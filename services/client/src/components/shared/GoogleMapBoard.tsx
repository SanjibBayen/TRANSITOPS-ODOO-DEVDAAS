/// <reference types="@types/google.maps" />
import React, { useState, useEffect, useRef } from 'react';
import { Navigation, Compass, MapPin, AlertCircle, KeyRound } from 'lucide-react';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY || '';

const hasValidKey = Boolean(API_KEY) && API_KEY.length > 10;

const HUBS: Record<string, { lat: number; lng: number }> = {
  'Mumbai': { lat: 19.0760, lng: 72.8777 },
  'Delhi': { lat: 28.7041, lng: 77.1025 },
  'Pune': { lat: 18.5204, lng: 73.8567 },
  'Nashik': { lat: 19.9975, lng: 73.7898 },
  'Ahmedabad': { lat: 23.0225, lng: 72.5714 },
  'Surat': { lat: 21.1702, lng: 72.8311 },
};

interface GoogleMapBoardProps {
  activeTripId: string | null;
  trips: any[];
}

export const GoogleMapBoard: React.FC<GoogleMapBoardProps> = ({ activeTripId, trips }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  const activeTrip = trips.find(t => t.id === activeTripId);

  // Load Google Maps script dynamically
  useEffect(() => {
    if (!hasValidKey || mapLoaded || mapError) return;

    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      setMapLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=geometry`;
    script.async = true;
    script.defer = true;
    script.onload = () => setMapLoaded(true);
    script.onerror = () => setMapError(true);
    document.head.appendChild(script);

    return () => {
      // Don't remove on unmount - other components might use it
    };
  }, [hasValidKey, mapLoaded, mapError]);

  // Initialize map
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    const map = new google.maps.Map(mapRef.current, {
      center: { lat: 21.5, lng: 75.0 },
      zoom: 6,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      styles: [
        { featureType: 'all', elementType: 'labels.text.fill', stylers: [{ color: '#6b7280' }] },
        { featureType: 'all', elementType: 'labels.text.stroke', stylers: [{ visibility: 'off' }] },
        { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#d1d5db' }] },
        { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#f3f4f6' }] },
        { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#e0e7ff' }] },
      ],
    });

    // Add hub markers
    Object.entries(HUBS).forEach(([name, pos]) => {
      const marker = new google.maps.Marker({
        position: pos,
        map,
        title: name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#714B67',
          fillOpacity: 1,
          strokeColor: '#fff',
          strokeWeight: 2,
        },
        label: {
          text: name,
          color: '#1b1c1c',
          fontSize: '11px',
          fontWeight: 'bold',
        },
      });

      marker.addListener('click', () => {
        const infoWindow = new google.maps.InfoWindow({
          content: `<div style="padding:8px"><strong>${name}</strong><br/><span style="font-size:11px;color:#666">TransitOps Hub</span></div>`,
        });
        infoWindow.open(map, marker);
      });
    });

    // Draw active trip route
    if (activeTrip) {
      const source = HUBS[activeTrip.source];
      const dest = HUBS[activeTrip.destination];

      if (source && dest) {
        // Draw route line
        new google.maps.Polyline({
          path: [source, dest],
          geodesic: true,
          strokeColor: '#714B67',
          strokeOpacity: 0.8,
          strokeWeight: 4,
          map,
        });

        // Add vehicle marker at interpolated position
        const progress = (activeTrip.progressPercent || 0) / 100;
        const vehiclePos = {
          lat: source.lat + (dest.lat - source.lat) * progress,
          lng: source.lng + (dest.lng - source.lng) * progress,
        };

        new google.maps.Marker({
          position: vehiclePos,
          map,
          title: `${activeTrip.trip_number || activeTrip.id} - ${activeTrip.vehicle?.registration_number || 'Vehicle'}`,
          icon: {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 6,
            fillColor: '#006a68',
            fillOpacity: 1,
            strokeColor: '#fff',
            strokeWeight: 2,
            rotation: 45,
          },
        });

        // Fit bounds
        const bounds = new google.maps.LatLngBounds();
        bounds.extend(source);
        bounds.extend(dest);
        map.fitBounds(bounds, { top: 50, bottom: 50, left: 50, right: 50 });
      }
    }

    return () => {
      // Cleanup not needed - map is in the DOM
    };
  }, [mapLoaded, activeTrip]);

  // No API Key - Show placeholder
  if (!hasValidKey) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm min-h-[350px] flex flex-col justify-center items-center text-center">
        <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-xl mb-4">
          <KeyRound className="h-8 w-8 text-[#714B67]" />
        </div>
        <h3 className="text-sm font-bold text-gray-900 dark:text-zinc-100">Google Maps API Key Required</h3>
        <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1 max-w-sm">
          Add <code className="bg-gray-100 dark:bg-zinc-800 px-1 rounded">VITE_GOOGLE_MAPS_KEY</code> to your <code className="bg-gray-100 dark:bg-zinc-800 px-1 rounded">.env</code> file to enable live maps.
        </p>
        {activeTrip && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg text-xs">
            <p className="font-bold">{activeTrip.source} → {activeTrip.destination}</p>
            <p className="text-gray-500 mt-1">{activeTrip.planned_distance || activeTrip.distanceKm}km | Progress: {activeTrip.progressPercent || 0}%</p>
          </div>
        )}
      </div>
    );
  }

  // Map error
  if (mapError) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm min-h-[350px] flex flex-col justify-center items-center text-center">
        <AlertCircle className="h-8 w-8 text-red-400 mb-3" />
        <h3 className="text-sm font-bold text-gray-900 dark:text-zinc-100">Map Failed to Load</h3>
        <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">Check your API key or network connection.</p>
      </div>
    );
  }

  // Loading
  if (!mapLoaded) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-sm min-h-[350px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#714B67]"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-zinc-300">
          <Navigation className="h-3.5 w-3.5 text-[#714B67]" />
          Live Fleet Map
        </div>
        <span className="text-[10px] text-gray-500">
          {activeTrip ? `Tracking: ${activeTrip.trip_number || activeTrip.id}` : 'All Hubs'}
        </span>
      </div>
      <div ref={mapRef} className="w-full h-[350px]" />
    </div>
  );
};