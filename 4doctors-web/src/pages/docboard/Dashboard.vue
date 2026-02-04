<template>
  <div class="div">
    <header class="mb-6 flex justify-between items-center">
        <div>
            <h1 class="text-2xl font-bold text-slate-900">DocBoard</h1>
            <p class="text-slate-500">Your practice command center.</p>
        </div>
        <div class="flex gap-2">
            <button class="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50">Filter</button>
            <button class="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800">+ New Task</button>
        </div>
    </header>

    <!-- Category Tabs -->
    <div class="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button v-for="tab in tabs" :key="tab.id"
            @click="activeTab = tab.id"
            :class="['px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors', 
                     activeTab === tab.id ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50']">
            {{ tab.label }}
            <span v-if="tab.count" :class="['ml-2 px-1.5 py-0.5 rounded-full text-xs', activeTab === tab.id ? 'bg-slate-700 text-slate-200' : 'bg-slate-100 text-slate-600']">{{ tab.count }}</span>
        </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p class="text-xs text-slate-500 font-medium uppercase">Pending Signature</p>
            <p class="text-2xl font-bold text-red-600 mt-1">12</p>
        </div>
         <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p class="text-xs text-slate-500 font-medium uppercase">Results to Review</p>
            <p class="text-2xl font-bold text-orange-600 mt-1">8</p>
        </div>
         <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p class="text-xs text-slate-500 font-medium uppercase">Refill Requests</p>
            <p class="text-2xl font-bold text-blue-600 mt-1">5</p>
        </div>
         <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p class="text-xs text-slate-500 font-medium uppercase">Patient Messages</p>
            <p class="text-2xl font-bold text-purple-600 mt-1">3</p>
        </div>
    </div>

    <!-- Task List -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="divide-y divide-slate-100">
            <div v-for="task in tasks" :key="task.id" 
                class="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors group cursor-pointer"
                @click="selectedTask = task">
                <div class="p-2 rounded-lg" :class="getTaskColor(task.type)">
                    <component :is="getTaskIcon(task.type)" class="w-5 h-5" />
                </div>
                <div class="flex-1">
                    <div class="flex justify-between">
                        <h3 class="font-medium text-slate-900">{{ task.title }}</h3>
                        <span class="text-xs font-mono text-slate-400">10m ago</span>
                    </div>
                    <p class="text-sm text-slate-500">{{ task.patient }} • {{ task.details }}</p>
                </div>
                <div class="flex items-center gap-2" @click.stop>
                    <router-link 
                        v-if="task.type === 'note'"
                        to="/visit/123/review" 
                        class="opacity-0 group-hover:opacity-100 px-3 py-1 text-sm border border-slate-200 rounded hover:bg-white transition-opacity text-blue-600 font-medium"
                    >
                        Review
                    </router-link>
                    <router-link 
                        v-else-if="task.type === 'result'"
                        to="/billing/claimcoach" 
                        class="opacity-0 group-hover:opacity-100 px-3 py-1 text-sm border border-slate-200 rounded hover:bg-white transition-opacity text-emerald-600 font-medium"
                    >
                        Verify
                    </router-link>
                    <button v-else class="opacity-0 group-hover:opacity-100 px-3 py-1 text-sm border border-slate-200 rounded hover:bg-white transition-opacity">
                        Action
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Task Detail Modal (Project 6.3) -->
    <Modal v-if="selectedTask" v-model="showDetailModal" :title="selectedTask.title" maxWidth="lg" @close="selectedTask = null">
        <div class="space-y-6">
            <!-- Patient Quick View -->
            <div class="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                    {{ selectedTask.patient.split(' ').map((n: string)=>n[0]).join('') }}
                </div>
                <div>
                    <h4 class="font-bold text-slate-900">{{ selectedTask.patient }}</h4>
                    <p class="text-[10px] text-slate-500 font-mono tracking-widest uppercase">MRN: 488219 • DOB: 05/12/1984</p>
                </div>
                <Badge variant="info" class="ml-auto">Blue Cross PPO</Badge>
            </div>

            <!-- Status Timeline -->
            <div class="space-y-4">
                <h5 class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Processing Timeline</h5>
                <div class="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                    <div class="relative items-center flex gap-3">
                        <div class="absolute -left-5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white ring-2 ring-emerald-100"></div>
                        <span class="text-xs font-bold text-slate-900">Encounter Recorded</span>
                        <span class="text-[10px] text-slate-400 ml-auto font-mono">Yesterday 4:15 PM</span>
                    </div>
                    <div class="relative items-center flex gap-3">
                        <div class="absolute -left-5 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-white ring-2 ring-blue-100"></div>
                        <span class="text-xs font-bold text-slate-900">AI Transcription Complete</span>
                        <span class="text-[10px] text-slate-400 ml-auto font-mono">Yesterday 4:17 PM</span>
                    </div>
                    <div class="relative items-center flex gap-3 opacity-50">
                        <div class="absolute -left-5 w-2.5 h-2.5 bg-slate-300 rounded-full border-2 border-white"></div>
                        <span class="text-xs font-bold text-slate-600">Provider Review Pending</span>
                        <span class="text-[10px] text-slate-400 ml-auto font-mono">--</span>
                    </div>
                </div>
            </div>

            <!-- Actions -->
            <div class="grid grid-cols-2 gap-3">
                <button class="p-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2">
                    <UserPlus class="w-4 h-4" /> Reassign
                </button>
                 <button class="p-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2">
                    <Clock class="w-4 h-4" /> Snooze
                </button>
            </div>
        </div>
        <template #footer>
             <button @click="showDetailModal = false" class="px-4 py-2 text-slate-600 font-medium">Close</button>
             <router-link 
                v-if="selectedTask.type === 'note'"
                to="/visit/123/review" 
                class="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700"
             >
                Start Review
             </router-link>
             <router-link 
                v-else-if="selectedTask.type === 'result'"
                to="/billing/claimcoach" 
                class="px-6 py-2 bg-emerald-600 text-white font-bold rounded-lg shadow-lg hover:bg-emerald-700"
             >
                Verify Codes
             </router-link>
        </template>
    </Modal>


  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, type Ref } from 'vue';
