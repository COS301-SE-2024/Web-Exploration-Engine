/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const LeafletMap: React.FC = () => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
  const [center, setCenter] = useState<[number, number] | null>(null);
  const [showUserMarker, setShowUserMarker] = useState(false);
  const [markers, setMarkers] = useState<
    { coords: [number, number]; address: string }[]
  >([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      delete (L.Icon.Default.prototype as any)._getIconUrl;

      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl:
          'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      });

      const mockAddresses = [
        '28 Manchester Road, Chiselhurst, East London',
        '655 Cape Road, Hunters Retreat, Port Elizabeth',
        '3 8th Avenue, Summerstrand, Port Elizabeth',
        'Tokyo, Japan',
        '1600 Amphitheatre Parkway, Mountain View, CA',
        '1 Infinite Loop, Cupertino, CA',
        '221B Baker Street, London, UK',
        'Eiffel Tower, Paris, France',
        'Colosseum, Rome, Italy',
        'Sydney Opera House, Sydney, Australia',
        'Great Wall of China, China',
        'Statue of Liberty, New York, USA',
        'Taj Mahal, Agra, India',
        'Christ the Redeemer, Rio de Janeiro, Brazil',
        'Mount Everest, Nepal',
      ];

      const convertAddressesToCoords = async () => {
        const geocodedMarkers = await Promise.all(
          mockAddresses.map(async (address: string) => {
            try {
              const geoResponse = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
                  address
                )}&format=json&addressdetails=1`
              );
              const data = await geoResponse.json();
              console.log(`Geocoding response for ${address}:`, data);
              if (Array.isArray(data) && data.length > 0) {
                const { lat, lon } = data[0];
                return { coords: [parseFloat(lat), parseFloat(lon)], address };
              } else {
                console.error(
                  'Empty or unexpected response from geocoding service for address:',
                  address
                );
                return null;
              }
            } catch (error) {
              console.error(
                'Error converting address to coordinates for address:',
                address,
                error
              );
              return null;
            }
          })
        );
        console.log(
          'Filtered geocoded markers:',
          geocodedMarkers.filter((marker) => marker !== null)
        );
        setMarkers(
          geocodedMarkers.filter((marker) => marker !== null) as {
            coords: [number, number];
            address: string;
          }[]
        );
      };

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            console.log('User location retrieved:', { latitude, longitude });
            setUserLocation([latitude, longitude]);
            setCenter([latitude, longitude]);
            setShowUserMarker(true);
          },
          (error) => {
            console.error('Error getting user location:', error);
            setCenter([0, 0]); // No specific center if permission denied
            setShowUserMarker(false);
          }
        );
      } else {
        console.error('Geolocation not supported by this browser');
        setCenter([0, 0]);
      }

      convertAddressesToCoords();
    }
  }, []);

  console.log('User location:', userLocation);
  console.log('Center:', center);
  console.log('Markers:', markers);

  const userIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconRetinaUrl:
      'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    shadowSize: [41, 41],
  });

  return (
    <MapContainer
      center={center || [0, 0]}
      zoom={2}
      style={{ height: '100%', width: '100%' }}
      zoomControl={false} // Disable zoom control buttons
      minZoom={2} // Set the minimum zoom level
      maxZoom={17} // Set the maximum zoom level
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {showUserMarker && userLocation && (
        <Marker position={userLocation} icon={userIcon}>
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
