"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "../../components/header";
import Footer from "../../components/footer";

interface CarRentalDetails {
  id: string;
  name: string;
  carType: string;
  transmission: string;
  fuel: string;
  doors: number;
  seats: number;
  aircon: boolean;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  pricing: {
    dailyRate: number;
    totalCost: number;
    currency: string;
  };
  company: string;
  images: string[];
  rating: number;
  features: string[];
  pickup: {
    location: string;
    hours: string;
  };
  dropoff: {
    location: string;
    hours: string;
  };
  description: string;
  specifications: {
    make: string;
    model: string;
    year: number;
    color: string;
    engine: string;
    fuelCapacity: string;
    mileage: string;
  };
  policies: {
    ageRequirement: string;
    licenseRequirement: string;
    insurance: string;
    cancellation: string;
    deposit: string;
  };
}

// Enhanced mock data generator for car details
const generateCarDetails = (id: string): CarRentalDetails => {
  const carConfigs = [
    {
      type: "Economy",
      make: "Toyota",
      model: "Yaris",
      year: 2023,
      transmission: "Manual",
      fuel: "Petrol",
      doors: 4,
      seats: 5,
      dailyRate: 22,
      company: "Hertz",
      rating: 4.2,
      color: "Silver",
      engine: "1.0L 3-cylinder",
      fuelCapacity: "42L",
      mileage: "4.8L/100km",
      features: [
        "Air Conditioning",
        "Power Steering",
        "Radio/CD Player",
        "Central Locking",
        "Electric Windows",
        "Driver Airbag",
        "Passenger Airbag"
      ],
      description: "Perfect for city driving, this Toyota Yaris offers excellent fuel economy and easy maneuverability. Ideal for couples or small families exploring urban areas."
    },
    {
      type: "Economy",
      make: "Nissan",
      model: "Micra",
      year: 2024,
      transmission: "Automatic",
      fuel: "Petrol",
      doors: 4,
      seats: 5,
      dailyRate: 25,
      company: "Avis",
      rating: 4.1,
      color: "White",
      engine: "1.0L 3-cylinder",
      fuelCapacity: "41L",
      mileage: "5.2L/100km",
      features: [
        "Air Conditioning",
        "Bluetooth Connectivity",
        "USB Charging Ports",
        "Touchscreen Display",
        "Rear Parking Sensors",
        "Electronic Stability Control",
        "Anti-lock Braking System"
      ],
      description: "The Nissan Micra combines modern technology with efficient performance. Features automatic transmission for comfortable city and highway driving."
    },
    {
      type: "Compact",
      make: "Volkswagen",
      model: "Golf",
      year: 2023,
      transmission: "Manual",
      fuel: "Diesel",
      doors: 4,
      seats: 5,
      dailyRate: 32,
      company: "Budget",
      rating: 3.9,
      color: "Blue",
      engine: "1.6L TDI",
      fuelCapacity: "50L",
      mileage: "4.2L/100km",
      features: [
        "GPS Navigation System",
        "Air Conditioning",
        "Bluetooth Connectivity",
        "Parking Sensors",
        "Cruise Control",
        "Multi-function Steering Wheel",
        "Digital Climate Control",
        "Heated Mirrors"
      ],
      description: "The Volkswagen Golf is renowned for its build quality and driving dynamics. This diesel variant offers excellent fuel efficiency for longer journeys."
    },
    {
      type: "Compact",
      make: "Ford",
      model: "Focus",
      year: 2024,
      transmission: "Automatic",
      fuel: "Hybrid",
      doors: 4,
      seats: 5,
      dailyRate: 38,
      company: "Enterprise",
      rating: 4.3,
      color: "Red",
      engine: "1.0L EcoBoost Hybrid",
      fuelCapacity: "52L",
      mileage: "4.4L/100km",
      features: [
        "GPS Navigation",
        "Apple CarPlay",
        "Android Auto",
        "Reversing Camera",
        "Cruise Control",
        "Lane Keeping Assist",
        "Automatic Emergency Braking",
        "Wireless Phone Charging"
      ],
      description: "Experience the future of driving with this hybrid Ford Focus. Advanced safety features and connectivity make every journey comfortable and secure."
    },
    {
      type: "Mid-size",
      make: "BMW",
      model: "3 Series",
      year: 2023,
      transmission: "Automatic",
      fuel: "Diesel",
      doors: 4,
      seats: 5,
      dailyRate: 45,
      company: "Sixt",
      rating: 4.0,
      color: "Black",
      engine: "2.0L TwinPower Turbo",
      fuelCapacity: "59L",
      mileage: "5.1L/100km",
      features: [
        "Premium Sound System",
        "Leather Seats",
        "Dual Climate Control",
        "GPS Navigation",
        "Heated Front Seats",
        "Rain Sensing Wipers",
        "Xenon Headlights",
        "Sport Suspension",
        "iDrive Controller"
      ],
      description: "Experience luxury and performance with the BMW 3 Series. Premium materials and advanced technology create the ultimate driving experience."
    },
    {
      type: "Mid-size",
      make: "Audi",
      model: "A4",
      year: 2024,
      transmission: "Automatic",
      fuel: "Petrol",
      doors: 4,
      seats: 5,
      dailyRate: 42,
      company: "Europcar",
      rating: 3.8,
      color: "Silver",
      engine: "2.0L TFSI",
      fuelCapacity: "54L",
      mileage: "6.1L/100km",
      features: [
        "Virtual Cockpit",
        "Heated Seats",
        "Parking Assistant",
        "Premium Audio",
        "Matrix LED Headlights",
        "Quattro All-Wheel Drive",
        "Bang & Olufsen Sound",
        "Ambient Lighting"
      ],
      description: "The Audi A4 represents the perfect balance of luxury, technology, and performance. Sophisticated design meets cutting-edge innovation."
    },
    {
      type: "SUV",
      make: "Toyota",
      model: "RAV4",
      year: 2023,
      transmission: "Automatic",
      fuel: "Hybrid",
      doors: 5,
      seats: 7,
      dailyRate: 62,
      company: "Hertz",
      rating: 4.2,
      color: "White",
      engine: "2.5L Hybrid",
      fuelCapacity: "55L",
      mileage: "4.7L/100km",
      features: [
        "All-Wheel Drive",
        "Roof Rails",
        "Rear Parking Camera",
        "Toyota Safety Sense 2.0",
        "Blind Spot Monitoring",
        "Third Row Seating",
        "Power Tailgate",
        "Smartphone Integration"
      ],
      description: "Perfect for families and adventures, the Toyota RAV4 Hybrid combines space, efficiency, and reliability. Ideal for both city driving and weekend getaways."
    },
    {
      type: "SUV",
      make: "Land Rover",
      model: "Discovery Sport",
      year: 2024,
      transmission: "Automatic",
      fuel: "Diesel",
      doors: 5,
      seats: 7,
      dailyRate: 68,
      company: "Avis",
      rating: 4.1,
      color: "Grey",
      engine: "2.0L D180",
      fuelCapacity: "70L",
      mileage: "6.8L/100km",
      features: [
        "Terrain Response System",
        "Panoramic Sunroof",
        "Meridian Sound System",
        "InControl Touch Pro",
        "Configurable Ambient Lighting",
        "Wade Sensing",
        "All Terrain Progress Control",
        "Premium Interior"
      ],
      description: "Discover luxury and capability with the Land Rover Discovery Sport. Advanced terrain management and premium comfort for any adventure."
    },
    {
      type: "Luxury",
      make: "Mercedes-Benz",
      model: "C-Class",
      year: 2024,
      transmission: "Automatic",
      fuel: "Petrol",
      doors: 4,
      seats: 5,
      dailyRate: 85,
      company: "Budget",
      rating: 3.9,
      color: "Black",
      engine: "2.0L Turbo",
      fuelCapacity: "66L",
      mileage: "7.2L/100km",
      features: [
        "MBUX Infotainment System",
        "Burmester Audio",
        "LED High Performance Headlights",
        "Active Brake Assist",
        "ARTICO Leather Upholstery",
        "64-Color Ambient Lighting",
        "Wireless Charging",
        "Voice Control"
      ],
      description: "Experience the epitome of luxury with the Mercedes-Benz C-Class. Cutting-edge technology and supreme comfort in every detail."
    },
    {
      type: "Luxury",
      make: "BMW",
      model: "5 Series",
      year: 2024,
      transmission: "Automatic",
      fuel: "Hybrid",
      doors: 4,
      seats: 5,
      dailyRate: 92,
      company: "Enterprise",
      rating: 4.3,
      color: "Blue",
      engine: "2.0L Hybrid",
      fuelCapacity: "68L",
      mileage: "5.8L/100km",
      features: [
        "iDrive 7.0 Operating System",
        "Harman Kardon Audio",
        "Driving Assistant Professional",
        "Wireless Charging",
        "Gesture Control",
        "Head-Up Display",
        "Adaptive LED Headlights",
        "Executive Lounge Seating"
      ],
      description: "The BMW 5 Series redefines executive luxury. Innovative hybrid technology meets uncompromising comfort and performance."
    },
    {
      type: "Electric",
      make: "Tesla",
      model: "Model 3",
      year: 2024,
      transmission: "Automatic",
      fuel: "Electric",
      doors: 4,
      seats: 5,
      dailyRate: 58,
      company: "Sixt",
      rating: 4.0,
      color: "White",
      engine: "Electric Motor",
      fuelCapacity: "75kWh Battery",
      mileage: "15kWh/100km",
      features: [
        "Autopilot",
        "Supercharging Network Access",
        "Premium Audio",
        "Over-the-air Updates",
        "Glass Roof",
        "Mobile Connector",
        "Smartphone App Integration",
        "Regenerative Braking"
      ],
      description: "Step into the future with the Tesla Model 3. Zero emissions, cutting-edge technology, and access to the world's most advanced charging network."
    },
    {
      type: "Electric",
      make: "Volkswagen",
      model: "ID.4",
      year: 2024,
      transmission: "Automatic",
      fuel: "Electric",
      doors: 5,
      seats: 5,
      dailyRate: 55,
      company: "Europcar",
      rating: 3.8,
      color: "Grey",
      engine: "Electric Motor",
      fuelCapacity: "77kWh Battery",
      mileage: "17kWh/100km",
      features: [
        "Digital Cockpit Pro",
        "Fast Charging Capability",
        "We Connect App",
        "IQ.DRIVE Assistance Systems",
        "3-Zone Climate Control",
        "ID.Light Light Strip",
        "Augmented Reality Head-up Display",
        "Travel Assist"
      ],
      description: "Discover electric mobility with the Volkswagen ID.4. Spacious interior, intelligent technology, and sustainable driving for the modern world."
    }
  ];

  const carIndex = parseInt(id.split('-')[1]) - 1;
  const config = carConfigs[carIndex % carConfigs.length];

  // Location-specific coordinates for more realistic addresses
  const locations = [
    {
      address: "London Heathrow Airport - Terminal 2",
      latitude: 51.4700,
      longitude: -0.4543
    },
    {
      address: "London City Centre - King's Cross",
      latitude: 51.5308,
      longitude: -0.1238
    },
    {
      address: "Manchester Airport - Terminal 1",
      latitude: 53.3539,
      longitude: -2.2750
    },
    {
      address: "Birmingham City Centre",
      latitude: 52.4862,
      longitude: -1.8904
    },
    {
      address: "Edinburgh Airport",
      latitude: 55.9500,
      longitude: -3.3725
    },
    {
      address: "Glasgow Central Station",
      latitude: 55.8580,
      longitude: -4.2590
    }
  ];

  const location = locations[carIndex % locations.length];

  return {
    id,
    name: `${config.make} ${config.model} (${config.type})`,
    carType: config.type,
    transmission: config.transmission,
    fuel: config.fuel,
    doors: config.doors,
    seats: config.seats,
    aircon: true,
    location: {
      latitude: location.latitude + (Math.random() - 0.5) * 0.01,
      longitude: location.longitude + (Math.random() - 0.5) * 0.01,
      address: location.address
    },
    pricing: {
      dailyRate: config.dailyRate,
      totalCost: config.dailyRate * 3,
      currency: "GBP"
    },
    company: config.company,
    images: [
      "/popdest/dubai.jpg",
      "/popdest/london.jpg",
      "/popdest/paris.jpg",
      "/popdest/newyork.webp",
      "/popdest/tokyo.webp",
      "/popdest/sydney.webp"
    ],
    rating: config.rating + (Math.random() * 0.2 - 0.1), // Small variation
    features: config.features,
    pickup: {
      location: location.address,
      hours: carIndex % 3 === 0 ? "06:00-22:00" : "24/7"
    },
    dropoff: {
      location: location.address,
      hours: carIndex % 3 === 0 ? "06:00-22:00" : "24/7"
    },
    description: config.description,
    specifications: {
      make: config.make,
      model: config.model,
      year: config.year,
      color: config.color,
      engine: config.engine,
      fuelCapacity: config.fuelCapacity,
      mileage: config.mileage
    },
    policies: {
      ageRequirement: "Minimum age 21 years (25+ for luxury/sports cars)",
      licenseRequirement: "Valid driving license held for minimum 1 year",
      insurance: "Comprehensive insurance included (excess applies)",
      cancellation: "Free cancellation up to 24 hours before pickup",
      deposit: config.type === "Luxury" || config.type === "Electric" ? "£300 security deposit required" : "£200 security deposit required"
    }
  };
};

