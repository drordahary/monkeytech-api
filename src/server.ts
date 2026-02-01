import { buildApp } from "./app";

async function bootstrap() {
  const app = await buildApp();

  const port = Number(process.env.PORT) || 3000;
  const host = "0.0.0.0";

  try {
    await app.listen({ port, host });
    app.log.info(`API running on http://${host}:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

bootstrap();
