"use client";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L, { LatLngExpression, LatLngBounds } from "leaflet";
import { useMemo, useEffect } from "react";

import type { FC } from "react";

interface HotelMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  price: string;
  address: string;
  image: string;
  rating: string;
  phone: string;
  cancellation: string;
}

interface MapWithMarkersProps {
  markers: HotelMarker[];
  highlightedHotelId?: string | null;
}

// Component to update map view when markers change
const MapViewUpdater: FC<{ center: LatLngExpression; zoom: number; bounds: LatLngBounds | null }> = ({ center, zoom, bounds }) => {
  const map = useMap();

  useEffect(() => {
    if (bounds) {
      // If we have bounds (multiple hotels), fit the map to show all hotels
      map.fitBounds(bounds, { padding: [20, 20] });
    } else {
      // Single hotel or no hotels - use center and zoom
      map.setView(center, zoom);
    }
  }, [map, center, zoom, bounds]);

  return null;
};

const MapWithMarkers: FC<MapWithMarkersProps> = ({ markers, highlightedHotelId }) => {
  // Calculate center and bounds based on hotel locations
  const { center, zoom, bounds } = useMemo(() => {
    if (markers.length === 0) {
      // Default to a more central world location instead of Saudi Arabia
      return {
        center: [51.505, -0.09] as LatLngExpression, // London coordinates - more neutral
        zoom: 2, // World view when no hotels
        bounds: null
      };
    }

    if (markers.length === 1) {
      // Single hotel - center on it with good zoom level
      return {
        center: [markers[0].lat, markers[0].lng] as LatLngExpression,
        zoom: 14,
        bounds: null
      };
    }

    // Multiple hotels - calculate bounds to fit all hotels
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
  }, [markers]);

  // Custom hotel marker icons
  const normalHotelIcon = L.icon({
    iconUrl: "data:image/svg+xml;base64," + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ea580c" width="32" height="32">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    `),
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const highlightedHotelIcon = L.icon({
    iconUrl: "data:image/svg+xml;base64," + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#dc2626" width="40" height="40">
        <circle cx="12" cy="12" r="8" fill="#fef2f2" stroke="#dc2626" stroke-width="2"/>
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    `),
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  // Create a unique key for the map based on markers to force re-render when city changes
  const mapKey = useMemo(() => {
    if (markers.length === 0) return 'empty';
    // Use the first hotel's coordinates as a key to detect city changes
    return `${markers[0].lat.toFixed(3)}_${markers[0].lng.toFixed(3)}_${markers.length}`;
  }, [markers]);

  return (
    <MapContainer
      key={mapKey} // This forces re-render when city changes
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

      {/* Hotel markers */}
      {markers.map(marker => {
        const isHighlighted = highlightedHotelId === marker.id;
        return (
          <Marker
            key={marker.id}
            position={[marker.lat, marker.lng] as LatLngExpression}
            icon={isHighlighted ? highlightedHotelIcon : normalHotelIcon}
            zIndexOffset={isHighlighted ? 1000 : 0} // Bring highlighted marker to front
          >
            {/* Click Popup with Rich Hotel Information */}
            <Popup maxWidth={300} minWidth={280}>
              <div className="max-w-[280px] p-0 overflow-hidden rounded-lg">
                {/* Hotel Image */}
                <div className="relative">
                  <img
                    src={marker.image}
                    alt={marker.name}
                    className="w-full h-32 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/popdest/abudhabi.jpg";
                    }}
                  />
                  {/* Price Badge */}
                  <div className="absolute top-2 right-2 bg-orange-600 text-white px-2 py-1 rounded-md text-sm font-bold">
                    {marker.price && marker.price !== '-' ? `£${marker.price}` : 'Price on request'}
                  </div>
                </div>

                {/* Hotel Info */}
                <div className="p-3 bg-white">
                  <div className="font-bold text-base mb-1 text-gray-900">{marker.name}</div>
                  <div className="text-sm text-gray-600 mb-2">{marker.address}</div>

                  {/* Rating and Phone */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="bg-gray-200 px-2 py-1 rounded font-bold">{marker.rating}</span>
                      <span className="text-gray-500">{marker.phone}</span>
                    </div>
                  </div>

                  {/* Cancellation Policy */}
                  <div className="text-xs text-green-600 mt-2">{marker.cancellation}</div>

                  {/* Action buttons */}
                  <div className="mt-3 pt-3 border-t border-gray-200 flex gap-2">
                    <button className="flex-1 bg-orange-600 text-white px-3 py-2 rounded text-sm font-bold hover:bg-orange-700 transition-colors">
                      View Deal
                    </button>
                    <button className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors">
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}

      {/* Show hotel count in bottom right */}
      <div className="leaflet-bottom leaflet-right">
        <div className="bg-white p-2 m-2 rounded shadow-md text-sm">
          📍 {markers.length} hotel{markers.length !== 1 ? 's' : ''} found
        </div>
      </div>
    </MapContainer>
  );
};

export default MapWithMarkers;
