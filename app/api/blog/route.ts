/** @format */

import { NextRequest, NextResponse } from 'next/server';

// Force this route to be dynamic (not pre-rendered)
export const dynamic = 'force-dynamic';

export async function GET() {
	try {
		// Import Prisma dynamically to avoid build-time issues
		const { PrismaClient } = await import('@prisma/client');
		const prisma = new PrismaClient();

		const posts = await prisma.blogPost.findMany();
		await prisma.$disconnect();

		return NextResponse.json(posts);
	} catch (error) {
		console.error('Error fetching blog posts:', error);
		return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
	}
}

export async function POST(req: NextRequest) {
	try {
		const data = await req.json();
		// Only allow fields defined in the model
		const { city, image, excerpt, content } = data;
		if (!city || !image || !excerpt || !content) {
			return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
		}

		// Import Prisma dynamically to avoid build-time issues
		const { PrismaClient } = await import('@prisma/client');
		const prisma = new PrismaClient();

		const post = await prisma.blogPost.create({ data: { city, image, excerpt, content } });
		await prisma.$disconnect();

		return NextResponse.json(post);
	} catch (e) {
		const message = e instanceof Error ? e.message : 'Unknown error';
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
