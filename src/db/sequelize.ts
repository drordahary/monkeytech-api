// src/db/sequelize.ts
import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASSWORD!,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: "postgres",
    logging: false,
  },
);

export async function connectSequelize(retries = 5): Promise<void> {
  while (retries > 0) {
    try {
      await sequelize.authenticate();
      console.log("Database connected");
      return;
    } catch (err) {
      retries--;
      console.log(`DB not ready, retrying... (${retries} left)`);
      await new Promise((res) => setTimeout(res, 3000));
    }
  }

  throw new Error("Could not connect to database");
}
