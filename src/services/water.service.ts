import { Outage, TimelineSlot, WaterStatus } from '../types';
import { MOCK_OUTAGES, MOCK_WATER_STATUSES } from '../data/mock/outages';

class WaterService {
  private outages: Outage[] = [...MOCK_OUTAGES];
  private waterStatuses: Record<string, WaterStatus> = { ...MOCK_WATER_STATUSES };

  async getWaterStatus(areaId: string): Promise<WaterStatus> {
    await new Promise((resolve) => setTimeout(resolve, 80));
    if (this.waterStatuses[areaId]) {
      return this.waterStatuses[areaId];
    }
    // Fallback default status
    return {
      areaId,
      status: 'available',
      message: 'Water supply is operating under normal operating conditions.',
      pressureLevel: 'normal',
      updatedAt: new Date().toISOString(),
      sourceReservoirName: 'Municipal Bulk Supply',
      sourceReservoirLevel: 70,
      activeIssuesCount: 0,
      tankerDispatched: false,
    };
  }

  async getOutages(areaId?: string): Promise<Outage[]> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    if (!areaId) return this.outages;
    return this.outages.filter((o) => o.areaId === areaId);
  }

  async getOutageById(id: string): Promise<Outage | undefined> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return this.outages.find((o) => o.id === id);
  }

  async getTodayTimeline(areaId: string): Promise<TimelineSlot[]> {
    const status = await this.getWaterStatus(areaId);
    const slots: TimelineSlot[] = [];

    // Generate 24 hours timeline based on current status and outages
    for (let hour = 0; hour < 24; hour++) {
      const timeLabel = `${hour.toString().padStart(2, '0')}:00`;
      let hourStatus = status.status;
      let desc = 'Water Available — Normal Pressure';
      let pressure = status.pressureLevel;

      if (areaId === 'melville-brixton-jhb') {
        if (hour >= 5 && hour < 19) {
          hourStatus = 'outage';
          desc = 'Emergency Outage: 300mm pipe rupture';
          pressure = 'zero';
        } else {
          hourStatus = 'available';
          desc = 'Expected Supply Restored';
          pressure = 'normal';
        }
      } else if (areaId === 'randburg-jhb') {
        if (hour >= 6 && hour < 15) {
          hourStatus = 'warning';
          desc = 'Low Pressure: Linden pump reset';
          pressure = 'low';
        } else {
          hourStatus = 'available';
          desc = 'Normal Supply Pressure';
          pressure = 'normal';
        }
      } else if (areaId === 'sandton-jhb') {
        // Today is normal, tomorrow has planned shutdown
        hourStatus = 'available';
        desc = 'Water Available (Scheduled outage tomorrow 08:00)';
        pressure = 'normal';
      }

      slots.push({
        hour,
        timeLabel,
        status: hourStatus,
        description: desc,
        pressure,
      });
    }

    return slots;
  }

  async getOutageAnalytics(areaId?: string) {
    const outages = await this.getOutages(areaId);
    const total = outages.length;
    const active = outages.filter((o) => o.status === 'active').length;
    const upcoming = outages.filter((o) => o.status === 'upcoming').length;
    const resolved = outages.filter((o) => o.status === 'resolved').length;

    return {
      total,
      active,
      upcoming,
      resolved,
      totalHoursSavedOrRestored: 42,
      averageRestorationHours: 6.4,
      reliabilityScore: areaId === 'melville-brixton-jhb' ? 78 : areaId === 'randburg-jhb' ? 86 : 96,
    };
  }
}

export const waterService = new WaterService();
