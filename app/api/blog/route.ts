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

		// If no posts found, return fallback data
		if (posts.length === 0) {
			const fallbackPosts = [
				{
					id: 1,
					city: 'Paris',
					image: '/popdest/paris.jpg',
					excerpt:
						'Experience the romance, art, and cuisine of Paris. Discover the Eiffel Tower, Louvre, and charming cafes.',
					content:
						'Paris, the City of Light, is renowned for its timeless beauty, rich history, and vibrant culture.',
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				},
				{
					id: 2,
					city: 'London',
					image: '/popdest/london.jpg',
					excerpt: 'Explore historic landmarks, vibrant markets, and world-class museums in London.',
					content:
						'London, the capital of England, is a dynamic metropolis that seamlessly blends historic charm with modern innovation.',
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				},
				{
					id: 3,
					city: 'Rome',
					image: '/popdest/rome.webp',
					excerpt:
						'Walk through ancient ruins, taste authentic Italian food, and marvel at Renaissance art in Rome.',
					content: 'Rome, the Eternal City, is a living museum where ancient history meets modern life.',
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				},
			];
			return NextResponse.json(fallbackPosts);
		}

		return NextResponse.json(posts);
	} catch (error) {
		console.error('Error fetching blog posts:', error);

		// Return fallback data instead of error when database fails
		const fallbackPosts = [
			{
				id: 1,
				city: 'Paris',
				image: '/popdest/paris.jpg',
				excerpt:
					'Experience the romance, art, and cuisine of Paris. Discover the Eiffel Tower, Louvre, and charming cafes.',
				content:
					'Paris, the City of Light, is renowned for its timeless beauty, rich history, and vibrant culture.',
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			},
			{
				id: 2,
				city: 'London',
				image: '/popdest/london.jpg',
				excerpt: 'Explore historic landmarks, vibrant markets, and world-class museums in London.',
				content:
					'London, the capital of England, is a dynamic metropolis that seamlessly blends historic charm with modern innovation.',
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			},
			{
				id: 3,
				city: 'Rome',
				image: '/popdest/rome.webp',
				excerpt:
					'Walk through ancient ruins, taste authentic Italian food, and marvel at Renaissance art in Rome.',
				content: 'Rome, the Eternal City, is a living museum where ancient history meets modern life.',
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			},
		];

		console.log('Returning fallback blog posts due to database error');
		return NextResponse.json(fallbackPosts);
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
