/** @format */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const blogPosts = [
	{
		city: 'Paris',
		image: '/popdest/paris.jpg',
		excerpt:
			'Experience the romance, art, and cuisine of Paris. Discover the Eiffel Tower, Louvre, and charming cafes.',
		content:
			"Paris, the City of Light, is renowned for its timeless beauty, rich history, and vibrant culture. From the iconic Eiffel Tower to the world-famous Louvre Museum, Paris offers an abundance of attractions that captivate millions of visitors each year. Stroll along the Seine River, explore the charming neighborhoods of Montmartre and Le Marais, and indulge in exquisite French cuisine at local bistros and cafes. Whether you're admiring art at the Musée d'Orsay, shopping on the Champs-Élysées, or enjoying a picnic in Luxembourg Gardens, Paris promises an unforgettable experience filled with romance and wonder.",
	},
	{
		city: 'London',
		image: '/popdest/london.jpg',
		excerpt: 'Explore historic landmarks, vibrant markets, and world-class museums in London.',
		content:
			"London, the capital of England, is a dynamic metropolis that seamlessly blends historic charm with modern innovation. Visit iconic landmarks like Big Ben, the Tower of London, and Buckingham Palace. Explore world-class museums such as the British Museum and Tate Modern. Experience the vibrant atmosphere of Borough Market, Camden Market, and Covent Garden. Take a ride on the London Eye for panoramic city views, enjoy a show in the West End, and discover the diverse neighborhoods from trendy Shoreditch to upscale Kensington. London's rich history, cultural diversity, and endless attractions make it a must-visit destination.",
	},
	{
		city: 'Rome',
		image: '/popdest/rome.webp',
		excerpt:
			'Walk through ancient ruins, taste authentic Italian food, and marvel at Renaissance art in Rome.',
		content:
			"Rome, the Eternal City, is a living museum where ancient history meets modern life. Explore the magnificent Colosseum, walk through the Roman Forum, and marvel at the Pantheon. Visit Vatican City to see the Sistine Chapel and St. Peter's Basilica. Toss a coin into the Trevi Fountain, climb the Spanish Steps, and wander through the charming Trastevere neighborhood. Indulge in authentic Italian cuisine, from perfect pasta to gelato, while enjoying the city's vibrant piazzas and outdoor cafes. Rome's incredible architecture, art, and culinary traditions create an unforgettable journey through time.",
	},
	{
		city: 'Barcelona',
		image: '/popdest/barcelona.jpg',
		excerpt: 'Enjoy Gaudí architecture, sunny beaches, and lively culture in Barcelona.',
		content:
			"Barcelona, the vibrant capital of Catalonia, is famous for its unique architecture, beautiful beaches, and lively culture. Discover the extraordinary works of Antoni Gaudí, including the iconic Sagrada Familia, Park Güell, and Casa Batlló. Stroll down Las Ramblas, explore the Gothic Quarter's narrow medieval streets, and relax at Barceloneta Beach. Experience the city's renowned culinary scene with tapas tours, fresh seafood, and local markets like La Boquería. Enjoy the Mediterranean climate, vibrant nightlife, and the passionate spirit of Catalonia that makes Barcelona a truly captivating destination.",
	},
	{
		city: 'Dubai',
		image: '/popdest/dubai.jpg',
		excerpt:
			'Experience luxury, innovation, and desert adventures in this modern Middle Eastern metropolis.',
		content:
			"Dubai is a dazzling city of superlatives, where cutting-edge architecture meets traditional Arabian culture. Marvel at the world's tallest building, the Burj Khalifa, shop in massive malls like the Dubai Mall, and experience luxury at every turn. Take a desert safari to experience traditional Bedouin culture, visit the historic Al Fahidi neighborhood, and cruise along Dubai Creek. Enjoy world-class beaches, innovative cuisine, and spectacular attractions like the Dubai Fountain. With its blend of modern innovation and cultural heritage, Dubai offers a unique travel experience unlike anywhere else in the world.",
	},
];

async function seed() {
	try {
		console.log('🌱 Seeding database...');

		// Clear existing blog posts
		await prisma.blogPost.deleteMany();
		console.log('🗑️  Cleared existing blog posts');

		// Create new blog posts
		for (const post of blogPosts) {
			await prisma.blogPost.create({
				data: post,
			});
			console.log(`✅ Created blog post for ${post.city}`);
		}

		console.log('🎉 Database seeding completed successfully!');
	} catch (error) {
		console.error('❌ Error seeding database:', error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
}

seed();
