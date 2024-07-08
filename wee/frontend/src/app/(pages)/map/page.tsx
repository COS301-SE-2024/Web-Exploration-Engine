"use client"; // Ensure this directive is at the top of the file

import React from 'react';
import dynamic from 'next/dynamic';

const LeafletMap = dynamic(() => import('../../components/map/LeafletMap'), { ssr: false });

const MapPage: React.FC = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full h-screen">
        <LeafletMap />
      </div>
    </main>
  );
};

export default MapPage;
