/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppHeader } from './components/layout/AppHeader';
import { EmergencyBanner } from './components/layout/EmergencyBanner';
import { DesktopSidebar } from './components/layout/DesktopSidebar';
import { BottomNavigation, NavTab } from './components/layout/BottomNavigation';
import { AreaSelectorModal } from './components/layout/AreaSelectorModal';
import { ReportWizardModal } from './components/reports/ReportWizardModal';
import { HomeDashboard } from './components/dashboard/HomeDashboard';
import { ScheduleView } from './components/schedule/ScheduleView';
import { ReservoirsView } from './components/reservoirs/ReservoirsView';
import { CommunityView } from './components/community/CommunityView';
import { ReportsView } from './components/reports/ReportsView';
import { NotificationsView } from './components/notifications/NotificationsView';
import { ProfileView } from './components/profile/ProfileView';
import { useUserStore } from './store/user.store';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [isReportWizardOpen, setIsReportWizardOpen] = useState(false);
  const [trackedReportId, setTrackedReportId] = useState<string | null>(null);

  // Enforce bright light mode across the entire app
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  const handleTrackReport = (reportId: string) => {
    setTrackedReportId(reportId);
    setCurrentTab('reports');
  };

  const renderActiveView = () => {
    switch (currentTab) {
      case 'dashboard':
        return (
          <HomeDashboard
            onSelectTab={setCurrentTab}
            onOpenReportWizard={() => setIsReportWizardOpen(true)}
            onTrackReport={handleTrackReport}
          />
        );
      case 'schedule':
        return <ScheduleView />;
      case 'reservoirs':
        return <ReservoirsView />;
      case 'community':
        return <CommunityView />;
      case 'reports':
        return (
          <ReportsView
            onOpenReportWizard={() => setIsReportWizardOpen(true)}
            initialReportId={trackedReportId}
          />
        );
      case 'notifications':
        return (
          <NotificationsView
            onNavigateToOutage={() => setCurrentTab('schedule')}
            onNavigateToReports={() => setCurrentTab('reports')}
          />
        );
      case 'profile':
        return <ProfileView />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Emergency Global Alert Banner */}
      <EmergencyBanner
        onNavigateToSchedule={() => setCurrentTab('schedule')}
        onNavigateToReports={() => setCurrentTab('reports')}
      />

      {/* Main Top Header */}
      <AppHeader
        onOpenReportModal={() => setIsReportWizardOpen(true)}
        onNavigateToNotifications={() => setCurrentTab('notifications')}
      />

      {/* Main App Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar Navigation */}
        <DesktopSidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          onOpenReportWizard={() => setIsReportWizardOpen(true)}
        />

        {/* Dynamic Main Content Container */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 overflow-y-auto max-w-5xl">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNavigation
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenReportWizard={() => setIsReportWizardOpen(true)}
      />

      {/* Modal Dialogs */}
      <AreaSelectorModal />
      <ReportWizardModal
        isOpen={isReportWizardOpen}
        onClose={() => setIsReportWizardOpen(false)}
        onTrackReport={handleTrackReport}
      />
    </div>
  );
}
