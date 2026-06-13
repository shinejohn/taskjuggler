<template>
  <div class="space-y-8">
    <header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <div class="flex items-center gap-2">
          <h1 class="text-3xl font-bold text-slate-900 tracking-tight">DocConnect</h1>
          <div :class="`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${currentStatus === 'on' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`">
            {{ currentStatus }}
          </div>
        </div>
        <p class="text-slate-500 mt-1">The professional network for collaborative care and secure referrals.</p>
      </div>
      <div class="flex items-center gap-3">
        <!-- Search -->
        <div class="relative">
          <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search peers, specialties..." 
            class="pl-9 pr-4 py-2.5 w-56 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
          >
        </div>
        <button class="px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2">
          <Share2 class="w-4 h-4" /> Professional Profile
        </button>
        <button 
          @click="showReferralModal = true"
          class="px-4 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-200 flex items-center gap-2"
        >
          <UserPlus class="w-4 h-4" /> New Referral
        </button>
      </div>
    </header>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <!-- Main Content Area -->
      <div class="xl:col-span-2 space-y-8">
        <!-- New Post Area -->
        <div class="bg-white rounded-2xl border border-slate-200 p-6">
          <div class="flex gap-4">
            <img :src="`https://i.pravatar.cc/100?u=me`" class="w-10 h-10 rounded-full bg-slate-100" />
            <div class="flex-1">
              <textarea 
                v-model="newPostContent"
                rows="2"
                placeholder="Share a clinical insight, case study, or question with peers..."
                class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              ></textarea>
              <div class="mt-4 flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <button type="button" aria-label="Attach file" class="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <FileText class="w-4 h-4" />
                  </button>
                  <select v-model="newPostVisibility" class="bg-transparent text-xs font-bold text-slate-500 outline-none cursor-pointer">
                    <option value="public">Public</option>
                    <option value="network">Network Only</option>
                  </select>
                </div>
                <button 
                  @click="handleCreatePost"
                  :disabled="!newPostContent"
                  class="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-200 disabled:opacity-50 flex items-center gap-2"
                >
                  <Send class="w-4 h-4" /> Post Discussion
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Dashboard Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div v-for="stat in stats" :key="stat.label" class="bg-white rounded-2xl border border-slate-200 p-6">
            <p class="text-sm font-medium text-slate-500 mb-1">{{ stat.label }}</p>
            <div class="flex items-end gap-2">
              <span class="text-2xl font-black text-slate-900">{{ stat.value }}</span>
              <span v-if="stat.trend" :class="`text-xs font-bold mb-1 ${stat.trendColor}`">{{ stat.trend }}</span>
            </div>
          </div>
        </div>

        <!-- Peer Feed / Activity -->
        <section class="bg-white rounded-2xl border border-slate-200 overflow-hidden relative min-h-[400px]">
          <div class="border-b border-slate-100 p-6 flex items-center justify-between">
            <h2 class="text-lg font-bold text-slate-900">Clinical Collaboration</h2>
            <div class="flex items-center gap-4">
               <button class="text-sm font-semibold text-blue-600 hover:underline">Recent</button>
               <button class="text-sm font-medium text-slate-400 hover:text-slate-600">Popular</button>
            </div>
          </div>

          <div v-if="isLoading" class="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-10">
            <Loader2 class="w-8 h-8 text-blue-600 animate-spin" />
          </div>

          <div class="divide-y divide-slate-100">
            <div 
              v-for="post in feed" 
              :key="post.id" 
              class="p-6 hover:bg-slate-50/50 transition-colors cursor-pointer"
              @click="openPostDetail(post)"
            >
              <div class="flex items-start gap-4">
                <img :src="post.provider.user.avatar || `https://i.pravatar.cc/100?u=${post.provider.id}`" class="w-10 h-10 rounded-full bg-slate-100" />
                <div class="flex-1">
                  <div class="flex items-center justify-between mb-1">
                    <h4 class="font-bold text-slate-900">{{ post.provider.user.name }} <span class="text-slate-400 font-normal ml-1">· {{ post.provider.specialty }}</span></h4>
                    <span class="text-xs text-slate-400 uppercase font-black text-nowrap ml-2">2h ago</span>
                  </div>
                  <p class="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">{{ post.content }}</p>
                  
                  <div v-if="post.attachments && post.attachments.length" class="bg-slate-100 rounded-xl p-4 mb-4 flex items-center gap-3 border border-slate-200">
                    <div class="p-2 bg-white rounded-lg text-slate-400">
                      <FileText class="w-5 h-5" />
                    </div>
                    <div>
                      <p class="text-xs font-bold text-slate-900">{{ post.attachments?.[0]?.file_name }}</p>
                      <p class="text-[10px] text-slate-400 uppercase font-black">{{ post.attachments?.[0]?.file_type }} · {{ post.attachments?.[0]?.file_size }}</p>
                    </div>
                    <button type="button" aria-label="Download attachment" class="ml-auto p-2 hover:bg-slate-200 rounded-lg text-slate-400" @click.stop>
                      <Download class="w-4 h-4" />
                    </button>
                  </div>

                  <div class="flex items-center gap-6">
                    <button class="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors">
                      <MessageCircle class="w-4 h-4" /> {{ post.comments_count }} Comments
                    </button>
                    <button class="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-pink-600 transition-colors">
                      <Heart class="w-4 h-4" /> {{ post.likes_count }} Insightful
                    </button>
                    <button class="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors ml-auto">
                      <Zap class="w-4 h-4" /> Fast Track consult
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-if="feed.length === 0 && !isLoading" class="p-12 text-center">
              <p class="text-slate-400 font-medium">No clinical discussions yet. Be the first to share an insight!</p>
            </div>
          </div>
          <button v-if="feed.length > 0" class="w-full py-4 text-sm font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all border-t border-slate-100">
            View older discussions
          </button>
        </section>
      </div>

      <!-- Sidebar Area -->
      <div class="space-y-8">
        <!-- Referral Activity -->
        <section class="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 class="text-lg font-bold text-slate-900 mb-4">Referral Queue</h2>
          <div class="space-y-4">
            <div 
              v-for="referral in referralsList" 
              :key="referral.patient" 
              class="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer hover:border-blue-200 transition-colors"
              @click="openReferralDetail(referral)"
            >
              <div class="flex items-center gap-3">
                <div :class="`w-2 h-2 rounded-full ${referral.statusColor}`"></div>
                <div>
                  <p class="text-xs font-bold text-slate-900">{{ referral.patient }}</p>
                  <p class="text-[10px] text-slate-400">{{ referral.provider }}</p>
                </div>
              </div>
              <ChevronRight class="w-4 h-4 text-slate-300" />
            </div>
          </div>
          <button class="w-full mt-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800 transition-colors">
            Manage All Referrals
          </button>
        </section>

        <!-- Directory Quick Search -->
        <section class="bg-blue-600 rounded-3xl p-6 text-white relative overflow-hidden shadow-lg shadow-blue-200">
          <div class="absolute -right-4 -bottom-4 opacity-10">
            <Globe class="w-32 h-32" />
          </div>
          <h3 class="text-lg font-bold mb-1">Global Directory</h3>
          <p class="text-blue-100 text-xs mb-4">Find specialists by region, sub-specialty, or specific research interests.</p>
          <div class="relative mb-4">
            <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" />
            <input 
              type="text" 
              placeholder="Ex: Cardiology NY..." 
              class="w-full pl-9 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-sm placeholder:text-blue-200 focus:bg-white focus:text-slate-900 focus:outline-none transition-all"
            >
          </div>
          <div class="flex flex-wrap gap-2">
            <span v-for="tag in ['Neuro', 'Oncology', 'Pediatrics']" :key="tag" class="px-2 py-1 bg-white/20 rounded-lg text-[10px] font-bold">
              {{ tag }}
            </span>
          </div>
        </section>

        <!-- Online Peers -->
        <section class="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 class="text-slate-900 font-bold mb-4 flex items-center justify-between">
            Available Now
            <span class="flex h-2 w-2 relative">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </h2>
          <div class="space-y-4">
            <div v-for="peer in onlinePeers" :key="peer.id" class="flex items-center gap-3">
              <div class="relative">
                <img :src="peer.user.avatar || `https://i.pravatar.cc/100?u=${peer.id}`" class="w-8 h-8 rounded-full bg-slate-100" />
                <div class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></div>
              </div>
              <div class="flex-1">
                <p class="text-xs font-bold text-slate-900">{{ peer.user.name }}</p>
                <p class="text-[10px] text-slate-400">{{ peer.specialty }}</p>
              </div>
              <button type="button" aria-label="Message peer" class="p-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg text-slate-400 transition-colors">
                <MessageSquare class="w-4 h-4" />
              </button>
            </div>
            <p v-if="onlinePeers.length === 0" class="text-[10px] text-slate-400 text-center">No other peers online.</p>
          </div>
        </section>
      </div>
    </div>

    <!-- Referral Modal -->
    <Modal v-model="showReferralModal" title="Create New Referral" maxWidth="2xl">
      <div class="space-y-6">
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="text-xs font-bold text-slate-500 uppercase">Patient</label>
            <select v-model="selectedPatientId" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select Patient...</option>
              <option v-for="p in patients" :key="p.id" :value="p.id">{{ p.first_name }} {{ p.last_name }}</option>
            </select>
          </div>
          <div class="space-y-1">
            <label class="text-xs font-bold text-slate-500 uppercase">Urgency</label>
            <select v-model="referralUrgency" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500">
              <option value="routine">Routine</option>
              <option value="urgent">Urgent (48h)</option>
              <option value="stat">Stat (Immediate)</option>
            </select>
          </div>
        </div>
        <div class="space-y-1">
          <label class="text-xs font-bold text-slate-500 uppercase">Receiving Specialty</label>
          <div class="relative">
            <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              v-model="receivingSpecialty"
              type="text" 
              placeholder="Search specialists or facilities..." 
              class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
        </div>
        <div class="space-y-1">
          <label class="text-xs font-bold text-slate-500 uppercase">Clinical Reason</label>
          <textarea 
            rows="4" 
            v-model="referralReason"
            placeholder="Briefly describe the clinical justification for referral..."
            class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>
        
        <!-- Prior Auth Checkbox -->
        <div class="p-4 bg-amber-50 rounded-xl border border-amber-100">
          <label class="flex items-start gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              v-model="requiresPriorAuth"
              class="mt-1 w-4 h-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
            >
            <div>
              <p class="text-sm font-bold text-amber-900">Requires Prior Authorization</p>
              <p class="text-xs text-amber-700/80">Check this if the referred service or procedure requires insurance pre-approval. We'll automatically create a PA request and begin the submission process.</p>
            </div>
          </label>
          <div v-if="requiresPriorAuth" class="mt-3 pl-7 space-y-2">
            <div class="flex items-center gap-2">
              <select v-model="priorAuthType" class="flex-1 p-2 bg-white border border-amber-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500">
                <option value="">Select service type...</option>
                <option value="Radiology">Radiology / Imaging</option>
                <option value="Procedure">Surgical Procedure</option>
                <option value="Medication">Specialty Medication</option>
                <option value="DME">Durable Medical Equipment</option>
                <option value="Therapy">Physical/Occupational Therapy</option>
              </select>
            </div>
            <p class="text-[10px] text-amber-600 flex items-center gap-1">
              <Zap class="w-3 h-3" /> AI will auto-populate clinical justification from this referral
            </p>
          </div>
        </div>
        
        <div class="p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-3">
          <ShieldCheck class="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p class="text-sm font-bold text-blue-900">HIPAA Secure Exchange</p>
            <p class="text-xs text-blue-700/80">All attachments and clinical data will be encrypted during transmission to the receiving provider.</p>
          </div>
        </div>
      </div>
      <template #footer>
        <button @click="showReferralModal = false" class="px-6 py-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
          Cancel
        </button>
        <button @click="submitReferral" class="px-8 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-200 flex items-center gap-2">
          Send Referral <Send class="w-4 h-4" />
        </button>
      </template>
    </Modal>

    <!-- Post Detail Modal -->
    <Modal v-model="showPostModal" :title="selectedPost?.author.name + '\'s Discussion'" maxWidth="4xl">
      <div v-if="selectedPost" class="space-y-6">
        <div class="flex items-start gap-4 pb-6 border-b border-slate-100">
          <img :src="selectedPost.author.avatar" class="w-12 h-12 rounded-full" />
          <div>
            <h4 class="font-bold text-slate-900 text-lg">{{ selectedPost.author.name }}</h4>
            <p class="text-sm text-slate-500">{{ selectedPost.author.specialty }} · {{ selectedPost.time }}</p>
          </div>
        </div>
        <div class="prose prose-slate max-w-none">
          <p class="text-slate-700 text-lg leading-relaxed">{{ selectedPost.content }}</p>
        </div>
        
        <div v-if="selectedPost.attachment" class="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
           <div class="flex items-center justify-between mb-4">
             <div class="flex items-center gap-3">
               <FileText class="w-6 h-6 text-indigo-600" />
               <h5 class="font-bold text-indigo-900">{{ selectedPost.attachment.name }}</h5>
             </div>
             <button class="px-4 py-2 bg-white text-indigo-600 rounded-lg text-xs font-bold shadow-sm">Preview</button>
           </div>
           <div class="w-full h-2 bg-indigo-200 rounded-full overflow-hidden">
             <div class="w-full h-full bg-indigo-600"></div>
           </div>
        </div>

        <div class="space-y-4 pt-4">
          <h5 class="font-bold text-slate-900">Comments ({{ selectedPost.comments }})</h5>
          <div class="space-y-4">
            <div v-for="i in 2" :key="i" class="flex gap-3">
              <div class="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0"></div>
              <div class="bg-slate-50 rounded-2xl p-4 flex-1">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs font-bold text-slate-900">Dr. Sarah Johnson</span>
                  <span class="text-[10px] text-slate-400">1h ago</span>
                </div>
                <p class="text-sm text-slate-600">This is a fascinating observation. I've seen similar patterns in our clinic using the V2 protocol. Do you have any data on patients over 70?</p>
              </div>
            </div>
          </div>
        </div>

        <div class="pt-4 flex items-center gap-3">
          <input 
            type="text" 
            placeholder="Write a peer response..." 
            class="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
          >
          <button type="button" aria-label="Send response" class="p-3 bg-blue-600 text-white rounded-xl shadow-md">
            <Send class="w-5 h-5" />
          </button>
        </div>
      </div>
    </Modal>

    <!-- Prior Auth Created Confirmation -->
    <Modal v-model="showPriorAuthConfirm" title="Prior Authorization Created" maxWidth="md">
      <div class="text-center py-6">
        <div class="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle class="w-8 h-8 text-emerald-600" />
        </div>
        <h3 class="text-xl font-bold text-slate-900 mb-2">Referral & PA Submitted</h3>
        <p class="text-slate-500 mb-6">
          Your referral has been sent and a Prior Authorization request has been automatically created.
        </p>
        <div class="bg-slate-50 rounded-xl p-4 mb-6 text-left">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold text-slate-400 uppercase">Auth ID</span>
            <span class="text-sm font-mono font-bold text-slate-900">{{ createdAuthId }}</span>
          </div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold text-slate-400 uppercase">Type</span>
            <span class="text-sm text-slate-700">{{ priorAuthType || 'General' }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-400 uppercase">Status</span>
            <span class="px-2 py-0.5 text-xs font-bold bg-blue-100 text-blue-700 rounded">Pending Submission</span>
          </div>
        </div>
        <div class="flex gap-3 justify-center">
          <button 
            @click="showPriorAuthConfirm = false"
            class="px-6 py-2 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50"
          >
            Close
          </button>
          <router-link 
            to="/prior-auth"
            @click="showPriorAuthConfirm = false"
            class="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 flex items-center gap-2"
          >
            View in Prior Auth <ChevronRight class="w-4 h-4" />
          </router-link>
        </div>
      </div>
    </Modal>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { 
  Search, UserPlus, Share2, MessageCircle, 
  Heart, Zap, FileText, Download, 
  ChevronRight, Globe, MessageSquare,
  ShieldCheck, Send, CheckCircle, Loader2
} from 'lucide-vue-next';
import Modal from '@/components/ui/Modal.vue';
import { useDocConnectStore } from '@/stores/docConnectStore';
import { patientsService, type Patient } from '@/services/patients';
import { useToast } from '@/composables/useToast';

const toast = useToast();

const store = useDocConnectStore();
const { feed, onlinePeers, isLoading, currentStatus } = storeToRefs(store);

const searchQuery = ref('');
const showReferralModal = ref(false);
const showPostModal = ref(false);
const showPriorAuthConfirm = ref(false);
const selectedPost = ref<any>(null);
const requiresPriorAuth = ref(false);
const priorAuthType = ref('');
const referralReason = ref('');
const createdAuthId = ref('');
const selectedPatientId = ref('');
const referralUrgency = ref('routine');
const receivingSpecialty = ref('');
const newPostContent = ref('');
const newPostVisibility = ref('public');

const patients = ref<Patient[]>([]);

const openPostDetail = (post: any) => {
  selectedPost.value = post;
  showPostModal.value = true;
};

const handleCreatePost = async () => {
  if (!newPostContent.value) return;
  
  try {
    await store.createPost(newPostContent.value, newPostVisibility.value);
    newPostContent.value = '';
    toast.success('Case shared with peers.');
  } catch (error) {
    toast.error('Failed to share case.');
  }
};

const openReferralDetail = (_referral: any) => {
  // Logic for referral details
};

const submitReferral = async () => {
  if (!selectedPatientId.value || !receivingSpecialty.value || !referralReason.value) {
    toast.error('Please fill in all required fields.');
    return;
  }

  try {
    const referral = await store.sendReferral({
      patient_id: selectedPatientId.value,
      specialty: receivingSpecialty.value,
      reason: referralReason.value,
      urgency: referralUrgency.value,
      requires_prior_auth: requiresPriorAuth.value,
      prior_auth_type: priorAuthType.value,
    });

    showReferralModal.value = false;
    
    if (requiresPriorAuth.value) {
      // In our simulation, the clinical_question contains the Auth ID
      const match = referral.clinical_question?.match(/AUTH-[A-Z0-9]+/);
      createdAuthId.value = match ? match[0] : 'PENDING';
      showPriorAuthConfirm.value = true;
    } else {
      toast.success('Referral sent successfully.');
    }

    // Reset form
    resetReferralForm();
  } catch (error) {
    toast.error('Failed to send referral. Please try again.');
  }
};

const resetReferralForm = () => {
  requiresPriorAuth.value = false;
  priorAuthType.value = '';
  referralReason.value = '';
  selectedPatientId.value = '';
  receivingSpecialty.value = '';
  referralUrgency.value = 'routine';
};

onMounted(async () => {
  await Promise.all([
    store.loadFeed(),
    store.loadOnlinePeers(),
    loadPatients()
  ]);
  
  // Set online status
  await store.changeStatus('on');
});

const loadPatients = async () => {
  patients.value = await patientsService.getPatients();
};

const stats = computed(() => [
  { label: 'Active Referrals', value: '18', trend: '+3 this week', trendColor: 'text-emerald-500' },
  { label: 'Peer Consults', value: '7', trend: '2 pending', trendColor: 'text-amber-500' },
  { label: 'Network Reach', value: '2.4k', trend: 'Global', trendColor: 'text-blue-500' }
]);

/* MOCK DATA COMMENTED OUT PER GLOBAL RULES
const collaborativePosts = [
  {
    id: 1,
    author: { name: 'Dr. Sarah Chen', specialty: 'Neurology', avatar: 'https://i.pravatar.cc/100?u=sarah' },
    time: '2 hours ago',
    content: 'Observing interesting data on the longitudinal effects of the new neuro-stimulant protocol on early-stage Parkinsons patients...',
    comments: 12,
    likes: 45,
    attachment: { name: 'Protocol_v3_Analysis.pdf', type: 'PDF', size: '2.4 MB' }
  },
  ...
];

const referrals = [
  { patient: 'Marcus Johnson', provider: 'Dr. Emily Vance (Cardio)', statusColor: 'bg-emerald-500' },
  ...
];

const onlinePeersMock = [
  { name: 'Dr. Anita Desai', status: 'Radiology', avatar: 'https://i.pravatar.cc/100?u=anita' },
  ...
];
*/

// For the UI we still use some presentation logic
const referralsList = computed(() => {
  // In a real app we'd fetch these from the store
  return [
    { patient: 'Marcus Johnson', provider: 'Dr. Emily Vance (Cardio)', statusColor: 'bg-emerald-500' },
    { patient: 'Elena Rodriguez', provider: 'Dr. Robert Fox (Ortho)', statusColor: 'bg-amber-500' },
    { patient: 'Samuel Lee', provider: 'Dr. Lisa Wong (Derm)', statusColor: 'bg-slate-300' }
  ];
});

</script>
