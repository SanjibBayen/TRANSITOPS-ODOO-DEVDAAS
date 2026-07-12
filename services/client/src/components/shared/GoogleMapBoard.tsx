import React, { useState, useEffect, useRef } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useAdvancedMarkerRef, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { Navigation, Compass, MapPin, AlertCircle, RefreshCw, KeyRound, CheckCircle2 } from 'lucide-react';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';

const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY' && API_KEY.trim() !== '';

// Precise Coordinates for Gujarat Hubs
const HUBS: { [key: string]: google.maps.LatLngLiteral } = {
  'Gandhinagar Depot': { lat: 23.2156, lng: 72.6369 },
  'Ahmedabad Hub': { lat: 23.0225, lng: 72.5714 },
  'Vadodara Hub': { lat: 22.3072, lng: 73.1812 },
  'Surat Hub': { lat: 21.1702, lng: 72.8311 },
  'Rajkot Hub': { lat: 22.3039, lng: 70.8022 }
};

function RouteDisplay({ origin, destination }: {
  origin: google.maps.LatLngLiteral;
  destination: google.maps.LatLngLiteral;
}) {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');
  const fallbackPolylineRef = useRef<google.maps.Polyline | null>(null);
  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  useEffect(() => {
    if (!routesLib || !map) return;

    // Clear previous elements
    if (fallbackPolylineRef.current) {
      fallbackPolylineRef.current.setMap(null);
      fallbackPolylineRef.current = null;
    }
    polylinesRef.current.forEach(p => p.setMap(null));
    polylinesRef.current = [];

    routesLib.Route.computeRoutes({
      origin,
      destination,
      travelMode: 'DRIVING',
      fields: ['path', 'viewport'],
    }).then(({ routes }) => {
      if (routes?.[0]) {
        const newPolylines = routes[0].createPolylines();
        newPolylines.forEach(p => {
          p.setOptions({
            strokeColor: '#714B67',
            strokeWeight: 5,
            strokeOpacity: 0.8
          });
          p.setMap(map);
        });
        polylinesRef.current = newPolylines;
        if (routes[0].viewport) map.fitBounds(routes[0].viewport);
      }
    }).catch(err => {
      console.warn("computeRoutes caught error, using fallback straight path:", err);
      drawFallbackLine();
    });

    function drawFallbackLine() {
      polylinesRef.current.forEach(p => p.setMap(null));
      polylinesRef.current = [];
      
      const lineSymbol = {
        path: 'M 0,-1 0,1',
        strokeOpacity: 1,
        scale: 4
      };

      const poly = new google.maps.Polyline({
        path: [origin, destination],
        geodesic: true,
        strokeColor: '#714B67',
        strokeOpacity: 0,
        icons: [{
          icon: lineSymbol,
          offset: '0',
          repeat: '20px'
        }],
        strokeWeight: 4,
        map: map
      });
      
      fallbackPolylineRef.current = poly;

      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(origin);
      bounds.extend(destination);
      map.fitBounds(bounds);
    }

    return () => {
      if (fallbackPolylineRef.current) fallbackPolylineRef.current.setMap(null);
      polylinesRef.current.forEach(p => p.setMap(null));
    };
  }, [routesLib, map, origin, destination]);

  return null;
}

const DEFAULT_CENTER = { lat: 22.75, lng: 72.85 }; // Centered in Gujarat

interface GoogleMapBoardProps {
  activeTripId: string | null;
  trips: any[];
}

