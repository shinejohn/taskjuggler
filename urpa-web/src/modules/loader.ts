import type { App } from 'vue';
import type { Router } from 'vue-router';
import type { UrpaModule } from '@/types/module';

// Registry to hold loaded modules
const loadedModules: UrpaModule[] = [];

/**
 * Register a module with the application
 */
export function registerModule(module: UrpaModule, app: App, router: Router) {
    console.log(`[ModuleLoader] Registering module: ${module.name} (${module.id})`);

    // 1. Register Routes
    if (module.routes) {
        module.routes.forEach(route => {
            console.log(`[ModuleLoader] Adding route: ${route.path}`);
            router.addRoute(route);
        });
    }

    // 2. Execute Setup Hook
    if (module.setup) {
        module.setup(app);
    }

    // 3. Store module for later access (e.g. Nav items)
    loadedModules.push(module);
}

/**
 * Get all loaded modules
 */
export function getModules(): UrpaModule[] {
    return loadedModules;
}

/**
 * Get aggregated navigation items from all modules
 */
export function getModuleNavItems() {
    return loadedModules.flatMap(m => m.navItems || []);
}

export function getModuleSystemPrompts() {
    return loadedModules
        .map(m => m.systemPromptAdditions)
        .filter(Boolean)
        .join('\n\n');
}
