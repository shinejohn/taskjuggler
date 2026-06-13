<template>
  <div class="space-y-6">
    <header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 tracking-tight">Provider Directory</h1>
        <p class="text-slate-500 mt-1">Search the global network of specialists and facilities.</p>
      </div>
    </header>

    <!-- Search & Filters -->
    <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="md:col-span-2 relative">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            v-model="filters.query"
            type="text" 
            placeholder="Search by name, clinical interest, or keyword..."
            class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
            @keyup.enter="handleSearch"
          >
        </div>
        <div class="relative">
          <MapPin class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            v-model="filters.location"
            type="text" 
            placeholder="City, State, or Zip"
            class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
            @keyup.enter="handleSearch"
          >
        </div>
        <div>
          <select 
            v-model="filters.specialty" 
            class="w-full h-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-600 cursor-pointer"
            @change="handleSearch"
          >
            <option value="">All Specialties</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Dermatology">Dermatology</option>
            <option value="Neurology">Neurology</option>
            <option value="Orthopedics">Orthopedics</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="Psychiatry">Psychiatry</option>
            <option value="Radiology">Radiology</option>
            <option value="Surgery">Surgery</option>
          </select>
        </div>
      </div>
      
      <div class="mt-4 flex flex-wrap gap-2">
        <span v-for="tag in commonTags" :key="tag" 
          @click="toggleTag(tag)"
          :class="`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${filters.query.includes(tag) ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`"
        >
          {{ tag }}
        </span>
      </div>

      <div class="mt-6 flex justify-end">
        <button 
          @click="handleSearch"
          class="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2"
        >
          <Search class="w-4 h-4" /> Find Providers
        </button>
      </div>
    </div>

    <!-- Results -->
    <div v-if="isLoading" class="py-12 flex justify-center">
      <Loader2 class="w-10 h-10 text-blue-600 animate-spin" />
    </div>
    
    <div v-else-if="results.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="provider in results" 
        :key="provider.id" 
        class="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-shadow cursor-pointer group"
        @click="viewProfile(provider.id)"
      >
        <div class="flex items-start gap-4 mb-4">
          <img :src="provider.user?.avatar || `https://i.pravatar.cc/150?u=${provider.id}`" class="w-16 h-16 rounded-full bg-slate-100 object-cover" />
          <div>
            <h3 class="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{{ provider.user?.first_name }} {{ provider.user?.last_name }}, {{ provider.credential || 'MD' }}</h3>
            <p class="text-sm font-semibold text-blue-600">{{ provider.specialty }}</p>
            <p class="text-xs text-slate-500 flex items-center gap-1 mt-1">
              <Building2 class="w-3 h-3" /> {{ provider.organization?.name || 'Private Practice' }}
            </p>
            <p class="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <MapPin class="w-3 h-3" /> {{ provider.organization?.city || 'New York' }}, {{ provider.organization?.state || 'NY' }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2 mb-6">
          <div :class="`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${provider.is_accepting_referrals ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`">
            {{ provider.is_accepting_referrals ? 'Accepting Referrals' : 'No Referrals' }}
          </div>
          <div v-if="provider.online_status?.status === 'on'" class="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] uppercase font-bold tracking-wider">
            Online Now
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <button class="py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
            <MessageSquare class="w-4 h-4" /> Message
          </button>
          <button class="py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
            <UserPlus class="w-4 h-4" /> Refer Patient
          </button>
        </div>
      </div>
    </div>

    <div v-else-if="hasSearched" class="py-20 text-center">
      <div class="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Search class="w-10 h-10 text-slate-400" />
      </div>
      <h3 class="text-lg font-bold text-slate-900">No providers found</h3>
      <p class="text-slate-500">Try adjusting your filters or search terms.</p>
    </div>
    
    <div v-else class="py-20 text-center">
        <p class="text-slate-400">Enter a search term to find providers.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useDocConnectStore } from '@/stores/docConnectStore';
import { Search, MapPin, Building2, MessageSquare, UserPlus, Loader2 } from 'lucide-vue-next';

const router = useRouter();
const store = useDocConnectStore();

const filters = reactive({
  query: '',
  location: '',
  specialty: '',
  insurance: ''
});

interface DirectoryProvider {
  id: string;
  specialty: string;
  credential?: string;
  location?: string;
  user?: { first_name?: string; last_name?: string; name?: string; avatar?: string };
  organization?: { name?: string; city?: string; state?: string };
  is_accepting_referrals?: boolean;
  online_status?: { status: string };
  rating?: number;
  tags?: string[];
}

const results = ref<DirectoryProvider[]>([]);
const isLoading = ref(false);
const hasSearched = ref(false);

const commonTags = ['Telehealth', 'Pediatric', 'Geriatric', 'Research', 'Oncology'];

const handleSearch = async () => {
  isLoading.value = true;
  hasSearched.value = true;
  try {
    const response = await store.searchDirectory(filters);
    results.value = response.data; // Paginated response
  } catch (error) {
    // search failed — results stay empty
  } finally {
    isLoading.value = false;
  }
};

const viewProfile = (id: string) => {
  router.push(`/docconnect/profile/${id}`);
};

const toggleTag = (tag: string) => {
    if (filters.query.includes(tag)) {
        filters.query = filters.query.replace(tag, '').trim();
    } else {
        filters.query = filters.query ? `${filters.query} ${tag}` : tag;
    }
}
</script>
