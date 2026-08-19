import { create } from 'zustand';
import { IssueReport, IssueStatus, IssueUrgency } from '../types';
import { reportService } from '../services/report.service';

interface ReportStoreState {
  reports: IssueReport[];
  selectedReport: IssueReport | null;
  isLoading: boolean;
  searchFilter: string;
  statusFilter: 'all' | IssueStatus;
  myReportsCount: number;

  loadReports: (areaId?: string) => Promise<void>;
  selectReport: (report: IssueReport | null) => void;
  selectReportById: (id: string) => Promise<void>;
  toggleSupport: (reportId: string) => Promise<void>;
  toggleFollow: (reportId: string) => Promise<void>;
  submitReport: (params: {
    type: IssueReport['type'];
    typeName: string;
    areaId: string;
    areaName: string;
    streetLocation: string;
    description: string;
    urgency: IssueUrgency;
    reporterName?: string;
    reporterPhone?: string;
    imageUrl?: string;
  }) => Promise<IssueReport>;
  advanceStatus: (reportId: string, nextStatus: IssueStatus, note: string) => Promise<void>;
  setSearchFilter: (query: string) => void;
  setStatusFilter: (status: 'all' | IssueStatus) => void;
}

export const useReportStore = create<ReportStoreState>((set, get) => ({
  reports: [],
  selectedReport: null,
  isLoading: false,
  searchFilter: '',
  statusFilter: 'all',
  myReportsCount: 1,

  loadReports: async (areaId?: string) => {
    set({ isLoading: true });
    try {
      const list = await reportService.getReports(areaId);
      const myCount = list.filter((r) => r.isSupportedByMe || r.isFollowedByMe).length;
      set({ reports: list, myReportsCount: myCount });
    } finally {
      set({ isLoading: false });
    }
  },

  selectReport: (report) => set({ selectedReport: report }),

  selectReportById: async (id: string) => {
    set({ isLoading: true });
    try {
      const report = await reportService.getReportById(id);
      set({ selectedReport: report || null });
    } finally {
      set({ isLoading: false });
    }
  },

  toggleSupport: async (reportId: string) => {
    const updated = await reportService.toggleSupport(reportId);
    if (updated) {
      set((state) => ({
        reports: state.reports.map((r) => (r.id === reportId ? updated : r)),
        selectedReport: state.selectedReport?.id === reportId ? updated : state.selectedReport
      }));
    }
  },

  toggleFollow: async (reportId: string) => {
    const updated = await reportService.toggleFollow(reportId);
    if (updated) {
      set((state) => ({
        reports: state.reports.map((r) => (r.id === reportId ? updated : r)),
        selectedReport: state.selectedReport?.id === reportId ? updated : state.selectedReport
      }));
    }
  },

  submitReport: async (params) => {
    set({ isLoading: true });
    try {
      const created = await reportService.createReport(params);
      set((state) => ({
        reports: [created, ...state.reports],
        selectedReport: created,
        myReportsCount: state.myReportsCount + 1
      }));
      return created;
    } finally {
      set({ isLoading: false });
    }
  },

  advanceStatus: async (reportId, nextStatus, note) => {
    const updated = await reportService.advanceReportStatus(reportId, nextStatus, note);
    if (updated) {
      set((state) => ({
        reports: state.reports.map((r) => (r.id === reportId ? updated : r)),
        selectedReport: state.selectedReport?.id === reportId ? updated : state.selectedReport
      }));
    }
  },

  setSearchFilter: (query) => set({ searchFilter: query }),
  setStatusFilter: (status) => set({ statusFilter: status })
}));