function CarHireDetailContent() {
  const params = useParams();
  const [car, setCar] = useState<CarRentalDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (params.id) {
      // Simulate API call
      setTimeout(() => {
        const carDetails = generateCarDetails(params.id as string);
        setCar(carDetails);
        setLoading(false);
      }, 500);
    }
  }, [params.id]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-orange-600 font-bold text-xl">Loading car details...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (!car) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-red-600 font-bold text-xl">Car not found</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 pt-16">
        {/* Back button */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link
            href="/car-hire"
            className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-2"
          >
            ← Back to search results
          </Link>
        </div>

        {/* Main content */}
        <div className="max-w-7xl mx-auto px-4 pb-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Image Gallery */}
            <div className="relative h-96">
              <img
                src={car.images[currentImageIndex]}
                alt={`${car.name} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Image navigation */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {car.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                  />
                ))}
              </div>

              {/* Company badge */}
              <div className="absolute top-4 left-4 bg-orange-600 text-white px-3 py-2 rounded font-bold">
                {car.company}
              </div>

              {/* Rating */}
              <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-2 rounded">
                ⭐ {car.rating.toFixed(1)}
              </div>
            </div>

            {/* Car details */}
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left column - Car info */}
                <div className="lg:col-span-2">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">{car.name}</h1>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-50 p-3 rounded text-center">
                      <div className="font-bold text-gray-900">{car.carType}</div>
                      <div className="text-sm text-gray-600">Type</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded text-center">
                      <div className="font-bold text-gray-900">{car.transmission}</div>
                      <div className="text-sm text-gray-600">Transmission</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded text-center">
                      <div className="font-bold text-gray-900">{car.seats}</div>
                      <div className="text-sm text-gray-600">Seats</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded text-center">
                      <div className="font-bold text-gray-900">{car.doors}</div>
                      <div className="text-sm text-gray-600">Doors</div>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-6">{car.description}</p>

                  {/* Features */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Features & Amenities</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {car.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-gray-700">
                          <span className="text-green-600">✓</span>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Specifications */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Specifications</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div><span className="font-medium">Make:</span> {car.specifications.make}</div>
                          <div><span className="font-medium">Model:</span> {car.specifications.model}</div>
                          <div><span className="font-medium">Year:</span> {car.specifications.year}</div>
                          <div><span className="font-medium">Color:</span> {car.specifications.color}</div>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div><span className="font-medium">Engine:</span> {car.specifications.engine}</div>
                          <div><span className="font-medium">Fuel:</span> {car.fuel}</div>
                          <div><span className="font-medium">Capacity:</span> {car.specifications.fuelCapacity}</div>
                          <div><span className="font-medium">Mileage:</span> {car.specifications.mileage}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Policies */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Rental Policies</h3>
                    <div className="space-y-3 text-sm text-gray-700">
                      <div><span className="font-medium">Age Requirement:</span> {car.policies.ageRequirement}</div>
                      <div><span className="font-medium">License:</span> {car.policies.licenseRequirement}</div>
                      <div><span className="font-medium">Insurance:</span> {car.policies.insurance}</div>
                      <div><span className="font-medium">Cancellation:</span> {car.policies.cancellation}</div>
                      <div><span className="font-medium">Deposit:</span> {car.policies.deposit}</div>
                    </div>
                  </div>
                </div>

                {/* Right column - Booking */}
                <div className="lg:col-span-1">
                  <div className="bg-gray-50 p-6 rounded-lg sticky top-24">
                    <div className="text-center mb-6">
                      <div className="text-3xl font-bold text-gray-900">
                        £{car.pricing.dailyRate}
                      </div>
                      <div className="text-gray-600">per day</div>
                      <div className="text-sm text-gray-500 mt-2">
                        Total: £{car.pricing.totalCost} (3 days)
                      </div>
                    </div>

                    {/* Pickup/Dropoff Info */}
                    <div className="space-y-4 mb-6">
                      <div>
                        <div className="font-medium text-gray-900">Pickup Location</div>
                        <div className="text-sm text-gray-600">{car.pickup.location}</div>
                        <div className="text-sm text-gray-500">{car.pickup.hours}</div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Drop-off Location</div>
                        <div className="text-sm text-gray-600">{car.dropoff.location}</div>
                        <div className="text-sm text-gray-500">{car.dropoff.hours}</div>
                      </div>
                    </div>

                    <button className="w-full bg-orange-600 text-white py-3 px-6 rounded-lg font-bold text-lg hover:bg-orange-700 transition duration-200">
                      Book Now
                    </button>

                    <div className="text-xs text-gray-500 text-center mt-4">
                      Free cancellation • No hidden fees
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default function CarHireDetailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CarHireDetailContent />
    </Suspense>
  );
}
