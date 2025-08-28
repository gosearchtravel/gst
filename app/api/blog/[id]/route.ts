/** @format */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Force this route to be dynamic (not pre-rendered)
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;

		// Validate the ID parameter
		const numericId = Number(id);
		if (isNaN(numericId)) {
			return NextResponse.json({ error: 'Invalid ID parameter' }, { status: 400 });
		}

		const post = await prisma.blogPost.findUnique({
			where: { id: numericId },
		});

		if (!post) {
			return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
		}

		return NextResponse.json(post);
	} catch (error) {
		console.error('Error fetching blog post:', error);
		return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 });
	}
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;
		const data = await req.json();

		// Validate the ID parameter
		const numericId = Number(id);
		if (isNaN(numericId)) {
			return NextResponse.json({ error: 'Invalid ID parameter' }, { status: 400 });
		}

		const { city, image, excerpt, content } = data;
		if (!city || !image || !excerpt || !content) {
			return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
		}

		const updatedPost = await prisma.blogPost.update({
			where: { id: numericId },
			data: {
				city,
				image,
				excerpt,
				content,
			},
		});

		return NextResponse.json(updatedPost);
	} catch (error) {
		console.error('Error updating blog post:', error);
		return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
	}
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;

		// Validate the ID parameter
		const numericId = Number(id);
		if (isNaN(numericId)) {
			return NextResponse.json({ error: 'Invalid ID parameter' }, { status: 400 });
		}

		await prisma.blogPost.delete({
			where: { id: numericId },
		});

		return NextResponse.json({ message: 'Blog post deleted successfully' });
	} catch (error) {
		console.error('Error deleting blog post:', error);
		return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
	}
}
