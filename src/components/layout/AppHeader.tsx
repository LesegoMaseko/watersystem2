import React from 'react';
import { Droplets, MapPin, ChevronDown, Bell, Moon, Sun, PlusCircle, Radio } from 'lucide-react';
import { useAreaStore } from '../../store/area.store';
import { useNotificationStore } from '../../store/notification.store';
import { useUserStore } from '../../store/user.store';
import { useWaterStatus } from '../../hooks/use-water-status';
import { Button } from '../ui/button';

interface AppHeaderProps {
  onOpenReportModal: () => void;
  onNavigateToNotifications: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  onOpenReportModal,
  onNavigateToNotifications
}) => {
  const { currentArea, setIsAreaSelectorOpen } = useAreaStore();
  const { unreadCount, triggerSimulatedAlert } = useNotificationStore();
  const { profile } = useUserStore();
  const { status } = useWaterStatus();

  const getInitials = () => {
    if (!profile.name) return 'JD';
    const parts = profile.name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 h-20 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-4">
        {/* Left: Primary Area Indicator and Location Selector */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsAreaSelectorOpen(true)}
            className="flex items-center gap-3 p-1.5 rounded-2xl hover:bg-slate-100/80 transition-all text-left cursor-pointer group"
          >
            <div className="p-2.5 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors">
              <MapPin className="w-5 h-5 text-blue-600 transition-colors" />
            </div>
            <div>
              <p className="text-[11px] uppercase font-bold text-slate-700 tracking-wider leading-none mb-1">
                Primary Area
              </p>
              <h2 className="text-base sm:text-lg font-black text-slate-950 leading-none flex items-center gap-1.5">
                {currentArea.name}, Gauteng
                <ChevronDown className="w-4 h-4 text-slate-700 group-hover:text-slate-950 transition-transform" />
              </h2>
            </div>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Quick Simulation Trigger for testing alerts */}
          <button
            type="button"
            onClick={() => {
              triggerSimulatedAlert(
                'emergency',
                'Emergency Valve Isolation Notice',
                `Supply telemetry indicates pipe pressure drop near ${currentArea.suburb} Sector 2.`,
                currentArea.name
              );
            }}
            title="Simulate incoming municipal water alert"
            className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold text-slate-700 hover:text-blue-700 hover:bg-blue-50 transition-colors border border-slate-200 cursor-pointer shadow-2xs"
          >
            <Radio className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
            <span>Simulate Telemetry</span>
          </button>

          {/* Notifications with red dot badge */}
          <div className="relative">
            <button
              type="button"
              onClick={onNavigateToNotifications}
              className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
            </button>
            {unreadCount > 0 && (
              <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full" />
            )}
          </div>

          {/* User Initials Avatar Circle */}
          <div
            className="w-10 h-10 bg-blue-100 text-blue-700 font-bold rounded-full flex items-center justify-center text-sm shadow-xs select-none"
            title={profile.name || 'Resident'}
          >
            {getInitials()}
          </div>
        </div>
      </div>
    </header>
  );
};
