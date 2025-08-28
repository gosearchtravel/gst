
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BlogPost } from '../../types/blog';

export default function BlogPage() {
  // Utility to convert city names to one-word, lowercase slugs for URLs
  function citySlug(city: string) {
    return city.toLowerCase().replace(/\s+/g, '');
  }
  // Utility to capitalize each word in a city name
  function capitalizeCity(city: string) {
    return city
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  useEffect(() => {
    fetch('/api/blog').then(res => res.json()).then(setPosts);
  }, []);
  return (
    <main className="max-w-5xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-10 mt-10 text-center">City Travel Blog</h1>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map(post => (
          <div
            key={post.city}
            className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col cursor-pointer"
            onClick={() => router.push(`/blog/${citySlug(post.city)}`)}
          >
            <img src={post.image} alt={post.city} className="w-full h-48 object-cover" />
            <div className="p-6 flex-1 flex flex-col justify-between">
              <h2 className="text-2xl font-bold mb-2">{capitalizeCity(post.city)}</h2>
              <p className="mb-4 text-gray-700">{post.excerpt}</p>
              <Link href={`/blog/${citySlug(post.city)}`}
                className="mt-auto inline-block px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 font-semibold text-center">
                Read More
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}