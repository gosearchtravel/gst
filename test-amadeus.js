/** @format */

// Test script to check Amadeus API capabilities
const fetch = require('node-fetch');

const testAmadeusEndpoints = async () => {
	console.log('Testing Amadeus API endpoints...');

	const clientId = process.env.AMADEUS_API_KEY;
	const clientSecret = process.env.AMADEUS_API_SECRET;

	console.log('Client ID:', clientId ? 'Set' : 'Not set');
	console.log('Client Secret:', clientSecret ? 'Set' : 'Not set');

	if (!clientId || !clientSecret) {
		console.log('Missing credentials');
		return;
	}

	try {
		// Get access token
		const tokenRes = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
		});

		const tokenData = await tokenRes.json();
		console.log('Access token obtained:', !!tokenData.access_token);

		if (!tokenData.access_token) {
			console.log('Token response:', tokenData);
			return;
		}

		// Test a simple endpoint first
		console.log('Testing basic airport lookup...');
		const airportTest = await fetch(
			'https://test.api.amadeus.com/v1/reference-data/locations?keyword=LON&subType=AIRPORT',
			{
				headers: {
					Authorization: `Bearer ${tokenData.access_token}`,
					'Content-Type': 'application/json',
				},
			}
		);

		console.log('Airport test status:', airportTest.status);

		// Now test car rental endpoints
		console.log('Testing car rental endpoints...');
		const endpoints = [
			'https://test.api.amadeus.com/v1/shopping/car-offers?pickupLocation=LHR&dropoffLocation=LHR&pickupDateTime=2025-08-28T10:00:00&dropoffDateTime=2025-08-30T10:00:00',
			'https://test.api.amadeus.com/v1/reference-data/car-rental-providers',
			'https://test.api.amadeus.com/v1/reference-data/locations?keyword=LHR&subType=CAR_RENTAL',
		];

		for (const endpoint of endpoints) {
			try {
				const response = await fetch(endpoint, {
					headers: {
						Authorization: `Bearer ${tokenData.access_token}`,
						'Content-Type': 'application/json',
					},
				});

				console.log(`${endpoint}: ${response.status} ${response.statusText}`);

				if (response.status === 200) {
					const data = await response.json();
					console.log('Success! Sample response:', JSON.stringify(data, null, 2).substring(0, 300));
				} else if (response.status !== 404) {
					const errorData = await response.json();
					console.log('Error response:', errorData);
				}
			} catch (error) {
				console.log(`${endpoint}: Error - ${error.message}`);
			}
		}
	} catch (error) {
		console.error('Script error:', error);
	}
};

testAmadeusEndpoints().catch(console.error);
