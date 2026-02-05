import { useDashboardStore, type DashboardItem, type ItemCategory } from '@/stores/scribemd/dashboardStore';
import { scribeService } from '@/services/scribe';

/**
 * Composable for managing dashboard items with optimistic updates
 */
export function useDashboardItems() {
    const store = useDashboardStore();

    // Add item with optimistic update
    async function addItem(
        category: ItemCategory,
        itemData: Record<string, unknown>,
        source: 'ai' | 'manual' = 'manual'
    ): Promise<DashboardItem> {
        if (!store.visit?.id) {
            throw new Error('No active visit');
        }

        // Optimistic ID for immediate UI update
        const optimisticId = `temp-${Date.now()}`;
        const optimisticItem: DashboardItem = {
            id: optimisticId,
            visit_id: store.visit.id,
            category,
            item_data: itemData,
            source,
            is_accepted: true,
            is_modified: false,
            display_order: 0,
        };

        // Optimistic update
        store.addItem(optimisticItem);

        try {
            const item = await scribeService.addItem(store.visit.id, {
                category,
                item_data: itemData,
                source,
            });

            // Replace optimistic item with real one
            store.removeItem(optimisticId);
            store.addItem(item);
            return item;
        } catch (err) {
            // Rollback on failure
            store.removeItem(optimisticId);
            throw err;
        }
    }

    // Update item with optimistic update
    async function updateItem(
        itemId: string,
        updates: { item_data?: Record<string, unknown>; is_accepted?: boolean }
    ): Promise<DashboardItem> {
        if (!store.visit?.id) {
            throw new Error('No active visit');
        }

        // Store original for rollback
        const items = Object.values(store.visit.items).flat();
        const original = items.find(i => i.id === itemId);
        if (!original) {
            throw new Error('Item not found');
        }

        // Optimistic update
        store.updateItem(itemId, updates);

        try {
            const item = await scribeService.updateItem(store.visit.id, itemId, updates);
            store.updateItem(itemId, item);
            return item;
        } catch (err) {
            // Rollback on failure
            store.updateItem(itemId, original);
            throw err;
        }
    }

    // Delete item with optimistic update
    async function deleteItem(itemId: string): Promise<void> {
        if (!store.visit?.id) {
            throw new Error('No active visit');
        }

        // Store original for rollback
        const items = Object.values(store.visit.items).flat();
        const original = items.find(i => i.id === itemId);
        if (!original) {
            throw new Error('Item not found');
        }

        // Optimistic update
        store.removeItem(itemId);

        try {
            await scribeService.deleteItem(store.visit.id, itemId);
        } catch (err) {
            // Rollback on failure
            store.addItem(original);
            throw err;
        }
    }

    // Toggle acceptance with optimistic update
    async function toggleItem(itemId: string): Promise<DashboardItem> {
        if (!store.visit?.id) {
            throw new Error('No active visit');
        }

        // Optimistic update
        store.toggleItemAcceptance(itemId);

        try {
            const item = await scribeService.toggleItem(store.visit.id, itemId);
            return item;
        } catch (err) {
            // Rollback on failure
            store.toggleItemAcceptance(itemId);
            throw err;
        }
    }

    // Get items by category
    function getItemsByCategory(category: ItemCategory): DashboardItem[] {
        if (!store.visit?.items) return [];
        return store.visit.items[category] ?? [];
    }

    // Get accepted items only
    function getAcceptedItems(): DashboardItem[] {
        if (!store.visit?.items) return [];
        return Object.values(store.visit.items)
            .flat()
            .filter(item => item.is_accepted);
    }

    // Get items by source
    function getItemsBySource(source: 'ai' | 'manual'): DashboardItem[] {
        if (!store.visit?.items) return [];
        return Object.values(store.visit.items)
            .flat()
            .filter(item => item.source === source);
    }

    return {
        addItem,
        updateItem,
        deleteItem,
        toggleItem,
        getItemsByCategory,
        getAcceptedItems,
        getItemsBySource,
    };
}
