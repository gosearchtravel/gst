/** @format */

import { NextRequest, NextResponse } from 'next/server';
import { createPrismaClient } from '../../../lib/prisma';
import { BlogPostCreateInput } from '../../../types/blog';

// Force this route to be dynamic (not pre-rendered)
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
	let prisma;
	try {
		prisma = await createPrismaClient();
		const posts = await prisma.blogPost.findMany({
			orderBy: {
				createdAt: 'desc',
			},
		});

		return NextResponse.json(posts);
	} catch (error) {
		console.error('Error fetching blog posts:', error);
		return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
	} finally {
		if (prisma) {
			await prisma.$disconnect();
		}
	}
}

export async function POST(req: NextRequest) {
	let prisma;
	try {
		prisma = await createPrismaClient();
		const data: BlogPostCreateInput = await req.json();
		// Only allow fields defined in the model
		const { city, image, excerpt, content } = data;
		if (!city || !image || !excerpt || !content) {
			return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
		}

		const newPost = await prisma.blogPost.create({
			data: {
				city,
				image,
				excerpt,
				content,
			},
		});

		return NextResponse.json(newPost);
	} catch (e) {
		const message = e instanceof Error ? e.message : 'Unknown error';
		return NextResponse.json({ error: message }, { status: 500 });
	} finally {
		if (prisma) {
			await prisma.$disconnect();
		}
	}
}
