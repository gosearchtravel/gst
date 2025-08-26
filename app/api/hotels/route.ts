/** @format */

import { NextRequest, NextResponse } from 'next/server';

interface GeoCode {
	latitude: number;
	longitude: number;
}

interface HotelLocation {
	hotelId: string;
	geoCode: GeoCode;
}

interface HotelWithLocation {
	hotelId: string;
	geoCode?: GeoCode;
}

interface HotelOffer {
	hotel: HotelWithLocation;
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { city, checkIn, checkOut, guests } = body;

		console.log('Hotels API called with:', { city, checkIn, checkOut, guests });

		// Validate required parameters
		if (!city || !checkIn || !checkOut || !guests) {
			return NextResponse.json(
				{
					data: [],
					error: 'Missing required parameters: city, checkIn, checkOut, guests',
				},
				{ status: 400 }
			);
		}

		// Use correct env variable names for Amadeus API
		const clientId = process.env.AMADEUS_API_KEY;
		const clientSecret = process.env.AMADEUS_API_SECRET;

		if (!clientId || !clientSecret) {
			console.error('Missing Amadeus API credentials');
			return NextResponse.json(
				{
					data: [],
					error: 'API configuration error. Please contact support.',
				},
				{ status: 500 }
			);
		}

		// Get access token
		const tokenRes = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
		});
		const tokenData = await tokenRes.json();
		const accessToken = tokenData.access_token;

		// Step 1: Get hotels in the city
		const hotelsListRes = await fetch(
			`https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city?cityCode=${city}`,
			{
				headers: { Authorization: `Bearer ${accessToken}` },
			}
		);
		const hotelsListData = await hotelsListRes.json();
		const hotelsArray = Array.isArray(hotelsListData.data) ? hotelsListData.data : [];

		// Limit to first 20 hotels to avoid API limits
		const limitedHotels = hotelsArray.slice(0, 20);

		const hotelIdToGeo = limitedHotels.reduce((acc: Record<string, GeoCode>, h: HotelLocation) => {
			acc[h.hotelId] = h.geoCode;
			return acc;
		}, {});
		const hotelIds = limitedHotels.map((h: HotelLocation) => h.hotelId).join(',');

		if (!hotelIds) {
			return NextResponse.json({
				data: [],
				error: 'No hotels found for this city.',
				raw: hotelsListData,
			});
		}

		// Step 2: Get hotel offers for those hotelIds
		const offersRes = await fetch(
			`https://test.api.amadeus.com/v3/shopping/hotel-offers?hotelIds=${hotelIds}&checkInDate=${checkIn}&checkOutDate=${checkOut}&adults=${guests}`,
			{
				headers: { Authorization: `Bearer ${accessToken}` },
			}
		);
		const offersData = await offersRes.json();

		// Check for API errors
		if (offersData.errors) {
			return NextResponse.json({
				data: [],
				error: offersData.errors[0]?.detail || 'API Error occurred',
				raw: offersData,
			});
		}

		// Defensive: always return an array for frontend
		let offers = Array.isArray(offersData.data) ? offersData.data : [];

		// Merge geoCode into each hotel
		offers = offers.map((item: HotelOffer) => {
			if (item.hotel && item.hotel.hotelId && hotelIdToGeo[item.hotel.hotelId]) {
				item.hotel.geoCode = hotelIdToGeo[item.hotel.hotelId];
			}
			return item;
		});

		return NextResponse.json({
			data: offers,
			error: null,
			meta: {
				totalHotelsInCity: hotelsArray.length,
				searchedHotels: limitedHotels.length,
				foundOffers: offers.length,
			},
		});
	} catch (error) {
		console.error('Hotels API error:', error);
		return NextResponse.json(
			{
				data: [],
				error: 'Error fetching hotels. Please try again later.',
			},
			{ status: 500 }
		);
	}
}
