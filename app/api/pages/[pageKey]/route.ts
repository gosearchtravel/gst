/** @format */

import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function GET(req: NextRequest, context: { params: { pageKey: string } }) {
	const pageKey = context.params.pageKey;
	try {
		const page = await prisma.pageContent.findUnique({ where: { key: pageKey } });
		return Response.json({ content: page?.content || '' });
	} catch (e) {
		return Response.json({ content: '' });
	}
}

export async function PUT(req: NextRequest, context: { params: { pageKey: string } }) {
	const pageKey = context.params.pageKey;
	let content = '';
	try {
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
		const page = await prisma.pageContent.upsert({
			where: { key: pageKey },
			update: { content },
			create: { key: pageKey, content },
		});
		console.log('Upserted page:', page);
		return Response.json({ content: page.content });
	} catch (e) {
		console.error('Prisma upsert error:', e);
		return Response.json({ content: '' });
	}
}
