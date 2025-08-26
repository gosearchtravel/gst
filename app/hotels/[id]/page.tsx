"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Star, Wifi, Car, Coffee, Dumbbell, MapPin, Calendar, Users, CreditCard, Award, ThumbsUp, ThumbsDown, MoreHorizontal } from 'lucide-react';
import Header from '../../components/header';
import Footer from '../../components/footer';

export default function HotelDetail() {
  const params = useParams();
  const router = useRouter();
  const [hotel, setHotel] = useState<any>(null);
  const [hotelOffer, setHotelOffer] = useState<any>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const hotelId = params.id as string;

  // Hotel images - use real images if available, fallback to sample
  const hotelImages = hotel?.media?.length > 0
    ? hotel.media.map((media: any) => media.uri)
    : [
      "/popdest/london.jpg",
      "/popdest/dubai.jpg",
      "/popdest/paris.jpg",
      "/popdest/newyork.webp",
      "/popdest/tokyo.webp",
      "/popdest/singapore.webp"
    ];

  // Sample reviews data (keeping for now until we get real reviews from API)
  const reviews = [
    {
      id: 1,
      userName: "Sarah M.",
      country: "United Kingdom",
      rating: 9.2,
      date: "August 2025",
      title: "Excellent location and service",
      comment: "Perfect location right in the heart of Covent Garden. The room was small but very well designed and comfortable. Staff were incredibly helpful and friendly. Would definitely stay again!",
      helpful: 12,
      roomType: "Standard Double Room",
      stayDuration: "2 nights"
    },
    {
      id: 2,
      userName: "James R.",
      country: "United States",
      rating: 8.5,
      date: "July 2025",
      title: "Great hotel, tiny rooms",
      comment: "The location is unbeatable - walking distance to everything in central London. Rooms are very small but cleverly designed. The bed was comfortable and the shower was excellent. Reception staff were very helpful with recommendations.",
      helpful: 8,
      roomType: "Superior Double Room",
      stayDuration: "3 nights"
    },
    {
      id: 3,
      userName: "Emma L.",
      country: "Australia",
      rating: 9.0,
      date: "June 2025",
      title: "Perfect for London city break",
      comment: "Loved everything about this hotel. Yes, the rooms are compact but that's London for you. The location more than makes up for it - right next to Covent Garden market and easy walk to West End theaters. Clean, modern, and great value.",
      helpful: 15,
      roomType: "Deluxe Double Room with Balcony",
      stayDuration: "4 nights"
    },
    {
      id: 4,
      userName: "Michael B.",
      country: "Germany",
      rating: 7.8,
      date: "May 2025",
      title: "Good hotel with minor issues",
      comment: "Overall a good stay. The location is fantastic and the staff are friendly. The room was clean but very small. The air conditioning was a bit noisy at night, but the comfort of the bed made up for it. Good breakfast options nearby.",
      helpful: 6,
      roomType: "Standard Double Room",
      stayDuration: "2 nights"
    },
    {
      id: 5,
      userName: "Lisa K.",
      country: "Canada",
      rating: 9.5,
      date: "April 2025",
      title: "Outstanding city hotel",
      comment: "This hotel exceeded all expectations! The smart room design maximizes every inch of space. Location is absolutely perfect for exploring London. The staff went above and beyond to help with recommendations and bookings. Highly recommend!",
      helpful: 20,
      roomType: "Superior Double Room",
      stayDuration: "5 nights"
    }
  ];

  // Sample hotel data
  const sampleHotel = {
    id: params.id,
    name: "The Z Hotel Covent Garden",
    stars: 3,
    address: "31-33 Bedford Street, London, WC2E 9ED",
    rating: 8.1,
    ratingText: "Very good",
    reviews: "4,616 reviews",
    coordinates: { lat: 51.5074, lng: -0.1278 },
    description: "This 3-star hotel is situated close to Charing Cross and offers a coffee maker. It also provides a coffee bar, free Wi-Fi and a 24-hour reception. All the rooms at The Z Hotel Covent Garden provide ironing facilities, plus all the essentials for a comfortable stay.",
    amenities: [
      "Free Wi-Fi",
      "24-hour reception",
      "Coffee bar",
      "Air conditioning",
      "Non-smoking rooms",
      "Room service",
      "Elevator",
      "Coffee maker in room",
      "Luggage storage",
      "Express check-in/out"
    ],
    nearbyAttractions: [
      { name: "Covent Garden", distance: "0.1 km" },
      { name: "Royal Opera House", distance: "0.2 km" },
      { name: "Somerset House", distance: "0.3 km" },
      { name: "National Gallery", distance: "0.5 km" },
      { name: "Trafalgar Square", distance: "0.6 km" }
    ]
  };

  useEffect(() => {
    async function fetchHotelData() {
      try {
        setLoading(true);
        setError("");

        // Get search params from URL or use defaults
        const urlParams = new URLSearchParams(window.location.search);
        const city = urlParams.get('city') || 'LON';
        const checkIn = urlParams.get('checkIn') || new Date(Date.now() + 86400000).toISOString().split('T')[0];
        const checkOut = urlParams.get('checkOut') || new Date(Date.now() + 172800000).toISOString().split('T')[0];
        const guests = urlParams.get('guests') || '2';

        console.log('URL Parameters:', {
          url: window.location.href,
          search: window.location.search,
          city: urlParams.get('city'),
          checkIn: urlParams.get('checkIn'),
          checkOut: urlParams.get('checkOut'),
          guests: urlParams.get('guests'),
          hotelId
        });

        // Check if we have proper search parameters - be more lenient
        if (!urlParams.get('city') && hotelId !== 'sample-hotel') {
          console.warn('Missing city parameter, will use default city for hotel search');
          // Don't return error immediately, try with default city
        }

        console.log('Fetching hotel data with params:', { city, checkIn, checkOut, guests, hotelId });

        // Fetch hotel data from API
        const response = await fetch('/api/hotels', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ city, checkIn, checkOut, guests }),
        });

        const data = await response.json();
        console.log('API Response:', data);

        if (data.error) {
          console.error('API Error:', data.error);
          // Handle specific API errors with better user messages
          if (data.error.includes('No hotels found for this city')) {
            // Try to use sample hotel data as fallback for testing
            if (process.env.NODE_ENV === 'development') {
              console.log('Development mode: using sample hotel for testing');
              setHotel(sampleHotel);
              setLoading(false);
              return;
            }
            setError('No hotels available in this city. Please try a different destination or search criteria.');
          } else {
            setError(data.error);
          }
          setLoading(false);
          return;
        }

        // Check if we have any hotel data at all
        if (!data.data || data.data.length === 0) {
          console.warn('No hotel data received from API');
          // In development, use sample hotel as fallback
          if (process.env.NODE_ENV === 'development') {
            console.log('Development mode: using sample hotel as fallback');
            setHotel(sampleHotel);
            setLoading(false);
            return;
          }
          setError('No hotels available for the selected dates. Please try different dates or destination.');
          setLoading(false);
          return;
        }

        // Find the specific hotel by ID (try multiple fields and be more flexible)
        const foundHotel = data.data.find((item: any) => {
          const itemHotelId = item.hotel?.hotelId || item.hotelId || item.id;
          const itemId = item.hotel?.id || item.id;

          return itemHotelId === hotelId ||
            itemId === hotelId ||
            itemHotelId?.toString() === hotelId ||
            itemId?.toString() === hotelId;
        });

        console.log('Hotel search results:', {
          hotelId,
          totalHotels: data.data.length,
          foundHotel: foundHotel ? 'Found' : 'Not found',
          firstHotelStructure: data.data[0] ? {
            hotelId: data.data[0].hotelId,
            id: data.data[0].id,
            hotel: data.data[0].hotel ? {
              hotelId: data.data[0].hotel.hotelId,
              id: data.data[0].hotel.id,
              name: data.data[0].hotel.name
            } : 'No hotel object'
          } : 'No hotels'
        });

        if (foundHotel) {
          console.log('Setting hotel data:', foundHotel);
          setHotelOffer(foundHotel);
          setHotel(foundHotel.hotel || foundHotel);
        } else {
          // If we can't find the specific hotel, but we have hotels, let's use the first one as fallback
          if (data.data.length > 0) {
            console.log('Using first hotel as fallback:', data.data[0]);
            setHotelOffer(data.data[0]);
            setHotel(data.data[0].hotel || data.data[0]);
            // Update the URL to reflect the actual hotel ID
            const actualHotelId = data.data[0].hotel?.hotelId || data.data[0].hotelId || data.data[0].id;
            if (actualHotelId && actualHotelId !== hotelId) {
              console.log(`Hotel ID mismatch: requested ${hotelId}, using ${actualHotelId}`);
            }
          } else {
            // Last resort: use sample hotel in development
            if (process.env.NODE_ENV === 'development') {
              console.log('Development mode: using sample hotel as final fallback');
              setHotel(sampleHotel);
            } else {
              setError(`Hotel with ID ${hotelId} not found in search results. Please go back and search again.`);
            }
          }
        }

      } catch (error) {
        console.error('Error fetching hotel:', error);
        setError('Failed to load hotel details');
      } finally {
        setLoading(false);
      }
    }

    if (hotelId && hotelId !== 'sample-hotel') {
      fetchHotelData();
    } else if (hotelId === 'sample-hotel') {
      // Use sample hotel data for testing
      console.log('Using sample hotel data');
      setHotel(sampleHotel);
      setLoading(false);
    } else {
      setError('Please search for hotels first');
      setLoading(false);
    }
  }, [hotelId]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center pt-16">
          <div className="text-lg">Loading hotel details...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center pt-16 px-4">
          <div className="text-center max-w-md">
            <div className="mb-6">
              <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Hotel Not Available</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            {process.env.NODE_ENV === 'development' && (
              <div className="bg-gray-100 p-3 rounded mb-4 text-left">
                <h4 className="font-medium mb-2">Debug Info:</h4>
                <div className="text-xs space-y-1">
                  <div>Hotel ID: {hotelId}</div>
                  <div>URL: {typeof window !== 'undefined' ? window.location.href : 'N/A'}</div>
                  <div>Loading: {loading.toString()}</div>
                </div>
              </div>
            )}
            <div className="space-y-3">
              {process.env.NODE_ENV === 'development' && (
                <button
                  onClick={() => {
                    console.log('Loading sample hotel...');
                    setHotel(sampleHotel);
                    setError('');
                  }}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Load Sample Hotel (Dev)
                </button>
              )}
              <button
                onClick={() => router.push('/hotels')}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Search Hotels
              </button>
              <button
                onClick={() => router.back()}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!hotel) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center pt-16">
          <div className="text-center">
            <div className="text-lg mb-4">Hotel not found</div>
            <div className="text-sm text-gray-600 mb-4">
              Hotel ID: {hotelId} | Loading: {loading.toString()} | Error: {error}
            </div>
            <button
              onClick={() => router.push('/hotels')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
            >
              Search Hotels
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Debug display (temporary)
  const isDebugMode = process.env.NODE_ENV === 'development';

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 pt-16"> {/* Added pt-16 to account for sticky header */}
        {/* Debug info (temporary) */}
        {isDebugMode && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 text-sm">
            <strong>Debug:</strong> Hotel ID: {hotelId} | Hotel Name: {hotel?.name} | Offers: {hotelOffer?.offers?.length || 0}
          </div>
        )}
        {/* Header Navigation */}
        <div className="bg-white border-b px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="text-sm text-gray-600">
              <span className="text-orange-600">Home</span> / <span className="text-orange-600">Hotels</span> / {hotel?.name || 'Hotel Details'}
            </div>
          </div>
        </div>

        {/* Hotel Header */}
        <div className="bg-white px-4 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2 mb-2">
                  {hotel?.name || 'Hotel Name'}
                  {hotel?.rating && (
                    <div className="flex">
                      {[...Array(Math.floor(hotel.rating / 2))].map((_, i) => (
                        <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  )}
                </h1>
                <p className="text-gray-600 mb-2">
                  {hotel?.address?.lines?.join(', ') || hotel?.address || 'Address not available'}
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-600 text-white px-2 py-1 rounded font-bold text-sm">
                      {hotel?.rating || '8.0'}
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">
                        {hotel?.rating >= 9 ? 'Excellent' : hotel?.rating >= 8 ? 'Very Good' : hotel?.rating >= 7 ? 'Good' : 'Fair'}
                      </span>
                      <span className="text-gray-600 text-sm ml-1">(Reviews)</span>
                    </div>
                  </div>
                  <div className="text-sm text-blue-600 underline cursor-pointer">Excellent location - show map</div>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="bg-white px-4 pb-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-4 gap-2 h-96">
              <div className="col-span-2 relative">
                <img
                  src={hotelImages[0]}
                  alt="Hotel main"
                  className="w-full h-full object-cover rounded-l-lg"
                />
              </div>
              <div className="grid grid-rows-2 gap-2">
                <img
                  src={hotelImages[1]}
                  alt="Hotel"
                  className="w-full h-full object-cover"
                />
                <img
                  src={hotelImages[2]}
                  alt="Hotel"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-rows-2 gap-2">
                <img
                  src={hotelImages[3]}
                  alt="Hotel"
                  className="w-full h-full object-cover rounded-tr-lg"
                />
                <div className="relative">
                  <img
                    src={hotelImages[4]}
                    alt="Hotel"
                    className="w-full h-full object-cover rounded-br-lg"
                  />
                  <button
                    onClick={() => setShowAllPhotos(true)}
                    className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white font-medium rounded-br-lg hover:bg-opacity-60 transition-all"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Show all photos
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Quick Info */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-800">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">You're eligible for a Genius discount!</span>
                </div>
                <p className="text-green-700 text-sm mt-1">
                  To save at this property, all you have to do is sign in.
                </p>
              </div>

              {/* Available Rooms */}
              <div className="bg-white rounded-lg border">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-bold text-gray-900">Available rooms</h2>
                  <p className="text-gray-600 text-sm mt-1">Select rooms and guests</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-4 font-medium text-gray-900">Room type</th>
                        <th className="text-left p-4 font-medium text-gray-900">Sleeps</th>
                        <th className="text-left p-4 font-medium text-gray-900">Price for 2 nights</th>
                        <th className="text-left p-4 font-medium text-gray-900">Your choices</th>
                        <th className="text-left p-4 font-medium text-gray-900">Select rooms</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hotelOffer?.offers?.length > 0 ? (
                        hotelOffer.offers.map((offer: any, index: number) => (
                          <tr key={index} className="border-b">
                            <td className="p-4">
                              <div className="flex gap-4">
                                <img
                                  src={hotelImages[0]}
                                  alt="Room"
                                  className="w-20 h-16 object-cover rounded"
                                />
                                <div>
                                  <h3 className="font-medium text-gray-900">
                                    {offer.room?.typeEstimated?.category || 'Standard Room'}
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    {offer.room?.typeEstimated?.beds || '1 bed'} •
                                    {offer.room?.description?.text || 'Room details'}
                                  </p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                      Free WiFi
                                    </span>
                                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                      Air conditioning
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-1">
                                {[...Array(2)].map((_, i) => (
                                  <svg key={i} className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                  </svg>
                                ))}
                              </div>
                            </td>
                            <td className="p-4">
                              <div>
                                <div className="text-lg font-bold">
                                  {offer.price?.currency} {offer.price?.total || '120'}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {offer.price?.variations?.changes?.[0]?.total ? 'Per night' : 'Total price'}
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="space-y-1">
                                {(offer.policies?.cancellation?.type === 'FULL_STAY' || !offer.policies?.cancellation) && (
                                  <div className="text-green-600 text-sm font-medium">
                                    ✓ Free cancellation
                                  </div>
                                )}
                                <div className="text-green-600 text-sm font-medium">
                                  ✓ No prepayment needed
                                </div>
                                <div className="text-xs text-gray-600">
                                  – pay at the property
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="space-y-2">
                                <select className="border rounded px-3 py-2 text-sm w-24">
                                  <option value="0">0</option>
                                  <option value="1">1</option>
                                  <option value="2">2</option>
                                </select>
                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors w-full">
                                  Reserve
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-gray-500">
                            No room offers available for the selected dates. Please try different dates or contact the hotel directly.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Property Overview */}
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">About this property</h2>
                <p className="text-gray-700 mb-6">{hotel.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Most popular facilities</h3>
                    <div className="space-y-2">
                      {hotel.amenities.slice(0, 5).map((amenity: string, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {amenity}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Nearby attractions</h3>
                    <div className="space-y-2">
                      {hotel.nearbyAttractions.map((attraction: any, index: number) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-700">{attraction.name}</span>
                          <span className="text-gray-500">{attraction.distance}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Guest Reviews */}
              <div className="bg-white rounded-lg border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Guest reviews</h2>
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-600 text-white px-3 py-1 rounded font-bold text-lg">
                      {hotel.rating}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{hotel.ratingText}</div>
                      <div className="text-sm text-gray-600">{hotel.reviews}</div>
                    </div>
                  </div>
                </div>

                {/* Review Categories */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">8.9</div>
                    <div className="text-sm text-gray-600">Location</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">8.2</div>
                    <div className="text-sm text-gray-600">Cleanliness</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">8.0</div>
                    <div className="text-sm text-gray-600">Service</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">7.5</div>
                    <div className="text-sm text-gray-600">Value</div>
                  </div>
                </div>

                {/* Individual Reviews */}
                <div className="space-y-6">
                  {reviews.slice(0, 3).map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-medium">
                            {review.userName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{review.userName}</div>
                            <div className="text-sm text-gray-600">{review.country} • {review.date}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="bg-blue-600 text-white px-2 py-1 rounded text-sm font-bold">
                            {review.rating}
                          </div>
                        </div>
                      </div>

                      <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
                      <p className="text-gray-700 mb-3">{review.comment}</p>

                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center gap-4">
                          <span>Room: {review.roomType}</span>
                          <span>•</span>
                          <span>{review.stayDuration}</span>
                        </div>
                        <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L9 9.5v1.5M7 20l-2-1m2 1v-3.5a3.5 3.5 0 00-1.023-2.485L3 12m4 8a3 3 0 01-3-3V9.25a3.75 3.75 0 013-3.75" />
                          </svg>
                          Helpful ({review.helpful})
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Show More Reviews Button */}
                <div className="mt-6 text-center">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                    Show all {reviews.length} reviews
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Booking Card */}
            <div className="lg:col-span-1">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 sticky top-20">
                <div className="text-center mb-6">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    Perfect for a 2-night stay!
                  </div>
                  <div className="text-sm text-gray-600">
                    Located in the real heart of London, this property has an excellent location score of 9.5!
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">2 nights, 2 adults</span>
                    <span className="font-semibold">£240</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Taxes and charges</span>
                    <span className="font-semibold">£24</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between items-center">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-lg font-bold">£264</span>
                  </div>
                </div>

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium text-lg transition-colors mb-4">
                  Reserve
                </button>

                <div className="text-center">
                  <div className="text-green-600 font-medium text-sm mb-1">✓ Free cancellation</div>
                  <div className="text-green-600 font-medium text-sm">✓ No prepayment needed</div>
                  <div className="text-xs text-gray-600 mt-2">
                    You can cancel later, so lock in this great price today!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full Screen Photo Gallery Modal */}
        {showAllPhotos && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center">
              <button
                onClick={() => setShowAllPhotos(false)}
                className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="relative max-w-4xl max-h-[80vh]">
                <img
                  src={hotelImages[selectedImageIndex]}
                  alt={`${hotel.name} - Image ${selectedImageIndex + 1}`}
                  className="max-w-full max-h-full object-contain"
                />

                <button
                  onClick={() => setSelectedImageIndex(prev => prev > 0 ? prev - 1 : hotelImages.length - 1)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <button
                  onClick={() => setSelectedImageIndex(prev => prev < hotelImages.length - 1 ? prev + 1 : 0)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-lg">
                {selectedImageIndex + 1} / {hotelImages.length}
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
