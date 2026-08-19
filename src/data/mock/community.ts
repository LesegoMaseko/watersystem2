import { CommunityPost } from '../../types';

export const MOCK_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post-001',
    author: {
      name: 'Joburg Water Control Centre',
      isOfficial: true,
      badge: 'Official Entity'
    },
    areaId: 'melville-brixton-jhb',
    areaName: 'Melville, Brixton & Auckland Park',
    category: 'official',
    title: 'Urgent Update: Caroline Street 300mm Pipeline Repair Status',
    message: 'Technical teams are actively welding the replacement sleeve on the Caroline St trunk line. Three roaming water tankers have been stationed at Brixton Primary School, UJ Kingsway Campus Gate 2, and 7th St Melville Plaza. Estimated full restoration 18:30 today.',
    createdAt: '2026-08-18T07:45:00Z',
    helpfulCount: 84,
    isHelpfulByMe: true,
    commentsCount: 14,
    isPinned: true,
    tags: ['EmergencyOutage', 'TankersDispatched', 'BrixtonTower'],
    comments: [
      {
        id: 'c-1',
        author: 'Cllr. Mark van der Merwe',
        isOfficial: true,
        message: 'I am on site with the Depot 3 engineers. The excavation is finished and backfilling will commence after pressure tests at 16:00.',
        createdAt: '2026-08-18T07:55:00Z'
      },
      {
        id: 'c-2',
        author: 'Nomsa Dlamini (Resident)',
        isOfficial: false,
        message: 'Can confirm water tanker has arrived at Brixton Primary School. Line is orderly. Please bring clean 20L containers.',
        createdAt: '2026-08-18T08:05:00Z'
      },
      {
        id: 'c-3',
        author: 'Keagan Pillay',
        isOfficial: false,
        message: 'Thank you for the prompt tanker deployment! Appreciate the live updates.',
        createdAt: '2026-08-18T08:12:00Z'
      }
    ]
  },
  {
    id: 'post-002',
    author: {
      name: 'Joburg Water Planned Works',
      isOfficial: true,
      badge: 'Official Entity'
    },
    areaId: 'sandton-jhb',
    areaName: 'Sandton & Morningside',
    category: 'official',
    title: 'Notice: Scheduled 9-Hour Water Shutdown Tomorrow (19 Aug)',
    message: 'Please be advised of scheduled infrastructure upgrades on Rivonia Road tomorrow, 19 August, between 08:00 and 17:00. Residents are encouraged to store potable water beforehand. Roaming tankers will be placed at Morningside Shopping Centre.',
    createdAt: '2026-08-18T06:00:00Z',
    helpfulCount: 62,
    isHelpfulByMe: false,
    commentsCount: 8,
    isPinned: true,
    tags: ['PlannedShutdown', 'Sandton', 'Morningside'],
    comments: [
      {
        id: 'c-4',
        author: 'Gareth Evans',
        isOfficial: false,
        message: 'Will the medical centre on Outspan road be connected to emergency water backup?',
        createdAt: '2026-08-18T06:30:00Z'
      },
      {
        id: 'c-5',
        author: 'Joburg Water Control Centre',
        isOfficial: true,
        message: 'Yes Gareth, healthcare facilities and retirement villages have priority dedicated tanker routes.',
        createdAt: '2026-08-18T06:45:00Z'
      }
    ]
  },
  {
    id: 'post-003',
    author: {
      name: 'Lerato Khumalo',
      isOfficial: false,
      badge: 'Community Contributor'
    },
    areaId: 'randburg-jhb',
    areaName: 'Randburg & Blairgowrie',
    category: 'reports',
    title: 'Water trickling back in lower Blairgowrie',
    message: 'Just checked my garden tap on Gordon Ave and pressure seems to be slowly recovering, though still cloudy with air bubbles. Remember to let taps run for 30 seconds before drinking.',
    createdAt: '2026-08-18T07:20:00Z',
    helpfulCount: 29,
    isHelpfulByMe: true,
    commentsCount: 5,
    tags: ['PressureCheck', 'Blairgowrie'],
    comments: [
      {
        id: 'c-6',
        author: 'David Chen',
        isOfficial: false,
        message: 'Still dry up on Conrad Drive high point, but good to hear lower section is filling!',
        createdAt: '2026-08-18T07:35:00Z'
      }
    ]
  },
  {
    id: 'post-004',
    author: {
      name: 'Roodepoort Ratepayers Association',
      isOfficial: false,
      badge: 'Civic Group'
    },
    areaId: 'roodepoort-jhb',
    areaName: 'Roodepoort & Florida',
    category: 'restored',
    title: 'Florida Lake water supply 100% normal',
    message: 'Confirmed with local depot that yesterday’s valve replacement on Goldman Street is complete and all district zone valves are fully reopened with 4.5 bar pressure.',
    createdAt: '2026-08-18T06:50:00Z',
    helpfulCount: 45,
    isHelpfulByMe: false,
    commentsCount: 3,
    tags: ['Restored', 'FloridaLake'],
    comments: [
      {
        id: 'c-7',
        author: 'Braam Schoeman',
        isOfficial: false,
        message: 'Great news, washing machines running again!',
        createdAt: '2026-08-18T07:10:00Z'
      }
    ]
  },
  {
    id: 'post-005',
    author: {
      name: 'Prof. Helen Mokoena',
      isOfficial: false,
      badge: 'Water Conservationist'
    },
    areaId: 'sandton-jhb',
    areaName: 'Sandton & Morningside',
    category: 'tips',
    title: '5 Best Practices to prepare for tomorrow’s scheduled outage',
    message: '1. Fill sealed food-grade 5L or 20L bottles today.\n2. Fill bathtubs/buckets with non-potable water for toilet flushing.\n3. Turn off your geyser (water heater) circuit breaker before 08:00 to prevent element burnout if air enters lines.\n4. Keep taps closed tightly so when pressure returns you avoid flooded basins.',
    createdAt: '2026-08-18T06:15:00Z',
    helpfulCount: 96,
    isHelpfulByMe: true,
    commentsCount: 11,
    tags: ['OutageTips', 'WaterSaving', 'GeyserSafety'],
    comments: []
  },
  {
    id: 'post-006',
    author: {
      name: 'Tshepo Sithole',
      isOfficial: false
    },
    areaId: 'soweto-jhb',
    areaName: 'Soweto (Diepkloof & Orlando)',
    category: 'questions',
    title: 'Anyone know why fire hydrant was opened near Diepkloof Square?',
    message: 'Saw municipality technician opening the hydrant on Immink Dr this morning. Is there maintenance happening?',
    createdAt: '2026-08-18T06:30:00Z',
    helpfulCount: 12,
    isHelpfulByMe: false,
    commentsCount: 2,
    tags: ['Question', 'Hydrant'],
    comments: [
      {
        id: 'c-8',
        author: 'Joburg Water Control Centre',
        isOfficial: true,
        message: 'Hi Tshepo, that was routine bi-monthly line scouring to clear sediment and maintain pressure balance. Flow stopped at 07:15.',
        createdAt: '2026-08-18T07:00:00Z'
      }
    ]
  }
];
