'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export default function MapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Fix Leaflet icon issues in Next.js
    const fixLeafletIcon = () => {
      // This is a workaround for the missing Leaflet icons in Next.js
      const L = window.L;
      if (L) {
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        });
      }
    };

    // Call the fix function after Leaflet is loaded
    if (window.L) {
      fixLeafletIcon();
    } else {
      window.addEventListener('leaflet:loaded', fixLeafletIcon);
    }

    return () => {
      window.removeEventListener('leaflet:loaded', fixLeafletIcon);
    };
  }, []);

  return (
    <>
      {/* Load Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
        integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
        crossOrigin=""
      />
      
      {/* Load Leaflet JS */}
      <Script
        src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
        integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=="
        crossOrigin=""
        onLoad={() => {
          window.dispatchEvent(new Event('leaflet:loaded'));
        }}
      />
      
      {children}
    </>
  );
}
