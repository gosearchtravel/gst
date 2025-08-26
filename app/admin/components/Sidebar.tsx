"use client";
import Link from "next/link";
import { useState } from "react";
import { Home, Newspaper, Image, Sliders, FileText, Users, Megaphone, Star } from "lucide-react";

export default function Sidebar() {
  const [pagesOpen, setPagesOpen] = useState(false);
  return (
    <aside className="w-64 bg-white shadow-lg flex flex-col fixed top-0 left-0 h-screen z-30 pl-2">
      <div className="p-4 flex items-center gap-3 border-b">
        <Link href="/admin"><img src="/globe.svg" alt="Logo" className="h-8 w-8" /></Link>
        <span className="font-bold text-lg"><Link href="/admin">GST - Dashboard</Link></span>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-4">
          <li>
            <Link href="/admin" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
              <Home size={18} /> Dashboard
            </Link>
          </li>
          <li>
            <Link href="/admin/blog-posts" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
              <Newspaper size={18} /> Blog Posts
            </Link>
          </li>
          <li>
            <Link href="/admin/images" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
              <Image size={18} /> Image Uploads
            </Link>
          </li>
          <li>
            <Link href="/admin/sliders" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
              <Sliders size={18} /> Sliders
            </Link>
          </li>
          <li>
            <button
              className="flex items-center justify-between w-full text-gray-700 font-semibold mb-1 focus:outline-none"
              onClick={() => setPagesOpen((open) => !open)}
            >
              <span className="flex items-center gap-2"><FileText size={18} /> Pages</span>
              <span className={`transition-transform ${pagesOpen ? 'rotate-90' : ''}`}>▶</span>
            </button>
            {pagesOpen && (
              <ul className="ml-4 space-y-2 mt-2">
                <li><Link href="/admin/pages/home" className="flex items-center gap-2 text-gray-600 hover:text-blue-600"><Home size={16} /> HomePage</Link></li>
                <li><Link href="/admin/pages/about" className="flex items-center gap-2 text-gray-600 hover:text-blue-600"><Users size={16} /> About Us</Link></li>
                <li><Link href="/admin/pages/careers" className="flex items-center gap-2 text-gray-600 hover:text-blue-600"><Megaphone size={16} /> Careers</Link></li>
                <li><Link href="/admin/pages/press" className="flex items-center gap-2 text-gray-600 hover:text-blue-600"><Newspaper size={16} /> Press</Link></li>
                <li><Link href="/admin/pages/features" className="flex items-center gap-2 text-gray-600 hover:text-blue-600"><Star size={16} /> Travel Features</Link></li>
              </ul>
            )}
          </li>
        </ul>
      </nav>
    </aside>
  );
}
