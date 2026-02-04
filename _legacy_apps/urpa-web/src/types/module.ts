import type { App } from 'vue';
import type { RouteRecordRaw } from 'vue-router';
import type { Component } from 'vue';

export interface NavItem {
    id: string;
    label: string;
    icon: any; // Lucide icon component
    to?: string;
    children?: NavItem[];
}

export interface AiSkill {
    id: string;
    name: string;
    description: string;
    prompt: string;
}

export interface DashboardWidget {
    id: string;
    component: Component;
    span?: number; // Grid span (1-12)
}

export interface UrpaModule {
    id: string; // e.g., 'doctor'
    name: string; // e.g., 'Doctor Assistant'
    description: string;

    // Navigation
    navItems?: NavItem[];

    // Routes
    routes?: RouteRecordRaw[];

    // AI Context
    systemPromptAdditions?: string;
    skills?: AiSkill[];

    // UI Integrations
    dashboardWidgets?: DashboardWidget[];

    // Setup hook
    setup?: (app: App) => void;
}
