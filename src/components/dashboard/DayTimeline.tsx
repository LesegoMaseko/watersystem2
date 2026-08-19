import React, { useState } from 'react';
import { Clock, Info } from 'lucide-react';
import { Card } from '../ui/card';
import { TimelineSlot } from '../../types';

interface DayTimelineProps {
  timeline: TimelineSlot[];
}

export const DayTimeline: React.FC<DayTimelineProps> = ({ timeline }) => {
  const [selectedSlot, setSelectedSlot] = useState<TimelineSlot | null>(null);

  // Current hour of day (e.g. 8 for 08:00)
  const currentHour = new Date().getHours();

  return (
    <Card className="p-5 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-950 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-700" />
            Today’s 24-Hour Supply Timeline
          </h3>
          <p className="text-xs text-slate-700 font-medium mt-0.5">
            Real-time status breakdown across the day. Current hour marked below.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs font-bold text-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Low Pressure</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Outage</span>
          </div>
        </div>
      </div>

      {/* 24-Hour Segmented Bar */}
      <div className="space-y-1.5">
        <div className="relative flex items-center gap-0.5 sm:gap-1 p-1 bg-slate-100 rounded-xl overflow-hidden">
          {timeline.map((slot) => {
            const isNow = slot.hour === currentHour;
            const isSelected = selectedSlot?.hour === slot.hour;

            const getColor = () => {
              if (slot.status === 'outage') return 'bg-rose-500 hover:bg-rose-600';
              if (slot.status === 'warning') return 'bg-amber-500 hover:bg-amber-600';
              return 'bg-emerald-500 hover:bg-emerald-600';
            };

            return (
              <button
                key={slot.hour}
                type="button"
                onClick={() => setSelectedSlot(slot)}
                className={`flex-1 h-9 rounded-md transition-all cursor-pointer relative group ${getColor()} ${
                  isSelected ? 'ring-2 ring-blue-600 scale-105 z-10' : ''
                }`}
                title={`${slot.timeLabel}: ${slot.description}`}
              >
                {/* Current Hour Indicator Marker */}
                {isNow && (
                  <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white ring-2 ring-blue-700 shadow" />
                )}
              </button>
            );
          })}
        </div>

        {/* Time Marker Labels */}
        <div className="flex justify-between text-xs text-slate-700 font-mono font-bold px-1">
          <span>00:00</span>
          <span>04:00</span>
          <span>08:00</span>
          <span>12:00</span>
          <span>16:00</span>
          <span>20:00</span>
          <span>23:59</span>
        </div>
      </div>

      {/* Detail info box on clicked slot or current status */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Info className="w-4 h-4 text-blue-700 shrink-0" />
          <div>
            <span className="font-bold text-slate-950 mr-1.5">
              {selectedSlot ? `${selectedSlot.timeLabel} Window:` : 'Current Time Status:'}
            </span>
            <span className="text-slate-800 font-medium">
              {selectedSlot
                ? selectedSlot.description
                : timeline[currentHour]?.description || 'Normal Supply Available'}
            </span>
          </div>
        </div>
        {selectedSlot && (
          <button
            type="button"
            onClick={() => setSelectedSlot(null)}
            className="text-xs text-blue-700 hover:underline font-bold cursor-pointer"
          >
            Reset
          </button>
        )}
      </div>
    </Card>
  );
};
