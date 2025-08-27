/** @format */

// Enhanced Car Rental Data Utilities
// This file contains utilities for generating more realistic car rental data

export interface PricingModifier {
	season: 'peak' | 'high' | 'standard' | 'low';
	multiplier: number;
	description: string;
}

export interface AvailabilityStatus {
	available: boolean;
	remainingCars: number;
	nextAvailable?: string;
}

export class CarRentalDataEnhancer {
	// Seasonal pricing modifiers
	static getPricingModifier(date: string): PricingModifier {
		const month = new Date(date).getMonth() + 1; // 1-12

		if (month >= 6 && month <= 8) {
			return { season: 'peak', multiplier: 1.4, description: 'Summer Peak Season' };
		} else if (month === 12 || month <= 2) {
			return { season: 'high', multiplier: 1.2, description: 'Holiday Season' };
		} else if (month >= 4 && month <= 5) {
			return { season: 'high', multiplier: 1.15, description: 'Spring Travel Season' };
		} else {
			return { season: 'standard', multiplier: 1.0, description: 'Standard Rate' };
		}
	}

	// Dynamic availability based on demand simulation
	static getAvailability(carId: string, pickupDate: string): AvailabilityStatus {
		const hash = this.simpleHash(carId + pickupDate);
		const availability = hash % 100;

		if (availability < 15) {
			return {
				available: false,
				remainingCars: 0,
				nextAvailable: this.addDays(pickupDate, 1 + (hash % 3)),
			};
		} else if (availability < 30) {
			return {
				available: true,
				remainingCars: 1,
			};
		} else if (availability < 50) {
			return {
				available: true,
				remainingCars: 2,
			};
		} else {
			return {
				available: true,
				remainingCars: 5 + (hash % 10),
			};
		}
	}

	// Location-specific pricing
	static getLocationPriceModifier(location: string): number {
		const locationModifiers: { [key: string]: number } = {
			LHR: 1.3, // Heathrow premium
			LGW: 1.2, // Gatwick
			STN: 1.1, // Stansted
			MAN: 1.0, // Manchester
			BHX: 0.95, // Birmingham
			EDI: 1.05, // Edinburgh
			GLA: 0.9, // Glasgow
			default: 1.0,
		};

		return locationModifiers[location.toUpperCase()] || locationModifiers['default'];
	}

	// Demand-based pricing (higher demand = higher prices)
	static getDemandMultiplier(carType: string, dayOfWeek: number): number {
		const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

		if (carType === 'Luxury' && isWeekend) {
			return 1.2;
		} else if (carType === 'SUV' && isWeekend) {
			return 1.15;
		} else if (carType === 'Economy' && !isWeekend) {
			return 0.95; // Business traveler discount
		}

		return 1.0;
	}

	// Add special offers and promotions
	static getSpecialOffers(carId: string, duration: number): string[] {
		const offers: string[] = [];
		const hash = this.simpleHash(carId);

		if (duration >= 7) {
			offers.push('10% discount for weekly rentals');
		}

		if (duration >= 14) {
			offers.push('Free GPS upgrade for 2+ week rentals');
		}

		if (hash % 10 < 3) {
			offers.push('Free additional driver');
		}

		if (hash % 10 < 2) {
			offers.push('Complimentary upgrade (subject to availability)');
		}

		return offers;
	}

	// Generate realistic insurance options
	static getInsuranceOptions(basePrice: number) {
		return [
			{
				name: 'Basic Coverage',
				description: 'Third party insurance included',
				price: 0,
				excess: 800,
			},
			{
				name: 'Standard Protection',
				description: 'Collision damage waiver',
				price: Math.round(basePrice * 0.15),
				excess: 400,
			},
			{
				name: 'Premium Protection',
				description: 'Full coverage with zero excess',
				price: Math.round(basePrice * 0.25),
				excess: 0,
			},
		];
	}

	// Add realistic extras
	static getAvailableExtras() {
		return [
			{ name: 'GPS Navigation', price: 8, per: 'day' },
			{ name: 'Child Seat (0-4 years)', price: 12, per: 'rental' },
			{ name: 'Booster Seat (4-12 years)', price: 10, per: 'rental' },
			{ name: 'Additional Driver', price: 5, per: 'day' },
			{ name: 'Young Driver (21-24)', price: 15, per: 'day' },
			{ name: 'Roof Box', price: 20, per: 'rental' },
			{ name: 'Ski Rack', price: 15, per: 'rental' },
			{ name: 'Mobile WiFi Hotspot', price: 6, per: 'day' },
			{ name: 'Full Tank Return', price: 45, per: 'rental' },
		];
	}

	// Utility functions
	private static simpleHash(str: string): number {
		let hash = 0;
		for (let i = 0; i < str.length; i++) {
			const char = str.charCodeAt(i);
			hash = (hash << 5) - hash + char;
			hash = hash & hash; // Convert to 32-bit integer
		}
		return Math.abs(hash);
	}

	private static addDays(dateString: string, days: number): string {
		const date = new Date(dateString);
		date.setDate(date.getDate() + days);
		return date.toISOString().split('T')[0];
	}
}
