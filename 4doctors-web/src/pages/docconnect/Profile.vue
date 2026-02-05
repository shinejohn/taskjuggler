<template>
  <div class="max-w-5xl mx-auto space-y-8">
    <div v-if="isLoading" class="py-20 flex justify-center">
      <Loader2 class="w-12 h-12 text-blue-600 animate-spin" />
    </div>

    <div v-else-if="profile" class="space-y-8">
      <!-- Header / Hero -->
      <header class="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm relative overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
        
        <div class="flex flex-col md:flex-row gap-8 relative z-10">
          <img :src="profile.user?.avatar || `https://i.pravatar.cc/300?u=${profile.id}`" class="w-32 h-32 rounded-2xl bg-slate-100 object-cover shadow-lg" />
          
          <div class="flex-1">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 class="text-3xl font-black text-slate-900">{{ profile.user?.first_name }} {{ profile.user?.last_name }}, {{ profile.credential || 'MD' }}</h1>
                <p class="text-xl font-medium text-blue-600 mt-1">{{ profile.specialty }}</p>
                <div class="flex items-center gap-4 mt-3 text-sm text-slate-500">
                  <span class="flex items-center gap-1.5"><Building2 class="w-4 h-4" /> {{ profile.organization?.name }}</span>
                  <span class="flex items-center gap-1.5"><MapPin class="w-4 h-4" /> {{ profile.organization?.city }}, {{ profile.organization?.state }}</span>
                </div>
              </div>
              
              <div class="flex gap-3">
                 <button class="px-6 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2">
                   <MessageSquare class="w-4 h-4" /> Message
                 </button>
                 <button class="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors flex items-center gap-2">
                   <UserPlus class="w-4 h-4" /> Send Referral
                 </button>
              </div>
            </div>

            <div class="mt-8 flex flex-wrap gap-3">
              <div v-if="profile.doc_connect_profile?.is_accepting_referrals" class="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                <CheckCircle class="w-4 h-4" /> Accepting Referrals
              </div>
              <div v-for="tag in profile.doc_connect_profile?.clinical_interests" :key="tag" class="px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold">
                {{ tag }}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Sidebar Info -->
        <div class="space-y-6">
          <section class="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Contact & Locations</h3>
            <div class="space-y-4">
              <div class="flex items-start gap-3">
                <div class="bg-slate-50 p-2 rounded-lg text-slate-400"><Phone class="w-4 h-4" /></div>
                <div>
                  <p class="font-bold text-slate-900 text-sm">Office Phone</p>
                  <p class="text-slate-500 text-sm">{{ profile.phone || '(555) 123-4567' }}</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="bg-slate-50 p-2 rounded-lg text-slate-400"><Mail class="w-4 h-4" /></div>
                <div>
                  <p class="font-bold text-slate-900 text-sm">Secure Email</p>
                  <p class="text-slate-500 text-sm">{{ profile.user?.email }}</p>
                </div>
              </div>
            </div>
          </section>

          <section class="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Education</h3>
            <div class="space-y-4">
              <div v-for="(edu, idx) in profile.doc_connect_profile?.education_history" :key="idx" class="relative pl-4 border-l-2 border-slate-100">
                <p class="font-bold text-slate-900 text-sm">{{ edu.institution }}</p>
                <p class="text-slate-500 text-xs">{{ edu.degree }}, {{ edu.year }}</p>
              </div>
            </div>
          </section>
        </div>

        <!-- Main Bio & Details -->
        <div class="lg:col-span-2 space-y-6">
          <section class="bg-white rounded-2xl border border-slate-200 p-8">
            <h3 class="text-lg font-bold text-slate-900 mb-4">About</h3>
            <p class="text-slate-600 leading-relaxed whitespace-pre-line">{{ profile.doc_connect_profile?.bio || 'No biography available.' }}</p>
          </section>

          <section v-if="profile.doc_connect_profile?.research_interests?.length" class="bg-white rounded-2xl border border-slate-200 p-8">
             <h3 class="text-lg font-bold text-slate-900 mb-4">Research & Publications</h3>
             <ul class="space-y-3">
               <li v-for="(pub, idx) in profile.doc_connect_profile?.publications" :key="idx" class="flex gap-3 text-sm text-slate-600">
                 <span class="font-bold text-slate-300">{{ Number(idx) + 1 }}.</span>
                 {{ pub }}
               </li>
             </ul>
          </section>

           <section class="bg-white rounded-2xl border border-slate-200 p-8">
             <h3 class="text-lg font-bold text-slate-900 mb-4">Insurance Accepted</h3>
             <div class="flex flex-wrap gap-2">
               <span v-for="ins in profile.doc_connect_profile?.accepted_insurances || ['Blue Cross', 'Aetna', 'UnitedHealthcare', 'Medicare']" :key="ins" class="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-bold border border-green-100">
                 {{ ins }}
               </span>
             </div>
           </section>
        </div>
      </div>
    </div>
    
    <div v-else class="py-20 text-center">
      <p class="text-slate-400">Profile not found.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useDocConnectStore } from '@/stores/docConnectStore';
import { Building2, MapPin, MessageSquare, UserPlus, Phone, Mail, CheckCircle, Loader2 } from 'lucide-vue-next';

const route = useRoute();
const store = useDocConnectStore();

const profile = ref<any>(null);
const isLoading = ref(true);

onMounted(async () => {
  const id = route.params.id as string;
  // In a real app we'd fetch the specific profile. For now we can use the search or specific endpoint.
  // Since we don't have a getProfile endpoint in the store yet, let's mock the fetch for now using search
  try {
     await store.searchDirectory({ query: '', id: id }); // Assuming backend supports ID filter or we just fetch details
     // Actually let's simulate a fetch
     setTimeout(() => {
        profile.value = {
            id: '1',
            user: { first_name: 'Emily', last_name: 'Vance', email: 'emily.vance@example.com' },
            specialty: 'Cardiology',
            credential: 'MD, FACC',
            organization: { name: 'Metro General Hospital', city: 'New York', state: 'NY' },
            phone: '(212) 555-0199',
            doc_connect_profile: {
                bio: 'Dr. Vance is a board-certified cardiologist specializing in heart failure and transplant cardiology. She completed her fellowship at Johns Hopkins and has been practicing for over 15 years. Her research focuses on novel pharmacological interventions for Class III heart failure.',
                clinical_interests: ['Heart Failure', 'Transplant', 'LVAD'],
                is_accepting_referrals: true,
                education_history: [
                    { institution: 'Johns Hopkins University', degree: 'Fellowship', year: '2012' },
                    { institution: 'UCSF', degree: 'Residency', year: '2009' },
                    { institution: 'Harvard Medical School', degree: 'MD', year: '2006' }
                ],
                publications: [
                    'Vance, E. et al. "Long-term outcomes of LVAD therapy in bridge-to-transplant patients." JACC 2018.',
                    'Vance, E. "Novel biomarkers in early stage heart failure." Circulation 2020.'
                ]
            }
        };
        isLoading.value = false;
     }, 1000);
  } catch (e) {
      console.error(e);
      isLoading.value = false;
  }
});
</script>
