import { create } from 'zustand';
import { NotificationItem, NotificationType } from '../types';
import { notificationService } from '../services/notification.service';

interface NotificationStoreState {
  notifications: NotificationItem[];
  unreadCount: number;
  isLoading: boolean;
  activeFilter: 'all' | NotificationType;

  loadNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  setActiveFilter: (filter: 'all' | NotificationType) => void;
  triggerSimulatedAlert: (type: NotificationType, title: string, message: string, areaName: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationStoreState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  activeFilter: 'all',

  loadNotifications: async () => {
    set({ isLoading: true });
    try {
      const list = await notificationService.getNotifications();
      const unread = list.filter((n) => !n.isRead).length;
      set({ notifications: list, unreadCount: unread });
    } finally {
      set({ isLoading: false });
    }
  },

  markAsRead: async (id: string) => {
    await notificationService.markAsRead(id);
    const updated = get().notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    const unread = updated.filter((n) => !n.isRead).length;
    set({ notifications: updated, unreadCount: unread });
  },

  markAllAsRead: async () => {
    await notificationService.markAllAsRead();
    const updated = get().notifications.map((n) => ({ ...n, isRead: true }));
    set({ notifications: updated, unreadCount: 0 });
  },

  deleteNotification: async (id: string) => {
    await notificationService.deleteNotification(id);
    const updated = get().notifications.filter((n) => n.id !== id);
    const unread = updated.filter((n) => !n.isRead).length;
    set({ notifications: updated, unreadCount: unread });
  },

  setActiveFilter: (filter) => set({ activeFilter: filter }),

  triggerSimulatedAlert: async (type, title, message, areaName) => {
    const notif = await notificationService.createNotification({
      type,
      title,
      message,
      areaId: 'custom',
      areaName,
      urgency: type === 'emergency' ? 'critical' : 'high'
    });
    const updated = [notif, ...get().notifications];
    set({ notifications: updated, unreadCount: get().unreadCount + 1 });
  }
}));
