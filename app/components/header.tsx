'use client';

import React, { useState, useEffect } from 'react';
import { GlobeIcon, Heart, Plane, CircleUserRound } from 'lucide-react';
import Link from 'next/link';
import { SignInButton, SignUpButton } from '@clerk/nextjs';

export default function Header({ homePage = false }: { homePage?: boolean } = {}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (homePage) return;
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [homePage]);

  const headerBg = homePage ? 'bg-transparent' : (scrolled ? 'bg-black/70' : 'bg-black');

  return (
    <header className="sticky top-0 z-[9999]">
      <div className={`w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 absolute top-0 z-100 ${headerBg}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-700 rounded-xl flex items-center justify-center">
              <Link href='/'><Plane className="w-5 h-5 text-white" /></Link>
            </div>
            <h1 className="text-xl font-bold text-white">
              <Link href='/'>GoSearchTravel</Link>
            </h1>
          </div>
          <nav>
            <ul className="flex space-x-6">
              <li className="relative" onMouseEnter={() => setShowLangMenu(true)} onMouseLeave={() => setShowLangMenu(false)}>
                <button className="text-white hover:text-orange-600 font-bold flex items-center gap-1" aria-haspopup="true" aria-expanded={showLangMenu}>
                  <GlobeIcon className='cursor-pointer' />
                </button>
                {showLangMenu && (
                  <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-40 bg-white rounded shadow-lg z-50">
                    <ul className="flex flex-col">
                      <li><button className="px-4 py-2 text-left hover:bg-orange-100 w-full">English</button></li>
                      <li><button className="px-4 py-2 text-left hover:bg-orange-100 w-full">Spanish</button></li>
                      <li><button className="px-4 py-2 text-left hover:bg-orange-100 w-full">French</button></li>
                      <li><button className="px-4 py-2 text-left hover:bg-orange-100 w-full">German</button></li>
                      <li><button className="px-4 py-2 text-left hover:bg-orange-100 w-full">Chinese</button></li>
                    </ul>
                  </div>
                )}
              </li>
              <li>
                <a href="/favorites" className="text-white hover:text-orange-600 font-bold">
                  <Heart fill="currentColor" stroke="none" className="text-white-500" />
                </a>
              </li>
              <li className="relative" onMouseEnter={() => setShowDropdown(true)} onMouseLeave={() => setShowDropdown(false)}>
                <button
                  className="text-white hover:text-orange-600 font-bold"
                  aria-haspopup="true"
                  aria-expanded={showDropdown}
                >
                  <CircleUserRound className="text-white-500 cursor-pointer" />
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-32 bg-white rounded shadow-lg z-50">
                    <div className="flex flex-col">
                      <SignInButton>
                        <button className="px-4 py-2 text-left hover:bg-orange-100 w-full">Login</button>
                      </SignInButton>
                      <SignUpButton>
                        <button className="px-4 py-2 text-left hover:bg-orange-100 w-full">Sign Up</button>
                      </SignUpButton>
                    </div>
                  </div>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}