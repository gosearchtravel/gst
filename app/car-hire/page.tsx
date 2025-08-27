"use client";

import React, { useState, useEffect, Suspense, useRef } from 'react';
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search } from 'lucide-react';
import Header from "../components/header";
import Footer from "../components/footer";
import { CarRentalDataEnhancer } from "./utils/CarRentalDataEnhancer";
import PriceCalendar from "../../components/ui/price-calendar";
import "leaflet/dist/leaflet.css";

// Dynamic import for MapWithMarkers to avoid SSR issues with Leaflet
const MapWithMarkers = dynamic(() => import("./CarHireMapWithMarkers").then(mod => ({ default: mod.default })), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-100 animate-pulse" />
});

interface CarRentalData {
  id: string;
  name: string;
  carType: string;
  transmission: string;
  fuel: string;
  doors: number;
  seats: number;
  aircon: boolean;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  pricing: {
    dailyRate: number;
    totalCost: number;
    currency: string;
  };
  company: string;
  image: string;
  rating: number;
  features: string[];
  pickup: {
    location: string;
    hours: string;
  };
  dropoff: {
    location: string;
    hours: string;
  };
  availability?: {
    available: boolean;
    remainingCars: number;
    nextAvailable?: string;
  };
  specialOffers?: string[];
}

