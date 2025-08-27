"use client";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L, { LatLngExpression, LatLngBounds } from "leaflet";
import { useMemo, useEffect } from "react";

import type { FC } from "react";

interface CarMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  price: string;
  address: string;
  image: string;
  rating: string;
  phone: string;
  type: string;
}

interface MapWithMarkersProps {
  markers: CarMarker[];
  center?: { lat: number; lng: number };
  highlightedMarkerId?: string | null;
}

// Component to update map view when markers change
const MapViewUpdater: FC<{ center: LatLngExpression; zoom: number; bounds: LatLngBounds | null }> = ({ center, zoom, bounds }) => {
  const map = useMap();

  useEffect(() => {
    if (bounds) {
      // If we have bounds (multiple cars), fit the map to show all cars
      map.fitBounds(bounds, { padding: [20, 20] });
    } else {
      // Single car or no cars - use center and zoom
      map.setView(center, zoom);
    }
  }, [map, center, zoom, bounds]);

  return null;
};

const MapWithMarkers: FC<MapWithMarkersProps> = ({ markers, center: propCenter, highlightedMarkerId }) => {
  // Calculate center and bounds based on car rental locations
  const { center, zoom, bounds } = useMemo(() => {
    if (markers.length === 0) {
      // Use provided center or default to Dubai
      const defaultCenter = propCenter ? [propCenter.lat, propCenter.lng] : [25.2048, 55.2708];
      return {
        center: defaultCenter as LatLngExpression,
        zoom: 10,
        bounds: null
      };
    }

    if (markers.length === 1) {
      // Single car rental - center on it with good zoom level
      return {
        center: [markers[0].lat, markers[0].lng] as LatLngExpression,
        zoom: 14,
        bounds: null
      };
    }

    // Multiple car rentals - calculate bounds to fit all locations
    const lats = markers.map(m => m.lat);
    const lngs = markers.map(m => m.lng);

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    // Calculate center
    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;

    // Create bounds for fitting
    const boundsObj = new L.LatLngBounds(
      [minLat, minLng],
      [maxLat, maxLng]
    );

    return {
      center: [centerLat, centerLng] as LatLngExpression,
      zoom: 12, // Will be overridden by bounds
      bounds: boundsObj
    };
  }, [markers, propCenter]);

  // Custom car rental marker icons
  const normalCarIcon = L.icon({
    iconUrl: "data:image/svg+xml;base64," + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ea580c" width="32" height="32">
        <path d="M5,11L6.5,6.5H17.5L19,11M17.5,16A1.5,1.5 0 0,1 16,14.5A1.5,1.5 0 0,1 17.5,13A1.5,1.5 0 0,1 19,14.5A1.5,1.5 0 0,1 17.5,16M6.5,16A1.5,1.5 0 0,1 5,14.5A1.5,1.5 0 0,1 6.5,13A1.5,1.5 0 0,1 8,14.5A1.5,1.5 0 0,1 6.5,16M18.92,6C18.72,5.42 18.16,5 17.5,5H6.5C5.84,5 5.28,5.42 5.08,6L3,12V20A1,1 0 0,0 4,21H5A1,1 0 0,0 6,20V19H18V20A1,1 0 0,0 19,21H20A1,1 0 0,0 21,20V12L18.92,6Z"/>
      </svg>
    `),
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const highlightedCarIcon = L.icon({
    iconUrl: "data:image/svg+xml;base64=" + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#dc2626" width="40" height="40">
        <circle cx="12" cy="12" r="8" fill="#fef2f2" stroke="#dc2626" stroke-width="2"/>
        <path d="M5,11L6.5,6.5H17.5L19,11M17.5,16A1.5,1.5 0 0,1 16,14.5A1.5,1.5 0 0,1 17.5,13A1.5,1.5 0 0,1 19,14.5A1.5,1.5 0 0,1 17.5,16M6.5,16A1.5,1.5 0 0,1 5,14.5A1.5,1.5 0 0,1 6.5,13A1.5,1.5 0 0,1 8,14.5A1.5,1.5 0 0,1 6.5,16M18.92,6C18.72,5.42 18.16,5 17.5,5H6.5C5.84,5 5.28,5.42 5.08,6L3,12V20A1,1 0 0,0 4,21H5A1,1 0 0,0 6,20V19H18V20A1,1 0 0,0 19,21H20A1,1 0 0,0 21,20V12L18.92,6Z"/>
      </svg>
    `),
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  // Create a unique key for the map based on markers to force re-render when location changes
  const mapKey = useMemo(() => {
    if (markers.length === 0) return 'empty';
    // Use the first car's coordinates as a key to detect location changes
    return `${markers[0].lat.toFixed(3)}_${markers[0].lng.toFixed(3)}_${markers.length}`;
  }, [markers]);

  return (
    <MapContainer
      key={mapKey} // This forces re-render when location changes
      center={center}
      zoom={zoom}
      style={{ height: "100%", width: "100%", minHeight: 700 }}
      scrollWheelZoom={true}
    >
      {/* Component to update map view when markers change */}
      <MapViewUpdater center={center} zoom={zoom} bounds={bounds} />

      {/* English OpenStreetMap tiles */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        subdomains={['a', 'b', 'c']}
      />

      {/* Car rental markers */}
      {markers.map(marker => {
        const isHighlighted = highlightedMarkerId === marker.id;
        return (
          <Marker
            key={marker.id}
            position={[marker.lat, marker.lng] as LatLngExpression}
            icon={isHighlighted ? highlightedCarIcon : normalCarIcon}
            zIndexOffset={isHighlighted ? 1000 : 0} // Bring highlighted marker to front
          >
            {/* Click Popup with Rich Car Rental Information */}
            <Popup maxWidth={300} minWidth={280}>
              <div className="p-2">
                <div className="flex gap-3">
                  {/* Car Image */}
                  <img
                    src={marker.image}
                    alt={marker.name}
                    className="w-20 h-16 object-cover rounded"
                  />

                  {/* Car Details */}
                  <div className="flex-1">
                    <div className="font-bold text-gray-900 text-sm mb-1">
                      {marker.name}
                    </div>
                    <div className="text-xs text-gray-600 mb-1">
                      {marker.type} • Rating: {marker.rating}⭐
                    </div>
                    <div className="text-xs text-gray-600 mb-2">
                      📍 {marker.address}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-bold text-orange-600">
                        {marker.price}
                      </div>
                      <button className="bg-orange-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-orange-700">
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default MapWithMarkers;
