import { prisma } from "../../services/prisma.js";

export function findAdminUserByUsername(username: string) {
  return prisma.adminUser.findUnique({ where: { username } });
}
