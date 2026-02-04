<template>
  <div class="p-6">
    <header class="mb-8">
      <h1 class="text-3xl font-bold font-heading text-slate-900">Patient Records</h1>
      <p class="text-slate-500">Manage your patient list and history.</p>
    </header>

    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center py-20">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-600"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      </div>
      <h3 class="text-xl font-bold text-slate-900 mb-2">Connect to 4Doctors</h3>
      <p class="text-slate-500 max-w-md mx-auto mb-8">
        This view will be populated with data from the 4Doctors Practice Management System once connected.
      </p>
      <button class="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors">
        Connect Database
      </button>
    </div>
  </div>
</template>
