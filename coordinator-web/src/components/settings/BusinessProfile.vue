<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex justify-between items-start">
      <div>
        <h1 class="text-3xl font-heading font-bold text-[#1B4F72]">Business Profile</h1>
        <p class="text-slate-500 mt-1">
          This information helps your Coordinators represent your business accurately
        </p>
      </div>
      <button
        @click="saveProfile"
        class="px-5 py-2.5 bg-[#1B4F72] hover:bg-[#153e5a] text-white font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2"
      >
        <Save :size="18" />
        Save Changes
      </button>
    </div>

    <!-- Basic Information -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <h2 class="text-lg font-bold text-slate-900 mb-4">Basic Information</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-slate-700 mb-2">
            Business Name <span class="text-red-500">*</span>
          </label>
          <input
            v-model="profile.name"
            type="text"
            class="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72]"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">
            Business Type/Industry
          </label>
          <select
            v-model="profile.industry"
            class="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] bg-white"
          >
            <option>Dental Practice</option>
            <option>Plumbing</option>
            <option>Restaurant</option>
            <option>Legal Services</option>
            <option>Medical Office</option>
            <option>Auto Repair</option>
            <option>Salon & Spa</option>
            <option>Real Estate</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">
            Year Established
          </label>
          <input
            v-model.number="profile.yearEstablished"
            type="number"
            class="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72]"
          />
        </div>
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-slate-700 mb-2">
            Business Description
          </label>
          <textarea
            v-model="profile.description"
            rows="3"
            class="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72]"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">
            Number of Employees
          </label>
          <select
            v-model="profile.employeeCount"
            class="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] bg-white"
          >
            <option>1-5</option>
            <option>6-10</option>
            <option>11-25</option>
            <option>26-50</option>
            <option>50+</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Contact Information -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <h2 class="text-lg font-bold text-slate-900 mb-4">Contact Information</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">
            Primary Phone
          </label>
          <input
            v-model="profile.phone"
            type="tel"
            class="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72]"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">
            Secondary Phone <span class="text-slate-400">(optional)</span>
          </label>
          <input
            v-model="profile.phoneSecondary"
            type="tel"
            placeholder="(555) 234-5678"
            class="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72]"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">
            Email Address
          </label>
          <input
            v-model="profile.email"
            type="email"
            class="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72]"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">
            Website URL
          </label>
          <input
            v-model="profile.website"
            type="url"
            class="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72]"
          />
        </div>
        <div class="md:col-span-2">
          <h3 class="font-semibold text-slate-900 mb-3 mt-2">Physical Address</h3>
        </div>
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-slate-700 mb-2">
            Street Address
          </label>
          <input
            v-model="profile.address"
            type="text"
            class="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72]"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">
            Suite/Unit <span class="text-slate-400">(optional)</span>
          </label>
          <input
            v-model="profile.suite"
            type="text"
            placeholder="Suite 200"
            class="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72]"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">City</label>
          <input
            v-model="profile.city"
            type="text"
            class="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72]"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">State</label>
          <select
            v-model="profile.state"
            class="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] bg-white"
          >
            <option>FL</option>
            <option>CA</option>
            <option>NY</option>
            <option>TX</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">ZIP Code</label>
          <input
            v-model="profile.postalCode"
            type="text"
            class="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72]"
          />
        </div>
        <div class="md:col-span-2">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="sameAsPhysical"
              type="checkbox"
              class="rounded border-slate-300 text-[#1B4F72] focus:ring-[#1B4F72]"
            />
            <span class="text-sm text-slate-600">
              Mailing address same as physical address
            </span>
          </label>
        </div>
      </div>
    </div>

    <!-- Business Hours -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-bold text-slate-900">Business Hours</h2>
        <button
          @click="copyHoursToAll"
          class="text-sm text-[#1B4F72] hover:underline font-medium flex items-center gap-1"
        >
          <Copy :size="14" />
          Copy to all weekdays
        </button>
      </div>
      <div class="space-y-3">
        <div
          v-for="(day, i) in businessHours"
          :key="i"
          class="grid grid-cols-12 gap-3 items-center"
        >
          <div class="col-span-3 font-medium text-slate-700">{{ day.day }}</div>
          <div class="col-span-2">
            <button
              @click="toggleDay(i)"
              :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                day.open ? 'bg-[#1B4F72]' : 'bg-slate-200',
              ]"
            >
              <span
                :class="[
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  day.open ? 'translate-x-6' : 'translate-x-1',
                ]"
              />
            </button>
          </div>
          <template v-if="day.open">
            <div class="col-span-3">
              <input
                v-model="day.start"
                type="time"
                class="w-full px-2 py-1.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72]"
              />
            </div>
            <div class="col-span-1 text-center text-slate-400">to</div>
            <div class="col-span-3">
              <input
                v-model="day.end"
                type="time"
                class="w-full px-2 py-1.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72]"
              />
            </div>
          </template>
          <div v-else class="col-span-7 text-sm text-slate-400">Closed</div>
        </div>
      </div>
    </div>

    <!-- Services Offered -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <h2 class="text-lg font-bold text-slate-900 mb-2">Services Offered</h2>
      <p class="text-sm text-slate-500 mb-4">
        These help your Coordinator answer "What services do you offer?"
      </p>
      <div class="flex flex-wrap gap-2 mb-4">
        <div
          v-for="(service, i) in services"
          :key="i"
          class="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-[#1B4F72] rounded-full text-sm font-medium"
        >
          {{ service }}
          <button
            @click="removeService(i)"
            class="hover:text-red-600"
          >
            <X :size="14" />
          </button>
        </div>
        <button
          @click="showAddService = true"
          class="inline-flex items-center gap-1 px-3 py-1.5 border-2 border-dashed border-slate-300 text-slate-600 rounded-full text-sm font-medium hover:border-[#1B4F72] hover:text-[#1B4F72] transition-colors"
        >
          <Plus :size="14" />
          Add service
        </button>
      </div>
      <div v-if="showAddService" class="flex gap-2">
        <input
          v-model="newService"
          @keyup.enter="addService"
          type="text"
          placeholder="Service name"
          class="flex-1 px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72]"
        />
        <button
          @click="addService"
          class="px-4 py-2 bg-[#1B4F72] text-white rounded-lg hover:bg-[#153e5a]"
        >
          Add
        </button>
        <button
          @click="showAddService = false"
          class="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </div>

    <!-- Footer -->
    <div class="flex justify-between items-center pt-4 border-t border-slate-200">
      <p class="text-sm text-slate-500">
        <span v-if="saveMessage" class="text-green-600">{{ saveMessage }}</span>
        <span v-else-if="errorMessage" class="text-red-600">{{ errorMessage }}</span>
        <template v-else>Last updated: {{ lastUpdated }}</template>
      </p>
      <div class="flex gap-3">
        <button
          type="button"
          @click="discardChanges"
          class="px-5 py-2.5 text-slate-600 font-medium rounded-lg hover:bg-slate-100 transition-colors"
        >
          Discard Changes
        </button>
        <button
          type="button"
          :disabled="saving"
          @click="saveProfile"
          class="px-5 py-2.5 bg-[#1B4F72] hover:bg-[#153e5a] disabled:opacity-50 text-white font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2"
        >
          <Save :size="18" />
          {{ saving ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Save, Copy, X, Plus } from 'lucide-vue-next';
import { useOrganizationsStore } from '@/stores/organizations';

const organizationsStore = useOrganizationsStore();

const sameAsPhysical = ref(true);
const showAddService = ref(false);
const newService = ref('');
const saving = ref(false);
const saveMessage = ref('');
const errorMessage = ref('');

const profile = ref({
  name: '',
  industry: '',
  yearEstablished: '',
  description: '',
  employeeCount: '',
  phone: '',
  phoneSecondary: '',
  email: '',
  website: '',
  address: '',
  suite: '',
  city: '',
  state: '',
  postalCode: '',
});

const businessHours = ref([
  { day: 'Monday', open: true, start: '09:00', end: '17:00' },
  { day: 'Tuesday', open: true, start: '09:00', end: '17:00' },
  { day: 'Wednesday', open: true, start: '09:00', end: '17:00' },
  { day: 'Thursday', open: true, start: '09:00', end: '17:00' },
  { day: 'Friday', open: true, start: '09:00', end: '17:00' },
  { day: 'Saturday', open: false, start: '09:00', end: '17:00' },
  { day: 'Sunday', open: false, start: '09:00', end: '17:00' },
]);

const services = ref<string[]>([]);

const lastUpdated = computed(() => {
  return new Date().toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
});

function toggleDay(index: number) {
  businessHours.value[index].open = !businessHours.value[index].open;
}

function copyHoursToAll() {
  const firstDay = businessHours.value[0];
  businessHours.value.forEach((day) => {
    day.start = firstDay.start;
    day.end = firstDay.end;
  });
}

function addService() {
  if (newService.value.trim()) {
    services.value.push(newService.value.trim());
    newService.value = '';
    showAddService.value = false;
  }
}

function removeService(index: number) {
  services.value.splice(index, 1);
}

async function saveProfile() {
  const org = organizationsStore.currentOrganization;
  if (!org) return;
  saving.value = true;
  saveMessage.value = '';
  errorMessage.value = '';
  try {
    await organizationsStore.updateOrganization(org.id, {
      name: profile.value.name,
      industry: profile.value.industry,
      phone: profile.value.phone || undefined,
      email: profile.value.email || undefined,
      website: profile.value.website || undefined,
      address: profile.value.address || undefined,
      city: profile.value.city || undefined,
      state: profile.value.state || undefined,
      postal_code: profile.value.postalCode || undefined,
      business_hours: Object.fromEntries(
        businessHours.value.map(d => [d.day.toLowerCase(), { open: d.open, start: d.start, end: d.end }])
      ),
      settings: {
        ...(org.settings || {}),
        business_profile: {
          year_established: profile.value.yearEstablished,
          description: profile.value.description,
          employee_count: profile.value.employeeCount,
          phone_secondary: profile.value.phoneSecondary,
          suite: profile.value.suite,
          services: services.value,
        },
      },
    });
    saveMessage.value = 'Profile saved';
  } catch (err) {
    const axiosErr = err as { response?: { data?: { message?: string } } };
    errorMessage.value = axiosErr.response?.data?.message || 'Failed to save profile';
  } finally {
    saving.value = false;
  }
}

function loadProfile() {
  const org = organizationsStore.currentOrganization;
  if (!org) return;
  const extras = (org.settings?.business_profile ?? {}) as Record<string, string | string[] | undefined>;
  profile.value = {
    name: org.name || '',
    industry: org.industry || '',
    yearEstablished: (extras.year_established as string) || '',
    description: (extras.description as string) || '',
    employeeCount: (extras.employee_count as string) || '',
    phone: org.phone || '',
    phoneSecondary: (extras.phone_secondary as string) || '',
    email: org.email || '',
    website: org.website || '',
    address: org.address || '',
    suite: (extras.suite as string) || '',
    city: org.city || '',
    state: org.state || '',
    postalCode: org.postal_code || '',
  };
  services.value = Array.isArray(extras.services) ? [...extras.services] : [];
  if (org.business_hours) {
    businessHours.value = businessHours.value.map(d => {
      const saved = org.business_hours?.[d.day.toLowerCase()];
      return saved ? { day: d.day, open: !!saved.open, start: saved.start || d.start, end: saved.end || d.end } : d;
    });
  }
}

function discardChanges() {
  saveMessage.value = '';
  errorMessage.value = '';
  loadProfile();
}

onMounted(() => {
  loadProfile();
});
</script>

