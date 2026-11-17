import React from 'react';
import { TransportMode, TRANSPORT_MODES } from '../types';
import * as Icons from 'lucide-react';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

export function SelectTransportView({ onSelect, onBack }: { onSelect: (mode: TransportMode) => void, onBack: () => void }) {
  return (
    <div className="flex flex-col h-full bg-slate-50 p-6 pt-12 relative">
      <button 
        onClick={onBack}
        className="absolute top-4 left-4 p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 rounded-full transition"
      >
         <ArrowLeft size={24} />
      </button>
      <div className="text-center mb-8">
        <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold mb-3">Tujuan Terkunci</div>
        <h1 className="text-2xl font-bold text-slate-800">Tahap 2: Kendaraan</h1>
        <p className="text-slate-500 mt-2 text-sm">Bagaimana cara kamu mengantarkan bibit ini? Ingat, pilihanmu menentukan polusi yang terbuat.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 flex-1">
        {TRANSPORT_MODES.map((mode, idx) => {
          const Icon = (Icons as any)[mode.icon] || Icons.HelpCircle;
          return (
            <motion.button
              key={mode.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(mode)}
              className={`p-4 rounded-2xl shadow-sm border flex flex-col items-center justify-center transition gap-3 
                ${idx === TRANSPORT_MODES.length - 1 && TRANSPORT_MODES.length % 2 === 1 ? 'col-span-2' : ''}
                ${mode.emissionFactor > 0 ? 'bg-white border-slate-100 hover:border-slate-300' : 'bg-emerald-50 border-green-200 hover:border-green-400 hover:shadow-md'}`}
            >
              <div className={`p-4 rounded-full ${mode.emissionFactor > 0 ? 'bg-slate-100 text-slate-700' : 'bg-emerald-200 text-emerald-800'}`}>
                <Icon size={32} />
              </div>
              <h3 className="font-bold text-slate-800 text-center text-sm">{mode.name}</h3>
              <div className={`text-[10px] font-bold px-2 py-1 rounded-md ${mode.emissionFactor > 0 ? 'bg-slate-100 text-slate-600' : 'bg-green-600 text-white shadow-sm'}`}>
                 {mode.emissionFactor > 0 ? `± ${mode.emissionFactor} g CO₂/km` : 'Pahlawan Alam 🌿'}
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  );
}
