"use client";

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const LeafletMap: React.FC = () => {
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
    }
  }, []);

  return (
    <MapContainer center={[-29.849622, 31.022042]} zoom={13} style={{ height: '50%', width: '50%' }}>
      {/* Use your specific coordinates here */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[-29.849622, 31.022042]}> {/* Your specific coordinates */}
        <Popup>
          Your location popup content.
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default dynamic(() => Promise.resolve(LeafletMap), { ssr: false });
