import { useState, useEffect } from 'react';

export type LocationCoords = {
  latitude: number;
  longitude: number;
};

export function useGeolocation() {
  const [coords, setCoords] = useState<LocationCoords | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    let watchId: number;

    if (isTracking) {
      if (!navigator.geolocation) {
        setError("Geolocation tidak didukung oleh browser Anda.");
        return;
      }

      watchId = navigator.geolocation.watchPosition(
        (position) => {
          setCoords({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setError(null);
        },
        (err) => {
          setError(err.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [isTracking]);

  return { coords, error, isTracking, startTracking: () => setIsTracking(true), stopTracking: () => setIsTracking(false) };
}
