import {
  Prisma,
  PrismaClient,
  Subscriber,
  PostStatus,
  DeliveryStatus,
} from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import { config } from '../src/config';

const globalForPrisma = globalThis as unknown as {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prisma: any;
};

const prisma = new PrismaClient().$extends(withAccelerate());

export const prismaClient = globalForPrisma.prisma ?? prisma;

if (config.nodeEnv !== 'production') {
  globalForPrisma.prisma = prismaClient;
}

export type { Subscriber };
export { Prisma, PostStatus, DeliveryStatus };
