/** @format */

import { NextRequest, NextResponse } from 'next/server';

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

		// Mock response for now to avoid Vercel build issues
		// In production, you would connect to your actual database
		const mockPost = {
			id: numericId,
			city: 'Sample City',
			image: '/sample-image.jpg',
			excerpt: 'This is a sample blog post excerpt',
			content: 'This is sample blog post content',
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		return NextResponse.json(mockPost);
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

		// Mock response for now to avoid Vercel build issues
		const updatedPost = {
			id: numericId,
			...data,
			updatedAt: new Date().toISOString(),
		};

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

		// Mock response for now to avoid Vercel build issues
		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Error deleting blog post:', error);
		return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
	}
}
