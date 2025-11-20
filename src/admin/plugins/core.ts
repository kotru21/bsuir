import fastifyCookie from "@fastify/cookie";
import fastifySensible from "@fastify/sensible";
import fastifyMultipart from "@fastify/multipart";
import type { FastifyInstance } from "fastify";

export async function registerInfraPlugins(instance: FastifyInstance) {
  await instance.register(fastifySensible);

  await instance.register(fastifyMultipart, {
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
  });
}

export async function registerCookiePlugin(instance: FastifyInstance) {
  await instance.register(fastifyCookie, {
    hook: "onRequest",
  });
}

// Backward compatibility helper
export const registerCorePlugins = registerInfraPlugins;
