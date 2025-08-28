"use client";

import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';

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

interface FlightsResultsProps {
  selectedDate?: string;
  origin: string;
  destination: string;
  returnDate?: string;
  adults?: number;
  onLoadingChange?: (loading: boolean) => void;
  onProgressChange?: (progress: number) => void;
}

function getTimeParts(dt: string) {
  const d = new Date(dt);
  return {
    hours: d.getUTCHours(),
    minutes: d.getUTCMinutes()
  };
}

function isNextDay(depDate: string, arrDate: string) {
  const dep = new Date(depDate);
  const arr = new Date(arrDate);
  const depDay = dep.getUTCDate();
  const arrDay = arr.getUTCDate();
  return arrDay > depDay || (arrDay === 1 && depDay > 20);
}

function formatTime(dt: string) {
  const { hours, minutes } = getTimeParts(dt);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function formatDate(dt: string) {
  return new Date(dt).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });
}

function formatDuration(pt: string) {
  const match = pt.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return pt;
  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  return `${hours}h ${minutes}m`;
}

export default function FlightsResults({ selectedDate, origin, destination, returnDate, adults = 1, onLoadingChange, onProgressChange }: FlightsResultsProps) {
  const [results, setResults] = useState<FlightResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [visibleCount, setVisibleCount] = useState(10);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  // Notify parent of loading state changes
  useEffect(() => {
    onLoadingChange?.(loading);
  }, [loading, onLoadingChange]);

  // Notify parent of progress changes
  useEffect(() => {
    onProgressChange?.(progress);
  }, [progress, onProgressChange]);

  // Auto-search when props change
  useEffect(() => {
    if (origin && destination) {
      searchFlights();
    }
  }, [origin, destination, selectedDate, returnDate, adults]);

  const searchFlights = async () => {
    if (!origin || !destination) {
      return;
    }

    setLoading(true);
    setError("");
    setProgress(0);

    try {
      // Simulate progress
      const interval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const res = await fetch("/api/flights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin,
          destination,
          departureDate: selectedDate || new Date().toISOString().slice(0, 10),
          returnDate: returnDate || undefined,
          adults: adults || 1
        }),
      });

      clearInterval(interval);
      setProgress(100);

      if (!res.ok) {
        const errorData: ApiError = await res.json();
        throw new Error(errorData.detail || 'Failed to fetch flights');
      }

      const data: FlightResults = await res.json();
      setResults(data);

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 500);
    }
  };

  return (
    <div>
      {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">{error}</div>}

      {!results && !loading && !error && origin && destination && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-600">
          No search results yet. Waiting for flight data...
        </div>
      )}

      {results && results.data && results.data.length === 0 && (
        <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-600">
          No flights found for this route and date.
        </div>
      )}

      {results && results.data && results.data.length > 0 && (
        <div className="mt-8 text-sm">
          <h3 className="text-base font-bold mb-4">Flight Results</h3>
          <div className="mb-4 text-gray-700 text-sm">
            <div className="mb-2 text-xs text-gray-600 font-medium">
              Showing {Math.min(visibleCount, results.data.length)} of {results.data.length} result{results.data.length > 1 ? 's' : ''} found
            </div>
            <ul className="space-y-4">
              {results.data.slice(0, visibleCount).map((offer, idx) => {
                const isExpanded = expandedIdx === idx;
                const outboundSegment = offer.itineraries[0].segments[0];
                const outboundLastSegment = offer.itineraries[0].segments[offer.itineraries[0].segments.length - 1];
                const returnSegment = offer.itineraries.length > 1 ? offer.itineraries[1].segments[0] : null;
                const returnLastSegment = offer.itineraries.length > 1 ? offer.itineraries[1].segments[offer.itineraries[1].segments.length - 1] : null;
                const airlineCode = outboundSegment.operating?.airlineCode || outboundSegment.carrierCode;

                return (
                  <li key={`flight-${offer.id || idx}`} className="relative rounded-lg shadow-md border bg-white overflow-hidden">
                    {/* Promotional Header Banner */}
                    <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 flex items-center gap-3">
                      <img
                        src={`https://content.airhex.com/content/logos/airlines_${airlineCode}.png`}
                        alt={airlineCode}
                        className="w-6 h-6 object-contain bg-white rounded p-1"
                        onError={e => { e.currentTarget.src = '/globe.svg'; }}
                      />
                      <div className="flex-1">
                        <div className="font-bold text-sm">Fly {airlineCode} with up to 50% off</div>
                        <div className="text-xs opacity-90">Don&apos;t miss the dream sale, fly with {airlineCode} and save up to 50%.</div>
                      </div>
                    </div>

                    {/* Actions Row */}
                    <div className="flex justify-between items-center px-4 py-2 bg-gray-50 border-b">
                      <div className="flex gap-2">
                        <button className="flex items-center gap-1 px-2 py-1 border border-gray-300 rounded text-xs hover:bg-gray-100">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          Save
                        </button>
                        <button className="flex items-center gap-1 px-2 py-1 border border-gray-300 rounded text-xs hover:bg-gray-100">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                          </svg>
                          Share
                        </button>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <div className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          <span>1</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>0</span>
                        </div>
                      </div>
                    </div>

                    {/* Flight Details */}
                    <div className="p-3">
                      <div className="flex items-center justify-between">
                        {/* Left side - Flight times and route */}
                        <div className="flex-1">
                          {/* Outbound Flight */}
                          <div
                            className="flex items-center gap-3 mb-3 p-2 rounded cursor-pointer hover:bg-blue-100 hover:border-blue-300 border border-transparent transition-all duration-200 group"
                            onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                          >
                            <input type="checkbox" className="w-3 h-3" />
                            <img
                              src={`https://content.airhex.com/content/logos/airlines_${airlineCode}.png`}
                              alt={airlineCode}
                              className="w-8 h-8 object-contain"
                              onError={e => { e.currentTarget.src = '/globe.svg'; }}
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <span className="text-xs font-bold group-hover:text-blue-700 transition-colors">
                                  {typeof window !== 'undefined' ? formatTime(outboundSegment.departure.at) : ''} – {typeof window !== 'undefined' ? formatTime(outboundLastSegment.arrival.at) : ''}
                                  {typeof window !== 'undefined' && isNextDay(outboundSegment.departure.at, outboundLastSegment.arrival.at) ? <sup className="text-xs">+1</sup> : ''}
                                </span>
                                <span className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors">{offer.itineraries[0].segments.length === 1 ? 'direct' : `${offer.itineraries[0].segments.length - 1} stop${offer.itineraries[0].segments.length > 2 ? 's' : ''}`}</span>
                                <span className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors">{offer.itineraries[0].duration ? formatDuration(offer.itineraries[0].duration) : 'N/A'}</span>
                              </div>
                              <div className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors">
                                {outboundSegment.departure.iataCode} {outboundSegment.departure.airport || 'Airport'} – {outboundLastSegment.arrival.iataCode} {outboundLastSegment.arrival.airport || 'Airport'}
                              </div>
                            </div>
                          </div>

                          {/* Return Flight */}
                          {returnSegment && (
                            <div
                              className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-blue-100 hover:border-blue-300 border border-transparent transition-all duration-200 group"
                              onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                            >
                              <input type="checkbox" className="w-3 h-3" />
                              <img
                                src={`https://content.airhex.com/content/logos/airlines_${returnSegment.operating?.airlineCode || returnSegment.carrierCode}.png`}
                                alt={returnSegment.operating?.airlineCode || returnSegment.carrierCode}
                                className="w-8 h-8 object-contain"
                                onError={e => { e.currentTarget.src = '/globe.svg'; }}
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                  <span className="text-xs font-bold group-hover:text-blue-700 transition-colors">
                                    {typeof window !== 'undefined' ? formatTime(returnSegment.departure.at) : ''} – {typeof window !== 'undefined' ? formatTime(returnLastSegment!.arrival.at) : ''}
                                    {typeof window !== 'undefined' && isNextDay(returnSegment.departure.at, returnLastSegment!.arrival.at) ? <sup className="text-xs">+1</sup> : ''}
                                  </span>
                                  <span className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors">{offer.itineraries[1].segments.length === 1 ? 'direct' : `${offer.itineraries[1].segments.length - 1} stop`}</span>
                                  <span className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors">{offer.itineraries[1].duration ? formatDuration(offer.itineraries[1].duration) : 'N/A'}</span>
                                </div>
                                <div className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors">
                                  {returnSegment.departure.iataCode} {returnSegment.departure.airport || 'Airport'} – {returnLastSegment!.arrival.iataCode} {returnLastSegment!.arrival.airport || 'Airport'}
                                </div>
                                {offer.itineraries[1].segments.length > 1 && (
                                  <div className="text-xs text-orange-600 mt-1">
                                    {offer.itineraries[1].segments.map((seg, i) =>
                                      i > 0 ? seg.departure.iataCode : null
                                    ).filter(Boolean).join(', ')}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Right side - Price and booking */}
                        <div className="text-right ml-4">
                          <div className="text-lg font-bold mb-1">£{offer.price.total}</div>
                          <div className="text-xs text-gray-500 mb-1">Economy Saver</div>
                          <div className="text-xs text-gray-500 mb-3">{airlineCode.toUpperCase()}</div>
                          <button className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded font-semibold text-xs transition duration-200">
                            View Deal
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Flight Details */}
                    {isExpanded && (
                      <div className="px-3 pb-3 border-t border-gray-200">
                        <div className="bg-gray-50 rounded p-4 mt-3">
                          <div className="space-y-4">
                            {/* Outbound Flight Details */}
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-bold text-sm text-gray-800">
                                  Outbound • {typeof window !== 'undefined' ? formatDate(outboundSegment.departure.at) : ''}
                                </h4>
                                <span className="text-xs text-gray-600">
                                  {offer.itineraries[0].duration ? formatDuration(offer.itineraries[0].duration) : 'N/A'}
                                </span>
                              </div>

                              <div className="space-y-2">
                                {offer.itineraries[0].segments.map((segment, segIdx) => (
                                  <div key={segIdx} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                                    <div className="flex items-center gap-3">
                                      <img
                                        src={`https://content.airhex.com/content/logos/airlines_${segment.operating?.airlineCode || segment.carrierCode}.png`}
                                        alt={segment.operating?.airlineCode || segment.carrierCode}
                                        className="w-6 h-6 object-contain"
                                        onError={e => { e.currentTarget.src = '/globe.svg'; }}
                                      />
                                      <div>
                                        <div className="text-sm font-medium">
                                          {segment.operating?.airlineCode || segment.carrierCode} {segment.number}
                                        </div>
                                        <div className="text-xs text-gray-600">
                                          {segment.aircraft.code}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <div className="flex items-center gap-4">
                                        <div className="text-center">
                                          <div className="text-sm font-bold">
                                            {typeof window !== 'undefined' ? formatTime(segment.departure.at) : ''}
                                          </div>
                                          <div className="text-xs text-gray-600">{segment.departure.iataCode}</div>
                                        </div>
                                        <div className="text-center">
                                          <div className="text-sm font-bold">
                                            {typeof window !== 'undefined' ? formatTime(segment.arrival.at) : ''}
                                          </div>
                                          <div className="text-xs text-gray-600">{segment.arrival.iataCode}</div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Return Flight Details */}
                            {returnSegment && (
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-bold text-sm text-gray-800">
                                    Return • {typeof window !== 'undefined' ? formatDate(returnSegment.departure.at) : ''}
                                  </h4>
                                  <span className="text-xs text-gray-600">
                                    {offer.itineraries[1].duration ? formatDuration(offer.itineraries[1].duration) : 'N/A'}
                                  </span>
                                </div>

                                <div className="space-y-2">
                                  {offer.itineraries[1].segments.map((segment, segIdx) => (
                                    <div key={segIdx} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                                      <div className="flex items-center gap-3">
                                        <img
                                          src={`https://content.airhex.com/content/logos/airlines_${segment.operating?.airlineCode || segment.carrierCode}.png`}
                                          alt={segment.operating?.airlineCode || segment.carrierCode}
                                          className="w-6 h-6 object-contain"
                                          onError={e => { e.currentTarget.src = '/globe.svg'; }}
                                        />
                                        <div>
                                          <div className="text-sm font-medium">
                                            {segment.operating?.airlineCode || segment.carrierCode} {segment.number}
                                          </div>
                                          <div className="text-xs text-gray-600">
                                            {segment.aircraft.code}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <div className="flex items-center gap-4">
                                          <div className="text-center">
                                            <div className="text-sm font-bold">
                                              {typeof window !== 'undefined' ? formatTime(segment.departure.at) : ''}
                                            </div>
                                            <div className="text-xs text-gray-600">{segment.departure.iataCode}</div>
                                          </div>
                                          <div className="text-center">
                                            <div className="text-sm font-bold">
                                              {typeof window !== 'undefined' ? formatTime(segment.arrival.at) : ''}
                                            </div>
                                            <div className="text-xs text-gray-600">{segment.arrival.iataCode}</div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Ad label */}
                    <div className="absolute bottom-2 left-4 flex items-center gap-1 text-xs text-gray-500">
                      <span>{airlineCode.toUpperCase()}</span>
                      <span className="bg-gray-200 px-2 py-1 rounded text-xs">Ad</span>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </li>
                );
              })}
            </ul>

            {results.data.length > visibleCount && (
              <div className="text-center mt-6">
                <button
                  className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition duration-200"
                  onClick={() => setVisibleCount(visibleCount + 10)}
                >
                  Show More Results
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {results && results.data && results.data.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-500">No flights found for your search criteria.</div>
        </div>
      )}
    </div>
  );
}
