import { FastifyInstance } from "fastify";
import { Op } from "sequelize";
import { Location, Area } from "../models";

export async function locationsRoutes(app: FastifyInstance) {
  app.get("/locations", async (request) => {
    const query = request.query as {
      areaId?: string;
      type?: "ATTRACTION" | "FOOD" | "RESTAURANT";
      supportsFastrider?: string;
      q?: string;
      sort?: string;
      order?: "asc" | "desc";
    };

    const where: any = {};
    const order: any[] = [];

    // Filters
    if (query.areaId) {
      where.areaId = query.areaId;
    }

    if (query.type) {
      where.type = query.type;
    }

    if (query.supportsFastrider !== undefined) {
      where.supportsFastrider = query.supportsFastrider === "true";
    }

    if (query.q) {
      where.name = {
        [Op.iLike]: `%${query.q}%`,
      };
    }

    // Sorting (whitelist to avoid SQL injection)
    const sortableFields = ["avgWaitTime", "rating", "name"];
    if (query.sort && sortableFields.includes(query.sort)) {
      order.push([
        query.sort === "avgWaitTime" ? "avgWaitTime" : query.sort,
        query.order?.toUpperCase() === "DESC" ? "DESC" : "ASC",
      ]);
    }

    return Location.findAll({
      where,
      order,
      attributes: [
        "id",
        "name",
        "type",
        "supportsFastrider",
        "avgWaitTime",
        "rating",
      ],
      include: [
        {
          model: Area,
          as: "area",
          attributes: ["id", "name"],
        },
      ],
    });
  });
}
