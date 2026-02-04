<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold font-heading text-slate-800">
        Today's Clinic Schedule
      </h2>
      <button class="text-sm font-medium text-blue-600 hover:text-blue-800">
        View Full Calendar
      </button>
    </div>

    <div class="space-y-3">
      <div 
        v-for="patient in patients" 
        :key="patient.id"
        class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between"
      >
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
            {{ patient.initials }}
          </div>
          <div>
            <h3 class="font-bold text-slate-900">{{ patient.name }}</h3>
            <p class="text-sm text-slate-500">{{ patient.time }} • {{ patient.reason }}</p>
          </div>
        </div>
        <button class="px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors">
          Details
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const patients = [
  { id: 1, name: 'Sarah Jones', initials: 'SJ', time: '09:00 AM', reason: 'Annual Checkup' },
  { id: 2, name: 'Mike Smith', initials: 'MS', time: '10:30 AM', reason: 'Follow-up' },
  { id: 3, name: 'Emily Davis', initials: 'ED', time: '02:00 PM', reason: 'Consultation' },
];
</script>
