/** @format */

import { createPrismaClient } from './prisma';
import { BlogPost } from '../types/blog';

export async function getBlogPosts(): Promise<BlogPost[]> {
	const prisma = await createPrismaClient();
	// Adjust the model name if needed (e.g., prisma.blogPost.findMany)
	const posts = await prisma.blogPost.findMany({
		orderBy: { createdAt: 'desc' },
	});
	await prisma.$disconnect();
	// Convert Date fields to string for BlogPost type compatibility
	return posts.map((post) => ({
		...post,
		createdAt: post.createdAt.toISOString(),
		updatedAt: post.updatedAt.toISOString(),
	}));
}
