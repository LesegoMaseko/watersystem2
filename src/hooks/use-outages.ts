import { useState, useEffect, useCallback } from 'react';
import { Outage } from '../types';
import { waterService } from '../services/water.service';
import { useAreaStore } from '../store/area.store';

export const useOutages = (filteredByArea: boolean = true) => {
  const currentArea = useAreaStore((state) => state.currentArea);
  const [outages, setOutages] = useState<Outage[]>([]);
  const [analytics, setAnalytics] = useState<{
    total: number;
    active: number;
    upcoming: number;
    resolved: number;
    totalHoursSavedOrRestored: number;
    averageRestorationHours: number;
    reliabilityScore: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchOutages = useCallback(async () => {
    setIsLoading(true);
    try {
      const areaId = filteredByArea ? currentArea.id : undefined;
      const [list, stats] = await Promise.all([
        waterService.getOutages(areaId),
        waterService.getOutageAnalytics(areaId)
      ]);
      setOutages(list);
      setAnalytics(stats);
    } finally {
      setIsLoading(false);
    }
  }, [currentArea.id, filteredByArea]);

  useEffect(() => {
    fetchOutages();
  }, [fetchOutages]);

  return {
    outages,
    analytics,
    isLoading,
    refetch: fetchOutages
  };
};
