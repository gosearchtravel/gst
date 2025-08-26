'use client';

import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
      <Footer />
    </>
  );
}