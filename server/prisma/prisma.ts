import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const globalForPrisma = globalThis as unknown as {
  prisma: any;
};

const prisma = new PrismaClient().$extends(withAccelerate());

export const prismaClient = globalForPrisma.prisma ?? prisma;

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prismaClient;
}

export default prismaClient;
