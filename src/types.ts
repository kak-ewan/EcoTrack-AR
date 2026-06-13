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
  emissionFactor: number; // g CO2 per km
  icon: string;
}

export const TRANSPORT_MODES: TransportMode[] = [
  { id: 'walk', name: 'Jalan Kaki', emissionFactor: 0, icon: 'Footprints' },
  { id: 'bike', name: 'Sepeda', emissionFactor: 0, icon: 'Bike' },
  { id: 'motorcycle', name: 'Sepeda Motor', emissionFactor: 110, icon: 'Navigation' }, // generic icon
  { id: 'car', name: 'Mobil', emissionFactor: 192, icon: 'CarFront' },
  { id: 'bus', name: 'Transportasi Umum', emissionFactor: 105, icon: 'Bus' },
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
