/** @format */

import { NextResponse } from 'next/server';
import { createPrismaClient } from '../../../../lib/prisma';

export async function POST() {
	let prisma;
	try {
		prisma = await createPrismaClient();

		// Clear existing blog posts
		await prisma.blogPost.deleteMany();
		console.log('🗑️ Cleared existing blog posts');

		const blogPosts = [
			{
				city: 'Paris',
				image: '/popdest/paris.jpg',
				excerpt:
					'Experience the romance, art, and cuisine of Paris. Discover the Eiffel Tower, Louvre, and charming cafes.',
				content: `<p>Paris, the City of Light, is renowned for its timeless beauty, rich history, and vibrant culture.</p><p>From the iconic Eiffel Tower to the world-famous Louvre Museum, Paris offers an abundance of attractions that captivate millions of visitors each year.</p><p>Stroll along the Seine River, explore the charming neighborhoods of Montmartre and Le Marais, and indulge in exquisite French cuisine at local bistros and cafes.</p><p>Whether you're admiring art at the Musée d'Orsay, shopping on the Champs-Élysées, or enjoying a picnic in Luxembourg Gardens, Paris promises an unforgettable experience filled with romance and wonder.</p>`,
			},
			{
				city: 'London',
				image: '/popdest/london.jpg',
				excerpt: 'Explore historic landmarks, vibrant markets, and world-class museums in London.',
				content: `<p>London, the capital of England, is a dynamic metropolis that seamlessly blends historic charm with modern innovation.</p><p>Visit iconic landmarks like Big Ben, the Tower of London, and Buckingham Palace.</p><p>Explore world-class museums such as the British Museum and Tate Modern.</p><p>Experience the vibrant atmosphere of Borough Market, Camden Market, and Covent Garden.</p><p>Take a ride on the London Eye for panoramic city views, enjoy a show in the West End, and discover the diverse neighborhoods from trendy Shoreditch to upscale Kensington.</p><p>London's rich history, cultural diversity, and endless attractions make it a must-visit destination.</p>`,
			},
			{
				city: 'Rome',
				image: '/popdest/rome.webp',
				excerpt:
					'Walk through ancient ruins, taste authentic Italian food, and marvel at Renaissance art in Rome.',
				content: `<p>Rome, the Eternal City, is a living museum where ancient history meets modern life.</p><p>Explore the magnificent Colosseum, walk through the Roman Forum, and marvel at the Pantheon.</p><p>Visit Vatican City to see the Sistine Chapel and St. Peter's Basilica.</p><p>Toss a coin into the Trevi Fountain, climb the Spanish Steps, and wander through the charming Trastevere neighborhood.</p><p>Indulge in authentic Italian cuisine, from perfect pasta to gelato, while enjoying the city's vibrant piazzas and outdoor cafes.</p><p>Rome's incredible architecture, art, and culinary traditions create an unforgettable journey through time.</p>`,
			},
			{
				city: 'Barcelona',
				image: '/popdest/barcelona.jpg',
				excerpt: 'Enjoy Gaudí architecture, sunny beaches, and lively culture in Barcelona.',
				content: `<p>Barcelona, the vibrant capital of Catalonia, is famous for its unique architecture, beautiful beaches, and lively culture.</p><p>Discover the extraordinary works of Antoni Gaudí, including the iconic Sagrada Familia, Park Güell, and Casa Batlló.</p><p>Stroll down Las Ramblas, explore the Gothic Quarter's narrow medieval streets, and relax at Barceloneta Beach.</p><p>Experience the city's renowned culinary scene with tapas tours, fresh seafood, and local markets like La Boquería.</p><p>Enjoy the Mediterranean climate, vibrant nightlife, and the passionate spirit of Catalonia that makes Barcelona a truly captivating destination.</p>`,
			},
			{
				city: 'Dubai',
				image: '/popdest/dubai.jpg',
				excerpt:
					'Experience luxury, innovation, and desert adventures in this modern Middle Eastern metropolis.',
				content: `<p>Dubai is a dazzling city of superlatives, where cutting-edge architecture meets traditional Arabian culture.</p><p>Marvel at the world's tallest building, the Burj Khalifa, shop in massive malls like the Dubai Mall, and experience luxury at every turn.</p><p>Take a desert safari to experience traditional Bedouin culture, visit the historic Al Fahidi neighborhood, and cruise along Dubai Creek.</p><p>Enjoy world-class beaches, innovative cuisine, and spectacular attractions like the Dubai Fountain.</p><p>With its blend of modern innovation and cultural heritage, Dubai offers a unique travel experience unlike anywhere else in the world.</p>`,
			},
			{
				city: 'Istanbul',
				image: '/popdest/istanbul.webp',
				excerpt: 'Discover the crossroads of Europe and Asia, with stunning mosques and bustling bazaars.',
				content: `<p>Istanbul is a captivating city that bridges two continents, offering a unique blend of European and Asian cultures.</p><p>Explore the magnificent Hagia Sophia, the stunning Blue Mosque, and the grand Topkapi Palace.</p><p>Wander through the historic Grand Bazaar and Spice Bazaar, cruise along the Bosphorus, and enjoy traditional Turkish cuisine.</p><p>The city's rich Ottoman heritage, vibrant street life, and warm hospitality create an unforgettable experience.</p>`,
			},
			{
				city: 'New York',
				image: '/popdest/newyork.webp',
				excerpt: 'Experience the energy of NYC, from Central Park to Broadway and iconic skyscrapers.',
				content: `<p>New York City, the Big Apple, is a vibrant metropolis that never sleeps.</p><p>Visit iconic landmarks like the Statue of Liberty, Empire State Building, and Times Square.</p><p>Stroll through Central Park, explore world-class museums like the Metropolitan Museum of Art and MoMA, and catch a Broadway show.</p><p>Experience diverse neighborhoods from trendy Brooklyn to historic Greenwich Village, and indulge in cuisine from around the world.</p><p>NYC's energy, culture, and endless possibilities make it a truly unique destination.</p>`,
			},
			{
				city: 'Bangkok',
				image: '/popdest/bangkok.jpg',
				excerpt: 'Immerse yourself in Thai culture, street food, and magnificent temples in Bangkok.',
				content: `<p>Bangkok, the vibrant capital of Thailand, is a sensory feast of colors, flavors, and experiences.</p><p>Explore magnificent temples like Wat Pho and Wat Arun, cruise along the Chao Phraya River, and navigate bustling floating markets.</p><p>Indulge in incredible street food, from pad thai to mango sticky rice, and experience the famous Thai hospitality.</p><p>The city's blend of ancient traditions and modern energy, along with its affordable luxury and tropical climate, makes Bangkok an irresistible destination.</p>`,
			},
			{
				city: 'Tokyo',
				image: '/popdest/tokyo.jpg',
				excerpt:
					"Discover the perfect blend of traditional culture and cutting-edge technology in Japan's capital.",
				content: `<p>Tokyo is a mesmerizing metropolis where ancient traditions seamlessly blend with futuristic innovation.</p><p>Experience the serene beauty of traditional temples like Senso-ji, the bustling energy of Shibuya Crossing, and the tranquil gardens of the Imperial Palace.</p><p>Indulge in world-class cuisine from street food to Michelin-starred restaurants, explore unique neighborhoods like Harajuku and Akihabara, and witness the incredible efficiency of Japanese culture.</p><p>Tokyo offers an unforgettable journey through time and technology.</p>`,
			},
			{
				city: 'Sydney',
				image: '/popdest/sydney.jpg',
				excerpt:
					"Enjoy stunning harbors, beautiful beaches, and iconic landmarks in Australia's premier city.",
				content: `<p>Sydney captivates visitors with its stunning natural beauty and vibrant urban culture.</p><p>Marvel at the iconic Sydney Opera House and Harbour Bridge, relax on world-famous Bondi Beach, and explore the historic Rocks district.</p><p>Take a ferry across the spectacular harbor, discover diverse neighborhoods, and enjoy fresh seafood with harbor views.</p><p>With its perfect climate, friendly locals, and endless outdoor activities, Sydney embodies the best of Australian lifestyle.</p>`,
			},
		];

		// Create blog posts in database
		const createdPosts = [];
		for (const post of blogPosts) {
			const created = await prisma.blogPost.create({
				data: post,
			});
			createdPosts.push(created);
			console.log(`✅ Created blog post for ${post.city}`);
		}

		return NextResponse.json({
			success: true,
			message: `Successfully seeded ${createdPosts.length} blog posts`,
			posts: createdPosts,
		});
	} catch (error) {
		console.error('Error seeding database:', error);
		return NextResponse.json(
			{
				success: false,
				error: 'Failed to seed database',
				details: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 }
		);
	} finally {
		if (prisma) {
			await prisma.$disconnect();
		}
	}
}
