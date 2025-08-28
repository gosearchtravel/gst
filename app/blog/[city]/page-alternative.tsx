/** @format */

// Alternative blog page implementation that completely avoids build-time issues
import { notFound } from 'next/navigation';
import BlogMenuClient from './BlogMenuClient';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// City data for fallback during build issues
const CITY_FALLBACK_DATA = [
  { city: 'paris', image: '/popdest/paris.jpg', excerpt: 'Experience the romance and culture of Paris.' },
  { city: 'london', image: '/popdest/london.jpg', excerpt: 'Explore the historic landmarks of London.' },
  { city: 'tokyo', image: '/popdest/tokyo.webp', excerpt: 'Discover modern Japan in Tokyo.' },
  { city: 'barcelona', image: '/popdest/barcelona.jpg', excerpt: 'Enjoy the vibrant culture of Barcelona.' },
  { city: 'sydney', image: '/popdest/sydney.webp', excerpt: 'Experience Sydney\'s iconic attractions.' },
  { city: 'dubai', image: '/popdest/dubai.jpg', excerpt: 'Explore luxury and innovation in Dubai.' },
  { city: 'bangkok', image: '/popdest/bangkok.jpg', excerpt: 'Discover Thailand\'s bustling capital.' },
  { city: 'singapore', image: '/popdest/singapore.webp', excerpt: 'Experience Singapore\'s modern marvels.' },
  { city: 'hongkong', image: '/popdest/hongkong.jpg', excerpt: 'Explore Hong Kong\'s skyline and culture.' },
  { city: 'newyork', image: '/popdest/newyork.webp', excerpt: 'Experience the energy of New York City.' },
  { city: 'rome', image: '/popdest/rome.webp', excerpt: 'Discover ancient Rome\'s timeless beauty.' },
  { city: 'istanbul', image: '/popdest/istanbul.webp', excerpt: 'Explore where Europe meets Asia.' },
  { city: 'melbourne', image: '/popdest/melbourne.jpg', excerpt: 'Experience Australia\'s cultural capital.' }
];

function normalizeCityParam(param: string) {
  return param.toLowerCase().replace(/[\s-]+/g, '');
}

async function getBlogData() {
  try {
    // Only make API calls at runtime, never during build
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';

    const response = await fetch(`${baseUrl}/api/blog`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      return await response.json();
    }

    throw new Error('API response not ok');
  } catch (error) {
    console.log('API fetch failed, using fallback data');
    // Return fallback data if API fails
    return CITY_FALLBACK_DATA.map((city, index) => ({
      id: index + 1,
      ...city,
      content: `<p>Welcome to ${city.city}! This is a beautiful destination with many attractions to explore.</p>`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
  }
}

export default async function BlogCityPage({ params }: { params: Promise<{ city: string }> }) {
  const resolvedParams = await params;
  const city = resolvedParams?.city;

  if (!city) {
    return notFound();
  }

  const cityKey = normalizeCityParam(city);
  const allPosts = await getBlogData();

  const blog = allPosts.find((p: any) => normalizeCityParam(p.city) === cityKey);

  if (!blog) {
    return notFound();
  }

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
      <BlogMenuClient allPosts={allPosts} />
    </div>
  );
}
