/** @format */

import { NextRequest, NextResponse } from 'next/server';

// Force this route to be dynamic (not pre-rendered)
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
	try {
		// Mock response for now to avoid Vercel build issues
		const mockPosts = [
			{
				id: 1,
				city: 'Paris',
				image: '/sample-paris.jpg',
				excerpt: 'Discover the beauty of Paris',
				content: 'Paris is a wonderful city...',
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			},
			{
				id: 2,
				city: 'Tokyo',
				image: '/sample-tokyo.jpg',
				excerpt: 'Experience the culture of Tokyo',
				content: 'Tokyo is an amazing destination...',
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			},
		];

		return NextResponse.json(mockPosts);
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

		// Mock response for now to avoid Vercel build issues
		const newPost = {
			id: Math.floor(Math.random() * 1000),
			city,
			image,
			excerpt,
			content,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		return NextResponse.json(newPost);
	} catch (e) {
		const message = e instanceof Error ? e.message : 'Unknown error';
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
