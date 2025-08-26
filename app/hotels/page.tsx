"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "../components/header";
import Footer from "../components/footer";
import "leaflet/dist/leaflet.css";

// Dynamic import for MapWithMarkers to avoid SSR issues with Leaflet
const MapWithMarkers = dynamic(() => import("./MapWithMarkers"), { ssr: false });

interface HotelData {
  hotel?: {
    hotelId?: string;
    id?: string;
    name?: string;
    geoCode?: {
      latitude: number;
      longitude: number;
    };
    address?: {
      lines?: string[];
    };
    media?: Array<{ uri: string }>;
    rating?: number;
    contact?: {
      phone?: string;
    };
  };
  hotelId?: string;
  id?: string;
  name?: string;
  geoCode?: {
    latitude: number;
    longitude: number;
  };
  address?: {
    lines?: string[];
  };
  media?: Array<{ uri: string }>;
  rating?: number;
  contact?: {
    phone?: string;
  };
  offers?: Array<{
    price?: {
      total?: string;
    };
    cancellationPolicy?: {
      description?: string;
    };
  }>;
}

// City name to Amadeus city code mapping
const cityCodes: Record<string, string> = {
  "mecca": "JED",
  "jeddah": "JED",
  "dubai": "DXB",
  "cairo": "CAI",
  "london": "LON",
  "paris": "PAR",
  "istanbul": "IST",
  "riyadh": "RUH",
  "new york": "NYC",
  "muscat": "MCT",
  "tokyo": "NRT",
  "madrid": "MAD",
  "rome": "ROM",
  "milan": "MIL",
  "barcelona": "BCN",
  "amsterdam": "AMS",
  "berlin": "BER",
  "vienna": "VIE",
  "zurich": "ZUR",
  "geneva": "GVA",
  "brussels": "BRU",
  "lisbon": "LIS",
  "athens": "ATH",
  "copenhagen": "CPH",
  "stockholm": "ARN",
  "oslo": "OSL",
  "helsinki": "HEL",
  "moscow": "SVO",
  "st petersburg": "LED",
  "mumbai": "BOM",
  "delhi": "DEL",
  "bangalore": "BLR",
  "chennai": "MAA",
  "kolkata": "CCU",
  "hyderabad": "HYD",
  "pune": "PNQ",
  "ahmedabad": "AMD",
  "sydney": "SYD",
  "melbourne": "MEL",
  "brisbane": "BNE",
  "perth": "PER",
  "adelaide": "ADL",
  "auckland": "AKL",
  "wellington": "WLG",
  "christchurch": "CHC",
  "toronto": "YYZ",
  "vancouver": "YVR",
  "montreal": "YUL",
  "calgary": "YYC",
  "ottawa": "YOW",
  "los angeles": "LAX",
  "san francisco": "SFO",
  "chicago": "CHI",
  "miami": "MIA",
  "las vegas": "LAS",
  "washington": "DCA",
  "boston": "BOS",
  "seattle": "SEA",
  "denver": "DEN",
  "atlanta": "ATL",
  "philadelphia": "PHL",
  "detroit": "DTT",
  "minneapolis": "MSP",
  "phoenix": "PHX",
  "houston": "HOU",
  "dallas": "DFW",
  "mexico city": "MEX",
  "cancun": "CUN",
  "guadalajara": "GDL",
  "monterrey": "MTY",
  "sao paulo": "SAO",
  "rio de janeiro": "RIO",
  "brasilia": "BSB",
  "buenos aires": "BUE",
  "lima": "LIM",
  "bogota": "BOG",
  "caracas": "CCS",
  "santiago": "SCL",
  "quito": "UIO",
  "la paz": "LPB",
  "montevideo": "MVD",
  "asuncion": "ASU",
  "singapore": "SIN",
  "bangkok": "BKK",
  "kuala lumpur": "KUL",
  "jakarta": "JKT",
  "manila": "MNL",
  "ho chi minh city": "SGN",
  "hanoi": "HAN",
  "phnom penh": "PNH",
  "yangon": "RGN",
  "vientiane": "VTE",
  "hong kong": "HKG",
  "taipei": "TPE",
  "seoul": "SEL",
  "busan": "PUS",
  "osaka": "OSA",
  "kyoto": "UKY",
  "nagoya": "NGO",
  "sapporo": "CTS",
  "fukuoka": "FUK",
  "beijing": "PEK",
  "shanghai": "SHA",
  "guangzhou": "CAN",
  "shenzhen": "SZX",
  "chengdu": "CTU",
  "xian": "XIY",
  "hangzhou": "HGH",
  "nanjing": "NKG",
  "qingdao": "TAO",
  "tianjin": "TSN",
  "wuhan": "WUH",
  "chongqing": "CKG",
  "harbin": "HRB",
  "shenyang": "SHE",
  "dalian": "DLC",
  "kunming": "KMG",
  "urumqi": "URC",
  "lhasa": "LXA",
};

