

import React from 'react';

type TabType = 'flights' | 'hotels' | 'holidays' | 'carhire';

interface FlightResults {
  data: Array<{
    id: string;
    price: {
      total: string;
      currency: string;
    };
    itineraries: Array<{
      segments: Array<{
        departure: {
          iataCode: string;
          at: string;
        };
        arrival: {
          iataCode: string;
          at: string;
        };
      }>;
    }>;
    validatingAirlineCodes: string[];
  }>;
}

interface HotelResult {
  hotel: {
    hotelId: string;
    name: string;
  };
}

export default function SearchTabsForm() {
  const [tab, setTab] = React.useState<TabType>('flights');
  // Flights search state
  const [origin, setOrigin] = React.useState('');
  const [destination, setDestination] = React.useState('');
  const [departureDate, setDepartureDate] = React.useState('');
  const [returnDate, setReturnDate] = React.useState('');
  const [adults, setAdults] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState<FlightResults | null>(null);
  const [error, setError] = React.useState('');

  // Hotels search state
  const [hotelDest, setHotelDest] = React.useState('');
  const [hotelCheckIn, setHotelCheckIn] = React.useState('');
  const [hotelCheckOut, setHotelCheckOut] = React.useState('');
  const [hotelGuests, setHotelGuests] = React.useState(1);
  const [hotelLoading, setHotelLoading] = React.useState(false);
  const [hotelResults, setHotelResults] = React.useState<HotelResult[]>([]);
  const [hotelError, setHotelError] = React.useState('');

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

  function handleHotelsSearch(e: React.FormEvent) {
    e.preventDefault();
    const cityInput = hotelDest.trim().toLowerCase();
    const validDates = hotelCheckIn && hotelCheckOut && hotelCheckIn < hotelCheckOut;
    if (!validDates) {
      setHotelError("Please select valid check-in and check-out dates.");
      return;
    }
    const params = new URLSearchParams({
      city: cityInput, // Pass the original city name, not the code
      checkIn: hotelCheckIn,
      checkOut: hotelCheckOut,
      guests: hotelGuests.toString(),
    });
    window.location.href = `/hotels?${params.toString()}`;
  }

  const getTabBg = () => {
    if (tab === 'flights') return 'bg-orange-400';
    if (tab === 'hotels') return 'bg-orange-300';
    if (tab === 'holidays') return 'bg-orange-200';
    if (tab === 'carhire') return 'bg-orange-100';
    return 'bg-white';
  };

  function handleFlightsSearch(e: React.FormEvent) {
    e.preventDefault();
    // Redirect to /flights with query params
    const params = new URLSearchParams({
      origin,
      destination,
      departureDate,
      returnDate,
      adults: adults.toString(),
    });
    window.location.href = `/flights?${params.toString()}`;
  }

  return (
    <>
      <div className='flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full'>
        <div className="w-full flex justify-center">
          <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bottom-0 z-30 max-w-6xl w-full" style={{ marginTop: '-4rem' }}>
            {/* Tabs */}
            <div className="flex rounded-t-lg shadow px-2 sm:px-6">
              {['flights', 'hotels', 'holidays', 'carhire'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t as TabType)}
                  className={`px-4 py-2 mr-1 font-semibold rounded-t-lg transition cursor-pointer
                            ${tab === t
                      ? t === 'flights'
                        ? 'bg-orange-400 text-white'
                        : t === 'hotels'
                          ? 'bg-orange-300 text-white'
                          : t === 'holidays'
                            ? 'bg-orange-200 text-white'
                            : 'bg-orange-100 text-white'
                      : 'bg-white text-orange-400 hover:bg-orange-100'
                    }`}
                  style={{ textTransform: 'capitalize' }}
                >
                  {t === 'carhire' ? 'Car Hire' : t}
                </button>
              ))}
            </div>
            {/* Tab Content */}
            <form
              className={`rounded-b-lg shadow px-6 sm:px-16 py-4 flex ${tab === 'flights'
                ? 'flex-col sm:flex-row sm:justify-start sm:items-center gap-4'
                : 'flex-col sm:flex-row sm:justify-center sm:items-center gap-6'
                } max-w-6xl w-full ${getTabBg()} bg-opacity-90`}
              onSubmit={tab === 'flights' ? handleFlightsSearch : tab === 'hotels' ? handleHotelsSearch : undefined}
            >
              {tab === 'flights' && (
                <>
                  <input
                    type='text'
                    name='from'
                    placeholder='From'
                    className='border rounded px-3 py-2 flex-1 min-w-[120px] bg-white text-black'
                    value={origin}
                    onChange={e => setOrigin(e.target.value.toUpperCase())}
                    required
                  />
                  <input
                    type='text'
                    name='to'
                    placeholder='To'
                    className='border rounded px-3 py-2 flex-1 min-w-[120px] bg-white text-black'
                    value={destination}
                    onChange={e => setDestination(e.target.value.toUpperCase())}
                    required
                  />
                  <input
                    type='date'
                    name='depart'
                    className='border rounded px-3 py-2 flex-1 min-w-[150px] bg-white text-black'
                    value={departureDate}
                    onChange={e => setDepartureDate(e.target.value)}
                    required
                  />
                  <input
                    type='date'
                    name='return'
                    className='border rounded px-3 py-2 flex-1 min-w-[150px] bg-white text-black'
                    value={returnDate}
                    onChange={e => setReturnDate(e.target.value)}
                  />
                  <input
                    type='number'
                    name='passengers'
                    min='1'
                    className='border rounded px-3 py-2 flex-1 min-w-[120px] bg-white text-black'
                    value={adults}
                    onChange={e => setAdults(Number(e.target.value))}
                    placeholder='Passengers'
                    required
                  />
                  <select
                    name='class'
                    className='border rounded px-3 py-2 flex-1 min-w-[140px] bg-white text-black'
                    defaultValue='economy'>
                    <option value='economy'>Economy</option>
                    <option value='business'>Business</option>
                    <option value='first'>First</option>
                  </select>
                  <button
                    type='submit'
                    className='flex-1 min-w-[140px] bg-orange-800 hover:bg-orange-900 text-white font-semibold px-2 py-2 rounded transition cursor-pointer'
                    style={{ whiteSpace: 'nowrap' }}
                    disabled={loading}
                  >
                    {loading ? 'Searching...' : 'Search Flights'}
                  </button>
                </>
              )}
              {tab === 'hotels' && (
                <>
                  <input
                    type='text'
                    name='destination'
                    placeholder='Destination'
                    className='border rounded px-3 py-2 flex-1 min-w-[120px] bg-white text-black'
                    value={hotelDest}
                    onChange={e => setHotelDest(e.target.value)}
                    required
                  />
                  <input
                    type='date'
                    name='checkin'
                    className='border rounded px-3 py-2 flex-1 min-w-[120px] bg-white text-black'
                    value={hotelCheckIn}
                    onChange={e => setHotelCheckIn(e.target.value)}
                    required
                  />
                  <input
                    type='date'
                    name='checkout'
                    className='border rounded px-3 py-2 flex-1 min-w-[120px] bg-white text-black'
                    value={hotelCheckOut}
                    onChange={e => setHotelCheckOut(e.target.value)}
                    required
                  />
                  <input
                    type='number'
                    name='guests'
                    min='1'
                    className='border rounded px-3 py-2 flex-1 min-w-[100px] bg-white text-black'
                    value={hotelGuests}
                    onChange={e => setHotelGuests(Number(e.target.value))}
                    placeholder='Guests'
                    required
                  />
                  <button
                    type='submit'
                    className='bg-orange-800 hover:bg-orange-900 text-white font-semibold px-6 py-2 rounded transition min-w-[120px] cursor-pointer'
                    disabled={hotelLoading}
                  >
                    {hotelLoading ? 'Searching...' : 'Search Hotels'}
                  </button>
                </>
              )}
              {tab === 'holidays' && (
                <>
                  <input
                    type='text'
                    name='destination'
                    placeholder='Destination'
                    className='border rounded px-3 py-2 flex-1 min-w-[120px] bg-white text-black'
                    required
                  />
                  <input
                    type='date'
                    name='depart'
                    className='border rounded px-3 py-2 flex-1 min-w-[120px] bg-white text-black'
                    required
                  />
                  <input
                    type='number'
                    name='nights'
                    min='1'
                    defaultValue='7'
                    className='border rounded px-3 py-2 flex-1 min-w-[100px] bg-white text-black'
                    placeholder='Nights'
                    required
                  />
                  <input
                    type='number'
                    name='people'
                    min='1'
                    defaultValue='2'
                    className='border rounded px-3 py-2 flex-1 min-w-[100px] bg-white text-black'
                    placeholder='People'
                    required
                  />
                  <button
                    type='submit'
                    className='bg-orange-800 hover:bg-orange-900 text-white font-semibold px-6 py-2 rounded transition min-w-[120px] cursor-pointer'
                  >
                    Search Holidays
                  </button>
                </>
              )}
              {tab === 'carhire' && (
                <>
                  <input
                    type='text'
                    name='pickup'
                    placeholder='Pick-up Location'
                    className='border rounded px-3 py-2 flex-1 min-w-[140px] bg-white text-black'
                    required
                  />
                  <input
                    type='date'
                    name='pickupDate'
                    className='border rounded px-3 py-2 flex-1 min-w-[140px] bg-white text-black'
                    required
                  />
                  <input
                    type='time'
                    name='pickupTime'
                    className='border rounded px-3 py-2 flex-1 min-w-[120px] bg-white text-black'
                    required
                  />
                  <input
                    type='date'
                    name='dropoffDate'
                    className='border rounded px-3 py-2 flex-1 min-w-[140px] bg-white text-black'
                    required
                  />
                  <input
                    type='time'
                    name='dropoffTime'
                    className='border rounded px-3 py-2 flex-1 min-w-[120px] bg-white text-black'
                    required
                  />
                  <input
                    type='number'
                    name='drivers'
                    min='1'
                    defaultValue='1'
                    className='border rounded px-3 py-2 flex-1 min-w-[100px] bg-white text-black'
                    placeholder='Drivers'
                    required
                  />
                  <button
                    type='submit'
                    className='bg-orange-800 hover:bg-orange-900 text-white font-semibold px-6 py-2 rounded transition min-w-[120px] cursor-pointer'
                  >
                    Search
                  </button>
                </>
              )}
            </form>
            {/* Show flight results below the form */}
            {tab === 'flights' && (
              <div className="mt-8">
                {error && <div className="text-red-600 mb-4">{error}</div>}
                {results && (
                  <div>
                    <h3 className="text-lg font-bold mb-2">Results</h3>
                    {results.data && results.data.length > 0 ? (
                      <ul className="space-y-4">
                        {results.data.map((offer, idx) => (
                          <li key={idx} className="border rounded p-4">
                            <div className="font-semibold">Price: {offer.price.total} {offer.price.currency}</div>
                            <div>Itinerary: {offer.itineraries.map((it) => it.segments.map((seg) => `${seg.departure.iataCode} → ${seg.arrival.iataCode} (${seg.departure.at.split('T')[0]})`).join(', ')).join(' | ')}</div>
                            <div>Airlines: {offer.validatingAirlineCodes.join(', ')}</div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div>No flights found.</div>
                    )}
                  </div>
                )}
              </div>
            )}
            {/* Hotel results are now shown on /hotels page after redirect */}
          </div>
        </div>
      </div>
    </>
  );
}