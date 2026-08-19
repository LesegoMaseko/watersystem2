import { NotificationItem, NotificationType } from '../types';
import { MOCK_NOTIFICATIONS } from '../data/mock/notifications';

class NotificationService {
  private notifications: NotificationItem[] = [...MOCK_NOTIFICATIONS];

  async getNotifications(): Promise<NotificationItem[]> {
    await new Promise((resolve) => setTimeout(resolve, 60));
    return [...this.notifications].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async markAsRead(id: string): Promise<NotificationItem | undefined> {
    const notif = this.notifications.find((n) => n.id === id);
    if (!notif) return undefined;
    notif.isRead = true;
    return { ...notif };
  }

  async markAllAsRead(): Promise<void> {
    this.notifications.forEach((n) => {
      n.isRead = true;
    });
  }

  async deleteNotification(id: string): Promise<void> {
    this.notifications = this.notifications.filter((n) => n.id !== id);
  }

  async createNotification(params: {
    type: NotificationType;
    title: string;
    message: string;
    areaId: string;
    areaName: string;
    urgency?: NotificationItem['urgency'];
    reportId?: string;
  }): Promise<NotificationItem> {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      type: params.type,
      title: params.title,
      message: params.message,
      areaId: params.areaId,
      areaName: params.areaName,
      timestamp: new Date().toISOString(),
      isRead: false,
      urgency: params.urgency || 'medium',
      reportId: params.reportId
    };

    this.notifications.unshift(newNotif);
    return newNotif;
  }
}

export const notificationService = new NotificationService();
