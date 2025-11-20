import fs from "node:fs";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import type { FastifyInstance } from "fastify";
import type { AdminConfig } from "../config.js";

export async function registerUploadRoutes(
  app: FastifyInstance,
  _options: { config: AdminConfig }
): Promise<void> {
  app.post("/api/upload", async (req, reply) => {
    const data = await req.file();
    if (!data) {
      return reply.status(400).send({ error: "No file uploaded" });
    }

    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedMimeTypes.includes(data.mimetype)) {
      return reply.status(400).send({ error: "Invalid file type" });
    }

    const uploadDir = path.resolve(process.cwd(), "src/data/images");
    // Ensure directory exists
    await fs.promises.mkdir(uploadDir, { recursive: true });

    const filename = `${Date.now()}-${data.filename}`;
    const filepath = path.join(uploadDir, filename);

    await pipeline(data.file, fs.createWriteStream(filepath));

    // Return relative path that can be stored in DB
    // Note: In production you might want to serve these via nginx or upload to S3
    // For now we assume the bot resolves images from src/data/images
    return {
      success: true,
      path: filename,
      url: `/images/${filename}`, // If we serve them statically
    };
  });
}
