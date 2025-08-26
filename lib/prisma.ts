/** @format */

// This file ensures that Prisma client doesn't get instantiated during build time
export const dynamic = 'force-dynamic';

export async function createPrismaClient() {
	// Only create Prisma client at runtime, never during build
	if (process.env.NODE_ENV === 'development' && !process.env.DATABASE_URL) {
		throw new Error('DATABASE_URL is required in development');
	}

	const { PrismaClient } = await import('@prisma/client');
	return new PrismaClient();
}
