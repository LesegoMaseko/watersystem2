import { useState, useEffect, useCallback } from 'react';
import { Reservoir } from '../types';
import { reservoirService } from '../services/reservoir.service';
import { useAreaStore } from '../store/area.store';

export const useReservoirs = () => {
  const currentArea = useAreaStore((state) => state.currentArea);
  const [reservoirs, setReservoirs] = useState<Reservoir[]>([]);
  const [currentReservoir, setCurrentReservoir] = useState<Reservoir | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchReservoirs = useCallback(async () => {
    setIsLoading(true);
    try {
      const all = await reservoirService.getReservoirs();
      setReservoirs(all);
      const current = all.find((r) => r.id === currentArea.reservoirId) || all[0];
      setCurrentReservoir(current || null);
    } finally {
      setIsLoading(false);
    }
  }, [currentArea.reservoirId]);

  useEffect(() => {
    fetchReservoirs();
  }, [fetchReservoirs]);

  return {
    reservoirs,
    currentReservoir,
    isLoading,
    refetch: fetchReservoirs
  };
};
