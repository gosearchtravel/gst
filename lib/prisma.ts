/** @format */

// This file ensures that Prisma client doesn't get instantiated during build time
export const dynamic = 'force-dynamic';

export async function createPrismaClient() {
	// Never create Prisma client during build time
	if (process.env.NODE_ENV === 'production' && !process.env.VERCEL_URL) {
		throw new Error('Prisma client not available during build');
	}

	// Only create Prisma client at runtime when database is available
	if (!process.env.DATABASE_URL) {
		throw new Error('DATABASE_URL is required');
	}

	const { PrismaClient } = await import('@prisma/client');
	return new PrismaClient();
}
