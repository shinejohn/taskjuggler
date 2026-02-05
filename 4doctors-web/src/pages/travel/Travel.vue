<template>
  <div class="travel-page">
    <header class="page-header">
      <div class="header-content">
        <Plane class="header-icon" />
        <div>
          <h1 class="page-title">Travel</h1>
          <p class="page-subtitle">Upcoming trips, conferences, and vacation planning</p>
        </div>
      </div>
      <button class="add-btn">
        <Plus class="add-icon" />
        Plan Trip
      </button>
    </header>

    <ModeBadge mode="personal" :show-label="true" class="mode-indicator" />

    <div class="upcoming-trips">
      <h2 class="section-title">Upcoming Trips</h2>
      <div class="trips-grid">
        <div class="trip-card" v-for="trip in trips" :key="trip.id">
          <div class="trip-image">
            {{ trip.emoji }}
          </div>
          <div class="trip-content">
            <span class="trip-destination">{{ trip.destination }}</span>
            <span class="trip-dates">{{ trip.dates }}</span>
            <span class="trip-purpose" :class="trip.type">{{ trip.purpose }}</span>
          </div>
          <div class="trip-countdown">
            <span class="countdown-number">{{ trip.daysUntil }}</span>
            <span class="countdown-label">days</span>
          </div>
        </div>
      </div>
    </div>

    <div class="quick-actions">
      <button class="action-card">
        <Search class="action-icon" />
        Search Flights
      </button>
      <button class="action-card">
        <Building class="action-icon" />
        Book Hotels
      </button>
      <button class="action-card">
        <Car class="action-icon" />
        Rent a Car
      </button>
      <button class="action-card">
        <Ticket class="action-icon" />
        Conferences
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Plane, Plus, Search, Building, Car, Ticket } from 'lucide-vue-next';
import ModeBadge from '@/components/core/ModeBadge.vue';

const trips = ref([
  { id: 1, destination: 'San Diego, CA', dates: 'Feb 15-18, 2026', purpose: 'Medical Conference', type: 'business', emoji: '🏥', daysUntil: 17 },
  { id: 2, destination: 'Hawaii', dates: 'Mar 20-28, 2026', purpose: 'Family Vacation', type: 'personal', emoji: '🏝️', daysUntil: 50 },
  { id: 3, destination: 'New York, NY', dates: 'Apr 5-7, 2026', purpose: 'CME Seminar', type: 'business', emoji: '🗽', daysUntil: 66 },
]);
</script>

<style scoped>
.travel-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 16px;
  color: white;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  width: 48px;
  height: 48px;
  opacity: 0.9;
}

.page-title {
  font-size: 28px;
  font-weight: 800;
  margin: 0;
}

.page-subtitle {
  opacity: 0.9;
  margin-top: 4px;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: white;
  color: #059669;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.add-btn:hover {
  transform: translateY(-2px);
}

.add-icon {
  width: 20px;
  height: 20px;
}

.mode-indicator {
  width: fit-content;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 16px;
}

.trips-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.trip-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s;
}

.trip-card:hover {
  border-color: #10b981;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.1);
}

.trip-image {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #ecfdf5, #d1fae5);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}

.trip-content {
  flex: 1;
}

.trip-destination {
  display: block;
  font-weight: 700;
  font-size: 16px;
  color: #1e293b;
}

.trip-dates {
  display: block;
  font-size: 14px;
  color: #64748b;
  margin: 4px 0;
}

.trip-purpose {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
}

.trip-purpose.business {
  background: #dbeafe;
  color: #2563eb;
}

.trip-purpose.personal {
  background: #d1fae5;
  color: #059669;
}

.trip-countdown {
  text-align: center;
  padding: 12px;
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 12px;
  color: white;
}

.countdown-number {
  display: block;
  font-size: 24px;
  font-weight: 800;
}

.countdown-label {
  font-size: 11px;
  opacity: 0.9;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.action-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.15s;
  font-weight: 600;
  color: #1e293b;
}

.action-card:hover {
  background: #10b981;
  color: white;
  border-color: #10b981;
}

.action-card:hover .action-icon {
  color: white;
}

.action-icon {
  width: 28px;
  height: 28px;
  color: #10b981;
}
</style>
