# Performance Optimizations

This document outlines all performance optimizations implemented in the 4calls.ai coordinator web application.

## 1. Service Worker (Offline Caching)

### Implementation
- **Location**: `public/sw.js`
- **Registration**: `src/utils/serviceWorker.ts`
- **Features**:
  - Caches static assets (HTML, CSS, JS)
  - Implements network-first strategy for API calls
  - Provides offline fallback
  - Automatic cache cleanup on updates

### Usage
The service worker is automatically registered in production builds. It:
- Caches static assets for instant loading
- Caches API responses for offline access
- Automatically updates when new versions are available

### Cache Strategies
- **Static Assets**: Cache-first (instant loading)
- **API Endpoints**: Network-first (fresh data, offline fallback)
- **Other Requests**: Network-only

## 2. Virtual Scrolling

### Implementation
- **Component**: `src/components/common/VirtualList.vue`
- **Purpose**: Efficiently render long lists without performance degradation

### Usage
```vue
<VirtualList
  :items="items"
  :item-height="60"
  :container-height="600"
  :overscan="3"
>
  <template #default="{ items: visibleItems, startIndex }">
    <div v-for="(item, index) in visibleItems" :key="item.id">
      Item {{ startIndex + index }}: {{ item.name }}
    </div>
  </template>
</VirtualList>
```

### Benefits
- Only renders visible items + overscan buffer
- Constant performance regardless of list size
- Smooth scrolling for thousands of items

## 3. Request Cancellation

### Implementation
- **Location**: `src/utils/requestCancellation.ts`
- **Integration**: `src/utils/api.ts`

### Features
- Automatic cancellation of stale requests (30s timeout)
- Prevents duplicate concurrent requests
- Manual cancellation support
- Automatic cleanup of old requests

### Usage
```typescript
import { requestCancellationManager } from '@/utils/requestCancellation';

// Cancel a specific request
requestCancellationManager.cancelRequest('GET:/api/endpoint');

// Cancel all pending requests
requestCancellationManager.cancelAllRequests();
```

### Automatic Features
- All API requests are automatically tracked
- Stale requests (>30s) are automatically cancelled
- Cleanup runs every 5 seconds

## 4. Optimistic Updates

### Implementation
- **Location**: `src/utils/optimisticUpdates.ts`
- **Example**: `src/stores/appointments.ts` (createAppointment)

### Features
- Instant UI updates before API response
- Automatic rollback on error
- Better perceived performance

### Usage
```typescript
import { withOptimisticUpdate } from '@/utils/optimisticUpdates';

async function createItem(data: ItemData) {
  const optimisticId = `temp-${Date.now()}`;
  const optimisticItem = { id: optimisticId, ...data };
  
  const rollback = () => {
    items.value = items.value.filter(i => i.id !== optimisticId);
  };

  try {
    items.value.push(optimisticItem);
    
    const response = await withOptimisticUpdate(
      optimisticId,
      optimisticItem,
      rollback,
      async () => await api.createItem(data)
    );
    
    // Replace optimistic item with real one
    const index = items.value.findIndex(i => i.id === optimisticId);
    items.value[index] = response.data;
  } catch (error) {
    // Rollback happens automatically
    throw error;
  }
}
```

## 5. Performance Monitoring

### Implementation
- **Location**: `src/utils/performance.ts`
- **Integration**: `src/utils/api.ts`, `src/main.ts`

### Features
- Tracks API call performance (duration, status)
- Web Vitals monitoring (LCP, FID, CLS)
- Custom performance metrics
- Export metrics for analysis

### Tracked Metrics
- **API Calls**: URL, method, duration, status
- **LCP**: Largest Contentful Paint
- **FID**: First Input Delay
- **CLS**: Cumulative Layout Shift
- **Custom Metrics**: Any custom performance measurements

### Usage
```typescript
import { performanceMonitor, measurePerformance } from '@/utils/performance';

// Measure function execution
const result = await measurePerformance('fetchData', async () => {
  return await fetchData();
});

// Get metrics
const apiCalls = performanceMonitor.getApiCalls();
const slowestCalls = performanceMonitor.getSlowestApiCalls(10);
const averageDuration = performanceMonitor.getAverageApiDuration();
const errorRate = performanceMonitor.getApiErrorRate();

// Export all metrics
const export = performanceMonitor.export();
```

### Automatic Tracking
- All API calls are automatically tracked
- Web Vitals are automatically monitored on app start
- Metrics are stored in memory (configurable limits)

## 6. API Response Caching

### Implementation
- **Location**: `src/utils/cache.ts`
- **Integration**: `src/utils/api.ts`

### Features
- TTL-based caching (30s, 1m, 5m, 15m)
- Automatic cache invalidation
- Request deduplication
- Configurable per-request

### Usage
```typescript
import { apiCache, CACHE_TTL } from '@/utils/cache';

// Manual cache operations
apiCache.set('/api/endpoint', data, CACHE_TTL.MEDIUM);
const cached = apiCache.get('/api/endpoint');
apiCache.invalidate('/api/endpoint');
```

### Automatic Features
- GET requests are automatically cached
- Cache TTL can be configured per request
- Cache is checked before making network requests

## 7. Debounced Search

### Implementation
- **Location**: `src/utils/request.ts`
- **Usage**: `src/pages/calls/CallsPage.vue`, `src/pages/contacts/ContactsPage.vue`

### Features
- Reduces API calls during typing
- Configurable delay (default: 300ms)
- Improved user experience

### Usage
```typescript
import { createDebounced } from '@/utils/request';

const handleSearch = createDebounced(() => {
  fetchData();
}, 300);
```

## 8. Bundle Optimization

### Implementation
- **Location**: `vite.config.ts`

### Features
- Code splitting (vendor chunks)
- Tree shaking
- Minification
- Optimized asset organization
- CSS code splitting

### Chunks
- `vue-vendor`: Vue, Vue Router, Pinia
- `ui-vendor`: Lucide icons
- `utils-vendor`: Axios
- Route-based chunks (lazy loading)

## Performance Best Practices

1. **Use Virtual Scrolling** for lists with 100+ items
2. **Enable Optimistic Updates** for create/update operations
3. **Configure Cache TTL** appropriately for each endpoint
4. **Monitor Performance** in development to identify bottlenecks
5. **Use Debouncing** for search inputs and filters
6. **Cancel Stale Requests** when navigating away

## Monitoring Performance

### Development
- Check browser DevTools Performance tab
- Review Network tab for API call timing
- Use Performance Monitor utilities

### Production
- Export metrics: `performanceMonitor.export()`
- Monitor Web Vitals
- Track API call durations and error rates

## Future Enhancements

- [ ] Service Worker background sync
- [ ] IndexedDB for persistent caching
- [ ] Request queuing for offline operations
- [ ] Performance budgets in CI/CD
- [ ] Real-time performance dashboard

