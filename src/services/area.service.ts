import { Area } from '../types';
import { MOCK_AREAS } from '../data/mock/areas';

class AreaService {
  private areas: Area[] = [...MOCK_AREAS];

  async getAreas(): Promise<Area[]> {
    // Simulate minor async latency for realistic feel
    await new Promise((resolve) => setTimeout(resolve, 100));
    return this.areas;
  }

  async getAreaById(id: string): Promise<Area | undefined> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return this.areas.find((a) => a.id === id);
  }

  async searchAreas(query: string): Promise<Area[]> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    const cleanQuery = query.toLowerCase().trim();
    if (!cleanQuery) return this.areas;
    return this.areas.filter(
      (a) =>
        a.name.toLowerCase().includes(cleanQuery) ||
        a.suburb.toLowerCase().includes(cleanQuery) ||
        a.city.toLowerCase().includes(cleanQuery) ||
        a.province.toLowerCase().includes(cleanQuery) ||
        (a.postalCode && a.postalCode.includes(cleanQuery))
    );
  }
}

export const areaService = new AreaService();
