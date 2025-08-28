

import { notFound } from 'next/navigation';
import BlogMenuClient from './BlogMenuClient';

// Make this a dynamic route to avoid build issues
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

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

    let allPosts;

    // Try to fetch from API, but handle build environment gracefully
    try {
      const baseUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

      const response = await fetch(`${baseUrl}/api/blog`, {
        cache: 'no-store'
      });

      if (response.ok) {
        allPosts = await response.json();
      } else {
        throw new Error('API fetch failed');
      }
    } catch (error) {
      // During build time, return static data to avoid build failures
      console.log('API fetch failed during build, using fallback data');
      return notFound();
    }

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