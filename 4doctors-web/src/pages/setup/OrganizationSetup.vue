<template>
  <div class="min-h-screen bg-slate-50 font-sans p-8 flex justify-center items-start">
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-8 w-full max-w-4xl">
        <header class="mb-8 border-b border-slate-100 pb-4">
            <h1 class="text-3xl font-bold text-slate-900">Organization Setup</h1>
            <p class="text-slate-500">Configure your practice profile and locations.</p>
        </header>

        <form @submit.prevent="save">
            <!-- Global Info -->
            <section class="mb-8">
                <h2 class="text-xl font-semibold text-slate-800 mb-4">Practice Profile</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Practice Name</label>
                        <input v-model="form.name" type="text" class="w-full p-2 border border-slate-300 rounded-lg" placeholder="e.g. City Family Medicine" required>
                    </div>
                     <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">NPI Number</label>
                        <input v-model="form.npi" type="text" class="w-full p-2 border border-slate-300 rounded-lg" placeholder="10-digit NPI">
                    </div>
                     <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Tax ID (EIN)</label>
                        <input v-model="form.tax_id" type="text" class="w-full p-2 border border-slate-300 rounded-lg">
                    </div>
                     <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Logo URL</label>
                        <input v-model="form.logo_url" type="text" class="w-full p-2 border border-slate-300 rounded-lg" placeholder="https://...">
                    </div>
                </div>
            </section>

             <!-- Locations -->
            <section class="mb-8 p-6 bg-slate-50 rounded-xl border border-slate-200">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-semibold text-slate-800">Locations</h2>
                    <button type="button" @click="addLocation" class="text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg">+ Add Location</button>
                </div>
                
                <div class="space-y-4">
                    <div v-for="(loc, index) in form.locations" :key="index" class="bg-white p-4 rounded-lg border border-slate-200 relative">
                        <button v-if="form.locations.length > 1" @click="removeLocation(index)" type="button" class="absolute top-2 right-2 text-slate-400 hover:text-red-500">
                             <Trash2 class="w-4 h-4"/>
                        </button>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <label class="block text-xs font-medium text-slate-700 mb-1">Location Name</label>
                                <input v-model="loc.name" type="text" class="w-full p-2 text-sm border border-slate-300 rounded-lg" placeholder="e.g. Downtown Clinic">
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-slate-700 mb-1">Detailed Address</label>
                                <input v-model="loc.address" type="text" class="w-full p-2 text-sm border border-slate-300 rounded-lg" placeholder="Street, City, Zip">
                            </div>
                             <div>
                                <label class="block text-xs font-medium text-slate-700 mb-1">Phone</label>
                                <input v-model="loc.phone" type="text" class="w-full p-2 text-sm border border-slate-300 rounded-lg">
                            </div>
                             <div>
                                <label class="block text-xs font-medium text-slate-700 mb-1">Timezone</label>
                                <select v-model="loc.timezone" class="w-full p-2 text-sm border border-slate-300 rounded-lg">
                                    <option value="America/New_York">Eastern Time</option>
                                    <option value="America/Chicago">Central Time</option>
                                    <option value="America/Denver">Mountain Time</option>
                                    <option value="America/Los_Angeles">Pacific Time</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div class="flex justify-end gap-4">
                <router-link to="/dashboard" class="px-6 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">Skip for now</router-link>
                <button type="submit" class="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 shadow-lg shadow-blue-200">Save & Continue</button>
            </div>
        </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Trash2 } from 'lucide-vue-next';

const router = useRouter();

const form = ref({
    name: '',
    npi: '',
    tax_id: '',
    logo_url: '',
    locations: [
        { name: 'Main Office', address: '', phone: '', timezone: 'America/New_York' }
    ]
});

const addLocation = () => {
    form.value.locations.push({ name: '', address: '', phone: '', timezone: 'America/New_York' });
};

const removeLocation = (idx: number) => {
    form.value.locations.splice(idx, 1);
};

const save = () => {
    // Mock save
    console.log('Saving Organization:', form.value);
    // In real app: await api.post('/organizations', form.value);
    router.push('/dashboard');
};
</script>
