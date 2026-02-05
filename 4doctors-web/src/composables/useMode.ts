import { computed } from 'vue';
import { useModeStore } from '@/stores/modeStore';

/**
 * Composable for accessing URPA mode functionality in components
 */
export function useMode() {
    const store = useModeStore();

    return {
        // State
        currentMode: computed(() => store.currentMode),
        modeHistory: computed(() => store.modeHistory),

        // Computed helpers
        isHIPAAActive: computed(() => store.isHIPAAActive),
        isPracticeMode: computed(() => store.isPracticeMode),
        isBusinessMode: computed(() => store.isBusinessMode),
        isPersonalMode: computed(() => store.isPersonalMode),
        isUnifiedView: computed(() => store.isUnifiedView),
        currentModeConfig: computed(() => store.currentModeConfig),

        // Actions
        setMode: store.setMode,
        getModeIcon: store.getModeIcon,
        getModeLabel: store.getModeLabel,
        canAccessInCurrentMode: store.canAccessInCurrentMode,
        suggestModeSwitch: store.suggestModeSwitch,

        // Constants
        modes: store.modes
    };
}
