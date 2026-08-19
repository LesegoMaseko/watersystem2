import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  Waves,
  MessageSquare,
  AlertTriangle,
  Bell,
  User,
  PlusCircle,
  MapPin,
  Home,
  Briefcase,
  Heart,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { NavTab } from './BottomNavigation';
import { useAreaStore } from '../../store/area.store';
import { useNotificationStore } from '../../store/notification.store';
import { useReportStore } from '../../store/report.store';
import { Button } from '../ui/button';

interface DesktopSidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenReportWizard: () => void;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  currentTab,
  onSelectTab,
  onOpenReportWizard
}) => {
  const { currentArea, savedAreas, allAreas, setCurrentArea, setIsAreaSelectorOpen } = useAreaStore();
  const { unreadCount } = useNotificationStore();
  const { myReportsCount } = useReportStore();

  const mainNav = [
    { id: 'dashboard' as NavTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'schedule' as NavTab, label: 'Water Schedule', icon: CalendarDays },
    { id: 'reservoirs' as NavTab, label: 'Reservoir Monitor', icon: Waves },
    { id: 'community' as NavTab, label: 'Community Feed', icon: MessageSquare },
    { id: 'reports' as NavTab, label: 'Report & Issues', icon: AlertTriangle, badge: myReportsCount },
    { id: 'notifications' as NavTab, label: 'Notifications', icon: Bell, badge: unreadCount },
    { id: 'profile' as NavTab, label: 'Profile & Settings', icon: User }
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-white border-r border-slate-200 shrink-0 h-[calc(100vh-5rem)] sticky top-20 overflow-y-auto">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-600/20">
            <Waves className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-950">
            WaterWatch
          </span>
        </div>
        <p className="text-[10px] uppercase tracking-widest font-bold text-slate-700 mt-1">
          Johannesburg Metro
        </p>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 p-4 space-y-1.5">
        {mainNav.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-colors cursor-pointer ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-bold shadow-xs'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950 font-semibold'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    isActive ? 'bg-blue-600' : 'bg-transparent'
                  }`}
                />
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-blue-600' : 'text-slate-600'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.id === 'notifications'
                      ? 'bg-rose-600 text-white'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Quick Switch Saved Areas */}
        <div className="pt-4 mt-2 border-t border-slate-100">
          <div className="flex items-center justify-between px-2 mb-2">
            <p className="text-[10px] uppercase font-bold text-slate-700 tracking-widest">
              My Locations
            </p>
            <button
              type="button"
              onClick={() => setIsAreaSelectorOpen(true)}
              className="text-[10px] text-blue-700 hover:underline font-bold uppercase tracking-wider cursor-pointer"
            >
              Manage
            </button>
          </div>

          <div className="space-y-1">
            {savedAreas.slice(0, 3).map((saved) => {
              const area = allAreas.find((a) => a.id === saved.areaId);
              if (!area) return null;
              const isSelected = currentArea.id === area.id;

              return (
                <button
                  key={saved.id}
                  type="button"
                  onClick={() => setCurrentArea(area)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-slate-100 font-bold text-slate-950'
                      : 'text-slate-700 hover:text-slate-950 hover:bg-slate-50 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className={isSelected ? 'text-blue-600' : 'text-slate-500'}>
                      <MapPin className="w-3.5 h-3.5" />
                    </span>
                    <span className="truncate">{saved.label}</span>
                  </div>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Bottom Report CTA Bright Card */}
      <div className="p-4 lg:p-5 mt-auto border-t border-slate-100">
        <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4 text-slate-950 shadow-2xs">
          <p className="text-[10px] uppercase font-bold tracking-widest text-blue-700 mb-1">
            Report Fault
          </p>
          <p className="text-xs font-bold text-slate-900 mb-3 leading-snug">
            Found a burst pipe or leak near you?
          </p>
          <button
            type="button"
            onClick={onOpenReportWizard}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 cursor-pointer transition-all active:scale-[0.98]"
          >
            + New Fault Report
          </button>
        </div>
      </div>
    </aside>
  );
};