import { 
    FileText, Pill, FlaskConical, MessageSquare, AlertCircle, 
    UserPlus, Clock 
} from 'lucide-vue-next';
import Modal from '@/components/ui/Modal.vue';
import Badge from '@/components/ui/Badge.vue';

interface Task {
    id: number;
    type: 'note' | 'result' | 'rx' | 'message';
    title: string;
    patient: string;
    details: string;
    status: string;
}

const activeTab = ref('all');
const showDetailModal = ref(false);
const selectedTask: Ref<Task | null> = ref(null);

watch(selectedTask, (val) => {
    if (val) showDetailModal.value = true;
});

onMounted(() => {
    // Audit tasks loaded
});

const tabs: Array<{ id: string; label: string; count?: number }> = [
    { id: 'all', label: 'All Tasks', count: 28 },
    { id: 'notes', label: 'Notes', count: 12 },
    { id: 'results', label: 'Labs/Results', count: 8 },
    { id: 'rx', label: 'Prescriptions', count: 5 },
    { id: 'messages', label: 'Messages', count: 3 },
];

const tasks: Ref<Task[]> = ref([
    { id: 1, type: 'note' as const, title: 'Sign Visit Note', patient: 'Sarah Johnson', details: 'Initial Consult - Cardiology', status: 'pending' },
    { id: 2, type: 'result' as const, title: 'Abnormal Lab Result', patient: 'Mike Ross', details: 'Lipid Panel - High LDL', status: 'urgent' },
    { id: 3, type: 'rx' as const, title: 'Refill Request', patient: 'Harvey Specter', details: 'Lisinopril 10mg', status: 'pending' },
    { id: 4, type: 'message' as const, title: 'Patient Question', patient: 'Donna Paulsen', details: 'Side effects inquiry', status: 'pending' },
]);

const getTaskIcon = (type: string) => {
    switch(type) {
        case 'note': return FileText;
        case 'rx': return Pill;
        case 'result': return FlaskConical;
        case 'message': return MessageSquare;
        default: return AlertCircle;
    }
}

const getTaskColor = (type: string) => {
    switch(type) {
        case 'note': return 'bg-red-50 text-red-600';
        case 'rx': return 'bg-blue-50 text-blue-600';
        case 'result': return 'bg-orange-50 text-orange-600';
        case 'message': return 'bg-purple-50 text-purple-600';
        default: return 'bg-slate-50 text-slate-600';
    }
}
</script>