// Interface for hotel markers
interface HotelMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  price: string;
  address: string;
}

export default function HotelsPage() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("city") || "");
  const [checkIn, setCheckIn] = useState(searchParams.get("checkIn") || "");
  const [checkOut, setCheckOut] = useState(searchParams.get("checkOut") || "");
  const [guests, setGuests] = useState(Number(searchParams.get("guests")) || 2);
  const [hotels, setHotels] = useState<HotelData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [highlightedHotelId, setHighlightedHotelId] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: string]: number }>({});
  const mapRef = useRef<HTMLDivElement>(null);

  async function handleSearch(e?: React.FormEvent<HTMLFormElement>) {
    if (e) e.preventDefault();
    setLoading(true);
    setHotels([]);
    setError("");
    // Convert city name to code
    const cityInput = search.trim().toLowerCase();
    const cityCode = cityCodes[cityInput];

    if (!cityCode) {
      setError(`City "${cityInput}" is not supported. Try: ${Object.keys(cityCodes).join(', ')}`);
      setLoading(false);
      return;
    }
    const validDates = checkIn && checkOut && checkIn < checkOut;
    if (!validDates) {
      setError("Please select valid check-in and check-out dates.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/hotels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city: cityCode, checkIn, checkOut, guests }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setHotels([]);
      } else if (Array.isArray(data.data) && data.data.length > 0) {
        setHotels(data.data);
      } else {
        setError("No hotels found for your search. Try a different city or date.");
        setHotels([]);
      }
    } catch (err) {
      setError("Error fetching hotels. Please try again later.");
      setHotels([]);
    } finally {
      setLoading(false);
    }
  }

  // Auto-search if params are present
  useEffect(() => {
    if (
      searchParams.get("city") &&
      searchParams.get("checkIn") &&
      searchParams.get("checkOut") &&
      searchParams.get("guests")
    ) {
      handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helper: get hotel markers
  const hotelMarkers = hotels
    .filter((hotel) => {
      const h = hotel.hotel || hotel;
      return h && h.geoCode && h.geoCode.latitude && h.geoCode.longitude;
    })
    .map((hotel) => {
      const h = hotel.hotel || hotel;
      const offer = hotel.offers?.[0] || {};
      return {
        id: h.hotelId || h.id || 'unknown',
        name: h.name || 'Unknown Hotel',
        lat: h.geoCode!.latitude,
        lng: h.geoCode!.longitude,
        price: offer.price?.total || "-",
        address: typeof h.address === 'object' && h.address?.lines
          ? h.address.lines[0] || ""
          : typeof h.address === 'string'
            ? h.address
            : "",
        image: h.media?.[0]?.uri || "/popdest/abudhabi.jpg",
        rating: h.rating?.toString() || "-",
        phone: h.contact?.phone || "No phone",
        cancellation: offer.cancellationPolicy?.description || "Free cancellation",
      };
    });

  return (
    <>
      <Header />
      <div className="flex flex-col min-h-screen bg-white pt-16"> {/* Added pt-16 for sticky header */}
        {/* Top: Full-width search form */}
        <div className="w-full px-8 pt-8 pb-4 border-b bg-white flex justify-center">
          <form className="flex gap-2 w-full max-w-3xl" onSubmit={handleSearch}>
            <input
              className="border rounded px-4 py-2 flex-1"
              placeholder="Enter city (e.g. Mecca, Dubai, Cairo, London)"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <input
              type="date"
              className="border rounded px-4 py-2"
              value={checkIn}
              onChange={e => setCheckIn(e.target.value)}
            />
            <input
              type="date"
              className="border rounded px-4 py-2"
              value={checkOut}
              onChange={e => setCheckOut(e.target.value)}
            />
            <input
              type="number"
              min={1}
              className="border rounded px-4 py-2 w-24"
              value={guests}
              onChange={e => setGuests(Number(e.target.value))}
            />
            <button type="submit" className="bg-orange-600 text-white px-6 py-2 rounded font-bold">Search</button>
          </form>
        </div>
        {/* Main content: filters, hotel list, map */}
        <div className="flex flex-1">
          {/* Left: Filters and hotel list */}
          <div className="w-[800px] p-8 border-r bg-white overflow-y-auto" style={{ maxHeight: 'calc(100vh - 120px)' }}>
            <div className="flex gap-2 mb-4">
              <button className="border rounded px-3 py-1 text-sm">All filters</button>
              <button className="border rounded px-3 py-1 text-sm">Smart Filters</button>
              <button className="border rounded px-3 py-1 text-sm">Free breakfast</button>
              <button className="border rounded px-3 py-1 text-sm">Price</button>
              <button className="border rounded px-3 py-1 text-sm">Amenities</button>
            </div>
            <div className="mb-2 text-gray-600 text-xs">Stay total - Including all taxes + fees</div>
            <div className="mb-4 text-gray-700 text-sm">
              {hotels.length > 0
                ? `${hotels.length} result${hotels.length > 1 ? 's' : ''} found`
                : 'No results found'}
              &nbsp; Sort by <b>Price (low to high)</b>
            </div>
            <div className="space-y-6">
              {error && <div className="text-red-600 font-bold mb-2">{error}</div>}
              {loading && <div className="text-orange-600 font-bold">Loading hotels...</div>}
              {Array.isArray(hotels) && hotels.length > 0 && hotels.map((hotel) => {
                // Defensive: Amadeus hotel API returns hotel + offers structure
                let h, offer;
                if (hotel && typeof hotel === 'object' && 'hotel' in hotel && Array.isArray(hotel.offers)) {
                  h = hotel.hotel;
                  offer = hotel.offers[0] || {};
                } else {
                  h = hotel;
                  offer = {};
                }

                // Skip if h is undefined or null
                if (!h) return null;

                return (
                  <div
                    key={h.hotelId || h.id}
                    className={`bg-white border rounded-lg shadow-sm overflow-hidden transition-all duration-200 cursor-pointer ${highlightedHotelId === (h.hotelId || h.id) ? 'ring-2 ring-orange-500 shadow-lg' : 'hover:shadow-md'
                      }`}
                    onMouseEnter={() => setHighlightedHotelId(h.hotelId || h.id)}
                    onMouseLeave={() => setHighlightedHotelId(null)}
                  >
                    <div className="flex h-48">
                      {/* Hotel Image Carousel */}
                      <div className="relative w-64 h-full">
                        {(() => {
                          // Create multiple images for each hotel (using various stock images as fallbacks)
                          const hotelImages = [
                            h.media?.[0]?.uri || "/popdest/abudhabi.jpg",
                            h.media?.[1]?.uri || "/popdest/dubai.jpg",
                            h.media?.[2]?.uri || "/popdest/london.jpg",
                            h.media?.[3]?.uri || "/popdest/paris.jpg",
                            h.media?.[4]?.uri || "/popdest/newyork.webp"
                          ];

                          const currentIndex = currentImageIndex[h.hotelId || h.id] || 0;

                          return (
                            <>
                              <img
                                src={hotelImages[currentIndex]}
                                alt={`${h.name} - Image ${currentIndex + 1}`}
                                className="w-full h-full object-cover"
                              />

                              {/* Image Navigation Dots */}
                              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
                                {hotelImages.map((_, index) => (
                                  <button
                                    key={index}
                                    onClick={() => setCurrentImageIndex(prev => ({
                                      ...prev,
                                      [h.hotelId || h.id]: index
                                    }))}
                                    className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                                      ? 'bg-white'
                                      : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                                      }`}
                                  />
                                ))}
                              </div>

                              {/* Previous/Next Arrows */}
                              <button
                                onClick={() => setCurrentImageIndex(prev => ({
                                  ...prev,
                                  [h.hotelId || h.id]: currentIndex > 0 ? currentIndex - 1 : hotelImages.length - 1
                                }))}
                                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-1.5 rounded-full shadow-sm transition-all"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                              </button>

                              <button
                                onClick={() => setCurrentImageIndex(prev => ({
                                  ...prev,
                                  [h.hotelId || h.id]: currentIndex < hotelImages.length - 1 ? currentIndex + 1 : 0
                                }))}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-1.5 rounded-full shadow-sm transition-all"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            </>
                          );
                        })()}

                        {/* Save and Share buttons overlay */}
                        <div className="absolute top-3 left-3 flex gap-2">
                          <button className="bg-white bg-opacity-90 hover:bg-opacity-100 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 shadow-sm transition-all">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            Save
                          </button>
                          <button className="bg-white bg-opacity-90 hover:bg-opacity-100 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 shadow-sm transition-all">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                            </svg>
                            Share
                          </button>
                        </div>

                        {/* Discount badge */}
                        {offer.price?.total && (
                          <div className="absolute top-12 right-3 bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs font-medium">
                            11% less than usual
                          </div>
                        )}
                      </div>

                      {/* Hotel Details */}
                      <div className="flex-1 p-4">
                        {/* Hotel Name and Location */}
                        <div className="mb-3">
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{h.name}</h3>
                          <p className="text-gray-600 text-sm">
                            {typeof h.address === 'object' && h.address?.lines
                              ? h.address.lines[0] || 'Location not specified'
                              : typeof h.address === 'string'
                                ? h.address
                                : 'Location not specified'}
                          </p>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-3 mb-3">
                          <div className="bg-gray-800 text-white px-2.5 py-1 rounded-md text-sm font-bold">
                            {h.rating || "7.9"}
                          </div>
                          <div className="text-sm">
                            <span className="font-medium text-gray-900">Good</span>
                            <span className="text-gray-500 ml-1">(303)</span>
                          </div>
                          <div className="flex text-yellow-400">
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </div>
                        </div>

                        {/* Booking Options */}
                        <div className="space-y-3">
                          {/* Agoda Option */}
                          <div className="flex items-center justify-between py-2 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">agoda</span>
                                <div className="flex gap-1">
                                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                </div>
                              </div>
                              <span className="text-sm text-gray-600">Free cancellation</span>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-gray-900">£{offer.price?.total || "47"}</div>
                            </div>
                          </div>

                          {/* Booking.com Option */}
                          <div className="flex items-center justify-between py-2">
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-bold text-blue-700">Booking.com</span>
                              <span className="text-sm text-gray-600">Free breakfast, Free cancellation</span>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-gray-900">£{offer.price?.total ? (parseInt(offer.price.total) * 4.5).toFixed(0) : "216"}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Price and View Deal */}
                      <div className="w-64 p-4 bg-gray-50 flex flex-col justify-between">
                        <div className="text-right">
                          <div className="text-xs text-blue-600 font-medium mb-1">priceline</div>
                          <div className="text-1xl font-bold text-gray-900 mb-1">£{offer.price?.total || "32"}</div>
                          <div className="text-sm text-green-700 font-medium mb-3">Free cancellation</div>
                        </div>

                        <Link
                          href={`/hotels/${h.hotelId || h.id || 'sample-hotel'}?city=${searchParams.get("city") || search}&checkIn=${searchParams.get("checkIn") || checkIn}&checkOut=${searchParams.get("checkOut") || checkOut}&guests=${searchParams.get("guests") || guests}`}
                          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-6 rounded-lg text-base transition-colors block text-center"
                        >
                          View Deal
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
              {!loading && hotels.length === 0 && <div className="text-gray-500">No hotels found.</div>}
            </div>
          </div>
          {/* Right: Map */}
          <div className="flex-1 relative">
            <MapWithMarkers markers={hotelMarkers} highlightedHotelId={highlightedHotelId} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}