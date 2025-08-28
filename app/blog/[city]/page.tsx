

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
    { city: 'bangkok' },
    { city: 'singapore' },
    { city: 'hongkong' },
    { city: 'newyork' },
    { city: 'rome' },
    { city: 'istanbul' },
    { city: 'melbourne' },
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

    // Fetch all blog posts from the database
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/blog`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error('Failed to fetch blog posts');
      return notFound();
    }

    const allPosts = await response.json();

    // Find the specific blog post by city
    const blog = allPosts.find(
      (p: any) => normalizeCityParam(p.city) === cityKey
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
        <BlogMenuClient allPosts={allPosts} />
      </div>
    );
  } catch (error) {
    console.error('Error in BlogCityPage:', error);
    return notFound();
  }
}