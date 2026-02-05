<template>
  <div class="business-reporting-widget">
    <div class="widget-header">
      <h3 class="widget-title">
        <BarChart3 class="title-icon" />
        Business Snapshot
      </h3>
      <select class="period-select">
        <option>Today</option>
        <option>This Week</option>
        <option selected>This Month</option>
      </select>
    </div>
    
    <div class="metrics-grid">
      <div class="metric" :class="{ positive: revenueChange > 0 }">
        <DollarSign class="metric-icon" />
        <div class="metric-content">
          <span class="metric-value">${{ formatNumber(revenue) }}</span>
          <span class="metric-label">Revenue</span>
        </div>
        <span class="metric-change">
          <TrendingUp v-if="revenueChange > 0" class="change-icon" />
          <TrendingDown v-else class="change-icon" />
          {{ Math.abs(revenueChange) }}%
        </span>
      </div>
      
      <div class="metric">
        <Users class="metric-icon" />
        <div class="metric-content">
          <span class="metric-value">{{ patients }}</span>
          <span class="metric-label">Patients Seen</span>
        </div>
      </div>
      
      <div class="metric">
        <FileText class="metric-icon" />
        <div class="metric-content">
          <span class="metric-value">{{ claims }}</span>
          <span class="metric-label">Claims Filed</span>
        </div>
      </div>
      
      <div class="metric">
        <Percent class="metric-icon" />
        <div class="metric-content">
          <span class="metric-value">{{ collectionRate }}%</span>
          <span class="metric-label">Collection Rate</span>
        </div>
      </div>
    </div>
    
    <div class="mini-chart">
      <div class="chart-bar" v-for="(day, idx) in chartData" :key="idx" :style="{ height: day.value + '%' }" :title="day.label"></div>
    </div>
    
    <router-link to="/billing/ledger" class="view-reports-btn">
      View Full Reports →
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { BarChart3, DollarSign, Users, FileText, Percent, TrendingUp, TrendingDown } from 'lucide-vue-next';

const revenue = ref(42580);
const revenueChange = ref(12);
const patients = ref(156);
const claims = ref(98);
const collectionRate = ref(87);

const chartData = ref([
  { label: 'Week 1', value: 65 },
  { label: 'Week 2', value: 80 },
  { label: 'Week 3', value: 70 },
  { label: 'Week 4', value: 100 },
]);

const formatNumber = (num: number) => num.toLocaleString();
</script>

<style scoped>
.business-reporting-widget {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 20px;
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.widget-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.title-icon {
  width: 20px;
  height: 20px;
  color: #0ea5e9;
}

.period-select {
  padding: 6px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 13px;
  color: #64748b;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.metric {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  background: #f8fafc;
  border-radius: 10px;
  position: relative;
}

.metric-icon {
  width: 22px;
  height: 22px;
  color: #64748b;
}

.metric-content {
  flex: 1;
}

.metric-value {
  display: block;
  font-size: 18px;
  font-weight: 800;
  color: #1e293b;
}

.metric-label {
  font-size: 11px;
  color: #64748b;
}

.metric-change {
  position: absolute;
  top: 8px;
  right: 10px;
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 2px;
}

.metric.positive .metric-change {
  color: #10b981;
}

.change-icon {
  width: 12px;
  height: 12px;
}

.mini-chart {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  height: 50px;
  margin-bottom: 20px;
  padding: 0 4px;
}

.chart-bar {
  flex: 1;
  background: linear-gradient(to top, #0ea5e9, #38bdf8);
  border-radius: 4px 4px 0 0;
  min-height: 10px;
  transition: height 0.3s ease;
}

.view-reports-btn {
  display: block;
  width: 100%;
  padding: 12px;
  background: #f0f9ff;
  border: 1px solid #e0f2fe;
  border-radius: 8px;
  color: #0ea5e9;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  transition: all 0.15s;
}

.view-reports-btn:hover {
  background: #e0f2fe;
}
</style>
