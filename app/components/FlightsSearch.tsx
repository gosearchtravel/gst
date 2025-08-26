"use client";

interface FlightSegment {
  departure: {
    iataCode: string;
    at: string;
    airport?: string;
  };
  arrival: {
    iataCode: string;
    at: string;
    airport?: string;
  };
  carrierCode: string;
  number: string;
  aircraft: {
    code: string;
  };
  operating?: {
    airlineCode: string;
  };
  marketing?: {
    airlineCode: string;
  };
}

interface FlightOffer {
  id: string;
  itineraries: {
    segments: FlightSegment[];
    duration?: string;
  }[];
  price: {
    total: string;
    currency: string;
  };
  numberOfBookableSeats?: number;
}

interface FlightResults {
  data: FlightOffer[];
}

interface ApiError {
  detail: string;
}

function getTimeParts(dt: string) {
  try {
    const d = new Date(dt);
    return { h: d.getHours().toString().padStart(2, '0'), m: d.getMinutes().toString().padStart(2, '0') };
  } catch {
    return { h: '', m: '' };
  }
}

import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { airports } from "./airports";

import PlaneLineIcon from "../../components/ui/PlaneLineIcon";

export default function FlightsSearch({ selectedDate, setOrigin, setDestination, origin, destination }: { selectedDate?: string, setOrigin: (o: string) => void, setDestination: (d: string) => void, origin: string, destination: string }) {
  // All hooks must be at the top level of the function!
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [originDropdown, setOriginDropdown] = useState(false);
  const [destinationDropdown, setDestinationDropdown] = useState(false);
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<FlightResults | null>(null);
  const [error, setError] = useState("");
  const [visibleCount, setVisibleCount] = useState(10);
  const [progress, setProgress] = useState(0);

  // Hydration-safe date formatting
  function formatDate(dt: string) {
    // Only run on client
    if (typeof window === 'undefined') return '';
    try {
      const d = new Date(dt);
      return d.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' });
    } catch {
      return '';
    }
  }
  // Hydration-safe helpers
  function formatDuration(pt: string) {
    const m = pt.match(/PT(\d+)H(\d+)?M?/);
    if (!m) return pt.replace('PT', '');
    return `${m[1]}h${m[2] ? ' ' + m[2] : ''}`;
  }
  function formatTime(dt: string) {
    const { h, m } = getTimeParts(dt);
    return h && m ? `${h}:${m}` : '';
  }
  function isNextDay(dep: string, arr: string) {
    try {
      return new Date(arr).getDate() !== new Date(dep).getDate();
    } catch {
      return false;
    }
  }

  // Auto-populate and search from query params
  useEffect(() => {
    async function searchFlightsFromParams(origin: string, destination: string, departureDate: string, returnDate: string, adults: number) {
      setLoading(true);
      setError("");
      setResults(null);
      try {
        const res = await fetch("/api/flights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ origin, destination, departureDate, returnDate, adults }),
        });
        const data = await res.json();
        if (!res.ok) {
          const apiError = data?.errors?.[0]?.detail || data?.error || data?.message || "Failed to fetch flights";
          throw new Error(apiError);
        }
        if (data?.errors && data.errors.length > 0) {
          setError(data.errors.map((e: ApiError) => e.detail).join("; "));
        } else {
          setResults(data);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const qOrigin = params.get("origin") || "";
    const qDestination = params.get("destination") || "";
    const qDepartureDate = params.get("departureDate") || "";
    const qReturnDate = params.get("returnDate") || "";
    const qAdults = params.get("adults") || "1";
    if (qOrigin && qDestination && qDepartureDate) {
      setOrigin(qOrigin);
      setDestination(qDestination);
      setDepartureDate(qDepartureDate);
      setReturnDate(qReturnDate);
      setAdults(Number(qAdults));
      // Auto-search
      searchFlightsFromParams(qOrigin, qDestination, qDepartureDate, qReturnDate, Number(qAdults));
    }
  }, []);

  useEffect(() => {
    if (selectedDate && selectedDate !== departureDate) {
      setDepartureDate(selectedDate);
      // Always trigger a search when the date changes and origin/destination are set
      if (origin && destination) {
        searchFlights({ preventDefault: () => { } } as React.FormEvent<HTMLFormElement>);
      }
    }
  }, [selectedDate, origin, destination]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loading) {
      setProgress(0);
      timer = setInterval(() => {
        setProgress(prev => (prev < 90 ? prev + 10 : prev));
      }, 120);
    } else {
      setProgress(100);
      setTimeout(() => setProgress(0), 400);
    }
    return () => clearInterval(timer);
  }, [loading]);

  async function searchFlights(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResults(null);
    try {
      const res = await fetch("/api/flights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ origin, destination, departureDate, returnDate, adults }),
      });
      const data = await res.json();
      if (!res.ok) {
        // Show Amadeus error message if available
        const apiError = data?.errors?.[0]?.detail || data?.error || data?.message || "Failed to fetch flights";
        throw new Error(apiError);
      }
      if (data?.errors && data.errors.length > 0) {
        setError(data.errors.map((e: ApiError) => e.detail).join("; "));
      } else {
        setResults(data);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Progress bar above main div */}
      {loading && (
        <div className="w-full">
          <div className="h-2 w-full bg-orange-300">
            <div
              className="h-2 bg-orange-600 transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
      <div>
        <form className="space-y-4" onSubmit={searchFlights}>
          <div>
            <label className="block mb-1 font-medium">Origin</label>
            <div className="relative">
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={origin}
                onChange={e => {
                  setOrigin(e.target.value.toUpperCase());
                  setOriginDropdown(true);
                }}
                onFocus={() => setOriginDropdown(true)}
                onBlur={() => setTimeout(() => setOriginDropdown(false), 150)}
                placeholder="e.g. DXB"
                required
                autoComplete="off"
              />
              {originDropdown && origin.length > 0 && (
                <ul className="absolute left-0 right-0 top-full bg-white border rounded shadow z-10 max-h-56 overflow-y-auto">
                  {airports.filter(a =>
                    a.code.includes(origin) ||
                    a.city.toUpperCase().includes(origin) ||
                    a.name.toUpperCase().includes(origin)
                  ).slice(0, 8).map(a => (
                    <li
                      key={a.code}
                      className="px-3 py-2 cursor-pointer hover:bg-orange-100"
                      onMouseDown={() => { setOrigin(a.code); setOriginDropdown(false); }}
                    >
                      <span className="font-bold">{a.code}</span> - {a.city} ({a.name})
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div>
            <label className="block mb-1 font-medium">Destination</label>
            <div className="relative">
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={destination}
                onChange={e => {
                  setDestination(e.target.value.toUpperCase());
                  setDestinationDropdown(true);
                }}
                onFocus={() => setDestinationDropdown(true)}
                onBlur={() => setTimeout(() => setDestinationDropdown(false), 150)}
                placeholder="e.g. LHR"
                required
                autoComplete="off"
              />
              {destinationDropdown && destination.length > 0 && (
                <ul className="absolute left-0 right-0 top-full bg-white border rounded shadow z-10 max-h-56 overflow-y-auto">
                  {airports.filter(a =>
                    a.code.includes(destination) ||
                    a.city.toUpperCase().includes(destination) ||
                    a.name.toUpperCase().includes(destination)
                  ).slice(0, 8).map(a => (
                    <li
                      key={a.code}
                      className="px-3 py-2 cursor-pointer hover:bg-orange-100"
                      onMouseDown={() => { setDestination(a.code); setDestinationDropdown(false); }}
                    >
                      <span className="font-bold">{a.code}</span> - {a.city} ({a.name})
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div>
            <label className="block mb-1 font-medium">Departure Date</label>
            <input type="date" className="w-full border rounded px-3 py-2" value={departureDate} onChange={e => setDepartureDate(e.target.value)} required />
          </div>
          <div>
            <label className="block mb-1 font-medium">Return Date</label>
            <input type="date" className="w-full border rounded px-3 py-2" value={returnDate} onChange={e => setReturnDate(e.target.value)} />
          </div>
          <div>
            <label className="block mb-1 font-medium">Adults</label>
            <input type="number" className="w-24 border rounded px-3 py-2" min={1} max={9} value={adults} onChange={e => setAdults(Number(e.target.value))} required />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded font-semibold" disabled={loading}>
            {loading ? "Searching..." : "Search Flights"}
          </button>
        </form>
        {error && <div className="mt-4 text-red-600">{error}</div>}
        {results && (
          <div className="mt-8 text-sm">
            <h3 className="text-base font-bold mb-2">Results</h3>
            {results.data && (
              <div className="mb-4 text-gray-700 text-sm">
                {results.data && results.data.length > 0 ? (
                  <>
                    <div className="mb-2 text-xs text-gray-600 font-medium">
                      Showing {Math.min(visibleCount, results.data.length)} of {results.data.length} result{results.data.length > 1 ? 's' : ''} found
                    </div>
                    <ul className="space-y-4">
                      {results.data.slice(0, visibleCount).map((offer, idx) => {
                        const isExpanded = expandedIdx === idx;
                        return (
                          <>
                            <li key={`flight-${offer.id || idx}`} className="relative rounded-2xl shadow border px-4 py-4 mb-2">
                              {/* ...existing card rendering code... */}
                              <div className="flex items-center gap-6">
                                {/* Airline logos column: only outgoing and incoming flights */}
                                <div className="flex flex-col items-center gap-8">
                                  {/* Outgoing flight logo */}
                                  <img
                                    src={offer.itineraries[0].segments[0].operating ? `https://content.airhex.com/content/logos/airlines_${offer.itineraries[0].segments[0].operating.airlineCode}.png` : '/globe.svg'}
                                    alt={offer.itineraries[0].segments[0].operating ? offer.itineraries[0].segments[0].operating.airlineCode : ''}
                                    className="w-[90px] h-[40px] object-contain"
                                    onError={e => { e.currentTarget.src = '/globe.svg'; }}
                                  />
                                  {/* Incoming flight logo (return) */}
                                  {offer.itineraries.length > 1 && (
                                    <img
                                      src={offer.itineraries[1].segments[0].operating ? `https://content.airhex.com/content/logos/airlines_${offer.itineraries[1].segments[0].operating.airlineCode}.png` : '/globe.svg'}
                                      alt={offer.itineraries[1].segments[0].operating ? offer.itineraries[1].segments[0].operating.airlineCode : ''}
                                      className="w-[90px] h-[40px] object-contain"
                                      onError={e => { e.currentTarget.src = '/globe.svg'; }}
                                    />
                                  )}
                                </div>
                                {/* Itinerary column: stacked segments */}
                                <div
                                  className={`lg:w-[400px] flex flex-col gap-4 p-3 border-r border-gray-300 cursor-pointer hover:bg-blue-50 transition justify-center items-center ${isExpanded ? 'bg-blue-50' : ''}`}
                                  onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                                >
                                  {offer.itineraries.map((it, i) => (
                                    <div key={i} className="flex gap-6 items-center">
                                      {/* Departure time/code */}
                                      <div className="flex flex-col">
                                        <span className="text-md font-semibold">{typeof window !== 'undefined' ? formatTime(it.segments[0].departure.at) : ''}</span>
                                        <span className="text-xs text-gray-500">{it.segments[0].departure.iataCode}</span>
                                      </div>

                                      <div className="flex flex-col">
                                        <span className="text-xs text-gray-500 mb-1">{it.duration ? formatDuration(it.duration) : 'N/A'}</span>
                                        <PlaneLineIcon className="w-32 h-6" />
                                        <span className="text-xs text-teal-600 mt-1">{it.segments.length === 1 ? 'Direct' : `${it.segments.length - 1} stop${it.segments.length - 1 > 1 ? 's' : ''}`}</span>
                                      </div>
                                      {/* Arrival time/code (+1 if next day) */}
                                      <div className="flex flex-col items-start">
                                        <span className="text-md font-semibold">
                                          {typeof window !== 'undefined' ? formatTime(it.segments[it.segments.length - 1].arrival.at) : ''}
                                          {typeof window !== 'undefined' && isNextDay(it.segments[0].departure.at, it.segments[it.segments.length - 1].arrival.at) ? <sup className="text-xs">+1</sup> : null}
                                        </span>
                                        <span className="text-xs text-gray-500">{it.segments[it.segments.length - 1].arrival.iataCode}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                {/* Price and actions column */}
                                <div className="relative flex flex-col h-full min-w-[140px] gap-4 border-gray-300 items-left text-left">
                                  {/* Favorite button */}
                                  <button
                                    className="p-2 hover:text-orange-600 absolute top-[-15px] right-[-10px]"
                                    title="Save"
                                    onClick={e => { e.stopPropagation(); /* TODO: handle favorite */ }}
                                  >
                                    <Heart className="w-[22px] h-[22px]" />
                                  </button>

                                  <div className="flex flex-col items-center justify-center gap-1 w-full text-center">
                                    <span className="text-gray-500 text-xs mb-1">{offer.numberOfBookableSeats || 9} deal{(offer.numberOfBookableSeats || 9) > 1 ? 's' : ''} from</span>
                                    <span className="text-lg font-bold text-blue-600">£{offer.price.total}</span>
                                  </div>
                                  <button className="bg-blue-900 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-800 text-base">Select <span aria-hidden>→</span></button>
                                </div>
                              </div>
                              {/* Expanded details full width below card */}
                              {isExpanded && (
                                <div className="w-full p-6 bg-gray-50 rounded-b-2xl text-left text-xs border-t border-gray-200 mt-2 flex flex-col gap-6">
                                  {/* Departure Flight Card */}
                                  <div className="bg-white rounded-xl shadow p-4 border flex flex-col gap-2">
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="font-bold text-base">Depart • {typeof window !== 'undefined' ? formatDate(offer.itineraries[0].segments[0].departure.at) : ''}</div>
                                      <div className="text-right text-sm font-semibold">{offer.itineraries[0].duration ? formatDuration(offer.itineraries[0].duration) : 'N/A'}</div>
                                    </div>
                                    <div className="flex items-center gap-3 mb-2">
                                      <span className="bg-red-700 text-white text-xs px-2 py-1 rounded">{offer.itineraries[0].segments[0].operating?.airlineCode || offer.itineraries[0].segments[0].marketing?.airlineCode}</span>
                                      <span className="font-semibold">{offer.itineraries[0].segments[0].carrierCode} {offer.itineraries[0].segments[0].number}</span>
                                      <span className="border px-2 py-1 rounded text-xs">{offer.itineraries[0].segments[0].aircraft?.code ? `Airbus ${offer.itineraries[0].segments[0].aircraft.code}` : ''}</span>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                      <div className="flex items-center gap-4">
                                        <span className="text-xl font-bold">{typeof window !== 'undefined' ? formatTime(offer.itineraries[0].segments[0].departure.at) : ''}</span>
                                        <span className="font-semibold">{offer.itineraries[0].segments[0].departure.iataCode}</span>
                                        <span className="text-gray-500">{offer.itineraries[0].segments[0].departure.airport}</span>
                                      </div>
                                      <div className="flex items-center gap-4">
                                        <span className="text-xl font-bold">{typeof window !== 'undefined' ? formatTime(offer.itineraries[0].segments[0].arrival.at) : ''}</span>
                                        <span className="font-semibold">{offer.itineraries[0].segments[0].arrival.iataCode}</span>
                                        <span className="text-gray-500">{offer.itineraries[0].segments[0].arrival.airport}</span>
                                      </div>
                                    </div>
                                  </div>
                                  {/* Return Flight Card (if exists) */}
                                  {offer.itineraries.length > 1 && (
                                    <div className="bg-white rounded-xl shadow p-4 border flex flex-col gap-2">
                                      <div className="flex items-center justify-between mb-2">
                                        <div className="font-bold text-base">Return • {typeof window !== 'undefined' ? formatDate(offer.itineraries[1].segments[0].departure.at) : ''}</div>
                                        <div className="text-right text-sm font-semibold">{offer.itineraries[1].duration ? formatDuration(offer.itineraries[1].duration) : 'N/A'}</div>
                                      </div>
                                      <div className="flex items-center gap-3 mb-2">
                                        <span className="bg-red-700 text-white text-xs px-2 py-1 rounded">{offer.itineraries[1].segments[0].operating?.airlineCode || offer.itineraries[1].segments[0].marketing?.airlineCode}</span>
                                        <span className="font-semibold">{offer.itineraries[1].segments[0].carrierCode} {offer.itineraries[1].segments[0].number}</span>
                                        <span className="border px-2 py-1 rounded text-xs">{offer.itineraries[1].segments[0].aircraft?.code ? `Airbus ${offer.itineraries[1].segments[0].aircraft.code}` : ''}</span>
                                      </div>
                                      <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-4">
                                          <span className="text-xl font-bold">{typeof window !== 'undefined' ? formatTime(offer.itineraries[1].segments[0].departure.at) : ''}</span>
                                          <span className="font-semibold">{offer.itineraries[1].segments[0].departure.iataCode}</span>
                                          <span className="text-gray-500">{offer.itineraries[1].segments[0].departure.airport}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                          <span className="text-xl font-bold">{typeof window !== 'undefined' ? formatTime(offer.itineraries[1].segments[0].arrival.at) : ''}</span>
                                          <span className="font-semibold">{offer.itineraries[1].segments[0].arrival.iataCode}</span>
                                          <span className="text-gray-500">{offer.itineraries[1].segments[0].arrival.airport}</span>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </li>
                            {(idx + 1) % 5 === 0 && (idx + 1) < visibleCount && (
                              <li key={`ad-banner-${idx}-${visibleCount}`} className="w-full flex justify-center items-center my-4">
                                <div className="w-full h-[100px] bg-orange-100 rounded-xl flex items-center justify-center text-lg font-bold text-orange-700 border border-orange-300">
                                  {/* Replace with actual ad banner/image if needed */}
                                  Ad Banner
                                </div>
                              </li>
                            )}
                          </>
                        );
                      })}
                    </ul>
                    {results.data.length > visibleCount && (
                      <div className="flex justify-center mt-6">
                        <button
                          className="bg-orange-600 text-white px-6 py-2 rounded font-semibold hover:bg-orange-700"
                          onClick={() => setVisibleCount(visibleCount + 10)}
                        >
                          Show more results
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="mt-8 text-sm">
                    No flights found for your search.
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}