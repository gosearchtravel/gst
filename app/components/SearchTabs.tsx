import React, { useRef } from 'react';
import { Search } from 'lucide-react';
import PriceCalendar from '../../components/ui/price-calendar';

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

  // Car hire search state
  const [carPickupLocation, setCarPickupLocation] = React.useState('');
  const [carPickupDate, setCarPickupDate] = React.useState('');
  const [carPickupTime, setCarPickupTime] = React.useState('');
  const [carDropoffDate, setCarDropoffDate] = React.useState('');
  const [carDropoffTime, setCarDropoffTime] = React.useState('');

  // Calendar state
  const [showCalendar, setShowCalendar] = React.useState(false);
  const [calendarType, setCalendarType] = React.useState<'departure' | 'return' | 'checkin' | 'checkout' | 'car-pickup' | 'car-dropoff'>('departure');
  const [calendarSearchType, setCalendarSearchType] = React.useState<'flight' | 'hotel' | 'car'>('flight');
  const [calendarPosition, setCalendarPosition] = React.useState<{ top: number; left: number; width: number } | undefined>();

  // Refs for date input fields
  const departureInputRef = useRef<HTMLInputElement>(null);
  const returnInputRef = useRef<HTMLInputElement>(null);
  const checkinInputRef = useRef<HTMLInputElement>(null);
  const checkoutInputRef = useRef<HTMLInputElement>(null);
  const carPickupInputRef = useRef<HTMLInputElement>(null);
  const carDropoffInputRef = useRef<HTMLInputElement>(null);

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

  function handleCarHireSearch(e: React.FormEvent) {
    e.preventDefault();
    const locationInput = carPickupLocation.trim().toLowerCase();
    const validDates = carPickupDate && carDropoffDate && carPickupDate <= carDropoffDate;
    if (!validDates) {
      alert("Please select valid pickup and drop-off dates.");
      return;
    }
    const params = new URLSearchParams({
      location: locationInput,
      pickupDate: carPickupDate,
      pickupTime: carPickupTime,
      dropoffDate: carDropoffDate,
      dropoffTime: carDropoffTime,
    });
    window.location.href = `/car-hire?${params.toString()}`;
  }

  function handleHolidaysSearch(e: React.FormEvent) {
    e.preventDefault();
    // For now, redirect to a placeholder or existing page
    alert("Holidays search coming soon!");
  }

  // Calendar handlers
  const openCalendar = (type: 'departure' | 'return' | 'checkin' | 'checkout' | 'car-pickup' | 'car-dropoff', searchType: 'flight' | 'hotel' | 'car') => {
    setCalendarType(type);
    setCalendarSearchType(searchType);

    // Calculate position based on input field
    let inputRef;
    switch (type) {
      case 'departure':
        inputRef = departureInputRef;
        break;
      case 'return':
        inputRef = returnInputRef;
        break;
      case 'checkin':
        inputRef = checkinInputRef;
        break;
      case 'checkout':
        inputRef = checkoutInputRef;
        break;
      case 'car-pickup':
        inputRef = carPickupInputRef;
        break;
      case 'car-dropoff':
        inputRef = carDropoffInputRef;
        break;
    }

    if (inputRef?.current) {
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
    switch (calendarType) {
      case 'departure':
        setDepartureDate(date);
        break;
      case 'return':
        setReturnDate(date);
        break;
      case 'checkin':
        setHotelCheckIn(date);
        break;
      case 'checkout':
        setHotelCheckOut(date);
        break;
      case 'car-pickup':
        setCarPickupDate(date);
        break;
      case 'car-dropoff':
        setCarDropoffDate(date);
        break;
    }
    setShowCalendar(false);
  };

  const getTabBg = () => {
    return 'bg-orange-400';
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
          <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bottom-15 z-30 max-w-6xl w-full">
            {/* Tabs */}
            <div className="flex rounded-t-lg shadow px-2 sm:px-6">
              {['flights', 'hotels', 'holidays', 'carhire'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t as TabType)}
                  className={`px-4 py-2 mr-1 font-semibold rounded-t-lg transition cursor-pointer
                            ${tab === t
                      ? 'bg-orange-400 text-white'
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
              className={`rounded-b-lg shadow px-6 sm:px-16 py-4 flex flex-col sm:flex-row sm:justify-center sm:items-center gap-6 max-w-6xl w-full ${getTabBg()} bg-opacity-90`}
              onSubmit={
                tab === 'flights'
                  ? handleFlightsSearch
                  : tab === 'hotels'
                    ? handleHotelsSearch
                    : tab === 'carhire'
                      ? handleCarHireSearch
                      : tab === 'holidays'
                        ? handleHolidaysSearch
                        : undefined
              }
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
                    ref={departureInputRef}
                    type='text'
                    name='depart'
                    placeholder='Departure Date'
                    className='border rounded px-3 py-2 flex-1 min-w-[150px] bg-white text-black cursor-pointer'
                    value={departureDate ? new Date(departureDate).toLocaleDateString() : ''}
                    onClick={() => openCalendar('departure', 'flight')}
                    readOnly
                    required
                  />
                  <input
                    ref={returnInputRef}
                    type='text'
                    name='return'
                    placeholder='Return Date'
                    className='border rounded px-3 py-2 flex-1 min-w-[150px] bg-white text-black cursor-pointer'
                    value={returnDate ? new Date(returnDate).toLocaleDateString() : ''}
                    onClick={() => openCalendar('return', 'flight')}
                    readOnly
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
                    className='min-w-[50px] bg-orange-800 hover:bg-orange-900 text-white font-semibold p-3 rounded transition cursor-pointer flex items-center justify-center'
                    style={{ whiteSpace: 'nowrap' }}
                    disabled={loading}
                    title={loading ? 'Searching...' : 'Search Flights'}
                  >
                    <Search size={20} />
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
                    ref={checkinInputRef}
                    type='text'
                    name='checkin'
                    placeholder='Check-in Date'
                    className='border rounded px-3 py-2 flex-1 min-w-[120px] bg-white text-black cursor-pointer'
                    value={hotelCheckIn ? new Date(hotelCheckIn).toLocaleDateString() : ''}
                    onClick={() => openCalendar('checkin', 'hotel')}
                    readOnly
                    required
                  />
                  <input
                    ref={checkoutInputRef}
                    type='text'
                    name='checkout'
                    placeholder='Check-out Date'
                    className='border rounded px-3 py-2 flex-1 min-w-[120px] bg-white text-black cursor-pointer'
                    value={hotelCheckOut ? new Date(hotelCheckOut).toLocaleDateString() : ''}
                    onClick={() => openCalendar('checkout', 'hotel')}
                    readOnly
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
                    className='bg-orange-800 hover:bg-orange-900 text-white font-semibold p-3 rounded transition min-w-[50px] cursor-pointer flex items-center justify-center'
                    disabled={hotelLoading}
                    title={hotelLoading ? 'Searching...' : 'Search Hotels'}
                  >
                    <Search size={20} />
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
                    className='bg-orange-800 hover:bg-orange-900 text-white font-semibold p-3 rounded transition min-w-[50px] cursor-pointer flex items-center justify-center'
                    title='Search Holidays'
                  >
                    <Search size={20} />
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
                    value={carPickupLocation}
                    onChange={e => setCarPickupLocation(e.target.value)}
                    required
                  />
                  <input
                    ref={carPickupInputRef}
                    type='text'
                    name='pickupDate'
                    placeholder='Pick-up Date'
                    className='border rounded px-3 py-2 flex-1 min-w-[140px] bg-white text-black cursor-pointer'
                    value={carPickupDate ? new Date(carPickupDate).toLocaleDateString() : ''}
                    onClick={() => openCalendar('car-pickup', 'car')}
                    readOnly
                    required
                  />
                  <input
                    type='time'
                    name='pickupTime'
                    className='border rounded px-3 py-2 flex-1 min-w-[120px] bg-white text-black'
                    value={carPickupTime}
                    onChange={e => setCarPickupTime(e.target.value)}
                    required
                  />
                  <input
                    ref={carDropoffInputRef}
                    type='text'
                    name='dropoffDate'
                    placeholder='Drop-off Date'
                    className='border rounded px-3 py-2 flex-1 min-w-[140px] bg-white text-black cursor-pointer'
                    value={carDropoffDate ? new Date(carDropoffDate).toLocaleDateString() : ''}
                    onClick={() => openCalendar('car-dropoff', 'car')}
                    readOnly
                    required
                  />
                  <input
                    type='time'
                    name='dropoffTime'
                    className='border rounded px-3 py-2 flex-1 min-w-[120px] bg-white text-black'
                    value={carDropoffTime}
                    onChange={e => setCarDropoffTime(e.target.value)}
                    required
                  />
                  <button
                    type='submit'
                    className='bg-orange-800 hover:bg-orange-900 text-white font-semibold p-3 rounded transition min-w-[50px] cursor-pointer flex items-center justify-center'
                    title='Search Cars'
                  >
                    <Search size={20} />
                  </button>
                </>
              )}
            </form>
          </div>
        </div>

        {/* Price Calendar Modal */}
        {showCalendar && (
          <PriceCalendar
            selectedDate={
              calendarType === 'departure' ? departureDate :
                calendarType === 'return' ? returnDate :
                  calendarType === 'checkin' ? hotelCheckIn :
                    calendarType === 'checkout' ? hotelCheckOut :
                      calendarType === 'car-pickup' ? carPickupDate :
                        calendarType === 'car-dropoff' ? carDropoffDate : ''
            }
            onDateSelect={handleDateSelect}
            onClose={() => setShowCalendar(false)}
            searchType={calendarSearchType}
            position={calendarPosition}
            inputRef={
              calendarType === 'departure' ? departureInputRef :
                calendarType === 'return' ? returnInputRef :
                  calendarType === 'checkin' ? checkinInputRef :
                    calendarType === 'checkout' ? checkoutInputRef :
                      calendarType === 'car-pickup' ? carPickupInputRef :
                        calendarType === 'car-dropoff' ? carDropoffInputRef : undefined
            }
          />
        )}
      </div>
    </>
  );
}