import React from 'react';
import { Home, Calendar, Waves, MessageSquare, Plus, User, AlertCircle } from 'lucide-react';
import { useReportStore } from '../../store/report.store';

export type NavTab = 'dashboard' | 'schedule' | 'reservoirs' | 'community' | 'reports' | 'notifications' | 'profile';

interface BottomNavigationProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenReportWizard: () => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentTab,
  onSelectTab,
  onOpenReportWizard
}) => {
  const myReportsCount = useReportStore((state) => state.myReportsCount);

  const navItems: Array<{
    id: NavTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }> = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'reservoirs', label: 'Reservoirs', icon: Waves },
    { id: 'community', label: 'Community', icon: MessageSquare },
    { id: 'reports', label: 'Issues', icon: AlertCircle, badge: myReportsCount },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <nav
      aria-label="Mobile navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-2 py-1.5 safe-area-pb shadow-lg"
    >
      <div className="flex items-center justify-around gap-1 relative">
        {navItems.slice(0, 3).map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative ${
                isActive
                  ? 'text-blue-700 font-bold'
                  : 'text-slate-700 hover:text-slate-950 font-semibold'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </button>
          );
        })}

        {/* Center Floating Plus Button for Instant Reporting */}
        <button
          type="button"
          onClick={onOpenReportWizard}
          className="flex flex-col items-center justify-center -mt-5 bg-blue-600 text-white rounded-full w-12 h-12 shadow-lg shadow-blue-600/30 border-2 border-white active:scale-95 transition-transform cursor-pointer"
          aria-label="Report water issue"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>

        {navItems.slice(3).map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative ${
                isActive
                  ? 'text-blue-700 font-bold'
                  : 'text-slate-700 hover:text-slate-950 font-semibold'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5 mb-0.5" />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1 -right-2 bg-blue-600 text-white text-[8px] font-bold px-1 rounded-full">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
