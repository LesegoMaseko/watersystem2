import React, { useState } from 'react';
import {
  Waves,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Activity,
  Droplets,
  Building,
  MapPin,
  Clock,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Reservoir, ReservoirStatus } from '../../types';
import { useReservoirs } from '../../hooks/use-reservoirs';
import { useAreaStore } from '../../store/area.store';

export const ReservoirsView: React.FC = () => {
  const { currentArea } = useAreaStore();
  const { reservoirs, isLoading } = useReservoirs();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ReservoirStatus>('all');
  const [selectedReservoirId, setSelectedReservoirId] = useState<string | null>(null);

  const filteredReservoirs = reservoirs.filter((res) => {
    if (statusFilter !== 'all' && res.status !== statusFilter) return false;
    if (
      searchTerm &&
      !res.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !res.municipality.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !res.fedAreas.some((fa) => fa.toLowerCase().includes(searchTerm.toLowerCase()))
    ) {
      return false;
    }
    return true;
  });

  const selectedReservoir =
    reservoirs.find((r) => r.id === selectedReservoirId) ||
    reservoirs.find((r) => r.id === currentArea.reservoirId) ||
    reservoirs[0];

  const getStatusBadge = (status: ReservoirStatus) => {
    if (status === 'critical') {
      return <Badge variant="danger" pulse>CRITICAL ({'<25%'})</Badge>;
    }
    if (status === 'warning') {
      return <Badge variant="warning">WARNING ({'<50%'})</Badge>;
    }
    return <Badge variant="success">HEALTHY LEVEL</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-950 tracking-tight flex items-center gap-2.5">
            <Waves className="w-6 h-6 text-blue-600" />
            Reservoir & Water Tower Telemetry
          </h1>
          <p className="text-sm text-slate-700 font-medium mt-1">
            Real-time bulk storage capacity, inflow/outflow balance, and 7-day trend metrics.
          </p>
        </div>

        {/* Search & Status Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="w-48 sm:w-64">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search reservoir or area..."
              leftIcon={<Search className="w-3.5 h-3.5" />}
            />
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
            {(['all', 'critical', 'warning', 'normal'] as const).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setStatusFilter(filter)}
                className={`px-2.5 py-1.5 rounded-lg capitalize transition-colors cursor-pointer ${
                  statusFilter === filter
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Selected Reservoir Card with Trend Chart */}
      {selectedReservoir && (
        <Card className="p-6 border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Col: Gauge & Vital Stats */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                  Featured Telemetry
                </span>
                {getStatusBadge(selectedReservoir.status)}
              </div>

              <div>
                <h2 className="text-xl font-black text-slate-950">
                  {selectedReservoir.name}
                </h2>
                <p className="text-xs text-slate-700 font-medium mt-0.5">
                  Authority: {selectedReservoir.municipality}
                </p>
              </div>

              {/* Big Level Display */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-700 block font-bold">
                    Current Fill Level
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-3xl sm:text-4xl font-black text-slate-950">
                      {selectedReservoir.level}%
                    </span>
                    <span
                      className={`text-xs font-bold flex items-center gap-0.5 ${
                        selectedReservoir.trend >= 0 ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      {selectedReservoir.trend >= 0 ? (
                        <TrendingUp className="w-3.5 h-3.5" />
                      ) : (
                        <TrendingDown className="w-3.5 h-3.5" />
                      )}
                      {selectedReservoir.trend >= 0 ? `+${selectedReservoir.trend}%` : `${selectedReservoir.trend}%`} (24h)
                    </span>
                  </div>
                </div>

                {/* Circular Mini Gauge Ring */}
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-200"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className={
                        selectedReservoir.status === 'critical'
                          ? 'text-rose-500'
                          : selectedReservoir.status === 'warning'
                          ? 'text-amber-500'
                          : 'text-blue-600'
                      }
                      strokeDasharray={`${selectedReservoir.level}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <Droplets className="w-5 h-5 text-blue-600 absolute" />
                </div>
              </div>

              {/* Rates */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] text-slate-700 block font-bold">Capacity</span>
                  <span className="font-black text-slate-950 mt-0.5 block">
                    {selectedReservoir.capacityML} ML
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] text-slate-700 block font-bold">Inflow</span>
                  <span className="font-bold text-emerald-700 mt-0.5 block">
                    {selectedReservoir.inflowRate}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] text-slate-700 block font-bold">Outflow</span>
                  <span className="font-bold text-blue-700 mt-0.5 block">
                    {selectedReservoir.outflowRate}
                  </span>
                </div>
              </div>

              {/* Fed Suburbs */}
              <div>
                <span className="text-xs font-bold text-slate-800 block mb-1.5">
                  Supplies Water To:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedReservoir.fedAreas.map((area, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-2 py-0.5 rounded-lg bg-slate-100 text-slate-800 font-semibold"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 2 Cols: 7-Day Trend Chart */}
            <div className="lg:col-span-2 flex flex-col justify-between pt-4 lg:pt-0 lg:pl-6 lg:border-l border-slate-200">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-slate-950 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-600" />
                    7-Day Storage Level History (%)
                  </span>
                  <span className="text-xs text-slate-700 font-medium">
                    Live telemetry feed
                  </span>
                </div>
                <p className="text-xs text-slate-700 font-medium mb-4">
                  Shows daily average storage capacity. Levels below 30% trigger high-lying suburb low pressure advisories.
                </p>
              </div>

              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={selectedReservoir.historicalData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorLevel" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: '#475569' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fontSize: 11, fill: '#475569' }}
                      axisLine={false}
                      tickLine={false}
                      unit="%"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '0.75rem',
                        color: '#f8fafc',
                        fontSize: '12px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
                      }}
                      formatter={(val: any) => [`${val}% Level`, 'Capacity']}
                    />
                    <Area
                      type="monotone"
                      dataKey="level"
                      stroke="#2563eb"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorLevel)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-700 font-medium pt-2 border-t border-slate-100">
                <span>Threshold: Normal &gt; 50% | Warning 25-50% | Critical &lt; 25%</span>
                <span className="font-bold text-slate-900">
                  Last pinged {new Date(selectedReservoir.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Grid of All Reservoirs */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-950">
          All Monitored Reservoirs ({filteredReservoirs.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReservoirs.map((res) => {
            const isSelected = selectedReservoir?.id === res.id;

            return (
              <Card
                key={res.id}
                variant="interactive"
                className={`p-5 flex flex-col justify-between transition-all ${
                  isSelected
                    ? 'ring-2 ring-blue-600 bg-blue-50/30'
                    : ''
                }`}
                onClick={() => setSelectedReservoirId(res.id)}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    {getStatusBadge(res.status)}
                    <span
                      className={`text-xs font-bold ${
                        res.trend >= 0 ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      {res.trend >= 0 ? `+${res.trend}%` : `${res.trend}%`}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-slate-950">
                      {res.name}
                    </h4>
                    <p className="text-xs text-slate-700 font-medium mt-0.5">
                      {res.municipality}
                    </p>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-700">Storage</span>
                      <span className="text-slate-950">{res.level}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          res.status === 'critical'
                            ? 'bg-rose-500'
                            : res.status === 'warning'
                            ? 'bg-amber-500'
                            : 'bg-blue-600'
                        }`}
                        style={{ width: `${res.level}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-700 font-medium pt-2 border-t border-slate-100">
                    <span>Cap: {res.capacityML} ML</span>
                    <span>Flow: {res.outflowRate}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 flex items-center justify-between text-xs font-bold text-blue-700">
                  <span>View Telemetry Chart</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
