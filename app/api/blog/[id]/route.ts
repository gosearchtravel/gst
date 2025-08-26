/** @format */

import { NextRequest, NextResponse } from 'next/server';

// Force this route to be dynamic (not pre-rendered)
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;

		// Import Prisma dynamically to avoid build-time issues
		const { PrismaClient } = await import('@prisma/client');
		const prisma = new PrismaClient();

		const post = await prisma.blogPost.findUnique({ where: { id: Number(id) } });
		await prisma.$disconnect();

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

		// Import Prisma dynamically to avoid build-time issues
		const { PrismaClient } = await import('@prisma/client');
		const prisma = new PrismaClient();

		const post = await prisma.blogPost.update({ where: { id: Number(id) }, data });
		await prisma.$disconnect();

		return NextResponse.json(post);
	} catch (error) {
		console.error('Error updating blog post:', error);
		return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
	}
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;

		// Import Prisma dynamically to avoid build-time issues
		const { PrismaClient } = await import('@prisma/client');
		const prisma = new PrismaClient();

		await prisma.blogPost.delete({ where: { id: Number(id) } });
		await prisma.$disconnect();

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Error deleting blog post:', error);
		return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
	}
}
