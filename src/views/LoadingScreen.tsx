import React, { useEffect } from 'react';
import { motion } from 'motion/react';

export function LoadingScreen({ onFinish }: { onFinish: () => void }) {
  useEffect(() => {
    // Simulasi loading selama 3 detik
    const timer = setTimeout(() => {
      onFinish();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <motion.div
      key="loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      className="absolute inset-0 w-full h-full bg-slate-900 z-[100] flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <img
        src="/images/loading-bg.webp"
        alt="Loading Background"
        className="absolute inset-0 w-full h-full object-cover opacity-80"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 px-6">
        {/* Title / Logo Image */}
        <img
          src="/images/loading-title.png"
          alt="EcoTrack AR"
          className="w-full max-w-xs md:max-w-sm mb-12 object-contain h-auto drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />

        <div className="w-14 h-14 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-6 shadow-lg shadow-green-500/20"></div>
        <h2 className="text-green-50 text-xl font-bold tracking-[0.2em] uppercase drop-shadow-md">Memuat Bumi...</h2>
      </div>
    </motion.div>
  );
}
