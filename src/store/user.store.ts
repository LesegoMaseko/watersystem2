import { create } from 'zustand';
import { UserProfile } from '../types';

interface UserStoreState {
  profile: UserProfile;
  updateProfile: (data: Partial<UserProfile>) => void;
  toggleNotificationPref: (key: keyof UserProfile['notificationPreferences']) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Ntando Sibaya',
  email: 'ntandosibaya05@gmail.com',
  phone: '+27 82 555 4910',
  primaryAreaId: 'sandton-jhb',
  savedAreas: [],
  notificationPreferences: {
    outageAlerts: true,
    emergencyAlerts: true,
    communityUpdates: true,
    reportUpdates: true,
    tankerAlerts: true
  },
  theme: 'system'
};

export const useUserStore = create<UserStoreState>((set, get) => {
  // Load saved state
  let initialProfile = DEFAULT_PROFILE;
  try {
    const saved = localStorage.getItem('waterwatch_user_profile');
    if (saved) {
      initialProfile = { ...DEFAULT_PROFILE, ...JSON.parse(saved) };
    }
  } catch {}

  // Apply dark mode on initialization
  const applyTheme = (theme: 'light' | 'dark' | 'system') => {
    const root = document.documentElement;
    const isDark =
      theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  applyTheme(initialProfile.theme);

  return {
    profile: initialProfile,

    updateProfile: (data) => {
      const updated = { ...get().profile, ...data };
      set({ profile: updated });
      try {
        localStorage.setItem('waterwatch_user_profile', JSON.stringify(updated));
      } catch {}
    },

    toggleNotificationPref: (key) => {
      const current = get().profile;
      const updated = {
        ...current,
        notificationPreferences: {
          ...current.notificationPreferences,
          [key]: !current.notificationPreferences[key]
        }
      };
      set({ profile: updated });
      try {
        localStorage.setItem('waterwatch_user_profile', JSON.stringify(updated));
      } catch {}
    },

    setTheme: (theme) => {
      const updated = { ...get().profile, theme };
      set({ profile: updated });
      applyTheme(theme);
      try {
        localStorage.setItem('waterwatch_user_profile', JSON.stringify(updated));
      } catch {}
    }
  };
});
