export type WaterSupplyStatus = 'available' | 'warning' | 'outage';
export type PressureLevel = 'normal' | 'low' | 'zero';
export type OutageType = 'planned' | 'emergency';
export type OutageStatus = 'upcoming' | 'active' | 'resolved';
export type ReservoirStatus = 'normal' | 'warning' | 'critical';
export type IssueStatus = 'submitted' | 'under_review' | 'confirmed' | 'repairing' | 'resolved';
export type IssueUrgency = 'low' | 'medium' | 'high' | 'critical';
export type NotificationType = 'outage' | 'emergency' | 'official' | 'community' | 'report';
export type CommunityCategory = 'all' | 'official' | 'reports' | 'restored' | 'questions' | 'tips';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Area {
  id: string;
  name: string;
  suburb: string;
  city: string;
  province: string;
  wardNumber: number;
  reservoirId: string;
  coordinates: Coordinates;
  postalCode?: string;
  populationEstimate?: number;
}

export interface WaterStatus {
  areaId: string;
  status: WaterSupplyStatus;
  message: string;
  pressureLevel: PressureLevel;
  updatedAt: string;
  estimatedRestoration?: string;
  outageStartTime?: string;
  sourceReservoirName: string;
  sourceReservoirLevel: number;
  affectedStreets?: string[];
  activeIssuesCount: number;
  tankerDispatched: boolean;
  tankerLocations?: string[];
  reason?: string;
}

export interface Outage {
  id: string;
  areaId: string;
  areaName: string;
  suburb: string;
  type: OutageType;
  status: OutageStatus;
  startTime: string;
  endTime?: string;
  estimatedRestoration?: string;
  description: string;
  reason: string;
  affectedStreets: string[];
  waterTankersLocation?: string[];
  technicianStatus: 'dispatched' | 'on_site' | 'repairing' | 'testing' | 'resolved';
  severity: 'low' | 'medium' | 'high' | 'critical';
  referenceCode: string;
}

export interface ReservoirHistoryPoint {
  date: string;
  level: number;
}

export interface Reservoir {
  id: string;
  name: string;
  level: number; // percentage 0 - 100
  status: ReservoirStatus;
  trend: number; // percentage change in 24h
  capacityML: number; // Megalitres
  inflowRate: string; // e.g. "450 L/s"
  outflowRate: string; // e.g. "480 L/s"
  updatedAt: string;
  fedAreas: string[];
  municipality: string;
  historicalData: ReservoirHistoryPoint[];
}

export interface IssueTimelineEvent {
  status: IssueStatus;
  title: string;
  description: string;
  timestamp: string;
}

export interface IssueReport {
  id: string;
  referenceNumber: string;
  type: 'burst_pipe' | 'no_water' | 'low_pressure' | 'water_leak' | 'discoloured_water' | 'meter_problem' | 'open_hydrant' | 'other';
  typeName: string;
  areaId: string;
  areaName: string;
  streetLocation: string;
  description: string;
  urgency: IssueUrgency;
  status: IssueStatus;
  createdAt: string;
  updatedAt: string;
  estimatedResolution?: string;
  affectedPeopleCount: number;
  supportedByCount: number;
  isSupportedByMe?: boolean;
  isFollowedByMe?: boolean;
  imageUrl?: string;
  reporterName?: string;
  reporterPhone?: string;
  technicianNotes?: string;
  timeline: IssueTimelineEvent[];
  coordinates?: Coordinates;
}

export interface CommunityComment {
  id: string;
  author: string;
  avatar?: string;
  isOfficial?: boolean;
  message: string;
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  author: {
    name: string;
    avatar?: string;
    isOfficial?: boolean;
    badge?: string;
  };
  areaId: string;
  areaName: string;
  category: CommunityCategory;
  title: string;
  message: string;
  createdAt: string;
  helpfulCount: number;
  isHelpfulByMe?: boolean;
  commentsCount: number;
  comments: CommunityComment[];
  tags?: string[];
  imageUrl?: string;
  isPinned?: boolean;
}

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  areaId: string;
  areaName: string;
  timestamp: string;
  isRead: boolean;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  actionUrl?: string;
  reportId?: string;
}

export interface SavedArea {
  id: string;
  areaId: string;
  label: string; // "Home", "Work", "Parents", "Office"
  icon: 'home' | 'briefcase' | 'heart' | 'map-pin';
  customName?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  primaryAreaId: string;
  savedAreas: SavedArea[];
  notificationPreferences: {
    outageAlerts: boolean;
    emergencyAlerts: boolean;
    communityUpdates: boolean;
    reportUpdates: boolean;
    tankerAlerts: boolean;
  };
  theme: 'light' | 'dark' | 'system';
}

export interface TimelineSlot {
  hour: number;
  timeLabel: string;
  status: WaterSupplyStatus;
  description: string;
  pressure: PressureLevel;
}
