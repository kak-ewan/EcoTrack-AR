export type AppState =
  | 'LOADING'
  | 'HOME'
  | 'SELECT_PLANT'
  | 'AR_PLACE'
  | 'SELECT_TRANSPORT'
  | 'DELIVERING'
  | 'RESULT';

export type TransportMode = {
  id: string;
  name: string;
  emissionFactor: number; // g CO2 per km (per penumpang / per pengguna)
  icon: string;
  note: string; // catatan estimasi singkat (asumsi perhitungan)
}

// Rujukan metode yang dipakai untuk semua moda.
// Catatan: periksa kembali dokumen aslinya sebelum dipublikasikan.
export const EMISSION_SOURCES: string[] = [
  'IPCC (2006), Guidelines for National GHG Inventories, Vol. 2 Bab 3 (Mobile Combustion) dan Vol. 4 Bab 10 (Livestock)',
  'US EPA, Emission Factors for Greenhouse Gas Inventories (bensin ± 8,887 kg CO2/galon ≈ 2,3 kg CO2/liter)',
  'KLHK RI, Pedoman Penyelenggaraan Inventarisasi GRK Nasional',
];

export const TRANSPORT_MODES: TransportMode[] = [
  {
    id: 'walk',
    name: 'Jalan Kaki',
    emissionFactor: 0,
    icon: 'Footprints',
    note: 'Emisi operasional nol karena tidak ada pembakaran bahan bakar. Emisi tidak langsung (mis. produksi makanan) tidak dihitung.',
  },
  {
    id: 'bike',
    name: 'Sepeda',
    emissionFactor: 0,
    icon: 'Bike',
    note: 'Emisi operasional nol karena tidak ada pembakaran bahan bakar. Emisi pembuatan sepeda dan produksi makanan tidak dihitung.',
  },
  {
    id: 'cidomo',
    name: 'Cidomo',
    emissionFactor: 0,
    icon: 'Caravan',
    note: 'Dihitung 0 untuk emisi bahan bakar fosil. CO2 napas hewan dianggap biogenik (IPCC), sedangkan metana kuda tidak dihitung di sini. Jika dihitung, estimasinya sekitar 35 g CO2e per km kendaraan (estimasi kasar, bukan nilai baku).',
  },
  {
    id: 'angkot',
    name: 'Angkot',
    emissionFactor: 40,
    icon: 'BusFront',
    note: 'Estimasi per penumpang: bensin 2,33 kg CO2/liter × (1 liter per 8–10 km) ÷ ± 7 penumpang ≈ 40 g/km. Hasil bergantung pada keterisian angkot dan kondisi lalu lintas.',
  },
  {
    id: 'motorcycle',
    name: 'Sepeda Motor',
    emissionFactor: 52,
    icon: 'Motorbike',
    note: 'Estimasi untuk 1 pengendara: bensin 2,33 kg CO2/liter ÷ ± 45 km/liter ≈ 52 g/km. Motor besar atau lalu lintas macet bisa menghasilkan lebih tinggi.',
  },
];

export type PlantModel = {
  id: string;
  name: string;
  color: string;
  type: string;
  modelUrl: string;
  thumbnailUrl: string;
}

export const PLANTS: PlantModel[] = [
  { id: 'cabai', name: 'Pohon Cabai', color: '#dc2626', type: 'tree', modelUrl: '/models/cabai.glb', thumbnailUrl: '/thumbnails/cabai.png' },
  { id: 'apel', name: 'Pohon Apel', color: '#ef4444', type: 'tree', modelUrl: '/models/apel.glb', thumbnailUrl: '/thumbnails/apel.png' },
  { id: 'jeruk', name: 'Pohon Jeruk', color: '#f97316', type: 'tree', modelUrl: '/models/jeruk.glb', thumbnailUrl: '/thumbnails/jeruk.png' },
];
