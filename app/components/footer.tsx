import React from 'react';
import Link from 'next/link';
import { Plane } from 'lucide-react';

const footerLinks = {
  explore: [
    { title: 'Cities', href: '#' },
    { title: 'Airports', href: '#' },
    { title: 'Countries', href: '#' },
    { title: 'Airlines', href: '#' },
    { title: 'Flights', href: 'flights' },
    { title: 'Hotels', href: 'hotels' },
    { title: 'Car hire', href: 'carhire' },
  ],
  company: [
    { title: 'About us', href: '#' },
    { title: 'Careers', href: '#' },
    { title: 'Press', href: '#' },
    { title: 'Travel features', href: '#' },
    { title: 'Blog', href: '/blog' },

  ],
  partners: [
    { title: 'Work with us', href: '#' },
    { title: 'Advertise with us', href: '#' },
    { title: 'Travel Insight', href: '#' },
    { title: 'Affiliates', href: '#' },
  ],
  help: [
    { title: 'Help', href: '#' },
    { title: 'Privacy settings', href: '#' },
    { title: 'Contact us', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer
      className="bg-black border-t border-slate-200/50 mt-auto relative"
      style={{
        backgroundImage: "url('/footerbg.png')",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center 200px',
        backgroundSize: '50%',
      }}
    >
      <style jsx>{`
        @media (max-width: 640px) {
          footer {
            background-position: center 85.5% !important;
            background-size: 70% !important;
          }
        }
      `}</style>
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Plane className="w-5 h-5 text-white" />
              </div>
              <h2 className="font-bold text-white text-xl">GoSearchTravel</h2>
            </div>
            <p className="text-white text-sm">
              Your journey, simplified. Find the best deals on flights, hotels, and more.
            </p>
          </div>

          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Explore</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.explore.map((link) => (
                <li key={link.title}>
                  <Link href={link.href} className="text-sm text-white hover:text-blue-600 transition-colors">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.title}>
                  <a href={link.href} className="text-sm text-white hover:text-blue-600 transition-colors">
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Partners</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.partners.map((link) => (
                <li key={link.title}>
                  <a href={link.href} className="text-sm text-white hover:text-blue-600 transition-colors">
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Help</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.help.map((link) => (
                <li key={link.title}>
                  <a href={link.href} className="text-sm text-white hover:text-blue-600 transition-colors">
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-200/50 pt-8 items-center text-center">
          <p className="text-sm text-slate-500">&copy; {new Date().getFullYear()} GoSearchTravel Ltd. All rights reserved.</p>
        </div>
        {/* FAQ Accordion Section */}
        {/* <div className="max-w-2xl mx-auto mt-10">
          <h2 className="text-xl font-bold mb-4 text-center text-white">Frequently Asked Questions</h2>
          <div className="space-y-3">
            <details className="bg-white/10 rounded-lg p-4">
              <summary className="cursor-pointer font-semibold text-white">How do I find the best flight deals?</summary>
              <div className="mt-2 text-sm text-white/90">Use our search to compare airlines, set price alerts, and book early for the best fares. Flexible dates and nearby airports can also help you save.</div>
            </details>
            <details className="bg-white/10 rounded-lg p-4">
              <summary className="cursor-pointer font-semibold text-white">What hotels can I book on GoSearchTravel?</summary>
              <div className="mt-2 text-sm text-white/90">We partner with thousands of hotels worldwide, from budget stays to luxury resorts. Filter by location, rating, and amenities to find your perfect match.</div>
            </details>
            <details className="bg-white/10 rounded-lg p-4">
              <summary className="cursor-pointer font-semibold text-white">Can I hire a car for my trip?</summary>
              <div className="mt-2 text-sm text-white/90">Yes! Compare car hire options from top providers, choose your pickup location, and book in advance for the best rates. All bookings include free cancellation.</div>
            </details>
            <details className="bg-white/10 rounded-lg p-4">
              <summary className="cursor-pointer font-semibold text-white">Do you offer holiday packages?</summary>
              <div className="mt-2 text-sm text-white/90">We offer curated holiday packages that include flights, hotels, and car hire. Browse our deals or customize your own for a stress-free getaway.</div>
            </details>
          </div>
        </div> */}
      </div>
    </footer>
  );
}