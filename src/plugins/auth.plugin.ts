import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";

const authPluginCallback: FastifyPluginAsync = async (app) => {
  if (!app.hasRequestDecorator("user")) {
    app.decorateRequest("user", null as any);
  }

  app.addHook("preHandler", async (req) => {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) return;

    try {
      const payload = await req.jwtVerify<{ sub: string; phone: string }>();

      (req as any).user = { id: payload.sub, phone: payload.phone };
    } catch {
      // ignore (routes can require auth)
    }
  });
};

export const authPlugin = fp(authPluginCallback);
