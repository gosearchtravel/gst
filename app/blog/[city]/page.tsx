

import { notFound } from 'next/navigation';
import BlogMenuClient from './BlogMenuClient';

// Force this page to be dynamic (not pre-rendered)
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Generate static params for known cities
export async function generateStaticParams() {
  return [
    { city: 'paris' },
    { city: 'london' },
    { city: 'tokyo' },
    { city: 'barcelona' },
    { city: 'sydney' },
    { city: 'dubai' },
  ];
}

function normalizeCityParam(param: string) {
  return param.toLowerCase().replace(/[\s-]+/g, '');
}

export default async function BlogCityPage({ params }: { params: Promise<{ city: string }> }) {
  try {
    const resolvedParams = await params;
    const city = resolvedParams?.city;

    if (!city) {
      return notFound();
    }

    const cityKey = normalizeCityParam(city);

    // Use mock data for now to avoid build issues
    // In production, you would fetch from your actual database
    const mockPosts = [
      {
        id: 1,
        city: 'paris',
        image: '/popdest/paris.jpg',
        excerpt: 'Experience the romance, art, and cuisine of Paris. Discover the Eiffel Tower, Louvre, and charming cafes.',
        content: '<p class="mb-10">Paris, the City of Light, offers an unparalleled blend of history, culture, and romance. From the iconic Eiffel Tower to the world-renowned Louvre Museum, every corner tells a story.</p><h2 class="text-2xl mb-10">Must-See Attractions</h2><p class="mb-10">Visit the Eiffel Tower, explore the Louvre, stroll along the Champs-Élysées, and enjoy the charm of Montmartre.</p>',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 2,
        city: 'london',
        image: '/popdest/london.jpg',
        excerpt: 'Explore historic landmarks, vibrant markets, and world-class museums in London.',
        content: '<p class="mb-10">London, a city where tradition meets modernity, offers visitors an incredible array of experiences from royal palaces to cutting-edge galleries.</p><h2 class="text-2xl mb-10">Royal Heritage</h2><p class="mb-10">Discover Buckingham Palace, Westminster Abbey, and the Tower of London, each steeped in centuries of British history.</p>',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 3,
        city: 'tokyo',
        image: '/popdest/tokyo.webp',
        excerpt: 'Experience the perfect blend of traditional culture and modern innovation in Tokyo.',
        content: '<p class="mb-10">Tokyo seamlessly blends ancient traditions with futuristic innovation, creating a unique urban experience unlike anywhere else in the world.</p><h2 class="text-2xl mb-10">Cultural Highlights</h2><p class="mb-10">Visit ancient temples, experience traditional tea ceremonies, and explore bustling modern districts like Shibuya and Harajuku.</p>',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 4,
        city: 'barcelona',
        image: '/popdest/barcelona.jpg',
        excerpt: 'Immerse yourself in the vibrant culture, stunning architecture, and delicious cuisine of Barcelona.',
        content: '<p class="mb-10">Barcelona captivates visitors with its unique blend of Gothic and modernist architecture, world-class museums, and vibrant street life.</p><h2 class="text-2xl mb-10">Architectural Wonders</h2><p class="mb-10">Marvel at Gaudí\'s masterpieces including the Sagrada Familia and Park Güell, explore the Gothic Quarter, and stroll down Las Ramblas.</p>',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 5,
        city: 'sydney',
        image: '/popdest/sydney.webp',
        excerpt: 'Discover the iconic landmarks, beautiful beaches, and vibrant culture of Sydney.',
        content: '<p class="mb-10">Sydney offers an incredible combination of natural beauty, iconic architecture, and world-class dining experiences.</p><h2 class="text-2xl mb-10">Iconic Attractions</h2><p class="mb-10">Visit the Sydney Opera House, climb the Harbour Bridge, relax at Bondi Beach, and explore the Royal Botanic Gardens.</p>',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 6,
        city: 'dubai',
        image: '/popdest/dubai.jpg',
        excerpt: 'Experience the luxury, innovation, and cultural diversity of Dubai.',
        content: '<p class="mb-10">Dubai is a gleaming metropolis that seamlessly blends traditional Arabian culture with ultra-modern innovation and luxury.</p><h2 class="text-2xl mb-10">Modern Marvels</h2><p class="mb-10">Visit the Burj Khalifa, shop at the Dubai Mall, explore the Gold Souk, and enjoy the pristine beaches of Jumeirah.</p>',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    const blog = mockPosts.find(
      (p) => normalizeCityParam(p.city) === cityKey
    );

    if (!blog) return notFound();

    return (
      <div className="relative">
        <main className="max-w-4xl mx-auto px-8 py-12">
          <h1 className="text-4xl font-bold mb-10 mt-10 capitalize">{blog.city}</h1>
          <img src={blog.image} alt={blog.city} className="rounded-lg h-64 w-full object-cover mb-6" />
          <p className="mb-6 text-lg text-gray-700">{blog.excerpt}</p>
          <div
            className="prose prose-lg max-w-none mb-6 text-gray-700"
            dangerouslySetInnerHTML={{
              __html: blog.content
                .replace(/<p(?![^>]*class=)/g, '<p class="mb-10"')
                .replace(/<h2(?![^>]*class=)/g, '<h2 class="text-2xl mb-10"')
            }}
          />
        </main>
        <BlogMenuClient allPosts={mockPosts} />
      </div>
    );
  } catch (error) {
    console.error('Error in BlogCityPage:', error);
    return notFound();
  }
}