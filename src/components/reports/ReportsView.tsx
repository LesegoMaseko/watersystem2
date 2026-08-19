import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
  Users,
  Search,
  Filter,
  PlusCircle,
  ArrowRight,
  Bell,
  Wrench,
  ChevronRight,
  Sparkles,
  Phone,
  FileCheck,
  RotateCcw
} from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Modal } from '../ui/modal';
import { IssueReport, IssueStatus } from '../../types';
import { useReportStore } from '../../store/report.store';
import { useAreaStore } from '../../store/area.store';
import { useToast } from '../../hooks/use-toast';

interface ReportsViewProps {
  onOpenReportWizard: () => void;
  initialReportId?: string | null;
}

const STAGES: Array<{ id: IssueStatus; label: string; short: string }> = [
  { id: 'submitted', label: 'Submitted', short: '1. Logged' },
  { id: 'under_review', label: 'Under Review', short: '2. Review' },
  { id: 'confirmed', label: 'Confirmed', short: '3. Confirmed' },
  { id: 'repairing', label: 'Repairing', short: '4. Repair' },
  { id: 'resolved', label: 'Resolved', short: '5. Resolved' }
];

export const ReportsView: React.FC<ReportsViewProps> = ({
  onOpenReportWizard,
  initialReportId
}) => {
  const { currentArea } = useAreaStore();
  const {
    reports,
    selectedReport,
    isLoading,
    loadReports,
    selectReport,
    selectReportById,
    toggleSupport,
    toggleFollow,
    advanceStatus
  } = useReportStore();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | IssueStatus>('all');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    loadReports(currentArea.id);
  }, [currentArea.id, loadReports]);

  useEffect(() => {
    if (initialReportId) {
      selectReportById(initialReportId);
      setIsDetailModalOpen(true);
    }
  }, [initialReportId, selectReportById]);

  const filteredReports = reports.filter((r) => {
    if (activeTab === 'my' && !r.isSupportedByMe && !r.isFollowedByMe) return false;
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (
      searchTerm &&
      !r.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !r.typeName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !r.streetLocation.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !r.description.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleOpenDetail = (report: IssueReport) => {
    selectReport(report);
    setIsDetailModalOpen(true);
  };

  const handleToggleSupport = async (reportId: string) => {
    await toggleSupport(reportId);
    showToast({
      type: 'success',
      title: 'Support Updated',
      message: 'Your status has been updated on this ticket.'
    });
  };

  const handleToggleFollow = async (reportId: string) => {
    await toggleFollow(reportId);
    showToast({
      type: 'info',
      title: 'Follow Status Changed',
      message: 'You will receive notifications on progress updates.'
    });
  };

  const handleSimulateNextStage = async () => {
    if (!selectedReport) return;
    const stageIndex = STAGES.findIndex((s) => s.id === selectedReport.status);
    if (stageIndex < STAGES.length - 1) {
      const nextStage = STAGES[stageIndex + 1].id;
      const notes: Record<IssueStatus, string> = {
        submitted: 'Ticket registered.',
        under_review: 'Technical dispatcher assigned job to Depot 3 Rapid Response Team.',
        confirmed: 'Hydraulic pressure drop verified by scada telemetry.',
        repairing: 'Excavation completed and replacement steel pipe section welded.',
        resolved: 'System pressure back to 4.2 bar. Water clarity verified.'
      };
      await advanceStatus(selectedReport.id, nextStage, notes[nextStage]);
      showToast({
        type: 'success',
        title: 'Stage Advanced (Simulation)',
        message: `Ticket is now marked as ${STAGES[stageIndex + 1].label}.`
      });
    }
  };

  const getStatusBadge = (status: IssueStatus) => {
    switch (status) {
      case 'submitted':
        return <Badge variant="neutral">1. SUBMITTED</Badge>;
      case 'under_review':
        return <Badge variant="info">2. UNDER REVIEW</Badge>;
      case 'confirmed':
        return <Badge variant="warning">3. CONFIRMED</Badge>;
      case 'repairing':
        return <Badge variant="danger" pulse>4. REPAIRING</Badge>;
      case 'resolved':
        return <Badge variant="success">5. RESOLVED</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-950 tracking-tight flex items-center gap-2.5">
            <AlertTriangle className="w-6 h-6 text-blue-600" />
            Active Issues & Fault Tracker
          </h1>
          <p className="text-sm text-slate-700 font-medium mt-1">
            Community reported pipe bursts, low pressure zones, and real-time repair progress in {currentArea.name}.
          </p>
        </div>

        <Button
          variant="primary"
          leftIcon={<PlusCircle className="w-4 h-4" />}
          onClick={onOpenReportWizard}
          className="self-start sm:self-auto"
        >
          Report New Fault
        </Button>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-4 text-sm font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`pb-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'all'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-700 hover:text-slate-950'
            }`}
          >
            All Ward Issues ({reports.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('my')}
            className={`pb-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'my'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-700 hover:text-slate-950'
            }`}
          >
            My Followed Reports
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2">
          <div className="w-48 sm:w-64">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search reference #, street..."
              leftIcon={<Search className="w-3.5 h-3.5" />}
            />
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
            {(['all', 'repairing', 'confirmed', 'resolved'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                className={`px-2.5 py-1.5 rounded-lg capitalize transition-colors cursor-pointer ${
                  statusFilter === s
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReports.length === 0 ? (
          <div className="col-span-2">
            <Card className="p-12 text-center text-slate-700 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-950">No Issues Reported</h3>
              <p className="text-xs max-w-sm mx-auto font-medium text-slate-700">
                No active water faults match your search or filter in this area.
              </p>
            </Card>
          </div>
        ) : (
          filteredReports.map((report) => {
            const currentStageIndex = STAGES.findIndex((s) => s.id === report.status);

            return (
              <Card
                key={report.id}
                variant="interactive"
                className="p-5 flex flex-col justify-between group"
                onClick={() => handleOpenDetail(report)}
              >
                <div className="space-y-3.5">
                  {/* Top: Reference Number + Status Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-black text-blue-700 tracking-wide">
                      #{report.referenceNumber}
                    </span>
                    {getStatusBadge(report.status)}
                  </div>

                  {/* Title & Street */}
                  <div>
                    <h3 className="text-base font-bold text-slate-950">
                      {report.typeName}
                    </h3>
                    <p className="text-xs text-slate-700 flex items-center gap-1.5 mt-1 font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{report.streetLocation}</span>
                    </p>
                  </div>

                  {/* Description snippet */}
                  <p className="text-xs text-slate-800 font-medium line-clamp-2 leading-relaxed">
                    {report.description}
                  </p>

                  {/* 5-Stage Mini Stepper */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[10px] text-slate-700 font-bold">
                      <span>Submitted</span>
                      <span>Review</span>
                      <span>Confirmed</span>
                      <span>Repairing</span>
                      <span>Done</span>
                    </div>
                    <div className="grid grid-cols-5 gap-1">
                      {STAGES.map((s, idx) => (
                        <div
                          key={s.id}
                          className={`h-1.5 rounded-full ${
                            idx <= currentStageIndex
                              ? report.status === 'resolved'
                                ? 'bg-emerald-600'
                                : 'bg-blue-600'
                              : 'bg-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Bar */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-700">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <Users className="w-3.5 h-3.5 text-blue-600" />
                    <span>{report.affectedPeopleCount} people affected</span>
                  </div>

                  <span className="text-blue-700 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    View Progress <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Detailed Issue Modal / Drawer */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={selectedReport ? `Issue #${selectedReport.referenceNumber}` : 'Issue Details'}
        description={selectedReport ? `${selectedReport.typeName} — ${selectedReport.areaName}` : ''}
        maxWidth="xl"
      >
        {selectedReport && (
          <div className="space-y-6">
            {/* Status Header Banner */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-700 block">
                  Current Lifecycle State
                </span>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusBadge(selectedReport.status)}
                  <span className="text-xs text-slate-700 font-medium">
                    Priority: <strong className="uppercase text-slate-950 font-bold">{selectedReport.urgency}</strong>
                  </span>
                </div>
              </div>

              {selectedReport.estimatedResolution && (
                <div className="text-left sm:text-right">
                  <span className="text-[10px] font-bold uppercase text-slate-700 block">
                    Estimated Restoration
                  </span>
                  <span className="text-xs font-black text-slate-950 mt-1 block">
                    {selectedReport.estimatedResolution}
                  </span>
                </div>
              )}
            </div>

            {/* 5-Step Progress Timeline */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
                Municipal Repair Lifecycle
              </h4>
              <div className="relative pl-6 border-l-2 border-slate-200 space-y-4">
                {selectedReport.timeline.map((event, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-blue-600 ring-4 ring-white" />
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-950">
                          {event.title}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-slate-700">
                          {event.timestamp}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-slate-800 mt-0.5 leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Technician Notes if any */}
            {selectedReport.technicianNotes && (
              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-blue-950">
                  <Wrench className="w-4 h-4 text-blue-600" />
                  <span>Depot Technician Log</span>
                </div>
                <p className="text-blue-900 font-medium leading-relaxed">
                  {selectedReport.technicianNotes}
                </p>
              </div>
            )}

            {/* Location & Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-700 block mb-1">Street Address:</span>
                <span className="text-slate-950 font-semibold">{selectedReport.streetLocation}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-700 block mb-1">Logged Date:</span>
                <span className="text-slate-950 font-semibold">
                  {new Date(selectedReport.createdAt).toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>

            {/* Interactive Actions (Support + Follow + Admin Simulation) */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant={selectedReport.isSupportedByMe ? 'primary' : 'outline'}
                  leftIcon={<Users className="w-4 h-4" />}
                  onClick={() => handleToggleSupport(selectedReport.id)}
                >
                  {selectedReport.isSupportedByMe ? 'Supported (+1 Added)' : 'I’m Affected (+1)'} ({selectedReport.affectedPeopleCount})
                </Button>

                <Button
                  size="sm"
                  variant={selectedReport.isFollowedByMe ? 'secondary' : 'outline'}
                  leftIcon={<Bell className="w-4 h-4" />}
                  onClick={() => handleToggleFollow(selectedReport.id)}
                >
                  {selectedReport.isFollowedByMe ? 'Following Updates' : 'Follow'}
                </Button>
              </div>

              {/* Simulation button for demoing the full backend workflow */}
              {selectedReport.status !== 'resolved' && (
                <button
                  type="button"
                  onClick={handleSimulateNextStage}
                  className="text-xs text-blue-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  title="Simulate municipal depot advancing this ticket to next repair stage"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Advance Repair Stage
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
