"use client";

import { useEffect, useRef } from "react";

interface MapPickerProps {
  onLocationSelect: (address: any) => void;
}

declare global {
  interface Window {
    L: any;
  }
}

export default function MapPicker({ onLocationSelect }: MapPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    // Load Leaflet CSS
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    // Load Leaflet JS
    if (!window.L) {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.async = true;
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }

    function initMap() {
      if (!mapRef.current || leafletMapRef.current || !window.L) return;
      
      const L = window.L;
      // Default to Hyderabad or user's general area
      const initialCoords: [number, number] = [17.3850, 78.4867];
      
      leafletMapRef.current = L.map(mapRef.current).setView(initialCoords, 13);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(leafletMapRef.current);

      markerRef.current = L.marker(initialCoords, { draggable: true }).addTo(leafletMapRef.current);

      // On click map
      leafletMapRef.current.on('click', function(e: any) {
        const { lat, lng } = e.latlng;
        markerRef.current.setLatLng([lat, lng]);
        reverseGeocode(lat, lng);
      });

      // On drag marker
      markerRef.current.on('dragend', function(e: any) {
        const { lat, lng } = markerRef.current.getLatLng();
        reverseGeocode(lat, lng);
      });

      // Try to get user current location immediately
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          leafletMapRef.current.setView([lat, lng], 16);
          markerRef.current.setLatLng([lat, lng]);
          reverseGeocode(lat, lng);
        });
      }
    }

    async function reverseGeocode(lat: number, lon: number) {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
        const data = await res.json();
        if (data && data.address) {
          onLocationSelect(data);
        }
      } catch (e) {
        console.error(e);
      }
    }

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []); // Empty dependency array so it only mounts once

  return (
    <div className="w-full h-64 bg-zinc-100 border border-zinc-200 mt-4 rounded-sm overflow-hidden z-0 relative">
      <div ref={mapRef} className="w-full h-full" style={{ zIndex: 1 }} />
      <div className="absolute top-2 right-2 bg-white px-2 py-1 text-xs font-semibold shadow z-[2] pointer-events-none rounded border border-zinc-200 text-zinc-700">
        Click or Drag pin to adjust
      </div>
    </div>
  );
}
