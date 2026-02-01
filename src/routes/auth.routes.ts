import { FastifyInstance } from "fastify";
import { createHash, randomInt } from "crypto";
import { Op } from "sequelize";
import { AuthCode, User } from "../models";

function normalizePhone(phone: string) {
  return phone.trim();
}

function hashCode(phone: string, code: string) {
  return createHash("sha256").update(`${phone}:${code}`).digest("hex");
}

export async function authRoutes(app: FastifyInstance) {
  const ttlSeconds = Number(process.env.AUTH_CODE_TTL_SECONDS ?? "300");
  const echo = (process.env.AUTH_DEV_ECHO_CODE ?? "false") === "true";

  // Request code
  app.post(
    "/auth/request-code",
    {
      config: {
        rateLimit: {
          max: 5,
          timeWindow: "1 minute",
        },
      },
    },
    async (req, reply) => {
      const body = req.body as { phone?: string };
      if (!body?.phone) return reply.badRequest("phone is required");

      const phone = normalizePhone(body.phone);

      const code = String(randomInt(0, 1000000)).padStart(6, "0");
      const expiresAt = new Date(Date.now() + ttlSeconds * 1000);

      await AuthCode.create({
        phone,
        codeHash: hashCode(phone, code),
        expiresAt,
        consumedAt: null,
      });

      return reply.send(echo ? { ok: true, devCode: code } : { ok: true });
    },
  );

  app.post(
    "/auth/verify-code",
    {
      config: {
        rateLimit: {
          max: 10,
          timeWindow: "1 minute",
        },
      },
    },
    async (req, reply) => {
      const body = req.body as { phone?: string; code?: string };
      if (!body?.phone || !body?.code)
        return reply.badRequest("phone and code are required");

      const phone = normalizePhone(body.phone);
      const code = body.code.trim();

      const auth = await AuthCode.findOne({
        where: {
          phone,
          consumedAt: null,
          expiresAt: { [Op.gt]: new Date() },
        },
        order: [["createdAt", "DESC"]],
      });

      if (!auth) return reply.unauthorized("Invalid or expired code");

      const expected = auth.codeHash;
      if (hashCode(phone, code) !== expected)
        return reply.unauthorized("Invalid or expired code");

      // consume code
      await auth.update({ consumedAt: new Date() });

      // upsert user
      const [user] = await User.findOrCreate({
        where: { phone },
        defaults: { phone },
      });

      const token = app.jwt.sign({ phone }, { sub: user.id, expiresIn: "7d" });

      return { token };
    },
  );
}
