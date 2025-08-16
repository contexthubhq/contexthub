import { PrismaClient } from '@prisma/client';

// Prevent multiple instances of Prisma Client in development
declare global {
  var __prisma: PrismaClient | undefined;
}

export const prisma = globalThis.__prisma || new PrismaClient();

if (process.env.NODE_ENV === 'development') {
  globalThis.__prisma = prisma;
}

export * from '@prisma/client';
export default prisma;

export function createPrismaClient(
  options?: ConstructorParameters<typeof PrismaClient>[0]
) {
  return new PrismaClient(options);
}
