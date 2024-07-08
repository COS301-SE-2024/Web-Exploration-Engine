/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const LeafletMap: React.FC = () => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [center, setCenter] = useState<[number, number] | null>(null);
  const [showUserMarker, setShowUserMarker] = useState(false);
  const [markers, setMarkers] = useState<Array<{ coords: [number, number]; address: string }>>([]);

  useEffect(() => {
    // Check if window is defined to ensure this runs only in the browser
    if (typeof window !== 'undefined') {
      // Fix the missing icon issue for Leaflet
      delete (L.Icon.Default.prototype as any)._getIconUrl;

      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      });

      // Convert mock addresses to coordinates
      const convertAddressesToCoords = async () => {
        try {
          const mockAddresses = [
            '28 Manchester Road Chiselhurst, East London',
            '655 Cape Road Hunters Retreat, Port Elizabeth',
            '3 8th Avenue Summerstrand, Port Elizabeth',
            'Tokyo, Japan',
          ];

          const geocodedMarkers = await Promise.all(
            mockAddresses.map(async (address: string) => {
              const geoResponse = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&addressdetails=1`
              );
              const data = await geoResponse.json();

              if (Array.isArray(data) && data.length > 0) {
                const { lat, lon } = data[0];
                return { coords: [parseFloat(lat), parseFloat(lon)], address };
              } else {
                console.error('Empty or unexpected response from geocoding service');
                return null;
              }
            })
          );

          // Filter out null values if any
          setMarkers(geocodedMarkers.filter(marker => marker !== null));
        } catch (error) {
          console.error('Error converting addresses to coordinates:', error);
        }
      };

      // Request user location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation([latitude, longitude]);
            setCenter([latitude, longitude]);
            setShowUserMarker(true);
          },
          (error) => {
            console.error('Error getting user location:', error);
            // Set a random location if user denies permission
            setCenter(null); // No specific center if permission denied
            setShowUserMarker(false);
          }
        );
      }

      convertAddressesToCoords();
    }
  }, []);

  return (
    <MapContainer
      center={center || [0, 0]} // Default center if not set
      zoom={4} // Default zoom level
      style={{ height: '50vh', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {showUserMarker && userLocation && (
        <Marker position={userLocation}>
          <Popup>You are here.</Popup>
        </Marker>
      )}
      {markers.map((marker, index) => (
        <Marker key={index} position={marker.coords}>
          <Popup>{marker.address}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default dynamic(() => Promise.resolve(LeafletMap), { ssr: false });
