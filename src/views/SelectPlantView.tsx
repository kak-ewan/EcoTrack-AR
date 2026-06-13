import React from 'react';
import { PlantModel, PLANTS } from '../types';
import { Leaf, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

export function SelectPlantView({ onSelect, onBack }: { onSelect: (plant: PlantModel) => void, onBack: () => void }) {
  return (
    <div className="flex flex-col h-full bg-slate-50 p-6 pt-12 relative">
      <button 
        onClick={onBack}
        className="absolute top-4 left-4 p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 rounded-full transition"
      >
         <ArrowLeft size={24} />
      </button>
      <div className="text-center mb-8">
         <div className="bg-green-100 text-green-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Leaf size={32} />
         </div>
        <h1 className="text-2xl font-bold text-slate-800">Tahap 1: Pilih Bibit</h1>
        <p className="text-slate-500 mt-2 text-sm">Pilih bibit tanaman virtual yang ingin kamu antarkan dan tanam hari ini.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 flex-1 overflow-y-auto pb-8">
        {PLANTS.map((plant, idx) => (
          <motion.button
            key={plant.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(plant)}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:border-green-400 hover:shadow-md transition text-left"
          >
            <div className="flex items-center gap-4">
              <div 
                className="w-16 h-16 rounded-full border-4 border-slate-50 shadow-inner flex shrink-0 overflow-hidden relative bg-slate-100 items-center justify-center" 
                style={{ backgroundColor: plant.color }}
              >
                <img 
                  src={plant.thumbnailUrl} 
                  alt={plant.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to pure color if image fails to load
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 text-lg">{plant.name}</h3>
                <p className="text-xs text-slate-500 capitalize px-2 py-1 bg-slate-100 rounded-md inline-block mt-1">Bibit {plant.type}</p>
              </div>
            </div>
            <div className="text-green-500 bg-green-50 p-2 rounded-full">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