// Enhanced mock car rental data with dynamic pricing
const generateMockCarRentals = (location: string, pickupDate?: string, dropoffDate?: string): CarRentalData[] => {
  // More realistic car configurations
  const carConfigs = [
    {
      type: "Economy",
      seats: 5,
      doors: 4,
      dailyRate: 22,
      make: "Toyota",
      model: "Yaris",
      transmission: "Manual",
      fuel: "Petrol",
      features: ["Air Conditioning", "Power Steering", "Radio/CD Player"]
    },
    {
      type: "Economy",
      seats: 5,
      doors: 4,
      dailyRate: 25,
      make: "Nissan",
      model: "Micra",
      transmission: "Automatic",
      fuel: "Petrol",
      features: ["Air Conditioning", "Bluetooth", "USB Charging"]
    },
    {
      type: "Compact",
      seats: 5,
      doors: 4,
      dailyRate: 32,
      make: "Volkswagen",
      model: "Golf",
      transmission: "Manual",
      fuel: "Diesel",
      features: ["GPS Navigation", "Air Conditioning", "Bluetooth", "Parking Sensors"]
    },
    {
      type: "Compact",
      seats: 5,
      doors: 4,
      dailyRate: 38,
      make: "Ford",
      model: "Focus",
      transmission: "Automatic",
      fuel: "Hybrid",
      features: ["GPS Navigation", "Apple CarPlay", "Reversing Camera", "Cruise Control"]
    },
    {
      type: "Mid-size",
      seats: 5,
      doors: 4,
      dailyRate: 45,
      make: "BMW",
      model: "3 Series",
      transmission: "Automatic",
      fuel: "Diesel",
      features: ["Premium Sound System", "Leather Seats", "Dual Climate Control", "GPS Navigation"]
    },
    {
      type: "Mid-size",
      seats: 5,
      doors: 4,
      dailyRate: 42,
      make: "Audi",
      model: "A4",
      transmission: "Automatic",
      fuel: "Petrol",
      features: ["Virtual Cockpit", "Heated Seats", "Parking Assistant", "Premium Audio"]
    },
    {
      type: "SUV",
      seats: 7,
      doors: 5,
      dailyRate: 62,
      make: "Toyota",
      model: "RAV4",
      transmission: "Automatic",
      fuel: "Hybrid",
      features: ["4WD", "Roof Rails", "Rear Parking Camera", "Safety Sense 2.0"]
    },
    {
      type: "SUV",
      seats: 7,
      doors: 5,
      dailyRate: 68,
      make: "Land Rover",
      model: "Discovery Sport",
      transmission: "Automatic",
      fuel: "Diesel",
      features: ["Terrain Response", "Panoramic Roof", "Meridian Sound", "InControl Touch Pro"]
    },
    {
      type: "Luxury",
      seats: 5,
      doors: 4,
      dailyRate: 85,
      make: "Mercedes-Benz",
      model: "C-Class",
      transmission: "Automatic",
      fuel: "Petrol",
      features: ["MBUX Infotainment", "Burmester Audio", "LED Headlights", "Active Brake Assist"]
    },
    {
      type: "Luxury",
      seats: 5,
      doors: 4,
      dailyRate: 92,
      make: "BMW",
      model: "5 Series",
      transmission: "Automatic",
      fuel: "Hybrid",
      features: ["iDrive 7.0", "Harman Kardon Audio", "Driving Assistant", "Wireless Charging"]
    },
    {
      type: "Electric",
      seats: 5,
      doors: 4,
      dailyRate: 58,
      make: "Tesla",
      model: "Model 3",
      transmission: "Automatic",
      fuel: "Electric",
      features: ["Autopilot", "Supercharging Network", "Premium Audio", "Over-the-air Updates"]
    },
    {
      type: "Electric",
      seats: 5,
      doors: 5,
      dailyRate: 55,
      make: "Volkswagen",
      model: "ID.4",
      transmission: "Automatic",
      fuel: "Electric",
      features: ["Digital Cockpit", "Fast Charging", "App Connect", "IQ.DRIVE Assistance"]
    }
  ];

  const companies = [
    { name: "Hertz", rating: 4.2 },
    { name: "Avis", rating: 4.1 },
    { name: "Budget", rating: 3.9 },
    { name: "Enterprise", rating: 4.3 },
    { name: "Sixt", rating: 4.0 },
    { name: "Europcar", rating: 3.8 }
  ];

  // Location-specific coordinates
  const locationCoords: { [key: string]: { lat: number; lng: number; city: string } } = {
    "LHR": { lat: 51.4700, lng: -0.4543, city: "London" },
    "JFK": { lat: 40.6413, lng: -73.7781, city: "New York" },
    "DXB": { lat: 25.2532, lng: 55.3657, city: "Dubai" },
    "CDG": { lat: 49.0097, lng: 2.5479, city: "Paris" },
    "NRT": { lat: 35.7720, lng: 140.3929, city: "Tokyo" },
    "SYD": { lat: -33.9399, lng: 151.1753, city: "Sydney" },
    "default": { lat: 51.4700, lng: -0.4543, city: location }
  };

  const coords = locationCoords[location.toUpperCase()] || locationCoords["default"];

  // Generate rental locations around the area
  const rentalLocations = [
    `${coords.city} Airport - Terminal 1`,
    `${coords.city} Airport - Terminal 2`,
    `${coords.city} City Centre`,
    `${coords.city} Train Station`,
    `${coords.city} Downtown`,
    `${coords.city} Business District`
  ];

  return carConfigs.map((car, index) => {
    const company = companies[index % companies.length];
    const location_addr = rentalLocations[index % rentalLocations.length];

    // Add some variation to coordinates
    const latVariation = (Math.random() - 0.5) * 0.02;
    const lngVariation = (Math.random() - 0.5) * 0.02;

    // Calculate dynamic pricing
    let adjustedRate = car.dailyRate;

    if (pickupDate) {
      // Apply seasonal pricing
      const seasonModifier = CarRentalDataEnhancer.getPricingModifier(pickupDate);
      adjustedRate *= seasonModifier.multiplier;

      // Apply location pricing
      const locationModifier = CarRentalDataEnhancer.getLocationPriceModifier(location);
      adjustedRate *= locationModifier;

      // Apply demand-based pricing
      const dayOfWeek = new Date(pickupDate).getDay();
      const demandModifier = CarRentalDataEnhancer.getDemandMultiplier(car.type, dayOfWeek);
      adjustedRate *= demandModifier;
    }

    // Calculate rental duration for total cost
    const rentalDays = pickupDate && dropoffDate ?
      Math.max(1, Math.ceil((new Date(dropoffDate).getTime() - new Date(pickupDate).getTime()) / (1000 * 60 * 60 * 24))) :
      3;

    // Get availability status
    const availability = pickupDate ?
      CarRentalDataEnhancer.getAvailability(`car-${index + 1}`, pickupDate) :
      { available: true, remainingCars: 5 };

    // Get special offers
    const specialOffers = pickupDate ?
      CarRentalDataEnhancer.getSpecialOffers(`car-${index + 1}`, rentalDays) :
      [];

    return {
      id: `car-${index + 1}`,
      name: `${car.make} ${car.model} (${car.type})`,
      carType: car.type,
      transmission: car.transmission,
      fuel: car.fuel,
      doors: car.doors,
      seats: car.seats,
      aircon: true,
      location: {
        latitude: coords.lat + latVariation,
        longitude: coords.lng + lngVariation,
        address: location_addr
      },
      pricing: {
        dailyRate: Math.round(adjustedRate),
        totalCost: Math.round(adjustedRate * rentalDays),
        currency: "GBP"
      },
      company: company.name,
      image: `/popdest/${["dubai", "london", "paris", "newyork", "tokyo", "sydney"][index % 6]}.jpg`,
      rating: company.rating + (Math.random() * 0.4 - 0.2), // Slight variation around company rating
      features: car.features,
      pickup: {
        location: location_addr,
        hours: index % 3 === 0 ? "06:00-22:00" : "24/7"
      },
      dropoff: {
        location: location_addr,
        hours: index % 3 === 0 ? "06:00-22:00" : "24/7"
      },
      // Add enhanced data
      availability,
      specialOffers
    };
  });
}; function CarHirePageContent() {
  const searchParams = useSearchParams();
  const [cars, setCars] = useState<CarRentalData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState(searchParams.get("location") || "");
  const [pickupDate, setPickupDate] = useState(searchParams.get("pickupDate") || "");
  const [pickupTime, setPickupTime] = useState(searchParams.get("pickupTime") || "");
  const [dropoffDate, setDropoffDate] = useState(searchParams.get("dropoffDate") || "");
  const [dropoffTime, setDropoffTime] = useState(searchParams.get("dropoffTime") || "");
  const [highlightedCarId, setHighlightedCarId] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: string]: number }>({});

  // Calendar state
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarType, setCalendarType] = useState<'pickup' | 'dropoff'>('pickup');
  const [calendarPosition, setCalendarPosition] = useState<{ top: number; left: number; width: number } | undefined>();

  // Refs for input fields
  const pickupInputRef = useRef<HTMLInputElement>(null);
  const dropoffInputRef = useRef<HTMLInputElement>(null);

  // Calendar handlers
  const openCalendar = (type: 'pickup' | 'dropoff') => {
    setCalendarType(type);

    // Calculate position based on input field
    const inputRef = type === 'pickup' ? pickupInputRef : dropoffInputRef;
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setCalendarPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }

    setShowCalendar(true);
  };

  const handleDateSelect = (date: string) => {
    if (calendarType === 'pickup') {
      setPickupDate(date);
    } else {
      setDropoffDate(date);
    }
    setShowCalendar(false);
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!search.trim()) return;

    setLoading(true);
    setError("");

    try {
      // Prepare API request data
      const pickupDateTime = `${pickupDate}T${pickupTime || '10:00'}:00`;
      const dropoffDateTime = `${dropoffDate}T${dropoffTime || '10:00'}:00`;

      const requestData = {
        pickupLocation: search,
        dropoffLocation: search, // Same location for now
        pickupDate: pickupDateTime,
        dropoffDate: dropoffDateTime,
        driverAge: 30 // Default driver age
      };

      console.log('Calling car hire API with:', requestData);

      const response = await fetch('/api/car-hire', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch car rentals');
      }

      console.log('Car hire API response:', data);
      setCars(data.data || []);

      // If no results from API, fall back to mock data
      if (!data.data || data.data.length === 0) {
        console.log('No API results, using mock data');
        const mockCars = generateMockCarRentals(search, pickupDate, dropoffDate);
        setCars(mockCars);
      }
    } catch (err) {
      console.error('Car hire API error:', err);
      setError("Error fetching car rentals. Using sample data.");

      // Fall back to mock data on error
      const mockCars = generateMockCarRentals(search, pickupDate, dropoffDate);
      setCars(mockCars);
    } finally {
      setLoading(false);
    }
  };

  // Auto-search if params are present
  useEffect(() => {
    if (
      searchParams.get("location") &&
      searchParams.get("pickupDate") &&
      searchParams.get("dropoffDate")
    ) {
      handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helper: get car rental markers
  const carMarkers = cars.map((car) => ({
    id: car.id,
    name: `${car.company} - ${car.name}`,
    lat: car.location.latitude,
    lng: car.location.longitude,
    price: `£${car.pricing.dailyRate}/day`,
    address: car.location.address,
    image: car.image,
    rating: car.rating.toFixed(1),
    phone: "Contact Rental Office",
    type: car.carType,
  }));

  return (
    <>
      <Header />
      <div className="flex flex-col min-h-screen bg-white pt-16">
        {/* Top: Full-width search form */}
        <div className="w-full px-8 pt-8 pb-4 border-b bg-white flex justify-center">
          <form className="flex gap-2 w-full max-w-4xl" onSubmit={handleSearch}>
            <input
              className="border rounded px-4 py-2 flex-1"
              placeholder="Pick-up location (e.g. Dubai, London, Paris)"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <input
              ref={pickupInputRef}
              type="text"
              placeholder="Pick-up Date"
              className="border rounded px-4 py-2 cursor-pointer"
              value={pickupDate ? new Date(pickupDate).toLocaleDateString() : ''}
              onClick={() => openCalendar('pickup')}
              readOnly
            />
            <input
              type="time"
              className="border rounded px-4 py-2"
              value={pickupTime}
              onChange={e => setPickupTime(e.target.value)}
            />
            <input
              ref={dropoffInputRef}
              type="text"
              placeholder="Drop-off Date"
              className="border rounded px-4 py-2 cursor-pointer"
              value={dropoffDate ? new Date(dropoffDate).toLocaleDateString() : ''}
              onClick={() => openCalendar('dropoff')}
              readOnly
            />
            <input
              type="time"
              className="border rounded px-4 py-2"
              value={dropoffTime}
              onChange={e => setDropoffTime(e.target.value)}
            />
            <button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white p-3 rounded font-bold flex items-center justify-center min-w-[50px]" title="Search">
              <Search size={20} />
            </button>
          </form>
        </div>

        {/* Main content: filters, car list, map */}
        <div className="flex flex-1">
          {/* Left: Filters and car list */}
          <div className="w-[800px] p-8 border-r bg-white overflow-y-auto" style={{ maxHeight: 'calc(100vh - 120px)' }}>
            <div className="flex gap-2 mb-4">
              <button className="border rounded px-3 py-1 text-sm">All filters</button>
              <button className="border rounded px-3 py-1 text-sm">Car type</button>
              <button className="border rounded px-3 py-1 text-sm">Transmission</button>
              <button className="border rounded px-3 py-1 text-sm">Price</button>
              <button className="border rounded px-3 py-1 text-sm">Company</button>
            </div>
            <div className="mb-2 text-gray-600 text-xs">Total cost - Including all taxes + fees</div>
            <div className="mb-4 text-gray-700 text-sm">
              {cars.length > 0
                ? `${cars.length} result${cars.length > 1 ? 's' : ''} found`
                : 'No results found'}
              &nbsp; Sort by <b>Price (low to high)</b>
            </div>

            <div className="space-y-6">
              {error && <div className="text-red-600 font-bold mb-2">{error}</div>}
              {loading && <div className="text-orange-600 font-bold">Loading car rentals...</div>}
              {cars.length > 0 && cars.map((car) => (
                <div
                  key={car.id}
                  className={`bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-200 cursor-pointer ${highlightedCarId === car.id ? 'ring-2 ring-orange-500 shadow-lg' : 'hover:shadow-md'
                    }`}
                  onMouseEnter={() => setHighlightedCarId(car.id)}
                  onMouseLeave={() => setHighlightedCarId(null)}
                >
                  <div className="flex">
                    {/* Left: Car Image */}
                    <div className="relative w-80 h-56">
                      <img
                        src={car.image}
                        alt={`${car.company} ${car.name}`}
                        className="w-full h-full object-cover"
                      />
                      {/* Save and Share buttons */}
                      <div className="absolute top-4 left-4 flex gap-2">
                        <button className="bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-1">
                          <span>♡</span> Save
                        </button>
                        <button className="bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-1">
                          <span>↗</span> Share
                        </button>
                      </div>

                      {/* Great Deal badge */}
                      {car.specialOffers && car.specialOffers.length > 0 && (
                        <div className="absolute top-4 right-4 bg-green-100 text-green-800 px-3 py-1 rounded-lg text-sm font-medium">
                          Great Deal
                        </div>
                      )}

                      {/* Company logo */}
                      <div className="absolute bottom-4 left-4 bg-orange-600 text-white px-3 py-1.5 rounded text-sm font-bold">
                        {car.company}
                      </div>
                    </div>

                    {/* Middle: Car Details */}
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{car.name}</h3>
                          <p className="text-gray-600 text-sm">or similar {car.carType}</p>
                        </div>

                        {/* Compare button */}
                        <button className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-1">
                          <span>⇄</span> Compare
                        </button>
                      </div>

                      {/* Car specs with icons */}
                      <div className="flex items-center gap-6 mb-4 text-gray-700">
                        <div className="flex items-center gap-1">
                          <span className="text-lg">👥</span>
                          <span className="font-medium">{car.seats}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-lg">💼</span>
                          <span className="font-medium">{car.doors - 2}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-lg">🚗</span>
                          <span className="font-medium">{car.doors}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-lg">🔄</span>
                          <span className="font-medium">{car.transmission.charAt(0)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-lg">❄️</span>
                          <span className="font-medium">A/C</span>
                        </div>
                      </div>

                      {/* Location and distance */}
                      <div className="flex items-start gap-2 mb-4">
                        <span className="text-gray-500 mt-0.5">🏢</span>
                        <div>
                          <p className="font-medium text-gray-900">{car.pickup.location}</p>
                          <p className="text-sm text-gray-600">2.1 mi from city centre</p>
                        </div>
                      </div>

                      {/* Rating and offer */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="bg-green-600 text-white px-2 py-1 rounded text-sm font-bold">
                          {car.rating.toFixed(1)}
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          Excellent offer from {car.company}
                        </span>
                      </div>

                      {/* Features grid */}
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                          <span className="text-green-600">✓</span>
                          <span>Free cancellation (48h)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-green-600">✓</span>
                          <span>Theft coverage</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-green-600">✓</span>
                          <span>Fair fuel policy</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-green-600">✓</span>
                          <span>Liability coverage</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-orange-500">⚠</span>
                          <span>155 mi included per day</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-green-600">✓</span>
                          <span>Collision damage waiver</span>
                        </div>
                      </div>

                      {/* Availability warning */}
                      {car.availability && car.availability.available && car.availability.remainingCars <= 2 && (
                        <div className="mt-3 text-sm text-orange-600 font-medium">
                          ⚠️ Only {car.availability.remainingCars} left at this price
                        </div>
                      )}
                    </div>

                    {/* Right: Pricing and CTA */}
                    <div className="w-64 p-6 bg-gray-50 flex flex-col justify-between">
                      <div className="text-right">
                        <div className="text-sm text-gray-600 mb-1">{car.company}</div>
                        {car.availability && car.availability.available && car.availability.remainingCars <= 2 && (
                          <div className="text-xs text-gray-500 mb-2">Out of hours fee ⓘ</div>
                        )}
                        <div className="text-3xl font-bold text-gray-900 mb-1">
                          £{car.pricing.totalCost}
                        </div>
                        <div className="text-sm text-gray-600 mb-4">Total</div>
                      </div>

                      {car.availability && !car.availability.available ? (
                        <div className="text-center">
                          <div className="bg-gray-400 text-white px-6 py-3 rounded-lg font-bold cursor-not-allowed w-full">
                            Unavailable
                          </div>
                          {car.availability.nextAvailable && (
                            <div className="text-xs text-gray-500 mt-2">
                              Next: {car.availability.nextAvailable}
                            </div>
                          )}
                        </div>
                      ) : (
                        <Link
                          href={`/car-hire/${car.id}`}
                          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-bold text-center block transition-colors"
                        >
                          View Deal
                        </Link>
                      )}

                      {/* Price comparison */}
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="text-xs text-gray-600 mb-2">6 more sites ⌄</div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <div className="font-medium">KAYAK</div>
                            <div className="text-green-600">£{car.pricing.totalCost - 2}</div>
                          </div>
                          <div>
                            <div className="font-medium">Car Rental 8</div>
                            <div>£{car.pricing.totalCost + 6}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Map */}
          <div className="flex-1 relative">
            <MapWithMarkers
              markers={carMarkers}
              center={cars.length > 0 ? {
                lat: cars[0].location.latitude,
                lng: cars[0].location.longitude
              } : { lat: 25.2048, lng: 55.2708 }}
              highlightedMarkerId={highlightedCarId}
            />
          </div>
        </div>
      </div>
      <Footer />

      {/* Price Calendar Modal */}
      {showCalendar && (
        <PriceCalendar
          selectedDate={calendarType === 'pickup' ? pickupDate : dropoffDate}
          onDateSelect={handleDateSelect}
          onClose={() => setShowCalendar(false)}
          searchType="car"
          position={calendarPosition}
          inputRef={calendarType === 'pickup' ? pickupInputRef : dropoffInputRef}
        />
      )}
    </>
  );
}

export default function CarHirePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CarHirePageContent />
    </Suspense>
  );
}
