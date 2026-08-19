import { IssueReport } from '../../types';

export const MOCK_REPORTS: IssueReport[] = [
  {
    id: 'rep-001',
    referenceNumber: 'WW-2026-45821',
    type: 'burst_pipe',
    typeName: 'Burst Pipe',
    areaId: 'melville-brixton-jhb',
    areaName: 'Melville, Brixton & Auckland Park',
    streetLocation: 'Corner Caroline & High Street, Brixton',
    description: 'Significant water pouring across Caroline St near Brixton Primary. High volume leak causing flooded driveway and street cavitation.',
    urgency: 'critical',
    status: 'repairing',
    createdAt: '2026-08-18T05:15:00Z',
    updatedAt: '2026-08-18T07:45:00Z',
    estimatedResolution: 'Today, 18:30',
    affectedPeopleCount: 1420,
    supportedByCount: 38,
    isSupportedByMe: true,
    isFollowedByMe: true,
    reporterName: 'Thabo M.',
    reporterPhone: '+27 82 459 1102',
    technicianNotes: 'Joburg Water team on site with excavator. Isolation valves closed on section 4B. Pipe replacement in progress.',
    timeline: [
      {
        status: 'submitted',
        title: 'Report Submitted',
        description: 'Resident report logged with location coordinates and photo evidence.',
        timestamp: '18 Aug, 05:15'
      },
      {
        status: 'under_review',
        title: 'Under Review',
        description: 'Control room validated incident and escalated to Depot 3 Rapid Response Team.',
        timestamp: '18 Aug, 05:35'
      },
      {
        status: 'confirmed',
        title: 'Incident Confirmed',
        description: 'Joburg Water technical assessment confirmed 300mm pipe burst.',
        timestamp: '18 Aug, 06:10'
      },
      {
        status: 'repairing',
        title: 'Repair Underway',
        description: 'Excavation team on site. New pipe sleeve fitted. Pressure testing pending.',
        timestamp: '18 Aug, 07:20'
      }
    ]
  },
  {
    id: 'rep-002',
    referenceNumber: 'WW-2026-45810',
    type: 'low_pressure',
    typeName: 'Low Pressure',
    areaId: 'randburg-jhb',
    areaName: 'Randburg & Blairgowrie',
    streetLocation: 'Conrad Drive & Susman Ave, Blairgowrie',
    description: 'Second-floor apartments have zero water pressure since 06:30 this morning. Taps only producing a slow trickle.',
    urgency: 'medium',
    status: 'confirmed',
    createdAt: '2026-08-18T06:40:00Z',
    updatedAt: '2026-08-18T07:30:00Z',
    estimatedResolution: 'Today, 15:00',
    affectedPeopleCount: 650,
    supportedByCount: 19,
    isSupportedByMe: false,
    isFollowedByMe: true,
    reporterName: 'Sarah K.',
    technicianNotes: 'Linden pump electrical system reset underway. Tanker positioned at Blairgowrie Rec Centre.',
    timeline: [
      {
        status: 'submitted',
        title: 'Report Submitted',
        description: 'Reported by local resident.',
        timestamp: '18 Aug, 06:40'
      },
      {
        status: 'under_review',
        title: 'Depot Dispatch',
        description: 'Telemetry alerts correlated with user report.',
        timestamp: '18 Aug, 07:05'
      },
      {
        status: 'confirmed',
        title: 'Confirmed by Depot',
        description: 'Linden reservoir pump trip verified by municipal telemetry.',
        timestamp: '18 Aug, 07:30'
      }
    ]
  },
  {
    id: 'rep-003',
    referenceNumber: 'WW-2026-45789',
    type: 'water_leak',
    typeName: 'Clean Water Leak',
    areaId: 'sandton-jhb',
    areaName: 'Sandton & Morningside',
    streetLocation: 'Rivonia Rd & Centre Rd, Morningside',
    description: 'Underground meter box leaking continuous stream of potable water into gutter for past 24 hours.',
    urgency: 'medium',
    status: 'under_review',
    createdAt: '2026-08-17T18:20:00Z',
    updatedAt: '2026-08-18T06:15:00Z',
    estimatedResolution: 'Tomorrow during planned maintenance',
    affectedPeopleCount: 120,
    supportedByCount: 7,
    isSupportedByMe: false,
    isFollowedByMe: false,
    reporterName: 'David N.',
    technicianNotes: 'Scheduled for repair during tomorrow’s planned Rivonia maintenance outage.',
    timeline: [
      {
        status: 'submitted',
        title: 'Report Submitted',
        description: 'Logged via WaterWatch community app.',
        timestamp: '17 Aug, 18:20'
      },
      {
        status: 'under_review',
        title: 'Queued for Scheduled Maintenance',
        description: 'Assigned job ticket #JW-88402 for tomorrow morning team.',
        timestamp: '18 Aug, 06:15'
      }
    ]
  },
  {
    id: 'rep-004',
    referenceNumber: 'WW-2026-45604',
    type: 'discoloured_water',
    typeName: 'Discoloured Water',
    areaId: 'roodepoort-jhb',
    areaName: 'Roodepoort & Florida',
    streetLocation: 'Rose Street & Goldman St, Florida',
    description: 'Brownish sediment in tap water after yesterday’s pipeline repair.',
    urgency: 'low',
    status: 'resolved',
    createdAt: '2026-08-17T16:30:00Z',
    updatedAt: '2026-08-18T07:00:00Z',
    estimatedResolution: 'Resolved',
    affectedPeopleCount: 210,
    supportedByCount: 14,
    isSupportedByMe: false,
    isFollowedByMe: false,
    reporterName: 'Annelize P.',
    technicianNotes: 'Hydrant line flushed at 06:45. Water quality sample cleared turbidity tests.',
    timeline: [
      {
        status: 'submitted',
        title: 'Report Submitted',
        description: 'Sediment report logged.',
        timestamp: '17 Aug, 16:30'
      },
      {
        status: 'confirmed',
        title: 'Depot Team Assigned',
        description: 'Scour valve flushing team dispatched.',
        timestamp: '17 Aug, 17:15'
      },
      {
        status: 'repairing',
        title: 'Main Line Flushing',
        description: 'Controlled hydrant flushing performed across Florida Lake precinct.',
        timestamp: '18 Aug, 06:45'
      },
      {
        status: 'resolved',
        title: 'Issue Resolved',
        description: 'Water clarity restored to SANS 241 drinking water standard.',
        timestamp: '18 Aug, 07:00'
      }
    ]
  },
  {
    id: 'rep-005',
    referenceNumber: 'WW-2026-45520',
    type: 'meter_problem',
    typeName: 'Damaged Water Meter',
    areaId: 'soweto-jhb',
    areaName: 'Soweto (Diepkloof & Orlando)',
    streetLocation: 'Zone 2, Diepkloof, near Community Hall',
    description: 'Cracked plastic smart meter cover overflowing onto sidewalk.',
    urgency: 'low',
    status: 'repairing',
    createdAt: '2026-08-17T11:00:00Z',
    updatedAt: '2026-08-18T07:10:00Z',
    estimatedResolution: 'Today, 14:00',
    affectedPeopleCount: 45,
    supportedByCount: 5,
    isSupportedByMe: false,
    isFollowedByMe: false,
    reporterName: 'Sipho Z.',
    timeline: [
      {
        status: 'submitted',
        title: 'Report Submitted',
        description: 'Meter fault reported.',
        timestamp: '17 Aug, 11:00'
      },
      {
        status: 'confirmed',
        title: 'Meter Team Dispatched',
        description: 'Smart meter replacement scheduled.',
        timestamp: '17 Aug, 14:00'
      },
      {
        status: 'repairing',
        title: 'Technician on Site',
        description: 'Installing replacement prepaid meter unit.',
        timestamp: '18 Aug, 07:10'
      }
    ]
  }
];
