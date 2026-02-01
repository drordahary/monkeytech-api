import { FastifyInstance } from "fastify";
import { Area, Location } from "../models";

export async function areasRoutes(app: FastifyInstance) {
  // GET /areas
  app.get("/areas", async () => {
    return Area.findAll({
      attributes: ["id", "name", "description"],
      order: [["name", "ASC"]],
    });
  });

  // GET /areas/:id/locations
  app.get("/areas/:id/locations", async (request, reply) => {
    const { id } = request.params as { id: string };

    const area = await Area.findByPk(id, {
      include: [
        {
          model: Location,
          as: "locations",
          attributes: [
            "id",
            "name",
            "type",
            "supportsFastrider",
            "avgWaitTime",
            "rating",
          ],
        },
      ],
    });

    if (!area) {
      return reply.code(404).send({ message: "Area not found" });
    }

    return area;
  });
}
