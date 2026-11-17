import React, { useEffect, useRef, useState } from 'react';
import { TransportMode } from '../types';
import { LocationCoords } from '../hooks/useGeolocation';
import { calculateDistance } from '../utils';
import { Navigation, MapPin } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Create custom icons to avoid standard leaflet icon bugs in Webpack/Vite
const startIcon = L.divIcon({
  className: 'custom-icon',
  html: '<div style="background-color: #22c55e; width: 14px; height: 14px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

const currentIcon = L.divIcon({
  className: 'custom-icon',
  html: '<div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></div>',
  iconSize: [22, 22],
  iconAnchor: [11, 11]
});

// Component to recenter map as user moves
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, map.getZoom(), { animate: true, duration: 2 });
  }, [center, map]);
  return null;
}

// Sumber tile peta: OpenStreetMap standar (gratis, tanpa API key).
// Catatan: server ini untuk pemakaian ringan-menengah. Jika trafik besar,
// pindah ke penyedia tile lain (mis. OpenFreeMap atau MapTiler).
const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

// Batas filter kualitas GPS
const MAX_ACCURACY_METERS = 25;
const MIN_MOVE_METERS = 5;

interface Props {
  currentLocation: LocationCoords | null;
  startLocation: LocationCoords | null;
  transportMode: TransportMode;
  onComplete: (distanceMeters: number) => void;
}

export function DeliveringView({ currentLocation, startLocation, transportMode, onComplete }: Props) {
  const [distance, setDistance] = useState(0);
  const [path, setPath] = useState<[number, number][]>([]);
  const lastPoint = useRef<LocationCoords | null>(null);

  // Hitung jarak dengan menjumlahkan setiap segmen lintasan (bukan garis lurus start -> sekarang).
  useEffect(() => {
    if (!currentLocation) return;

    // Abaikan sinyal GPS yang kurang akurat (> 25 m)
    if ((currentLocation.accuracy ?? 0) > MAX_ACCURACY_METERS) return;

    const prev = lastPoint.current ?? startLocation;

    // Belum ada titik acuan: pakai fix GPS pertama sebagai titik awal
    if (!prev) {
      lastPoint.current = currentLocation;
      setPath([[currentLocation.latitude, currentLocation.longitude]]);
      return;
    }

    // Titik awal dari startLocation ikut dimasukkan ke jejak (sekali saja)
    if (!lastPoint.current) {
      setPath([[prev.latitude, prev.longitude]]);
    }

    const segment = calculateDistance(
      prev.latitude,
      prev.longitude,
      currentLocation.latitude,
      currentLocation.longitude
    );

    // Abaikan gerakan kecil yang hanya berupa jitter GPS saat diam
    if (segment < Math.max(MIN_MOVE_METERS, currentLocation.accuracy ?? 0)) return;

    lastPoint.current = currentLocation;
    setDistance((d) => d + segment);
    setPath((p) => [...p, [currentLocation.latitude, currentLocation.longitude]]);
  }, [currentLocation, startLocation]);

  const mapCenter: [number, number] = currentLocation 
    ? [currentLocation.latitude, currentLocation.longitude] 
    : [0, 0];

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      {/* Map Section */}
      <div className="flex-1 relative z-0">
        {currentLocation ? (
          <MapContainer 
            center={mapCenter} 
            zoom={16} 
            scrollWheelZoom={true} 
            zoomControl={false}
            style={{ width: '100%', height: '100%' }}
          >
            <TileLayer
              attribution={TILE_ATTRIBUTION}
              url={TILE_URL}
              maxZoom={19}
            />
            {startLocation && (
              <Marker position={[startLocation.latitude, startLocation.longitude]} icon={startIcon} />
            )}
            
            <Marker position={[currentLocation.latitude, currentLocation.longitude]} icon={currentIcon} />
            
            {path.length > 1 && (
              <Polyline
                positions={path}
                color="#3b82f6"
                weight={4}
              />
            )}

            <MapUpdater center={mapCenter} />
          </MapContainer>
        ) : (
          <div className="w-full h-full flex flex-col justify-center items-center bg-slate-100">
             <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 relative animate-pulse">
                <Navigation size={24} className="text-blue-500" />
             </div>
             <p className="text-slate-500 text-sm">Menunggu sinyal GPS...</p>
          </div>
        )}
        
        {/* Top Floating Status Indicator */}
        <div className="absolute top-4 left-4 right-4 z-[400] pointer-events-none flex justify-center">
           <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-slate-100 flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </span>
              <span className="text-sm font-semibold text-slate-700">Sedang Mengantar...</span>
           </div>
        </div>
      </div>

      {/* Bottom Information Card */}
      <div className="bg-white rounded-t-3xl shadow-[0_-10px_40px_-5px_rgba(0,0,0,0.1)] p-6 z-10 relative">
        <h2 className="text-xl font-bold text-slate-800 mb-1">Informasi Perjalanan</h2>
        <p className="text-slate-500 text-sm mb-6">Moda: {transportMode.name}</p>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 w-full mb-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-500 shadow-sm border border-slate-100">
                  <MapPin size={20} />
               </div>
               <div>
                  <p className="text-sm text-slate-500">Jarak Ditempuh</p>
                  <p className="font-bold text-slate-800 text-2xl">{(distance / 1000).toFixed(2)} <span className="text-sm font-semibold text-slate-500">km</span></p>
               </div>
             </div>
          </div>
        </div>

        <button
          onClick={() => onComplete(distance)}
          className="w-full bg-slate-900 text-white font-semibold py-4 rounded-xl shadow-md hover:bg-slate-800 transition active:scale-95"
        >
          Selesaikan Pengantaran
        </button>
      </div>
    </div>
  );
}