export const GoogleMapBoard: React.FC<GoogleMapBoardProps> = ({ activeTripId, trips }) => {
  const [useSimulated, setUseSimulated] = useState(!hasValidKey);
  const [selectedMarker, setSelectedMarker] = useState<{ id: string; label: string; position: google.maps.LatLngLiteral; detail: string } | null>(null);

  const activeTrip = trips.find(t => t.id === activeTripId);

  // Determine current tracking location
  const getTrackingPos = () => {
    if (!activeTrip) return null;
    const srcCoords = HUBS[activeTrip.source] || HUBS['Gandhinagar Depot'];
    const destCoords = HUBS[activeTrip.destination] || HUBS['Ahmedabad Hub'];
    const pct = (activeTrip.progressPercent || 0) / 100;
    
    // Interpolate position along line for realistic map tracking
    return {
      lat: srcCoords.lat + (destCoords.lat - srcCoords.lat) * pct,
      lng: srcCoords.lng + (destCoords.lng - srcCoords.lng) * pct
    };
  };

  const trackingPos = getTrackingPos();

  if (!hasValidKey && !useSimulated) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm min-h-[350px] flex flex-col justify-between animate-fade-in">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-50 text-[#714B67] rounded-xl border border-purple-100">
              <KeyRound className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1b1c1c] dark:text-zinc-100">Google Maps API Key Configuration Required</h3>
              <p className="text-[10px] text-gray-500 dark:text-zinc-400 font-semibold mt-0.5">
                Enable interactive multi-asset Google Maps, satellite overlays, and route geocoding.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-zinc-950 rounded-xl p-4 border border-gray-200 dark:border-zinc-800 text-[11px] text-[#4d4847] dark:text-zinc-300 space-y-3 font-semibold">
            <p className="text-[#714B67] font-extrabold flex items-center gap-1.5 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0" />
              How to add your API Key:
            </p>
            <ol className="list-decimal pl-4 space-y-2 leading-relaxed text-[#5d5856] dark:text-zinc-400">
              <li>
                Get a Google Maps Platform API key from the{' '}
                <a 
                  href="https://console.cloud.google.com/google/maps-apis/start?utm_campaign=gmp-code-assist-ais" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#714B67] underline hover:text-[#5e3b56]"
                >
                  Google Cloud Console
                </a>.
              </li>
              <li>
                Add it to your AI Studio Secrets Panel:
                <ul className="list-disc pl-4 mt-1 text-[10px] text-gray-500 dark:text-zinc-400 space-y-0.5">
                  <li>Open <strong>Settings</strong> (⚙️ gear icon, top-right corner)</li>
                  <li>Go to <strong>Secrets</strong></li>
                  <li>Create a secret named <code>GOOGLE_MAPS_PLATFORM_KEY</code></li>
                  <li>Paste your API key and click Save</li>
                </ul>
              </li>
              <li>The application will automatically compile and reload with real live maps.</li>
            </ol>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-gray-200 dark:border-zinc-800 mt-4">
          <button
            onClick={() => setUseSimulated(true)}
            className="w-full sm:w-auto px-4 py-2 bg-[#714B67] text-white text-xs font-extrabold rounded-xl hover:bg-[#5e3b56] shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Compass className="h-4 w-4" />
            Proceed in Simulated Grid Mode
          </button>
          <span className="text-[10px] font-bold text-gray-500 dark:text-zinc-400">
            No credit card required for simulated sandbox.
          </span>
        </div>
      </div>
    );
  }

  // 1. Google Maps Mode
  if (hasValidKey && !useSimulated) {
    return (
      <div className="bg-[#f0ece9] border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm h-[320px] relative flex flex-col justify-between">
        <div className="absolute top-3 left-3 bg-white dark:bg-zinc-900/95 backdrop-blur-xs px-2.5 py-1 rounded-md border border-gray-200 dark:border-zinc-800 text-[10px] font-bold text-[#1b1c1c] dark:text-zinc-100 z-10 flex items-center gap-1.5 shadow-sm">
          <Navigation className="h-3.5 w-3.5 text-[#714B67]" />
          Google Maps Live Telematics Grid
        </div>

        <div className="absolute top-3 right-3 z-10 flex gap-2">
          <button
            onClick={() => setUseSimulated(true)}
            className="bg-white dark:bg-zinc-900/95 hover:bg-gray-100 dark:hover:bg-zinc-800 text-[#714B67] px-2.5 py-1 rounded-md border border-gray-200 dark:border-zinc-800 text-[9px] font-bold shadow-sm cursor-pointer uppercase"
          >
            Switch to Simulated Vector Map
          </button>
        </div>

        <div className="w-full h-full">
          <APIProvider apiKey={API_KEY} version="weekly">
            <Map
              defaultCenter={trackingPos || DEFAULT_CENTER}
              defaultZoom={9}
              mapId="DEMO_MAP_ID"
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              style={{ width: '100%', height: '100%' }}
              onCameraChanged={() => setSelectedMarker(null)}
            >
              {/* Static Hubs */}
              {Object.entries(HUBS).map(([name, pos]) => (
                <AdvancedMarker
                  key={name}
                  position={pos}
                  onClick={() => setSelectedMarker({
                    id: name,
                    label: name,
                    position: pos,
                    detail: 'TransitOps Core Regional Logistics Hub.'
                  })}
                >
                  <Pin background="#714B67" glyphColor="#fff" borderColor="#1b1c1c" />
                </AdvancedMarker>
              ))}

              {/* Active Telematics tracking marker */}
              {activeTrip && trackingPos && (
                <AdvancedMarker
                  position={trackingPos}
                  onClick={() => setSelectedMarker({
                    id: activeTrip.id,
                    label: `Mission ${activeTrip.id} - ${activeTrip.vehicleName}`,
                    position: trackingPos,
                    detail: `Pilot: ${activeTrip.driverName} | Speed: 62 km/h | Progress: ${activeTrip.progressPercent}%`
                  })}
                >
                  <Pin background="#008f8c" glyphColor="#fff" borderColor="#006a68" scale={1.2} />
                </AdvancedMarker>
              )}

              {/* Real Road Route Polyline Display */}
              {activeTrip && (
                <RouteDisplay 
                  origin={HUBS[activeTrip.source] || HUBS['Gandhinagar Depot']} 
                  destination={HUBS[activeTrip.destination] || HUBS['Ahmedabad Hub']} 
                />
              )}

              {/* Info Window */}
              {selectedMarker && (
                <InfoWindow
                  position={selectedMarker.position}
                  onCloseClick={() => setSelectedMarker(null)}
                >
                  <div className="p-1 max-w-[180px]">
                    <h4 className="text-xs font-bold text-[#1b1c1c] dark:text-zinc-100">{selectedMarker.label}</h4>
                    <p className="text-[10px] text-gray-600 dark:text-zinc-400 mt-1">{selectedMarker.detail}</p>
                    <div className="text-[9px] text-gray-400 mt-1 font-mono">
                      GPS: {selectedMarker.position.lat.toFixed(4)}°, {selectedMarker.position.lng.toFixed(4)}°
                    </div>
                  </div>
                </InfoWindow>
              )}
            </Map>
          </APIProvider>
        </div>

        <div className="bg-white dark:bg-zinc-900/95 border-t border-gray-200 dark:border-zinc-800 px-4 py-2 flex justify-between items-center text-[10px] text-gray-500 dark:text-zinc-400 font-bold z-10">
          <span>Active Tracker: {activeTrip ? `${activeTrip.id} (${activeTrip.vehicleName})` : 'All Hubs Overview'}</span>
          <span>Google Maps Platform Integration Layer</span>
        </div>
      </div>
    );
  }

  // 2. Simulated Vector Map Mode (Sandbox preview fallback)
  const activeTripPercent = activeTrip ? activeTrip.progressPercent : 0;
  const activeTripSource = activeTrip ? activeTrip.source : 'Gandhinagar Depot';
  const activeTripDest = activeTrip ? activeTrip.destination : 'Ahmedabad Hub';

  return (
    <div className="bg-[#f0ece9] border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm h-[320px] relative flex flex-col justify-between animate-fade-in">
      <div className="absolute top-3 left-3 bg-white dark:bg-zinc-900/90 backdrop-blur-xs px-2.5 py-1 rounded-md border border-gray-200 dark:border-zinc-800 text-[10px] font-bold text-[#1b1c1c] dark:text-zinc-100 z-10 flex items-center gap-1.5 shadow-sm">
        <Navigation className="h-3.5 w-3.5 text-[#714B67]" />
        Simulated Route Telematics Grid (Gujarat Corridor)
      </div>

      <div className="absolute top-3 right-3 z-10 flex gap-2">
        {hasValidKey && (
          <button
            onClick={() => setUseSimulated(false)}
            className="bg-white dark:bg-zinc-900/95 hover:bg-gray-100 dark:hover:bg-zinc-800 text-[#714B67] px-2.5 py-1 rounded-md border border-gray-200 dark:border-zinc-800 text-[9px] font-bold shadow-sm cursor-pointer uppercase"
          >
            Switch to Google Maps Live
          </button>
        )}
        {!hasValidKey && (
          <button
            onClick={() => setUseSimulated(false)}
            className="bg-[#714B67] text-white hover:bg-[#5e3b56] px-2.5 py-1 rounded-md border border-[#714B67] text-[9px] font-bold shadow-sm cursor-pointer uppercase flex items-center gap-1"
          >
            <KeyRound className="h-3 w-3" />
            Set Google Maps Key
          </button>
        )}
      </div>

      {/* Vector Route Map SVG */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 600 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Grid lines */}
          <line x1="0" y1="60" x2="600" y2="60" stroke="currentColor" className="text-gray-200 dark:text-zinc-800" strokeWidth="0.5" strokeDasharray="4 4" />
          <line x1="0" y1="120" x2="600" y2="120" stroke="currentColor" className="text-gray-200 dark:text-zinc-800" strokeWidth="0.5" strokeDasharray="4 4" />
          <line x1="0" y1="180" x2="600" y2="180" stroke="currentColor" className="text-gray-200 dark:text-zinc-800" strokeWidth="0.5" strokeDasharray="4 4" />
          <line x1="150" y1="0" x2="150" y2="240" stroke="currentColor" className="text-gray-200 dark:text-zinc-800" strokeWidth="0.5" strokeDasharray="4 4" />
          <line x1="300" y1="0" x2="300" y2="240" stroke="currentColor" className="text-gray-200 dark:text-zinc-800" strokeWidth="0.5" strokeDasharray="4 4" />
          <line x1="450" y1="0" x2="450" y2="240" stroke="currentColor" className="text-gray-200 dark:text-zinc-800" strokeWidth="0.5" strokeDasharray="4 4" />

          {/* Roads/Terrain background strokes */}
          <path d="M50,180 Q150,40 300,160 T550,60" stroke="#e1dad6" strokeWidth="8" strokeLinecap="round" />
          <path d="M50,80 Q200,200 400,90 T550,180" stroke="#e1dad6" strokeWidth="5" strokeLinecap="round" />
          
          {/* Highlighting active tracking path */}
          <path d="M120,80 L250,160 L450,110" stroke="#829c62" strokeWidth="4" strokeLinecap="round" strokeDasharray="6 4" />
          
          {/* Depot Pins */}
          {/* Pin 1: Source */}
          <g transform="translate(120, 80)">
            <circle r="8" fill="#714B67" opacity="0.2" />
            <circle r="4" fill="#714B67" />
            <text x="12" y="-4" fill="#1b1c1c" className="text-[10px] font-bold bg-white dark:bg-zinc-900 px-1 py-0.5 rounded border border-gray-100 dark:border-zinc-800 shadow-xs" fontSize="9">{activeTripSource}</text>
          </g>

          {/* Pin 2: Destination */}
          <g transform="translate(450, 110)">
            <circle r="8" fill="#006a68" opacity="0.2" />
            <circle r="4" fill="#006a68" />
            <text x="12" y="14" fill="#1b1c1c" className="text-[10px] font-bold bg-white dark:bg-zinc-900 px-1 py-0.5 rounded border border-gray-100 dark:border-zinc-800 shadow-xs" fontSize="9">{activeTripDest}</text>
          </g>

          {/* Dynamic Active Tracking Vehicle Pin based on actual trip position */}
          {activeTrip && (
            <g transform={`translate(${120 + (450 - 120) * (activeTripPercent / 100)}, ${80 + (110 - 80) * (activeTripPercent / 100)})`}>
              <circle r="12" fill="#008f8c" className="animate-ping" opacity="0.4" />
              <circle r="6" fill="#006a68" />
              <text x="-40" y="-14" fill="#006a68" className="text-[9px] font-extrabold bg-white dark:bg-zinc-900/90 backdrop-blur-xs px-1 rounded shadow-xs" fontSize="8">
                {activeTrip.id} ({activeTripPercent}%)
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Bottom mini-bar with coordinates */}
      <div className="mt-auto bg-white dark:bg-zinc-900/95 border-t border-gray-200 dark:border-zinc-800 px-4 py-2 flex justify-between items-center text-[10px] text-gray-500 dark:text-zinc-400 font-bold z-10">
        <span>Selected Track: {activeTrip ? `${activeTrip.id} (Sector Expy Transit)` : 'None'}</span>
        <span>Simulated GPS: {activeTrip ? `23.${2156 + Math.round(activeTripPercent * 1.5)}° N, 72.${6369 - Math.round(activeTripPercent)}° E` : 'Ready'}</span>
      </div>
    </div>
  );
};
