import { NotificationItem } from '../../types';

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'emergency',
    title: 'Emergency Outage Alert: Brixton & Auckland Park',
    message: 'Water supply interrupted due to burst 300mm pipe on Caroline St. Estimated restoration 18:30 today. 3 water tankers dispatched.',
    areaId: 'melville-brixton-jhb',
    areaName: 'Melville, Brixton & Auckland Park',
    timestamp: '2026-08-18T05:35:00Z',
    isRead: false,
    urgency: 'critical',
    reportId: 'rep-001'
  },
  {
    id: 'notif-2',
    type: 'outage',
    title: 'Scheduled Interruption Notice for Tomorrow',
    message: 'Planned maintenance in Sandton & Morningside on Wednesday 19 Aug from 08:00 to 17:00 for bulk valve connection.',
    areaId: 'sandton-jhb',
    areaName: 'Sandton & Morningside',
    timestamp: '2026-08-18T06:00:00Z',
    isRead: false,
    urgency: 'high'
  },
  {
    id: 'notif-3',
    type: 'report',
    title: 'Report Update: #WW-2026-45821 is Under Repair',
    message: 'Technical repair crew has arrived on site with replacement materials. Backfilling planned for 16:00.',
    areaId: 'melville-brixton-jhb',
    areaName: 'Melville, Brixton & Auckland Park',
    timestamp: '2026-08-18T07:25:00Z',
    isRead: true,
    urgency: 'medium',
    reportId: 'rep-001'
  },
  {
    id: 'notif-4',
    type: 'official',
    title: 'Linden Tower Low Pressure Alert',
    message: 'Randburg & Blairgowrie residents may experience low pressure during pump reset operations.',
    areaId: 'randburg-jhb',
    areaName: 'Randburg & Blairgowrie',
    timestamp: '2026-08-18T06:50:00Z',
    isRead: true,
    urgency: 'medium'
  },
  {
    id: 'notif-5',
    type: 'community',
    title: 'Water Tanker Deployed: Brixton Primary School',
    message: 'Nomsa confirmed water tanker is active and dispensing potable water at Brixton Primary School main gate.',
    areaId: 'melville-brixton-jhb',
    areaName: 'Melville, Brixton & Auckland Park',
    timestamp: '2026-08-18T08:05:00Z',
    isRead: true,
    urgency: 'low'
  }
];
