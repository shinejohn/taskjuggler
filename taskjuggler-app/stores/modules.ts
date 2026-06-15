import { create } from 'zustand';
import {
  ALL_MODULES,
  getEnabledModules,
  getEntitledModules,
} from '../config/modules';
import type { ModuleConfig } from '../config/modules';

interface ModulesState {
  /** Modules on the user's plan that are implemented in mobile */
  enabledModules: ModuleConfig[];
  /** All modules on the user's plan (including coming soon) */
  entitledModules: ModuleConfig[];
  activeModuleId: string;
  setEnabledModuleIds: (ids: string[]) => void;
  setActiveModule: (id: string) => void;
}

export const useModulesStore = create<ModulesState>((set) => ({
  enabledModules: getEnabledModules(),
  entitledModules: getEntitledModules(),
  activeModuleId: 'tasks',

  setEnabledModuleIds: (ids: string[]) => {
    set({
      enabledModules: getEnabledModules(ids),
      entitledModules: getEntitledModules(ids),
    });
  },

  setActiveModule: (id: string) => {
    const exists = ALL_MODULES.find((m) => m.id === id);
    if (exists) {
      set({ activeModuleId: id });
    }
  },
}));
