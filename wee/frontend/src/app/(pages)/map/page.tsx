// "use client";

// import React from 'react';
// import dynamic from 'next/dynamic';

// const LeafletMap = dynamic(() => import('../../components/map/LeafletMap'), { ssr: false });

// const MapPage: React.FC = () => {
//   return (
//     <main className="flex min-h-screen flex-col items-center justify-between p-24">
//       <div className="w-full h-screen fixed top-0 left-0 overflow-hidden">
//         <LeafletMap />
//       </div>
//     </main>
//   );
// };

// export default MapPage;

"use client";

import React from 'react';
import dynamic from 'next/dynamic';

const LeafletMap = dynamic(() => import('../../components/map/LeafletMap'), { ssr: false });

const MapPage: React.FC = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className='gap-4 grid md:grid-cols-1 w-full'>
        <div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center flex flex-col justify-center overflow-hidden relative h-96'>
          <LeafletMap />
        </div>
      </div>
    </main>
  );
};

export default MapPage;
