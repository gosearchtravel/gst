/** @format */

import { NextRequest, NextResponse } from 'next/server';

// Force this route to be dynamic (not pre-rendered)
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
	try {
		// Mock response for now to avoid Vercel build issues
		// This should match the data structure in /blog/[city]/page.tsx
		const mockPosts = [
			{
				id: 1,
				city: 'paris',
				title: 'Discover Paris',
				image: '/popdest/paris.jpg',
				imagePath: '/popdest/paris.jpg',
				excerpt:
					'Experience the romance, art, and cuisine of Paris. Discover the Eiffel Tower, Louvre, and charming cafes.',
				content:
					'<p class="mb-10">Paris, the City of Light, offers an unparalleled blend of history, culture, and romance. From the iconic Eiffel Tower to the world-renowned Louvre Museum, every corner tells a story.</p><h2 class="text-2xl mb-10">Must-See Attractions</h2><p class="mb-10">Visit the Eiffel Tower, explore the Louvre, stroll along the Champs-Élysées, and enjoy the charm of Montmartre.</p>',
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			},
			{
				id: 2,
				city: 'london',
				title: 'Explore London',
				image: '/popdest/london.jpg',
				imagePath: '/popdest/london.jpg',
				excerpt: 'Explore historic landmarks, vibrant markets, and world-class museums in London.',
				content:
					'<p class="mb-10">London, a city where tradition meets modernity, offers visitors an incredible array of experiences from royal palaces to cutting-edge galleries.</p><h2 class="text-2xl mb-10">Royal Heritage</h2><p class="mb-10">Discover Buckingham Palace, Westminster Abbey, and the Tower of London, each steeped in centuries of British history.</p>',
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			},
			{
				id: 3,
				city: 'tokyo',
				title: 'Experience Tokyo',
				image: '/popdest/tokyo.webp',
				imagePath: '/popdest/tokyo.webp',
				excerpt: 'Experience the perfect blend of traditional culture and modern innovation in Tokyo.',
				content:
					'<p class="mb-10">Tokyo seamlessly blends ancient traditions with futuristic innovation, creating a unique urban experience unlike anywhere else in the world.</p><h2 class="text-2xl mb-10">Cultural Highlights</h2><p class="mb-10">Visit ancient temples, experience traditional tea ceremonies, and explore bustling modern districts like Shibuya and Harajuku.</p>',
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			},
			{
				id: 4,
				city: 'barcelona',
				title: 'Discover Barcelona',
				image: '/popdest/barcelona.jpg',
				imagePath: '/popdest/barcelona.jpg',
				excerpt:
					'Immerse yourself in the vibrant culture, stunning architecture, and delicious cuisine of Barcelona.',
				content:
					'<p class="mb-10">Barcelona captivates visitors with its unique blend of Gothic and modernist architecture, world-class museums, and vibrant street life.</p><h2 class="text-2xl mb-10">Architectural Wonders</h2><p class="mb-10">Marvel at Gaudí\'s masterpieces including the Sagrada Familia and Park Güell, explore the Gothic Quarter, and stroll down Las Ramblas.</p>',
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			},
			{
				id: 5,
				city: 'sydney',
				title: 'Explore Sydney',
				image: '/popdest/sydney.webp',
				imagePath: '/popdest/sydney.webp',
				excerpt: 'Discover the iconic landmarks, beautiful beaches, and vibrant culture of Sydney.',
				content:
					'<p class="mb-10">Sydney offers an incredible combination of natural beauty, iconic architecture, and world-class dining experiences.</p><h2 class="text-2xl mb-10">Iconic Attractions</h2><p class="mb-10">Visit the Sydney Opera House, climb the Harbour Bridge, relax at Bondi Beach, and explore the Royal Botanic Gardens.</p>',
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			},
			{
				id: 6,
				city: 'dubai',
				title: 'Experience Dubai',
				image: '/popdest/dubai.jpg',
				imagePath: '/popdest/dubai.jpg',
				excerpt: 'Experience the luxury, innovation, and cultural diversity of Dubai.',
				content:
					'<p class="mb-10">Dubai is a gleaming metropolis that seamlessly blends traditional Arabian culture with ultra-modern innovation and luxury.</p><h2 class="text-2xl mb-10">Modern Marvels</h2><p class="mb-10">Visit the Burj Khalifa, shop at the Dubai Mall, explore the Gold Souk, and enjoy the pristine beaches of Jumeirah.</p>',
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
