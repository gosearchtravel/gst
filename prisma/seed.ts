/** @format */

import { PrismaClient } from '@prisma/client';
import { blogPosts } from '../app/data/_blogPosts';
import { blogDetails } from '../app/data/_blogDetails';

const prisma = new PrismaClient();

async function main() {
	// Delete all existing blog posts to avoid duplicates
	await prisma.blogPost.deleteMany();

	// Delete all existing page content
	await prisma.pageContent.deleteMany();

	// Seed all blogPosts
	for (const post of blogPosts) {
		const cityKey = post.city.replace(/\s+/g, '').toLowerCase();
		const details = blogDetails[cityKey];
		const city = post.city;
		const image = post.image;
		const excerpt = details?.excerpt || post.excerpt;
		const content = details ? details.paragraphs.join('\n\n') : post.excerpt;

		if (!city || !image || !excerpt || !content) {
			console.error('Missing required field:', { city, image, excerpt, content });
			continue;
		}

		await prisma.blogPost.create({
			data: { city, image, excerpt, content },
		});
	}

	// Seed any blogDetails not already in blogPosts
	const blogPostCities = new Set(
		blogPosts.map((p: { city: string }) => p.city.replace(/\s+/g, '').toLowerCase())
	);
	for (const cityKey in blogDetails) {
		if (!blogPostCities.has(cityKey)) {
			const details = blogDetails[cityKey];
			const city = details.title.split(':')[0];
			const image = details.image;
			const excerpt = details.excerpt;
			const content = details.paragraphs.join('\n\n');

			if (!city || !image || !excerpt || !content) {
				console.error('Missing required field:', { city, image, excerpt, content });
				continue;
			}

			await prisma.blogPost.create({
				data: { city, image, excerpt, content },
			});
		}
	}

	// Seed default content for admin pages
	const defaultPages = [
		{ key: 'home', content: 'Welcome to the Home Page! Edit this content in the admin panel.' },
		{ key: 'about', content: 'About Us: Edit this page to describe your company.' },
		{ key: 'careers', content: 'Careers: List open positions and company culture here.' },
		{ key: 'press', content: 'Press: Add press releases and media mentions.' },
		{ key: 'features', content: 'Travel Features: Highlight special features and destinations.' },
	];
	for (const page of defaultPages) {
		await prisma.pageContent.create({ data: page });
	}
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
