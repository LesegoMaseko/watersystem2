import React, { useState } from 'react';
import {
  Bell,
  CheckCheck,
  Trash2,
  AlertTriangle,
  Waves,
  ShieldCheck,
  Clock,
  Radio,
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { NotificationItem, NotificationType } from '../../types';
import { useNotificationStore } from '../../store/notification.store';
import { useAreaStore } from '../../store/area.store';
import { useToast } from '../../hooks/use-toast';

interface NotificationsViewProps {
  onNavigateToOutage?: () => void;
  onNavigateToReports?: () => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  onNavigateToOutage,
  onNavigateToReports
}) => {
  const { currentArea } = useAreaStore();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    triggerSimulatedAlert
  } = useNotificationStore();
  const { showToast } = useToast();

  const [typeFilter, setTypeFilter] = useState<'all' | NotificationType>('all');

  const filteredNotifications = notifications.filter((n) => {
    if (typeFilter !== 'all' && n.type !== typeFilter) return false;
    return true;
  });

  const handleMarkAll = () => {
    markAllAsRead();
    showToast({
      type: 'info',
      title: 'All Marked as Read',
      message: 'Notifications cleared from unread status.'
    });
  };

  const handleSimulate = (type: NotificationType) => {
    const titles: Record<NotificationType, string> = {
      emergency: 'Emergency Valve Isolation Alert',
      outage: 'Scheduled Maintenance Advisory (Tomorrow)',
      community: 'Community Update from Councilor',
      report: 'Report #WW-2026-45821 Stage Update',
      official: 'Rand Water Planned Pipeline Shutdown'
    };

    triggerSimulatedAlert(
      type,
      titles[type],
      `Telemetry event dispatched for ${currentArea.suburb} zone.`,
      currentArea.name
    );

    showToast({
      type: 'success',
      title: 'Alert Dispatched',
      message: `Simulated notification sent to ${currentArea.name}.`
    });
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'emergency':
        return <AlertTriangle className="w-5 h-5 text-rose-600" />;
      case 'outage':
        return <Waves className="w-5 h-5 text-blue-600" />;
      case 'official':
        return <ShieldCheck className="w-5 h-5 text-blue-600" />;
      default:
        return <Bell className="w-5 h-5 text-amber-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-950 tracking-tight flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-blue-600" />
            Alerts & Push Notifications
          </h1>
          <p className="text-sm text-slate-700 font-medium mt-1">
            Real-time emergency broadcast announcements, repair updates, and reservoir alarms.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<CheckCheck className="w-4 h-4" />}
              onClick={handleMarkAll}
            >
              Mark All Read
            </Button>
          )}
        </div>
      </div>

      {/* Test / Simulation Bar */}
      <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-800">
          <Radio className="w-4 h-4 text-blue-600 animate-pulse" />
          <span>
            <strong className="text-slate-950">Simulate Live Broadcaster:</strong> Dispatch a simulated incident to test notifications.
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => handleSimulate('emergency')}
            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-rose-600 text-white hover:bg-rose-700 cursor-pointer"
          >
            Emergency Outage
          </button>
          <button
            type="button"
            onClick={() => handleSimulate('outage')}
            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
          >
            Scheduled Outage
          </button>
          <button
            type="button"
            onClick={() => handleSimulate('official')}
            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer"
          >
            Joburg Water Notice
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold self-start max-w-fit">
        {(['all', 'emergency', 'outage', 'report', 'official', 'community'] as const).map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setTypeFilter(filter)}
            className={`px-3 py-1.5 rounded-lg capitalize transition-colors cursor-pointer ${
              typeFilter === filter
                ? 'bg-white text-slate-950 shadow-xs'
                : 'text-slate-700 hover:text-slate-950'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card className="p-12 text-center text-slate-700 space-y-2">
            <Bell className="w-10 h-10 text-slate-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-950">All Caught Up</h3>
            <p className="text-xs max-w-sm mx-auto font-medium text-slate-700">
              No notifications matching your current filter. You’ll be alerted when water incidents occur.
            </p>
          </Card>
        ) : (
          filteredNotifications.map((item) => (
            <Card
              key={item.id}
              className={`p-4 sm:p-5 transition-all ${
                !item.isRead
                  ? 'bg-blue-50/50 border-blue-200 shadow-xs'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-slate-100 shrink-0">
                    {getIcon(item.type)}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-950">
                        {item.title}
                      </span>
                      {!item.isRead && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-800 font-medium leading-relaxed">
                      {item.message}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-600 pt-1">
                      {item.areaName && <span>{item.areaName}</span>}
                      <span>•</span>
                      <span>
                        {new Date(item.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {!item.isRead && (
                    <button
                      type="button"
                      onClick={() => markAsRead(item.id)}
                      className="p-1.5 text-slate-600 hover:text-blue-700 rounded-lg transition-colors cursor-pointer"
                      title="Mark as read"
                    >
                      <CheckCheck className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => deleteNotification(item.id)}
                    className="p-1.5 text-slate-600 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                    title="Delete notification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
