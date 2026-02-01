import Fastify from "fastify";
import { connectSequelize } from "./db/sequelize";
import { setupAssociations } from "./models";
import { areasRoutes } from "./routes/areas.routes";
import { locationsRoutes } from "./routes/locations.route";
import { generateSlotsForDate } from "./services/fastrider-slot.service";
import { fastriderRoutes } from "./routes/fastrider.routes";
import { authPlugin } from "./plugins/auth.plugin";
import { authRoutes } from "./routes/auth.routes";
import jwt from "@fastify/jwt";
import sensible from "@fastify/sensible";
import rateLimit from "@fastify/rate-limit";

export async function buildApp() {
  const app = Fastify({ logger: true });

  // Connect DB
  try {
    await connectSequelize();
    setupAssociations();
  } catch (err) {
    app.log.error(err, "Database connection failed");
    process.exit(1);
  }

  const today = new Date().toISOString().slice(0, 10);
  await generateSlotsForDate(today);

  // Health check
  app.get("/health", async () => {
    return { status: "ok" };
  });

  await app.register(rateLimit, {
    global: false,
  });

  await app.register(sensible);
  await app.register(jwt, {
    secret: process.env.JWT_SECRET!,
  });

  await app.register(authPlugin);

  await app.register(authRoutes);
  await app.register(areasRoutes);
  await app.register(locationsRoutes);
  await app.register(fastriderRoutes);

  return app;
}
