'use client';

import React from 'react';
import HeroSlider from './components/HeroSlider';
import SearchTabs from './components/SearchTabs';
import PopularDestinations from './components/PopularDestinations';
import Header from './components/header';
import Footer from './components/footer';
import BlogPostsCarousel from './components/BlogPostsCarousel';

export default function Home() {
	return (
		<>
			<Header homePage />
			<HeroSlider />
			<SearchTabs />
			<PopularDestinations />
			<BlogPostsCarousel />
			<Footer />
		</>
	);
}