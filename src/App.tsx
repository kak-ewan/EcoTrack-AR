import React, { useState, useEffect } from 'react';
import { AppState, PlantModel, TransportMode } from './types';
import { useGeolocation, LocationCoords } from './hooks/useGeolocation';
import { AnimatePresence, motion } from 'motion/react';

import { SelectPlantView } from './views/SelectPlantView';
import { ARViewer } from './components/ARViewer';
import { SelectTransportView } from './views/SelectTransportView';
import { DeliveringView } from './views/DeliveringView';
import { ResultView } from './views/ResultView';
import { Leaf, Award, Map as MapIcon, Route, Maximize, Minimize, ArrowLeft } from 'lucide-react';

import { LoadingScreen } from './views/LoadingScreen';

export default function App() {
  const [appState, setAppState] = useState<AppState>('LOADING');
  const [selectedPlant, setSelectedPlant] = useState<PlantModel | null>(null);
  const [selectedTransport, setSelectedTransport] = useState<TransportMode | null>(null);
  
  const [startLocation, setStartLocation] = useState<LocationCoords | null>(null);
  const [distanceMeters, setDistanceMeters] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Gamification Stats
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('ecoTrackStats');
    return saved ? JSON.parse(saved) : { missions: 0, distance: 0, carbon: 0 };
  });

  const { coords: currentLocation, error: geoError, startTracking, stopTracking } = useGeolocation();

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleStart = () => {
    setAppState('SELECT_PLANT');
  };

  const handlePlantSelect = (plant: PlantModel) => {
    setSelectedPlant(plant);
    setAppState('AR_PLACE');
  };

  const handlePlantPicked = () => {
    if (currentLocation) {
      setStartLocation(currentLocation);
    }
    setAppState('SELECT_TRANSPORT');
  };

  const handleTransportSelect = (transport: TransportMode) => {
    setSelectedTransport(transport);
    if (!startLocation && currentLocation) {
      setStartLocation(currentLocation);
    }
    startTracking();
    setAppState('DELIVERING');
  };

  const handleDeliveryComplete = (distance: number) => {
    stopTracking();
    setDistanceMeters(distance);
    
    if (selectedTransport) {
      const carbonAdded = (distance / 1000) * selectedTransport.emissionFactor;
      const updatedStats = {
        missions: stats.missions + 1,
        distance: stats.distance + (distance / 1000), // in km
        carbon: stats.carbon + carbonAdded // in grams
      };
      setStats(updatedStats);
      localStorage.setItem('ecoTrackStats', JSON.stringify(updatedStats));
    }

    setAppState('RESULT');
  };

  const handleReset = () => {
    setSelectedPlant(null);
    setSelectedTransport(null);
    setStartLocation(null);
    setDistanceMeters(0);
    setAppState('HOME');
  };

  return (
    <div className="w-full h-screen bg-slate-100 overflow-hidden font-sans mx-auto max-w-md flex flex-col relative shadow-2xl">
      <button 
        onClick={toggleFullscreen}
        className="absolute top-4 right-4 z-[200] p-2 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full text-white transition-colors"
        aria-label="Toggle Fullscreen"
      >
        {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
      </button>

      <AnimatePresence mode="wait">
        {appState === 'LOADING' && (
          <LoadingScreen onFinish={() => setAppState('HOME')} />
        )}

        {appState === 'HOME' && (
          <motion.div 
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex flex-col items-center justify-center h-full p-6 text-center bg-white relative"
          >
            <div className="w-24 h-24 bg-green-100 rounded-3xl flex items-center justify-center mb-6 rotate-3">
               <Leaf size={48} className="text-green-600" />
            </div>
            <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight mb-2">EcoTrack <span className="text-green-500">AR</span></h1>
            <p className="text-slate-500 text-md mb-8 px-4">
              Pilih tanamanmu, jalan menuju lokasi, dan amati jejak karbonmu di dunia nyata.
            </p>

            {/* Gamification Dashboard */}
            <div className="w-full bg-slate-50 rounded-2xl p-5 mb-8 border border-slate-100 shadow-inner">
               <h3 className="text-sm font-bold tracking-widest text-slate-400 uppercase mb-4">Statistik Agens Lingkungan</h3>
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-100 flex flex-col items-center">
                     <Award className="text-amber-500 mb-2 size-6" />
                     <p className="font-bold text-slate-800 text-xl">{stats.missions}</p>
                     <p className="text-xs text-slate-500 text-center">Misi Selesai</p>
                  </div>
                  <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-100 flex flex-col items-center">
                     <MapIcon className="text-blue-500 mb-2 size-6" />
                     <p className="font-bold text-slate-800 text-xl">{stats.distance.toFixed(1)} <span className="text-xs">km</span></p>
                     <p className="text-xs text-slate-500 text-center">Jarak Tempuh</p>
                  </div>
               </div>
            </div>

            <button
              onClick={handleStart}
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-slate-800 transition transform hover:-translate-y-1 active:scale-95 mb-6"
            >
              Mulai Petualangan Alam
            </button>

            <div className="absolute bottom-4 left-0 right-0 text-center text-[10px] font-bold text-slate-300 tracking-widest uppercase pointer-events-none">
              Irwan Taufiqurrahman
            </div>
          </motion.div>
        )}

        {appState === 'SELECT_PLANT' && (
          <motion.div key="plant" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="h-full">
            <SelectPlantView onSelect={handlePlantSelect} onBack={() => setAppState('HOME')} />
          </motion.div>
        )}

        {appState === 'AR_PLACE' && selectedPlant && (
          <motion.div key="ar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full relative">
            <button 
              onClick={() => setAppState('SELECT_PLANT')}
              className="absolute top-4 left-4 z-[200] p-2 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full text-white transition-colors"
              aria-label="Kembali"
            >
              <ArrowLeft size={20} />
            </button>
            <InitiateTracking startTracking={startTracking} stopTracking={stopTracking} />
            <ARViewer plant={selectedPlant} onPick={handlePlantPicked} />
            {geoError && (
              <div className="absolute top-16 left-4 right-4 bg-red-100 text-red-700 p-3 rounded-lg text-sm z-50 shadow">
                Akses lokasi diperlukan: {geoError}
              </div>
            )}
          </motion.div>
        )}

        {appState === 'SELECT_TRANSPORT' && (
          <motion.div key="transport" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, y: 50 }} className="h-full">
            <SelectTransportView onSelect={handleTransportSelect} onBack={() => setAppState('SELECT_PLANT')} />
          </motion.div>
        )}

        {appState === 'DELIVERING' && selectedTransport && (
          <motion.div key="delivering" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="h-full">
            <DeliveringView 
              currentLocation={currentLocation}
              startLocation={startLocation}
              transportMode={selectedTransport}
              onComplete={handleDeliveryComplete}
            />
          </motion.div>
        )}

        {appState === 'RESULT' && selectedPlant && selectedTransport && (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: 50 }} className="h-full">
            <ResultView 
              plant={selectedPlant}
              transportMode={selectedTransport}
              distanceMeters={distanceMeters}
              onReset={handleReset}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InitiateTracking({ startTracking, stopTracking }: { startTracking: () => void, stopTracking: () => void }) {
  useEffect(() => {
    startTracking();
    return () => stopTracking();
  }, [startTracking, stopTracking]);
  return null;
}
