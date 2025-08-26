/** @format */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
	const { origin, destination, departureDate, returnDate, adults } = await request.json();

	// Amadeus API credentials (replace with your actual key/secret)
	const clientId = process.env.AMADEUS_API_KEY;
	const clientSecret = process.env.AMADEUS_API_SECRET;

	// Get access token
	const tokenRes = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
	});
	const tokenData = await tokenRes.json();
	const accessToken = tokenData.access_token;

	// Search flights
	const searchUrl = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${departureDate}&adults=${adults}${
		returnDate ? `&returnDate=${returnDate}` : ''
	}`;
	const flightRes = await fetch(searchUrl, {
		headers: { Authorization: `Bearer ${accessToken}` },
	});
	const flightData = await flightRes.json();

	return NextResponse.json(flightData);
}
