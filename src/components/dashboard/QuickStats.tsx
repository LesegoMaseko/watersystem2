import React from 'react';
import { Calendar, Waves, AlertCircle, Users, ArrowUpRight } from 'lucide-react';
import { Card } from '../ui/card';
import { Area, Outage, Reservoir, WaterStatus } from '../../types';

interface QuickStatsProps {
  status: WaterStatus | null;
  area: Area;
  reservoir: Reservoir | null;
  nextOutage: Outage | null;
  activeReportsCount: number;
  onNavigateToSchedule: () => void;
  onNavigateToReservoirs: () => void;
  onNavigateToReports: () => void;
  onNavigateToCommunity: () => void;
}

export const QuickStats: React.FC<QuickStatsProps> = ({
  status,
  area,
  reservoir,
  nextOutage,
  activeReportsCount,
  onNavigateToSchedule,
  onNavigateToReservoirs,
  onNavigateToReports,
  onNavigateToCommunity
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Next Outage */}
      <Card
        variant="interactive"
        className="p-5 flex flex-col justify-between group"
        onClick={onNavigateToSchedule}
      >
        <div className="flex items-start justify-between">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700">
            <Calendar className="w-4 h-4" />
          </div>
          <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-blue-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </div>
        <div className="mt-4">
          <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
            Next Maintenance
          </span>
          <p className="text-sm sm:text-base font-bold text-slate-950 truncate mt-0.5">
            {nextOutage
              ? nextOutage.status === 'active'
                ? 'Active Outage Now'
                : 'Tomorrow, 08:00'
              : 'No Outages Planned'}
          </p>
          <span className="text-xs font-medium text-slate-700 truncate block mt-0.5">
            {nextOutage ? nextOutage.reason : 'Next 7 days clear'}
          </span>
        </div>
      </Card>

      {/* 2. Reservoir Level */}
      <Card
        variant="interactive"
        className="p-5 flex flex-col justify-between group"
        onClick={onNavigateToReservoirs}
      >
        <div className="flex items-start justify-between">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700">
            <Waves className="w-4 h-4" />
          </div>
          <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-blue-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </div>
        <div className="mt-4">
          <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
            Primary Reservoir
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xl font-black text-slate-950">
              {reservoir ? `${reservoir.level}%` : '68%'}
            </span>
            {reservoir && (
              <span
                className={`text-xs font-bold ${
                  reservoir.trend >= 0 ? 'text-emerald-700' : 'text-rose-700'
                }`}
              >
                {reservoir.trend >= 0 ? `+${reservoir.trend}%` : `${reservoir.trend}%`}
              </span>
            )}
          </div>
          <span className="text-xs font-medium text-slate-700 truncate block mt-0.5">
            {reservoir ? reservoir.name.split('&')[0] : 'Normal Capacity'}
          </span>
        </div>
      </Card>

      {/* 3. Active Local Issues */}
      <Card
        variant="interactive"
        className="p-5 flex flex-col justify-between group"
        onClick={onNavigateToReports}
      >
        <div className="flex items-start justify-between">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700">
            <AlertCircle className="w-4 h-4" />
          </div>
          <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-blue-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </div>
        <div className="mt-4">
          <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
            Active Tickets in Ward
          </span>
          <p className="text-xl font-black text-slate-950 mt-0.5">
            {activeReportsCount}
          </p>
          <span className="text-xs font-medium text-slate-700 truncate block mt-0.5">
            {activeReportsCount > 0 ? 'Repairs dispatched' : 'All lines clear'}
          </span>
        </div>
      </Card>

      {/* 4. Community Activity */}
      <Card
        variant="interactive"
        className="p-5 flex flex-col justify-between group"
        onClick={onNavigateToCommunity}
      >
        <div className="flex items-start justify-between">
          <div className="p-2.5 rounded-xl bg-slate-100 text-slate-800">
            <Users className="w-4 h-4" />
          </div>
          <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-blue-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </div>
        <div className="mt-4">
          <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
            Community Reports
          </span>
          <p className="text-xl font-black text-slate-950 mt-0.5">
            18 Verified
          </p>
          <span className="text-xs font-medium text-slate-700 truncate block mt-0.5">
            Joburg Water active notices
          </span>
        </div>
      </Card>
    </div>
  );
};
