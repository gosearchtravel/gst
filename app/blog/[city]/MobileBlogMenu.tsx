"use client";
import { useState } from "react";

interface BlogPost {
  id: number;
  city: string;
}

export default function MobileBlogMenu({ allPosts }: { allPosts: BlogPost[] }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white rounded-full p-4 shadow-lg md:hidden"
        onClick={() => setOpen((o) => !o)}
        aria-label="Show all blog posts"
      >
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end md:hidden pointer-events-none">
          <div className="w-full bg-white rounded-t-lg p-6 max-h-[60vh] overflow-y-auto pointer-events-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">All Blog Posts</h2>
              <button className="text-gray-500 text-2xl" onClick={() => setOpen(false)}>&times;</button>
            </div>
            <ul className="space-y-2">
              {allPosts.map((post) => {
                const citySlug = post.city.replace(/\s+/g, '');
                return (
                  <li key={post.id} className="capitalize bg-gray-100 rounded">
                    <a href={`/blog/${citySlug}`} className="text-blue-600 hover:underline" onClick={() => setOpen(false)}>
                      {post.city}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
      {/* Desktop aside remains fixed */}
      <aside className="hidden md:block fixed top-24 right-8 w-64 h-[70vh] overflow-y-auto bg-white shadow-lg rounded-lg p-6 border border-gray-200 z-40">
        <h2 className="text-xl font-bold mb-4">All Blog Posts</h2>
        <ul className="space-y-2">
          {allPosts.map((post) => {
            const citySlug = post.city.replace(/\s+/g, '');
            return (
              <li key={post.id} className="capitalize bg-gray-100 rounded">
                <a href={`/blog/${citySlug}`} className="text-blue-600 hover:underline">
                  {post.city}
                </a>
              </li>
            );
          })}
        </ul>
      </aside>
    </>
  );
}
