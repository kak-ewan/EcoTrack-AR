import React from 'react';
import { PlantModel, TransportMode, EMISSION_SOURCES } from '../types';
import { CheckCircle, Leaf, Wind, Smartphone, TreePine } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  plant: PlantModel;
  transportMode: TransportMode;
  distanceMeters: number;
  onReset: () => void;
}

export function ResultView({ plant, transportMode, distanceMeters, onReset }: Props) {
  const distanceKm = distanceMeters / 1000;
  const carbonEmitted = distanceKm * transportMode.emissionFactor;
  
  const isZeroEmission = carbonEmitted === 0;

  // Analogi edukatif (Perkiraan kasar untuk tujuan pendidikan)
  const smartphoneCharges = Math.round(carbonEmitted / 8); // 1 charge ~ 8g CO2
  const treeAbsorptionDays = (carbonEmitted / 60).toFixed(1); // 1 pohon dewasa menyerap ~60g CO2 per hari

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col h-full bg-slate-50 p-6 pt-12 overflow-y-auto"
    >
      <div className="flex-1 flex flex-col items-center">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
          className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-500"
        >
          <CheckCircle size={48} />
        </motion.div>
        <h1 className="text-3xl font-bold text-slate-800 text-center mb-2">Misi Selesai!</h1>
        <p className="text-slate-500 text-center mb-8">Tanaman "{plant.name}" berhasil didistribusikan.</p>

        <div className="w-full bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-6">
           <h3 className="font-semibold text-slate-800 mb-4 text-lg">Laporan Misi</h3>
           
           <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                 <span className="text-slate-500">Jarak Ditempuh</span>
                 <span className="font-medium text-slate-800">{distanceKm.toFixed(2)} km</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                 <span className="text-slate-500">Transportasi</span>
                 <span className="font-medium text-slate-800">{transportMode.name}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                 <span className="text-slate-500 font-medium">Jejak Karbon</span>
                 <span className={`font-bold text-xl ${isZeroEmission ? 'text-green-500' : 'text-rose-500 flex items-center gap-2'}`}>
                    {carbonEmitted.toFixed(1)} g CO₂
                    {!isZeroEmission && <Wind size={20} />}
                 </span>
              </div>
           </div>
        </div>

        {/* Kotak Analogi Edukatif */}
        {isZeroEmission ? (
           <motion.div 
             initial={{ x: -20, opacity: 0 }}
             animate={{ x: 0, opacity: 1 }}
             transition={{ delay: 0.4 }}
             className="w-full bg-green-50 border border-green-200 rounded-2xl p-5 flex gap-4 items-start mb-8 text-green-800"
           >
              <Leaf className="shrink-0 mt-1 size-6" />
              <div>
                 <p className="font-bold mb-1 text-lg">Pahlawan Lingkungan!</p>
                 <p className="text-sm opacity-90 leading-relaxed">Pilihanmu menggunakan {transportMode.name} telah menghindarkan udara dari polusi. Terima kasih menjaga bumi tetap bersih hari ini!</p>
              </div>
           </motion.div>
        ) : (
           <motion.div 
             initial={{ x: -20, opacity: 0 }}
             animate={{ x: 0, opacity: 1 }}
             transition={{ delay: 0.4 }}
             className="w-full space-y-3 mb-8"
           >
              <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider pl-2">Tahukah Kamu?</h4>
              
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-4 items-center text-amber-800">
                <Smartphone className="shrink-0 size-8 text-amber-600 bg-amber-100 p-1.5 rounded-lg" />
                <p className="text-sm leading-snug">
                  Emisi ini setara dengan mengisi daya *smartphone* sebanyak <span className="font-bold">{smartphoneCharges} kali</span>.
                </p>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex gap-4 items-center text-emerald-800">
                <TreePine className="shrink-0 size-8 text-emerald-600 bg-emerald-100 p-1.5 rounded-lg" />
                <p className="text-sm leading-snug">
                  Butuh sekitar <span className="font-bold">{treeAbsorptionDays} hari</span> bagi satu pohon dewasa untuk menyerap kembali gas karbon sebanyak ini.
                </p>
              </div>
           </motion.div>
        )}

        {/* Catatan estimasi & sumber ilmiah */}
        <div className="w-full bg-white border border-slate-200 rounded-2xl p-4 mb-6 text-xs text-slate-500 leading-relaxed">
          <p className="font-semibold text-slate-600 mb-1">Catatan estimasi</p>
          <p className="mb-2">
            Angka ini adalah <span className="font-semibold">estimasi untuk edukasi</span>, bukan pengukuran emisi resmi.
            Jarak dihitung dari lintasan GPS dan emisi dihitung dengan faktor rata-rata. {transportMode.note}
          </p>
          <p className="font-semibold text-slate-600 mb-1">Rujukan ilmiah</p>
          <ul className="list-disc pl-4 space-y-1">
            {EMISSION_SOURCES.map((src) => (
              <li key={src}>{src}</li>
            ))}
          </ul>
        </div>
      </div>

      <button
        onClick={onReset}
        className="w-full bg-slate-900 text-white font-semibold py-4 rounded-xl shadow-md hover:bg-slate-800 transition active:scale-95"
      >
        Mulai Misi Baru
      </button>
    </motion.div>
  );
}
