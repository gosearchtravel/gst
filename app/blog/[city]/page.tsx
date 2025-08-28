

import { notFound } from 'next/navigation';
import { getBlogPosts } from '../../../lib/getBlogPosts';
import BlogMenuClient from './BlogMenuClient';
import { BlogPost } from '../../../types/blog';

// Make this a dynamic route to avoid build issues
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function normalizeCityParam(param: string) {
  return param.toLowerCase().replace(/[\s-]+/g, '');
}

export default async function BlogCityPage({ params }: { params: Promise<{ city: string }> }) {
  const resolvedParams = await params;
  const city = resolvedParams?.city;

  if (!city) {
    console.log('No city param found in route params:', resolvedParams);
    return notFound();
  }

  const cityKey = normalizeCityParam(city);
  console.log('Blog detail page: searching for cityKey:', cityKey);

  // Since this is a dynamic route, we'll fetch data at runtime only
  // This prevents any build-time database access issues

  let allPosts: BlogPost[] = [];
  let blog: BlogPost | null = null;

  try {
    allPosts = await getBlogPosts();
    console.log('Blog detail page: allPosts from DB:', allPosts.map((p: BlogPost) => p.city));
    blog = allPosts.find((p: BlogPost) => normalizeCityParam(p.city) === cityKey) || null;
    if (!blog) {
      console.log('Blog detail page: no match for cityKey:', cityKey, 'in posts:', allPosts.map((p: BlogPost) => normalizeCityParam(p.city)));
    }
  } catch (error) {
    console.error('Error fetching blog data:', error);
    return notFound();
  }

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