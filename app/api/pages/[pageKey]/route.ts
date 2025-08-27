/** @format */

import { NextRequest } from 'next/server';

// Force this route to be dynamic (not pre-rendered)
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest, context: { params: Promise<{ pageKey: string }> }) {
	const { pageKey } = await context.params;
	try {
		// Validate pageKey
		if (!pageKey || typeof pageKey !== 'string') {
			return Response.json({ error: 'Invalid page key' }, { status: 400 });
		}

		// Only import Prisma at runtime to avoid build-time issues
		const { PrismaClient } = await import('@prisma/client');
		const prisma = new PrismaClient();

		const page = await prisma.pageContent.findUnique({ where: { key: pageKey } });
		await prisma.$disconnect();

		return Response.json({ content: page?.content || '' });
	} catch (e) {
		console.error('Error fetching page content:', e);
		return Response.json({ content: '' });
	}
}

export async function PUT(req: NextRequest, context: { params: Promise<{ pageKey: string }> }) {
	const { pageKey } = await context.params;
	let content = '';

	try {
		// Validate pageKey
		if (!pageKey || typeof pageKey !== 'string') {
			return Response.json({ error: 'Invalid page key' }, { status: 400 });
		}

		const body = await req.text();
		console.log('PUT /api/pages/', pageKey, 'body:', body);
		if (body) {
			const json = JSON.parse(body);
			content = json.content || '';
		}
	} catch (e) {
		console.error('Error parsing body:', e);
		content = '';
	}

	try {
		// Only import Prisma at runtime to avoid build-time issues
		const { PrismaClient } = await import('@prisma/client');
		const prisma = new PrismaClient();

		const page = await prisma.pageContent.upsert({
			where: { key: pageKey },
			update: { content },
			create: { key: pageKey, content },
		});

		await prisma.$disconnect();
		console.log('Upserted page:', page);
		return Response.json({ content: page.content });
	} catch (e) {
		console.error('Prisma upsert error:', e);
		return Response.json({ error: 'Failed to update page content' }, { status: 500 });
	}
}
