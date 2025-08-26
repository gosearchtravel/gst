"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "../components/header";
import Footer from "../components/footer";
import "leaflet/dist/leaflet.css";

// Dynamic import for MapWithMarkers to avoid SSR issues with Leaflet
const MapWithMarkers = dynamic(() => import("./MapWithMarkers"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-100 animate-pulse" />
});

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
    room?: {
      description?: {
        text?: string;
      };
    };
    guests?: {
      adults?: number;
    };
    policies?: {
      cancellations?: Array<{
        description?: {
          text?: string;
        };
      }>;
    };
  }>;
}

interface HotelMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  price: string;
  address: string;
  image: string;
  rating: string;
  phone: string;
  cancellation: string;
}

// Available city codes for hotel search
const cityCodes: { [key: string]: string } = {
  Paris: "PAR",
  London: "LON",
  "New York": "NYC",
  Tokyo: "TYO",
  Dubai: "DXB",
  Rome: "ROM",
  Barcelona: "BCN",
  Bangkok: "BKK",
  Sydney: "SYD",
  Singapore: "SIN",
  Istanbul: "IST",
  Amsterdam: "AMS",
  "Los Angeles": "LAX",
  Miami: "MIA",
  Berlin: "BER",
  Madrid: "MAD",
  Vienna: "VIE",
  Prague: "PRG",
  Budapest: "BUD",
  Warsaw: "WAW",
  Stockholm: "STO",
  Oslo: "OSL",
  Copenhagen: "CPH",
  Helsinki: "HEL",
  Zurich: "ZUR",
  Geneva: "GVA",
  Brussels: "BRU",
  Lisbon: "LIS",
  Athens: "ATH",
  Cairo: "CAI",
  "Cape Town": "CPT",
  Johannesburg: "JNB",
  Mumbai: "BOM",
  Delhi: "DEL",
  "Hong Kong": "HKG",
  Seoul: "SEL",
  Melbourne: "MEL",
  Brisbane: "BNE",
  Perth: "PER",
  Adelaide: "ADL",
  Montreal: "YMQ",
  Toronto: "YTO",
  Vancouver: "YVR",
  "Mexico City": "MEX",
  "Buenos Aires": "BUE",
  "Rio de Janeiro": "RIO",
  "São Paulo": "SAO",
  Lima: "LIM",
  Santiago: "SCL",
  Bogota: "BOG",
  Caracas: "CCS",
  Quito: "UIO",
  "La Paz": "LPB",
  Montevideo: "MVD",
  Asuncion: "ASU",
  Georgetown: "GEO",
  Paramaribo: "PBM",
  "Tel Aviv": "TLV",
  Jerusalem: "JRS",
  Amman: "AMM",
  Beirut: "BEY",
  Damascus: "DAM",
  Kuwait: "KWI",
  Riyadh: "RUH",
  Doha: "DOH",
  "Abu Dhabi": "AUH",
  Muscat: "MCT",
  Manama: "BAH",
  Baghdad: "BGW",
  Tehran: "THR",
  Kabul: "KBL",
  Islamabad: "ISB",
  Karachi: "KHI",
  Lahore: "LHE",
  Dhaka: "DAC",
  Colombo: "CMB",
  Male: "MLE",
  Kathmandu: "KTM",
  Thimphu: "PBH",
  Ulaanbaatar: "ULN",
  Astana: "NQZ",
  Almaty: "ALA",
  Tashkent: "TAS",
  Bishkek: "FRU",
  Dushanbe: "DYU",
  Ashgabat: "ASB",
  Baku: "BAK",
  Yerevan: "EVN",
  Tbilisi: "TBS",
  Minsk: "MSQ",
  Kiev: "KBP",
  Chisinau: "KIV",
  Bucharest: "OTP",
  Sofia: "SOF",
  Belgrade: "BEG",
  Zagreb: "ZAG",
  Ljubljana: "LJU",
  Sarajevo: "SJJ",
  Podgorica: "TGD",
  Skopje: "SKP",
  Tirana: "TIA",
  Pristina: "PRN",
};

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

  // Function to handle hotel search
  const handleSearch = async () => {
    setLoading(true);
    setHotels([]);
    setError("");

    // Validate city
    const cityInput = search.trim();
    const cityCode = cityCodes[cityInput];
    if (!cityCode) {
      setError(`City "${cityInput}" is not supported. Try: ${Object.keys(cityCodes).join(', ')}`);
      setLoading(false);
      return;
    }

    // Validate dates
    if (!checkIn || !checkOut) {
      setError("Please select valid check-in and check-out dates.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/hotels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cityCode, checkInDate: checkIn, checkOutDate: checkOut, adults: guests }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error);
        setHotels([]);
      } else if (data.data && data.data.length > 0) {
        setHotels(data.data);
      } else {
        setError("No hotels found for your search. Try a different city or date.");
        setHotels([]);
      }
    } catch (error) {
      setError("Error fetching hotels. Please try again later.");
      setHotels([]);
    }
    setLoading(false);
  };

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

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Find Hotels</h1>

          <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Enter city name"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={e => setCheckIn(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={e => setCheckOut(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                <select
                  value={guests}
                  onChange={e => setGuests(Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>{num} guest{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Searching..." : "Search Hotels"}
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            <div className="space-y-4">
              {hotels.map((hotel, index) => {
                const h = hotel.hotel || hotel;
                const hotelId = h?.hotelId || h?.id || `hotel-${index}`;

                return (
                  <div
                    key={hotelId}
                    className="bg-white p-6 rounded-lg shadow-lg border hover:shadow-xl transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="md:w-1/3">
                        <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                          <img
                            src={h?.media?.[0]?.uri || "/placeholder-hotel.jpg"}
                            alt={h?.name || "Hotel"}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/placeholder-hotel.jpg";
                            }}
                          />
                        </div>
                      </div>

                      <div className="md:w-2/3">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          {h?.name || "Hotel Name Not Available"}
                        </h3>

                        <div className="flex items-center mb-2">
                          <span className="text-yellow-500">★</span>
                          <span className="ml-1 text-gray-600">
                            {h?.rating || "N/A"} / 5
                          </span>
                        </div>

                        <p className="text-gray-600 mb-2">
                          📍 {h?.address?.lines?.join(", ") || "Address not available"}
                        </p>

                        {h?.contact?.phone && (
                          <p className="text-gray-600 mb-2">
                            📞 {h.contact.phone}
                          </p>
                        )}

                        {hotel.offers && hotel.offers.length > 0 && (
                          <div className="mt-4">
                            <p className="font-semibold text-green-600 text-lg">
                              From ${hotel.offers[0]?.price?.total || "N/A"} / night
                            </p>
                            {hotel.offers[0]?.room?.description?.text && (
                              <p className="text-sm text-gray-600 mt-1">
                                {hotel.offers[0].room.description.text}
                              </p>
                            )}
                          </div>
                        )}

                        <div className="mt-4 flex gap-2">
                          <Link
                            href={`/hotels/${hotelId}`}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {!loading && hotels.length === 0 && <div className="text-gray-500">No hotels found.</div>}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
