import { IssueReport, IssueStatus, IssueUrgency } from '../types';
import { MOCK_REPORTS } from '../data/mock/reports';

class ReportService {
  private reports: IssueReport[] = [...MOCK_REPORTS];

  async getReports(areaId?: string): Promise<IssueReport[]> {
    await new Promise((resolve) => setTimeout(resolve, 80));
    if (!areaId) return [...this.reports];
    return this.reports.filter((r) => r.areaId === areaId);
  }

  async getReportById(id: string): Promise<IssueReport | undefined> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return this.reports.find((r) => r.id === id || r.referenceNumber.toLowerCase() === id.toLowerCase());
  }

  async checkDuplicates(areaId: string, type: string, streetLocation: string): Promise<IssueReport[]> {
    await new Promise((resolve) => setTimeout(resolve, 60));
    const cleanStreet = streetLocation.toLowerCase().trim();

    return this.reports.filter((r) => {
      if (r.status === 'resolved') return false;
      const sameArea = r.areaId === areaId;
      const sameType = r.type === type;
      const locationOverlap =
        cleanStreet &&
        (r.streetLocation.toLowerCase().includes(cleanStreet) ||
          cleanStreet.split(' ').some((word) => word.length > 3 && r.streetLocation.toLowerCase().includes(word)));

      return sameArea && (sameType || locationOverlap);
    });
  }

  async createReport(params: {
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
  }): Promise<IssueReport> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const refCode = `WW-2026-${randomNum}`;

    const newReport: IssueReport = {
      id: `rep-${Date.now()}`,
      referenceNumber: refCode,
      type: params.type,
      typeName: params.typeName,
      areaId: params.areaId,
      areaName: params.areaName,
      streetLocation: params.streetLocation,
      description: params.description,
      urgency: params.urgency,
      status: 'submitted',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      affectedPeopleCount: 1,
      supportedByCount: 1,
      isSupportedByMe: true,
      isFollowedByMe: true,
      reporterName: params.reporterName || 'Resident',
      reporterPhone: params.reporterPhone,
      imageUrl: params.imageUrl,
      technicianNotes: 'Ticket received and queued for dispatch assessment.',
      timeline: [
        {
          status: 'submitted',
          title: 'Report Submitted',
          description: 'Logged via WaterWatch civic portal with location and contact details.',
          timestamp: 'Just now'
        }
      ]
    };

    this.reports.unshift(newReport);
    return newReport;
  }

  async toggleSupport(reportId: string): Promise<IssueReport | undefined> {
    const report = this.reports.find((r) => r.id === reportId);
    if (!report) return undefined;

    if (report.isSupportedByMe) {
      report.supportedByCount = Math.max(0, report.supportedByCount - 1);
      report.affectedPeopleCount = Math.max(1, report.affectedPeopleCount - 1);
      report.isSupportedByMe = false;
    } else {
      report.supportedByCount += 1;
      report.affectedPeopleCount += 1;
      report.isSupportedByMe = true;
    }
    report.updatedAt = new Date().toISOString();
    return { ...report };
  }

  async toggleFollow(reportId: string): Promise<IssueReport | undefined> {
    const report = this.reports.find((r) => r.id === reportId);
    if (!report) return undefined;
    report.isFollowedByMe = !report.isFollowedByMe;
    return { ...report };
  }

  async advanceReportStatus(reportId: string, nextStatus: IssueStatus, note: string): Promise<IssueReport | undefined> {
    const report = this.reports.find((r) => r.id === reportId);
    if (!report) return undefined;

    report.status = nextStatus;
    report.updatedAt = new Date().toISOString();
    report.technicianNotes = note;

    const titles: Record<IssueStatus, string> = {
      submitted: 'Report Submitted',
      under_review: 'Under Technical Review',
      confirmed: 'Fault Confirmed by Control Room',
      repairing: 'Repair Crew on Site',
      resolved: 'Repair Completed & Pressure Restored'
    };

    report.timeline.push({
      status: nextStatus,
      title: titles[nextStatus],
      description: note,
      timestamp: 'Just now'
    });

    return { ...report };
  }
}

export const reportService = new ReportService();
