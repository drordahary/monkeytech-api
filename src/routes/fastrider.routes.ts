import { FastifyInstance } from "fastify";
import { sequelize } from "../db/sequelize";
import { Op } from "sequelize";
import { FastRiderSlot } from "../models/fastrider-slot.model";
import { FastRiderTicket } from "../models/fastrider-ticket.model";
import { Location } from "../models/location.model";
import { requireUser } from "../guards/auth-guard";

export async function fastriderRoutes(app: FastifyInstance) {
  app.post("/fastrider/:attractionId/book", async (request, reply) => {
    const user = requireUser(request, reply);
    if (!user) return;

    const { attractionId } = request.params as { attractionId: string };
    const userId = (request as any).user?.id;

    return sequelize.transaction(async (t) => {
      const attraction = await Location.findByPk(attractionId, {
        transaction: t,
      });

      if (!attraction || !attraction.supportsFastrider) {
        return reply.code(400).send({ message: "Attraction not eligible" });
      }

      const existingTicket = await FastRiderTicket.findOne({
        where: { userId, status: "ACTIVE" },
        transaction: t,
      });

      if (existingTicket) {
        return reply
          .code(409)
          .send({ message: "User already has an active FastRider ticket" });
      }

      const today = new Date().toISOString().slice(0, 10);

      const slot = await FastRiderSlot.findOne({
        where: {
          attractionId,
          date: today,
          remaining: { [Op.gt]: 0 },
        },
        order: [["startTime", "ASC"]],
        lock: t.LOCK.UPDATE,
        transaction: t,
      });

      if (!slot) {
        return reply
          .code(409)
          .send({ message: "No available FastRider slots" });
      }

      await slot.update({ remaining: slot.remaining - 1 }, { transaction: t });

      const ticket = await FastRiderTicket.create(
        {
          userId,
          slotId: slot.id,
          status: "ACTIVE",
        },
        { transaction: t },
      );

      return {
        ticketId: ticket.id,
        attraction: attraction.name,
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
      };
    });
  });

  app.get("/fastrider/my-ticket", async (request, reply) => {
    const user = requireUser(request, reply);
    if (!user) return;

    const userId = user.id;

    const ticket = await FastRiderTicket.findOne({
      where: {
        userId,
        status: "ACTIVE",
      },
      include: [
        {
          model: FastRiderSlot,
          as: "slot",
          include: [
            {
              model: Location,
              as: "attraction",
              attributes: ["id", "name"],
            },
          ],
        },
      ],
    });

    if (!ticket || !ticket.slot || !ticket.slot.attraction) {
      return reply.code(404).send({
        message: "No active FastRider ticket",
      });
    }

    return {
      ticketId: ticket.id,
      attraction: ticket.slot.attraction.name,
      date: ticket.slot.date,
      startTime: ticket.slot.startTime,
      endTime: ticket.slot.endTime,
      status: ticket.status,
    };
  });

  app.post("/fastrider/cancel", async (request, reply) => {
    const user = requireUser(request, reply);
    if (!user) return;

    await sequelize.transaction(async (t) => {
      const ticket = await FastRiderTicket.findOne({
        where: {
          userId: user.id,
          status: "ACTIVE",
        },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (!ticket) {
        return reply.code(404).send({
          message: "No active FastRider ticket to cancel",
        });
      }

      const slot = await FastRiderSlot.findByPk(ticket.slotId, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (!slot) {
        throw new Error("Slot not found");
      }

      await ticket.update({ status: "CANCELLED" }, { transaction: t });

      await slot.increment({ remaining: 1 }, { transaction: t });
    });

    return { message: "FastRider ticket cancelled" };
  });
}
