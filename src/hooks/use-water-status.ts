import { useState, useEffect, useCallback } from 'react';
import { WaterStatus, TimelineSlot } from '../types';
import { waterService } from '../services/water.service';
import { useAreaStore } from '../store/area.store';

export const useWaterStatus = () => {
  const currentArea = useAreaStore((state) => state.currentArea);
  const [status, setStatus] = useState<WaterStatus | null>(null);
  const [timeline, setTimeline] = useState<TimelineSlot[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    if (!currentArea) return;
    setIsLoading(true);
    setError(null);
    try {
      const [statusData, timelineData] = await Promise.all([
        waterService.getWaterStatus(currentArea.id),
        waterService.getTodayTimeline(currentArea.id)
      ]);
      setStatus(statusData);
      setTimeline(timelineData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load water status');
    } finally {
      setIsLoading(false);
    }
  }, [currentArea?.id]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  return {
    status,
    timeline,
    isLoading,
    error,
    refetch: fetchStatus,
    currentArea
  };
};
