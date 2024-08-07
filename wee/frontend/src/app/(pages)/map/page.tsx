"use client";

import React from 'react';
import dynamic from 'next/dynamic';

const LeafletMap = dynamic(() => import('../../components/map/LeafletMap'), { ssr: false });

const MapPage: React.FC = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full h-screen fixed top-0 left-0 overflow-hidden">
        <LeafletMap />
      </div>
    </main>
  );
};

export default MapPage;

