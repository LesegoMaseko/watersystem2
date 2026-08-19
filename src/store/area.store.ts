import { create } from 'zustand';
import { Area, SavedArea } from '../types';
import { MOCK_AREAS } from '../data/mock/areas';
import { areaService } from '../services/area.service';

interface AreaStoreState {
  currentArea: Area;
  allAreas: Area[];
  savedAreas: SavedArea[];
  isLoading: boolean;
  searchQuery: string;
  searchResults: Area[];
  isAreaSelectorOpen: boolean;

  setCurrentArea: (area: Area) => void;
  setCurrentAreaById: (id: string) => Promise<void>;
  addSavedArea: (areaId: string, label: string, icon?: SavedArea['icon']) => void;
  removeSavedArea: (savedAreaId: string) => void;
  setSearchQuery: (query: string) => Promise<void>;
  setIsAreaSelectorOpen: (isOpen: boolean) => void;
  loadAreas: () => Promise<void>;
}

const DEFAULT_SAVED_AREAS: SavedArea[] = [
  { id: 'sa-1', areaId: 'sandton-jhb', label: 'Home', icon: 'home' },
  { id: 'sa-2', areaId: 'melville-brixton-jhb', label: 'Work / Campus', icon: 'briefcase' },
  { id: 'sa-3', areaId: 'soweto-jhb', label: 'Parents (Soweto)', icon: 'heart' }
];

export const useAreaStore = create<AreaStoreState>((set, get) => ({
  currentArea: MOCK_AREAS[0], // Sandton
  allAreas: MOCK_AREAS,
  savedAreas: (() => {
    try {
      const stored = localStorage.getItem('waterwatch_saved_areas');
      return stored ? JSON.parse(stored) : DEFAULT_SAVED_AREAS;
    } catch {
      return DEFAULT_SAVED_AREAS;
    }
  })(),
  isLoading: false,
  searchQuery: '',
  searchResults: MOCK_AREAS,
  isAreaSelectorOpen: false,

  setCurrentArea: (area: Area) => {
    set({ currentArea: area, isAreaSelectorOpen: false });
    try {
      localStorage.setItem('waterwatch_current_area_id', area.id);
    } catch {}
  },

  setCurrentAreaById: async (id: string) => {
    const area = await areaService.getAreaById(id);
    if (area) {
      set({ currentArea: area, isAreaSelectorOpen: false });
      try {
        localStorage.setItem('waterwatch_current_area_id', area.id);
      } catch {}
    }
  },

  addSavedArea: (areaId: string, label: string, icon: SavedArea['icon'] = 'home') => {
    const newSavedArea: SavedArea = {
      id: `sa-${Date.now()}`,
      areaId,
      label,
      icon
    };
    const updated = [...get().savedAreas, newSavedArea];
    set({ savedAreas: updated });
    try {
      localStorage.setItem('waterwatch_saved_areas', JSON.stringify(updated));
    } catch {}
  },

  removeSavedArea: (savedAreaId: string) => {
    const updated = get().savedAreas.filter((s) => s.id !== savedAreaId);
    set({ savedAreas: updated });
    try {
      localStorage.setItem('waterwatch_saved_areas', JSON.stringify(updated));
    } catch {}
  },

  setSearchQuery: async (query: string) => {
    set({ searchQuery: query });
    const results = await areaService.searchAreas(query);
    set({ searchResults: results });
  },

  setIsAreaSelectorOpen: (isOpen: boolean) => set({ isAreaSelectorOpen: isOpen }),

  loadAreas: async () => {
    set({ isLoading: true });
    try {
      const areas = await areaService.getAreas();
      set({ allAreas: areas, searchResults: areas });

      // Restore saved selection
      const savedAreaId = localStorage.getItem('waterwatch_current_area_id');
      if (savedAreaId) {
        const found = areas.find((a) => a.id === savedAreaId);
        if (found) set({ currentArea: found });
      }
    } finally {
      set({ isLoading: false });
    }
  }
}));
