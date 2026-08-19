import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Clock,
  Gauge,
  Truck,
  RotateCw,
  MapPin,
  HelpCircle,
  Radio
} from 'lucide-react';
import { Card } from '../ui/card';
import { WaterStatus, Area } from '../../types';

interface WaterStatusCardProps {
  status: WaterStatus | null;
  area: Area;
  isLoading: boolean;
  onRefresh: () => void;
  onOpenReportWizard: () => void;
  onViewSchedule: () => void;
}

export const WaterStatusCard: React.FC<WaterStatusCardProps> = ({
  status,
  area,
  isLoading,
  onRefresh,
  onOpenReportWizard,
  onViewSchedule
}) => {
  if (!status) return null;

  const isAvailable = status.status === 'available';
  const isWarning = status.status === 'warning';
  const isOutage = status.status === 'outage';

  const getStatusBadge = () => {
    if (isOutage) {
      return (
        <span className="px-3 py-1 bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 text-[10px] font-bold rounded-full uppercase tracking-wider">
          Supply Interrupted
        </span>
      );
    }
    if (isWarning) {
      return (
        <span className="px-3 py-1 bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 text-[10px] font-bold rounded-full uppercase tracking-wider">
          Advisory / Low Pressure
        </span>
      );
    }
    return (
      <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 text-[10px] font-bold rounded-full uppercase tracking-wider">
        Live Status: Normal
      </span>
    );
  };

  const getHeadline = () => {
    if (isOutage) return 'Water Outage in Effect';
    if (isWarning) return 'Interruption Advisory';
    return 'Water Supply Available';
  };

  // 12-slot 24-hour visual projection bars
  const outlookSlots = [
    { height: isOutage ? 'h-1/4' : 'h-full', color: isOutage ? 'bg-rose-500' : 'bg-blue-500' },
    { height: isOutage ? 'h-1/4' : 'h-full', color: isOutage ? 'bg-rose-500' : 'bg-blue-500' },
    { height: isOutage ? 'h-1/4' : 'h-full', color: isOutage ? 'bg-rose-500' : 'bg-blue-500' },
    { height: isOutage ? 'h-1/4' : 'h-full', color: isOutage ? 'bg-rose-500' : 'bg-blue-500' },
    { height: isOutage ? 'h-1/4' : 'h-full', color: isOutage ? 'bg-rose-500' : 'bg-blue-500' },
    { height: isOutage ? 'h-2/4' : 'h-5/6', color: isOutage ? 'bg-rose-400' : 'bg-blue-400' },
    { height: isOutage ? 'h-3/4' : 'h-4/6', color: isOutage ? 'bg-amber-400' : 'bg-blue-300' },
    { height: isOutage ? 'h-3/4' : 'h-4/6', color: isOutage ? 'bg-amber-400' : 'bg-blue-300' },
    { height: isOutage ? 'h-full' : 'h-5/6', color: isOutage ? 'bg-emerald-400' : 'bg-blue-400' },
    { height: 'h-full', color: isOutage ? 'bg-emerald-500' : 'bg-blue-500' },
    { height: 'h-full', color: isOutage ? 'bg-emerald-500' : 'bg-blue-500' },
    { height: 'h-full', color: isOutage ? 'bg-emerald-500' : 'bg-blue-500' }
  ];

  return (
    <div className="bg-white rounded-[32px] border border-slate-200 p-6 sm:p-8 shadow-sm relative overflow-hidden transition-all">
      {/* Geometric background circle */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full translate-x-20 -translate-y-20 opacity-60 pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Top Header line */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {getStatusBadge()}
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] uppercase tracking-wider font-bold text-slate-700">
              • {area.name} (Ward {area.wardNumber})
            </span>
          </div>

          <div className="flex items-center gap-2 text-[12px] font-bold text-slate-700">
            <Clock className="w-4 h-4 text-slate-600" />
            <span>
              Updated {new Date(status.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <button
              type="button"
              onClick={onRefresh}
              className={`p-1 text-slate-700 hover:text-slate-900 transition-transform cursor-pointer ${
                isLoading ? 'animate-spin' : ''
              }`}
              title="Refresh telemetry"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hero Title & Description */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            {getHeadline()}
          </h1>
          <p className="text-base font-medium text-slate-800 mt-2 max-w-xl leading-relaxed">
            {status.message}
          </p>
        </div>

        {/* 24h Supply Outlook Geometric Bar Visualization */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Supply Outlook (Next 24h)
            </p>
            <button
              type="button"
              onClick={onViewSchedule}
              className="text-xs font-bold text-blue-700 hover:text-blue-900 hover:underline cursor-pointer"
            >
              View Full Schedule →
            </button>
          </div>

          <div className="flex gap-1.5 sm:gap-2 h-16 sm:h-20 items-end bg-slate-50 p-2 rounded-2xl border border-slate-200">
            {outlookSlots.map((slot, index) => (
              <div
                key={index}
                className={`flex-1 ${slot.color} rounded-t-lg ${slot.height} transition-all duration-300 hover:opacity-80`}
              />
            ))}
          </div>

          <div className="flex justify-between mt-2.5 text-xs font-bold text-slate-700 px-1">
            <span>12:00 PM</span>
            <span>6:00 PM</span>
            <span>12:00 AM</span>
            <span>6:00 AM</span>
            <span>11:00 AM</span>
          </div>
        </div>

        {/* Secondary Info Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-200 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[11px] uppercase font-bold text-slate-700 block mb-0.5">Tap Pressure</span>
            <span className="font-bold text-slate-900 text-sm">
              {status.pressureLevel === 'normal'
                ? 'Optimal (4.2 bar)'
                : status.pressureLevel === 'low'
                ? 'Reduced (< 1.5 bar)'
                : 'Zero (No Flow)'}
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[11px] uppercase font-bold text-slate-700 block mb-0.5">Primary Reservoir</span>
            <span className="font-bold text-slate-900 text-sm truncate block">
              {status.sourceReservoirName} ({status.sourceReservoirLevel}%)
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[11px] uppercase font-bold text-slate-700 block mb-0.5">Water Tankers</span>
            <span className="font-bold text-slate-900 text-sm">
              {status.tankerDispatched ? `${status.tankerLocations?.length || 1} Stationed` : 'None Needed'}
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[11px] uppercase font-bold text-slate-700 block mb-0.5">Active Faults</span>
            <span className="font-bold text-slate-900 text-sm">
              {status.activeIssuesCount} Open Tickets
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
