import { useState, useEffect, useCallback } from 'react';

export type LocationCoords = {
  latitude: number;
  longitude: number;
  /** Perkiraan akurasi GPS dalam meter (makin kecil makin akurat) */
  accuracy?: number;
};

export function useGeolocation() {
  const [coords, setCoords] = useState<LocationCoords | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  // useCallback supaya referensi fungsi stabil dan efek di komponen
  // pemakainya (mis. InitiateTracking) tidak dijalankan ulang setiap render.
  const startTracking = useCallback(() => setIsTracking(true), []);
  const stopTracking = useCallback(() => setIsTracking(false), []);

  useEffect(() => {
    if (!isTracking) return;

    if (!navigator.geolocation) {
      setError("Geolocation tidak didukung oleh browser Anda.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setError(null);
      },
      (err) => {
        setError(err.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [isTracking]);

  return { coords, error, isTracking, startTracking, stopTracking };
}
