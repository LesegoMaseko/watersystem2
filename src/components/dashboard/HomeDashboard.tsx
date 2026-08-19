import React, { useState } from 'react';
import {
  Waves,
  AlertTriangle,
  Calendar,
  MessageSquare,
  Truck,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Clock,
  Radio,
  FileText
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { WaterStatusCard } from './WaterStatusCard';
import { QuickStats } from './QuickStats';
import { DayTimeline } from './DayTimeline';
import { QuickActionButtons } from './QuickActionButtons';
import { useWaterStatus } from '../../hooks/use-water-status';
import { useOutages } from '../../hooks/use-outages';
import { useReservoirs } from '../../hooks/use-reservoirs';
import { useReportStore } from '../../store/report.store';
import { useAreaStore } from '../../store/area.store';
import { useCommunity } from '../../hooks/use-community';
import { NavTab } from '../layout/BottomNavigation';

interface HomeDashboardProps {
  onSelectTab: (tab: NavTab) => void;
  onOpenReportWizard: () => void;
  onTrackReport: (reportId: string) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onSelectTab,
  onOpenReportWizard,
  onTrackReport
}) => {
  const { currentArea } = useAreaStore();
  const { status, timeline, isLoading, refetch } = useWaterStatus();
  const { outages } = useOutages(true);
  const { reservoirs } = useReservoirs();
  const reports = useReportStore((state) => state.reports);
  const { posts: communityPosts } = useCommunity();
  const [communityFilter, setCommunityFilter] = useState<'all' | 'official' | 'community'>('all');

  const nextOutage = outages.length > 0 ? outages[0] : null;

  // Find supplying reservoir
  const reservoir =
    reservoirs.find((r) => r.id === currentArea.reservoirId) || reservoirs[0] || null;

  // Filter reports for this area
  const areaReports = reports.filter((r) => r.areaId === currentArea.id);

  // Filtered community notices
  const filteredNotices = communityPosts.filter((p) => {
    if (communityFilter === 'official') return p.isOfficial;
    if (communityFilter === 'community') return !p.isOfficial;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* 1. Main 3-Column Top Grid in Geometric Balance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Hero Card spans 2 columns on desktop */}
        <div className="col-span-1 lg:col-span-2">
          <WaterStatusCard
            status={status}
            area={currentArea}
            isLoading={isLoading}
            onRefresh={refetch}
            onOpenReportWizard={onOpenReportWizard}
            onViewSchedule={() => onSelectTab('schedule')}
          />
        </div>

        {/* Right Column: Reservoir Level & Active Reports Dark Card */}
        <div className="space-y-6">
          {/* Reservoir Levels Card */}
          {reservoir && (
            <div className="bg-white rounded-[24px] border border-slate-200 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-slate-950">Reservoir Levels</h3>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {reservoir.status.toUpperCase()}
                </span>
              </div>
              <div className="flex items-end gap-4 mb-4">
                <div className="text-4xl font-black text-slate-950">
                  {reservoir.level}
                  <span className="text-xl font-bold text-slate-700">%</span>
                </div>
                <div className="mb-1 flex items-center text-emerald-700 text-xs font-bold">
                  <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                  +3.4%
                </div>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${reservoir.level}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-4 text-[10px] text-slate-700 font-semibold">
                <span className="truncate">{reservoir.name}</span>
                <button
                  type="button"
                  onClick={() => onSelectTab('reservoirs')}
                  className="text-blue-700 hover:underline font-bold cursor-pointer"
                >
                  Details →
                </button>
              </div>
            </div>
          )}

          {/* Active Reports Bright Card */}
          <div className="bg-white rounded-[24px] p-6 text-slate-950 shadow-xs border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-950">Active Reports</h3>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 font-bold">
                {areaReports.length} in Ward {currentArea.wardNumber}
              </span>
            </div>

            <div className="space-y-2.5">
              {areaReports.length === 0 ? (
                <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-700 font-medium">
                  No active water faults in this sector.
                </div>
              ) : (
                areaReports.slice(0, 3).map((rep) => (
                  <div
                    key={rep.id}
                    onClick={() => onTrackReport(rep.id)}
                    className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-blue-50/70 border border-slate-100 rounded-xl transition-colors cursor-pointer"
                  >
                    <div
                      className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        rep.status === 'repairing'
                          ? 'bg-rose-500 animate-pulse'
                          : rep.status === 'resolved'
                          ? 'bg-emerald-500'
                          : 'bg-amber-500'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate text-slate-950">{rep.typeName}</p>
                      <p className="text-[11px] text-slate-700 font-medium truncate mt-0.5">
                        {rep.streetLocation}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-slate-700 font-bold shrink-0">
                      #{rep.referenceNumber}
                    </span>
                  </div>
                ))
              )}
            </div>

            <button
              type="button"
              onClick={() => onSelectTab('reports')}
              className="w-full mt-4 text-xs font-bold text-center text-blue-700 hover:text-blue-800 cursor-pointer py-1 transition-colors"
            >
              View All Issues →
            </button>
          </div>
        </div>
      </div>

      {/* 2. Quick Action Grid */}
      <QuickActionButtons
        onOpenReportWizard={onOpenReportWizard}
        onNavigateToSchedule={() => onSelectTab('schedule')}
        onNavigateToReservoirs={() => onSelectTab('reservoirs')}
        onNavigateToCommunity={() => onSelectTab('community')}
      />

      {/* 3. Community Updates & Verified Notices (Geometric Balance 3-Column Card) */}
      <div className="bg-white rounded-[24px] border border-slate-200 p-6 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-950">
              Community Updates & Verified Notices
            </h3>
            <p className="text-xs text-slate-700 font-medium mt-0.5">
              Live notifications from municipal engineers and verified neighborhood watch groups.
            </p>
          </div>

          <div className="flex gap-1.5 self-start bg-slate-100 p-1 rounded-full">
            <button
              type="button"
              onClick={() => setCommunityFilter('all')}
              className={`px-3 py-1 text-[10px] font-bold rounded-full transition-colors cursor-pointer ${
                communityFilter === 'all'
                  ? 'bg-slate-950 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setCommunityFilter('official')}
              className={`px-3 py-1 text-[10px] font-bold rounded-full transition-colors cursor-pointer ${
                communityFilter === 'official'
                  ? 'bg-slate-950 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              Official
            </button>
            <button
              type="button"
              onClick={() => setCommunityFilter('community')}
              className={`px-3 py-1 text-[10px] font-bold rounded-full transition-colors cursor-pointer ${
                communityFilter === 'community'
                  ? 'bg-slate-950 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              Local Reports
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredNotices.slice(0, 3).map((post, idx) => (
            <div
              key={post.id}
              className={`${
                idx < 2 ? 'md:border-r md:border-slate-100 md:pr-6' : ''
              } flex flex-col justify-between space-y-3`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      post.isOfficial
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    {post.isOfficial ? 'Joburg Water Notice' : post.areaName}
                  </span>
                  <span className="text-[10px] text-slate-600 font-semibold">
                    {post.timestamp}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-950 leading-snug">
                  {post.authorName}
                </h4>
                <p className="text-xs text-slate-800 font-medium line-clamp-3 leading-relaxed">
                  {post.content}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-600 font-semibold">
                <span>{post.likesCount} residents verified</span>
                <button
                  type="button"
                  onClick={() => onSelectTab('community')}
                  className="text-blue-700 font-bold hover:underline cursor-pointer"
                >
                  Read →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Quick Stats Overview */}
      <QuickStats
        status={status}
        area={currentArea}
        reservoir={reservoir}
        nextOutage={nextOutage}
        activeReportsCount={areaReports.length}
        onNavigateToSchedule={() => onSelectTab('schedule')}
        onNavigateToReservoirs={() => onSelectTab('reservoirs')}
        onNavigateToReports={() => onSelectTab('reports')}
        onNavigateToCommunity={() => onSelectTab('community')}
      />
    </div>
  );
};
