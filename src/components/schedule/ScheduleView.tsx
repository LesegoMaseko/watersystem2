import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Truck,
  Wrench,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Building
} from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Outage, OutageType } from '../../types';
import { useOutages } from '../../hooks/use-outages';
import { useAreaStore } from '../../store/area.store';

export const ScheduleView: React.FC = () => {
  const { currentArea } = useAreaStore();
  const [filterType, setFilterType] = useState<'all' | OutageType>('all');
  const [activeTab, setActiveTab] = useState<'today' | 'week' | 'history'>('today');
  const { outages, analytics, isLoading } = useOutages(false);

  // Filter outages
  const filteredOutages = outages.filter((o) => {
    if (filterType !== 'all' && o.type !== filterType) return false;
    if (activeTab === 'today') {
      return o.status === 'active' || o.status === 'upcoming';
    }
    if (activeTab === 'week') {
      return o.status !== 'resolved';
    }
    if (activeTab === 'history') {
      return o.status === 'resolved';
    }
    return true;
  });

  const getStatusBadge = (status: Outage['status'], type: Outage['type']) => {
    if (status === 'active') {
      return (
        <Badge variant="danger" pulse size="sm">
          ACTIVE {type.toUpperCase()}
        </Badge>
      );
    }
    if (status === 'upcoming') {
      return (
        <Badge variant="warning" size="sm">
          UPCOMING {type.toUpperCase()}
        </Badge>
      );
    }
    return (
      <Badge variant="success" size="sm">
        RESOLVED
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header & Description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-950 tracking-tight flex items-center gap-2.5">
            <Calendar className="w-6 h-6 text-blue-600" />
            Water Supply & Outage Schedule
          </h1>
          <p className="text-sm text-slate-700 font-medium mt-1">
            Official maintenance calendar, emergency repairs, and historical reliability for Gauteng.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl self-start">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              filterType === 'all'
                ? 'bg-white text-slate-950 shadow-xs'
                : 'text-slate-700 hover:text-slate-950'
            }`}
          >
            All Work
          </button>
          <button
            type="button"
            onClick={() => setFilterType('planned')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              filterType === 'planned'
                ? 'bg-white text-slate-950 shadow-xs'
                : 'text-slate-700 hover:text-slate-950'
            }`}
          >
            Planned
          </button>
          <button
            type="button"
            onClick={() => setFilterType('emergency')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              filterType === 'emergency'
                ? 'bg-white text-slate-950 shadow-xs'
                : 'text-slate-700 hover:text-slate-950'
            }`}
          >
            Emergency
          </button>
        </div>
      </div>

      {/* Analytics Summary Banner */}
      {analytics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="p-4 bg-slate-50 border-slate-200">
            <span className="text-[11px] font-bold uppercase text-slate-700 block">Total Tracked</span>
            <p className="text-xl font-black text-slate-950 mt-0.5">{analytics.total} Outages</p>
            <span className="text-xs font-medium text-slate-700 mt-0.5 block">Across Greater Gauteng</span>
          </Card>
          <Card className="p-4 bg-slate-50 border-slate-200">
            <span className="text-[11px] font-bold uppercase text-slate-700 block">Active Incidents</span>
            <p className="text-xl font-black text-rose-700 mt-0.5">{analytics.active} Active</p>
            <span className="text-xs font-medium text-slate-700 mt-0.5 block">Rapid repair teams on site</span>
          </Card>
          <Card className="p-4 bg-slate-50 border-slate-200">
            <span className="text-[11px] font-bold uppercase text-slate-700 block">Average Fix Duration</span>
            <p className="text-xl font-black text-blue-700 mt-0.5">{analytics.averageRestorationHours} Hours</p>
            <span className="text-xs font-medium text-slate-700 mt-0.5 block">For 300mm+ main lines</span>
          </Card>
          <Card className="p-4 bg-slate-50 border-slate-200">
            <span className="text-[11px] font-bold uppercase text-slate-700 block">System Reliability</span>
            <p className="text-xl font-black text-emerald-700 mt-0.5">{analytics.reliabilityScore}%</p>
            <span className="text-xs font-medium text-slate-700 mt-0.5 block">30-day uptime index</span>
          </Card>
        </div>
      )}

      {/* Tabs: Today / This Week / History */}
      <div className="flex border-b border-slate-200 gap-6 text-sm font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('today')}
          className={`pb-3 transition-colors border-b-2 cursor-pointer ${
            activeTab === 'today'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-700 hover:text-slate-950'
          }`}
        >
          Today’s Live Outages & Work
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('week')}
          className={`pb-3 transition-colors border-b-2 cursor-pointer ${
            activeTab === 'week'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-700 hover:text-slate-950'
          }`}
        >
          Upcoming This Week (7 Days)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`pb-3 transition-colors border-b-2 cursor-pointer ${
            activeTab === 'history'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-700 hover:text-slate-950'
          }`}
        >
          Outage History & Archives
        </button>
      </div>

      {/* List of Outages */}
      <div className="space-y-4">
        {filteredOutages.length === 0 ? (
          <Card className="p-12 text-center text-slate-700 space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-950">No Outages In This View</h3>
            <p className="text-xs max-w-sm mx-auto font-medium text-slate-700">
              There are no scheduled shutdowns or active emergency interruptions matching your current filter.
            </p>
          </Card>
        ) : (
          filteredOutages.map((outage) => {
            const isEmergency = outage.type === 'emergency';
            const isActive = outage.status === 'active';

            return (
              <Card
                key={outage.id}
                className={`p-5 sm:p-6 transition-all ${
                  isActive
                    ? 'border-rose-300 bg-rose-50/30'
                    : 'border-slate-200'
                }`}
              >
                <div className="space-y-4">
                  {/* Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      {getStatusBadge(outage.status, outage.type)}
                      <span className="font-mono text-xs text-slate-700 font-bold">
                        #{outage.referenceCode}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                      <Clock className="w-4 h-4 text-slate-600" />
                      <span>
                        {new Date(outage.startTime).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric'
                        })}{' '}
                        •{' '}
                        {new Date(outage.startTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                        {outage.endTime
                          ? ` - ${new Date(outage.endTime).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}`
                          : ''}
                      </span>
                    </div>
                  </div>

                  {/* Main Title & Description */}
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-950">
                      {outage.areaName} ({outage.suburb})
                    </h3>
                    <p className="text-sm font-medium text-slate-800 mt-1 leading-relaxed">
                      {outage.description}
                    </p>
                  </div>

                  {/* Reason & Affected Streets */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <span className="font-bold text-slate-700 block mb-1">
                        Cause / Activity:
                      </span>
                      <span className="text-slate-900 font-semibold">{outage.reason}</span>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <span className="font-bold text-slate-700 block mb-1">
                        Affected Streets:
                      </span>
                      <span className="text-slate-900 font-semibold truncate block">
                        {outage.affectedStreets.join(', ')}
                      </span>
                    </div>
                  </div>

                  {/* Tanker Locations if any */}
                  {outage.waterTankersLocation && outage.waterTankersLocation.length > 0 && (
                    <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs flex items-start gap-2.5">
                      <Truck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-blue-950">
                          Water Tankers Stationed at:
                        </span>
                        <span className="text-blue-900 font-semibold ml-1.5">
                          {outage.waterTankersLocation.join(' • ')}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Footer status */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-2 text-slate-700 font-medium">
                      <Wrench className="w-3.5 h-3.5 text-blue-600" />
                      <span>
                        Technical Status:{' '}
                        <strong className="capitalize text-slate-950 font-bold">
                          {outage.technicianStatus.replace('_', ' ')}
                        </strong>
                      </span>
                    </div>

                    {outage.estimatedRestoration && (
                      <span className="font-bold text-slate-950 bg-slate-100 px-3 py-1 rounded-lg">
                        ETA: {outage.estimatedRestoration}
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};
