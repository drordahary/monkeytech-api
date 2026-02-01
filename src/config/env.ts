import fp from "fastify-plugin";
import env from "@fastify/env";

export default fp(async (fastify) => {
  fastify.register(env, {
    schema: {
      type: "object",
      required: ["PORT", "DB_NAME", "DB_USER", "DB_PASSWORD", "JWT_SECRET"],
      properties: {
        PORT: { type: "number", default: 3000 },
        DB_HOST: { type: "string", default: "localhost" },
        DB_PORT: { type: "number", default: 5432 },
        DB_NAME: { type: "string" },
        DB_USER: { type: "string" },
        DB_PASSWORD: { type: "string" },
        JWT_SECRET: { type: "string" },
      },
    },
    dotenv: true,
  });
});
