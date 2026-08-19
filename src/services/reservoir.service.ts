import { Reservoir } from '../types';
import { MOCK_RESERVOIRS } from '../data/mock/reservoirs';

class ReservoirService {
  private reservoirs: Reservoir[] = [...MOCK_RESERVOIRS];

  async getReservoirs(): Promise<Reservoir[]> {
    await new Promise((resolve) => setTimeout(resolve, 80));
    return this.reservoirs;
  }

  async getReservoirById(id: string): Promise<Reservoir | undefined> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return this.reservoirs.find((r) => r.id === id);
  }

  async getReservoirForArea(reservoirId: string): Promise<Reservoir | undefined> {
    return this.getReservoirById(reservoirId);
  }
}

export const reservoirService = new ReservoirService();
