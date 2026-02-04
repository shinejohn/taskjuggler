import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { NavItem } from '@/types/module';
import {
    LayoutDashboard,
    Settings,
    MessageSquare,
    Calendar,
    Phone
} from 'lucide-vue-next';

export const useUiStore = defineStore('ui', () => {
    // Default Navigation Items
    const navItems = ref<NavItem[]>([
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
        { id: 'inbox', label: 'Inbox', icon: MessageSquare, to: '/inbox' }, // Placeholder route
        { id: 'calendar', label: 'Calendar', icon: Calendar, to: '/calendar' }, // Placeholder route
        { id: 'calls', label: 'Phone', icon: Phone, to: '/calls' }, // Placeholder route
        { id: 'settings', label: 'Settings', icon: Settings, to: '/settings' }, // Placeholder route
    ]);

    function addNavItems(items: NavItem[]) {
        // Prevent duplicates based on ID
        items.forEach(item => {
            if (!navItems.value.find(n => n.id === item.id)) {
                // Insert before 'Settings' if it exists, otherwise append
                const settingsIndex = navItems.value.findIndex(n => n.id === 'settings');
                if (settingsIndex >= 0) {
                    navItems.value.splice(settingsIndex, 0, item);
                } else {
                    navItems.value.push(item);
                }
            }
        });
    }

    return {
        navItems,
        addNavItems
    };
});
