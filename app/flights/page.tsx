"use client";

import { useState, useEffect } from "react";
import DatePriceSelector from "../components/DatePriceSelector";
import Header from "../components/header";
import Footer from "../components/footer";
import FlightsSearch from "../components/FlightsSearch";

// Helper to get today and next 6 days
function getNextDays(numDays: number) {
  const days = [];
  const today = new Date();
  for (let i = 0; i < numDays; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push({
      date: d.toISOString().slice(0, 10),
      price: 400 + Math.floor(Math.random() * 150), // Example price logic
    });
  }
  return days;
}

export default function FlightsPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [datePrices, setDatePrices] = useState<Array<{ date: string; price: number }>>([]);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");

  // Fetch live prices for the next 7 days when origin/destination change
  useEffect(() => {
    async function fetchPrices() {
      if (!origin || !destination) return;
      const days = [];
      const today = new Date();
      for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        days.push(d.toISOString().slice(0, 10));
      }
      const prices = await Promise.all(
        days.map(async (date) => {
          try {
            const res = await fetch("/api/flights", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ origin, destination, departureDate: date, adults: 1 }),
            });
            const data = await res.json();
            const price = data?.data?.[0]?.price?.total ? Number(data.data[0].price.total) : 0;
            return { date, price };
          } catch {
            return { date, price: 0 };
          }
        })
      );
      setDatePrices(prices);
    }
    fetchPrices();
  }, [origin, destination]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex flex-1 w-full max-w-7xl mx-auto px-4 py-8 gap-8 mt-20">
        {/* Left column: Filters */}
        <aside className="w-full max-w-xs bg-white border-r border-gray-200 p-6 rounded-lg shadow-md hidden md:block">
          <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg mb-6 transition">Get Price Alerts</button>
          <div className="space-y-4">
            <details className="border rounded-lg p-3">
              <summary className="font-semibold cursor-pointer">Stops</summary>
              <div className="mt-2 flex flex-col gap-2">
                <label><input type="checkbox" /> Direct</label>
                <label><input type="checkbox" /> 1 Stop</label>
                <label><input type="checkbox" /> 2+ Stops</label>
              </div>
            </details>
            <details className="border rounded-lg p-3">
              <summary className="font-semibold cursor-pointer">Baggage</summary>
              <div className="mt-2 flex flex-col gap-2">
                <label><input type="checkbox" /> Cabin Bag</label>
                <label><input type="checkbox" /> Checked Bag</label>
              </div>
            </details>
            <details className="border rounded-lg p-3">
              <summary className="font-semibold cursor-pointer">Departure Times</summary>
              <div className="mt-2">
                <label className="block mb-1">Outbound</label>
                <input type="range" min="0" max="24" className="w-full" />
                <label className="block mt-2 mb-1">Return</label>
                <input type="range" min="0" max="24" className="w-full" />
              </div>
            </details>
            <details className="border rounded-lg p-3">
              <summary className="font-semibold cursor-pointer">Journey Duration</summary>
              <div className="mt-2">
                <input type="range" min="1" max="24" className="w-full" />
              </div>
            </details>
            <details className="border rounded-lg p-3">
              <summary className="font-semibold cursor-pointer">Airline</summary>
              <div className="mt-2 flex flex-col gap-2">
                <label><input type="checkbox" /> Emirates</label>
                <label><input type="checkbox" /> Qatar Airways</label>
                <label><input type="checkbox" /> British Airways</label>
                {/* TODO: Dynamically list available airlines from results */}
              </div>
            </details>
            <details className="border rounded-lg p-3">
              <summary className="font-semibold cursor-pointer">Airports</summary>
              <div className="mt-2 flex flex-col gap-2">
                <label><input type="checkbox" /> All Outbound Airports</label>
                <label><input type="checkbox" /> All Destination Airports</label>
                {/* TODO: Dynamically list airports for selected cities */}
              </div>
            </details>
          </div>
        </aside>
        {/* Middle column: Search results and date selector */}
        <section className="flex-1 max-w-4xl mx-auto">
          {/* Price guide date selector */}
          <DatePriceSelector
            prices={datePrices}
            selectedDate={selectedDate}
            onSelect={setSelectedDate}
          />
          <FlightsSearch
            selectedDate={selectedDate}
            setOrigin={setOrigin}
            setDestination={setDestination}
            origin={origin}
            destination={destination}
          />
        </section>
        <aside className="w-[310px] hidden lg:block">
          <div className="mb-8">
            <div className="bg-gray-200 rounded-lg flex items-center justify-center" style={{ width: 310, height: 615 }}>
              <span className="text-gray-500">Ad Banner 310x615</span>
            </div>
          </div>
          <div>
            <div className="bg-gray-200 rounded-lg flex items-center justify-center" style={{ width: 310, height: 615 }}>
              <span className="text-gray-500">Ad Banner 310x615</span>
            </div>
          </div>
        </aside>
      </main>
      <Footer />
    </div>
  );
}
