

import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';

import BlogMenuClient from './BlogMenuClient';

const prisma = new PrismaClient();

function normalizeCityParam(param: string) {
  return param.toLowerCase().replace(/[\s-]+/g, '');
}

export default async function BlogCityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const cityKey = normalizeCityParam(city);
  // Normalize city for case-insensitive and whitespace-insensitive match
  const allPosts = await prisma.blogPost.findMany();
  const blog = allPosts.find(
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
      <BlogMenuClient allPosts={allPosts} />
    </div>
  );
}