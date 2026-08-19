import React from 'react';
import { AlertTriangle, Droplets, ArrowRight } from 'lucide-react';
import { useWaterStatus } from '../../hooks/use-water-status';

interface EmergencyBannerProps {
  onNavigateToSchedule?: () => void;
  onNavigateToReports?: () => void;
}

export const EmergencyBanner: React.FC<EmergencyBannerProps> = ({
  onNavigateToSchedule,
  onNavigateToReports
}) => {
  const { status, currentArea } = useWaterStatus();

  if (!status || status.status === 'available') {
    return null;
  }

  const isCriticalOutage = status.status === 'outage';

  return (
    <div
      className={`w-full border-b transition-colors px-4 py-2.5 text-xs sm:text-sm font-medium ${
        isCriticalOutage
          ? 'bg-rose-600 text-white border-rose-700'
          : 'bg-amber-500 text-slate-950 border-amber-600'
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-1 rounded bg-black/15 shrink-0">
            {isCriticalOutage ? (
              <AlertTriangle className="w-4 h-4 text-white animate-pulse" />
            ) : (
              <Droplets className="w-4 h-4 text-slate-950" />
            )}
          </div>
          <div>
            <span className="font-bold uppercase tracking-wider text-[11px] mr-2 px-1.5 py-0.5 rounded bg-black/20">
              {isCriticalOutage ? 'Active Emergency Outage' : 'Scheduled Notice'}
            </span>
            <span>
              <strong>{currentArea.suburb}:</strong> {status.message}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
          {status.estimatedRestoration && (
            <span className="hidden md:inline text-xs font-semibold opacity-90">
              ETA: {status.estimatedRestoration}
            </span>
          )}
          {isCriticalOutage && onNavigateToReports && (
            <button
              type="button"
              onClick={onNavigateToReports}
              className="underline font-semibold hover:opacity-80 flex items-center gap-1 cursor-pointer text-xs"
            >
              Follow Live Fix <ArrowRight className="w-3 h-3" />
            </button>
          )}
          {!isCriticalOutage && onNavigateToSchedule && (
            <button
              type="button"
              onClick={onNavigateToSchedule}
              className="underline font-semibold hover:opacity-80 flex items-center gap-1 cursor-pointer text-xs"
            >
              View Hours <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
