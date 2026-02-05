import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { URPAMode } from '@/types/mode';
import { MODES, getModeConfig } from '@/types/mode';

import api from '@/utils/api';

const STORAGE_KEY = 'urpa_mode';

export const useModeStore = defineStore('mode', () => {
    // State
    const currentMode = ref<URPAMode>(loadModeFromStorage());
    const modeHistory = ref<{ mode: URPAMode; timestamp: Date }[]>([]);

    // Computed
    const isHIPAAActive = computed(() => currentMode.value === 'practice');
    const isPracticeMode = computed(() => currentMode.value === 'practice');
    const isBusinessMode = computed(() => currentMode.value === 'business');
    const isPersonalMode = computed(() => currentMode.value === 'personal');
    const isUnifiedView = computed(() => currentMode.value === 'all');

    const currentModeConfig = computed(() => getModeConfig(currentMode.value));

    // Actions
    function loadModeFromStorage(): URPAMode {
        if (typeof localStorage !== 'undefined') {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored && ['practice', 'business', 'personal', 'all'].includes(stored)) {
                return stored as URPAMode;
            }
        }
        return 'practice'; // Default to Practice mode for a healthcare app
    }

    async function setMode(mode: URPAMode) {
        const previousMode = currentMode.value;

        // Log mode switch locally for UI history
        modeHistory.value.push({
            mode: previousMode,
            timestamp: new Date()
        });

        if (modeHistory.value.length > 10) {
            modeHistory.value = modeHistory.value.slice(-10);
        }

        // Update state immediately for UI responsiveness
        currentMode.value = mode;

        // Persist to storage
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, mode);
        }

        // Sync with backend (which also handles audit logging)
        try {
            await api.post('/urpa/mode/switch', { mode });
        } catch (error) {
            console.error('Failed to sync mode with backend:', error);
            // Optional: Revert mode if strict sync is required
        }
    }

    async function logModeSwitch(from: URPAMode, to: URPAMode) {
        // HIPAA audit logging for Practice mode transitions
        console.log(`[HIPAA Audit] Mode switch: ${from} -> ${to}`);

        // TODO: Send to backend audit log when API is available
        // await api.post('/api/urpa/audit', {
        //   action: 'MODE_SWITCH',
        //   from_mode: from,
        //   to_mode: to,
        //   timestamp: new Date().toISOString()
        // });
    }

    function getModeIcon(mode: URPAMode): string {
        switch (mode) {
            case 'practice': return '🔒';
            case 'business': return '💼';
            case 'personal': return '🏠';
            default: return '📊';
        }
    }

    function getModeLabel(mode: URPAMode): string {
        switch (mode) {
            case 'practice': return 'Practice Mode';
            case 'business': return 'Business Mode';
            case 'personal': return 'Personal Mode';
            default: return 'All Modes';
        }
    }

    function canAccessInCurrentMode(resourceMode: URPAMode): boolean {
        if (currentMode.value === 'all') return true;
        return currentMode.value === resourceMode;
    }

    function suggestModeSwitch(targetMode: URPAMode): { shouldSwitch: boolean; message: string } {
        if (currentMode.value === targetMode || currentMode.value === 'all') {
            return { shouldSwitch: false, message: '' };
        }

        return {
            shouldSwitch: true,
            message: `This action requires ${getModeLabel(targetMode)}. Switch modes?`
        };
    }

    return {
        // State
        currentMode,
        modeHistory,

        // Computed
        isHIPAAActive,
        isPracticeMode,
        isBusinessMode,
        isPersonalMode,
        isUnifiedView,
        currentModeConfig,

        // Actions
        setMode,
        getModeIcon,
        getModeLabel,
        canAccessInCurrentMode,
        suggestModeSwitch,

        // Constants
        modes: MODES
    };
});
