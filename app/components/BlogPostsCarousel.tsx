import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CarouselPrevious, CarouselNext, CarouselContent, CarouselItem, Carousel } from '@/components/ui/carousel';
import { BlogPost } from '@/types/blog';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

export default function BlogPostsCarousel() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/blog');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Check if the response has an error property (API error response)
        if (data && typeof data === 'object' && 'error' in data) {
          throw new Error(data.error as string);
        }

        // Ensure data is an array before setting it
        if (Array.isArray(data)) {
          setPosts(data);
          setError(null);
        } else {
          console.warn('API returned non-array data:', data);
          setPosts([]);
          setError('Invalid data format received');
        }
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError(err instanceof Error ? err.message : 'Failed to load blog posts');
        // Ensure posts is always an array
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();

    // Auto-scroll interval
    const interval = setInterval(() => {
      const nextBtn = document.querySelector('[data-carousel-next]') as HTMLButtonElement | null;
      if (nextBtn) nextBtn.click();
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  // Safety effect to ensure posts is always an array
  useEffect(() => {
    if (!Array.isArray(posts)) {
      console.warn('Posts state is not an array, resetting to empty array:', posts);
      setPosts([]);
    }
  }, [posts]);

  function citySlug(city: string) {
    return city.toLowerCase().replace(/[\s-]+/g, '');
  }

  function capitalizeCity(city: string) {
    return city
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // Safety function to ensure posts is always an array
  const safePosts = Array.isArray(posts) ? posts : [];

  return (
    <ErrorBoundary>
      <section className="py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Latest From The Blog</h2>
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="text-gray-600">Loading blog posts...</div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-600">{error}</div>
            </div>
          ) : safePosts.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-600">No blog posts available.</div>
            </div>
          ) : (
            <Carousel
              opts={{
                align: 'center',
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="gap-x-6 gap-y-6 p-4">
                {safePosts.map(post => (
                  <CarouselItem
                    key={post.city}
                    className="basis-full sm:basis-1/3 lg:basis-1/4 flex"
                  >
                    <div className="bg-white rounded-xl shadow-lg flex flex-col h-full w-full p-4 hover:shadow-lg/20 cursor-pointer" onClick={() => window.location.href = `/blog/${citySlug(post.city)}`}>
                      <img
                        src={post.image}
                        alt={post.city}
                        className="w-full h-28 object-cover rounded-lg mb-4"
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <h3 className="text-xl font-bold mb-2">
                          {capitalizeCity(post.city)}
                        </h3>
                        <p className="mb-4 text-gray-700">{post.excerpt}</p>
                        <Link
                          href={`/blog/${citySlug(post.city)}`}
                          className="mt-auto inline-block px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 font-semibold text-center"
                        >
                          Read More
                        </Link>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-between items-center mt-4 px-4">
                <CarouselPrevious className="bg-white rounded-full shadow p-2 hover:bg-orange-100 transition cursor-pointer" />
                <CarouselNext className="bg-white rounded-full shadow p-2 hover:bg-orange-100 transition cursor-pointer" />
              </div>
            </Carousel>
          )}
        </div>
      </section>
    </ErrorBoundary>
  );
}