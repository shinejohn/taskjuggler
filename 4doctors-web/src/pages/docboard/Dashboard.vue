<template>
  <div class="div">
    <header class="mb-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
            <h1 class="text-2xl font-bold text-slate-900">DocBoard</h1>
            <p class="text-slate-500">Your practice command center.</p>
        </div>
        <div class="flex flex-wrap items-center gap-3">
            <!-- Search -->
            <div class="relative">
                <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                    v-model="searchQuery"
                    type="text" 
                    placeholder="Search tasks, patients..." 
                    class="pl-9 pr-4 py-2 w-56 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                >
            </div>
            <!-- Urgency Filter -->
            <select v-model="urgencyFilter" class="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm">
                <option value="">All Priority</option>
                <option value="urgent">Urgent Only</option>
                <option value="pending">Pending</option>
            </select>
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
            <p class="text-2xl font-bold text-red-600 mt-1">{{ stats.pendingSignature }}</p>
        </div>
         <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p class="text-xs text-slate-500 font-medium uppercase">Results to Review</p>
            <p class="text-2xl font-bold text-orange-600 mt-1">{{ stats.resultsToReview }}</p>
        </div>
         <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p class="text-xs text-slate-500 font-medium uppercase">Refill Requests</p>
            <p class="text-2xl font-bold text-blue-600 mt-1">{{ stats.refillRequests }}</p>
        </div>
         <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p class="text-xs text-slate-500 font-medium uppercase">Patient Messages</p>
            <p class="text-2xl font-bold text-purple-600 mt-1">{{ stats.patientMessages }}</p>
        </div>
    </div>

    <!-- Task List -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="divide-y divide-slate-100">
            <div v-for="task in filteredTasks" :key="task.id" 
                :class="['transition-all', task.expanded ? 'bg-slate-50' : 'hover:bg-slate-50']">
                
                <!-- Task Row -->
                <div class="p-4 flex items-center gap-4 cursor-pointer" @click="toggleExpand(task)">
                    <div class="p-2 rounded-lg" :class="getTaskColor(task.type)">
                        <component :is="getTaskIcon(task.type)" class="w-5 h-5" />
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex justify-between items-start">
                            <h3 class="font-medium text-slate-900 truncate">{{ task.title }}</h3>
                            <span class="text-xs font-mono text-slate-400 ml-2 flex-shrink-0">{{ task.timeAgo }}</span>
                        </div>
                        <p class="text-sm text-slate-500 truncate">{{ task.patient }} • {{ task.details }}</p>
                    </div>
                    
                    <!-- Inline Quick Actions (visible on hover for applicable types) -->
                    <div class="flex items-center gap-2" @click.stop>
                        <!-- Refill Request: Approve/Deny inline -->
                        <template v-if="task.type === 'rx'">
                            <button 
                                @click="approveRefill(task)"
                                class="px-3 py-1.5 text-xs font-bold bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors shadow-sm"
                            >
                                Approve
                            </button>
                            <button 
                                @click="toggleExpand(task)"
                                class="px-3 py-1.5 text-xs font-bold border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                            >
                                Review
                            </button>
                        </template>
                        
                        <!-- Lab Result: Acknowledge inline -->
                        <template v-else-if="task.type === 'result'">
                            <button 
                                @click="acknowledgeResult(task)"
                                class="px-3 py-1.5 text-xs font-bold bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow-sm"
                            >
                                Acknowledge
                            </button>
                        </template>
                        
                        <!-- Note: Review link -->
                        <template v-else-if="task.type === 'note'">
                            <router-link 
                                to="/visit/123/review" 
                                class="px-3 py-1.5 text-xs font-bold text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                            >
                                Review & Sign
                            </router-link>
                        </template>
                        
                        <!-- Message: Reply link -->
                        <template v-else-if="task.type === 'message'">
                            <button 
                                @click="toggleExpand(task)"
                                class="px-3 py-1.5 text-xs font-bold text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
                            >
                                View & Reply
                            </button>
                        </template>
                    </div>
                    
                    <ChevronDown 
                        :class="['w-4 h-4 text-slate-400 transition-transform', task.expanded ? 'rotate-180' : '']" 
                    />
                </div>
                
                <!-- Expanded Inline Detail Panel (only for rx and result) -->
                <div v-if="task.expanded && (task.type === 'rx' || task.type === 'result')" class="px-4 pb-4">
                    <div class="ml-11 bg-white rounded-xl border border-slate-200 p-4">
                        
                        <!-- Refill Request Detail -->
                        <template v-if="task.type === 'rx'">
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                <div>
                                    <p class="text-[10px] font-bold text-slate-400 uppercase">Medication</p>
                                    <p class="text-sm font-bold text-slate-900">{{ task.rxDetails?.medication }}</p>
                                </div>
                                <div>
                                    <p class="text-[10px] font-bold text-slate-400 uppercase">Dosage</p>
                                    <p class="text-sm font-medium text-slate-700">{{ task.rxDetails?.dosage }}</p>
                                </div>
                                <div>
                                    <p class="text-[10px] font-bold text-slate-400 uppercase">Last Filled</p>
                                    <p class="text-sm font-medium text-slate-700">{{ task.rxDetails?.lastFilled }}</p>
                                </div>
                                <div>
                                    <p class="text-[10px] font-bold text-slate-400 uppercase">Refills Used</p>
                                    <p class="text-sm font-medium text-slate-700">{{ task.rxDetails?.refillsUsed }} of {{ task.rxDetails?.refillsTotal }}</p>
                                </div>
                            </div>
                            <div class="flex items-center justify-between pt-3 border-t border-slate-100">
                                <div class="flex items-center gap-2 text-xs text-slate-500">
                                    <AlertCircle class="w-3.5 h-3.5" />
                                    <span>Pharmacy: {{ task.rxDetails?.pharmacy }}</span>
                                </div>
                                <div class="flex gap-2">
                                    <button 
                                        @click="denyRefill(task)"
                                        class="px-4 py-2 text-xs font-bold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                                    >
                                        Deny
                                    </button>
                                    <button 
                                        @click="approveRefill(task)"
                                        class="px-4 py-2 text-xs font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
                                    >
                                        Approve Refill
                                    </button>
                                </div>
                            </div>
                        </template>
                        
                        <!-- Lab Result Detail -->
                        <template v-else-if="task.type === 'result'">
                            <div class="space-y-3 mb-4">
                                <div v-for="item in task.labResults" :key="item.name" class="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                                    <span class="text-sm text-slate-700">{{ item.name }}</span>
                                    <div class="flex items-center gap-3">
                                        <span :class="['text-sm font-bold', item.abnormal ? 'text-red-600' : 'text-slate-900']">
                                            {{ item.value }} {{ item.unit }}
                                        </span>
                                        <span class="text-xs text-slate-400">({{ item.range }})</span>
                                        <span v-if="item.abnormal" class="px-1.5 py-0.5 text-[10px] font-bold bg-red-100 text-red-600 rounded uppercase">
                                            {{ item.flag }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class="flex items-center justify-between pt-3 border-t border-slate-100">
                                <div class="text-xs text-slate-500">
                                    Collected: {{ task.labCollectedDate }}
                                </div>
                                <div class="flex gap-2">
                                    <button 
                                        @click="orderFollowUp(task)"
                                        class="px-4 py-2 text-xs font-bold text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                                    >
                                        Order Follow-up
                                    </button>
                                    <button 
                                        @click="acknowledgeResult(task)"
                                        class="px-4 py-2 text-xs font-bold bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors shadow-sm"
                                    >
                                        Acknowledge
                                    </button>
                                </div>
                            </div>
                        </template>
                        
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Empty State -->
        <div v-if="filteredTasks.length === 0" class="p-12 text-center">
            <CheckCircle class="w-12 h-12 text-emerald-400 mx-auto mb-4" />
            <h3 class="text-lg font-bold text-slate-900 mb-1">All caught up!</h3>
            <p class="text-sm text-slate-500">No pending tasks in this category.</p>
        </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { 
    FileText, Pill, FlaskConical, MessageSquare, AlertCircle,
    ChevronDown, CheckCircle, Search
} from 'lucide-vue-next';
import { useToast } from '@/composables/useToast';

const toast = useToast();
const searchQuery = ref('');
const urgencyFilter = ref('');

interface RxDetails {
    medication: string;
    dosage: string;
    lastFilled: string;
    refillsUsed: number;
    refillsTotal: number;
    pharmacy: string;
}

interface LabResult {
    name: string;
    value: string;
    unit: string;
    range: string;
    abnormal: boolean;
    flag?: string;
}

interface Task {
    id: number;
    type: 'note' | 'result' | 'rx' | 'message';
    title: string;
    patient: string;
    details: string;
    status: string;
    timeAgo: string;
    expanded?: boolean;
    rxDetails?: RxDetails;
    labResults?: LabResult[];
    labCollectedDate?: string;
}

const activeTab = ref('all');

const stats = reactive({
    pendingSignature: 12,
    resultsToReview: 8,
    refillRequests: 5,
    patientMessages: 3
});

const tabs = [
    { id: 'all', label: 'All Tasks', count: 28 },
    { id: 'notes', label: 'Notes', count: 12 },
    { id: 'results', label: 'Labs/Results', count: 8 },
    { id: 'rx', label: 'Prescriptions', count: 5 },
    { id: 'messages', label: 'Messages', count: 3 },
];

const tasks = ref<Task[]>([
    { 
        id: 1, 
        type: 'note', 
        title: 'Sign Visit Note', 
        patient: 'Sarah Johnson', 
        details: 'Initial Consult - Cardiology', 
        status: 'pending',
        timeAgo: '10m ago'
    },
    { 
        id: 2, 
        type: 'result', 
        title: 'Abnormal Lab Result', 
        patient: 'Mike Ross', 
        details: 'Lipid Panel - High LDL', 
        status: 'urgent',
        timeAgo: '25m ago',
        labCollectedDate: 'Jan 28, 2026 at 8:15 AM',
        labResults: [
            { name: 'Total Cholesterol', value: '242', unit: 'mg/dL', range: '<200', abnormal: true, flag: 'High' },
            { name: 'LDL Cholesterol', value: '168', unit: 'mg/dL', range: '<100', abnormal: true, flag: 'High' },
            { name: 'HDL Cholesterol', value: '45', unit: 'mg/dL', range: '>40', abnormal: false },
            { name: 'Triglycerides', value: '145', unit: 'mg/dL', range: '<150', abnormal: false }
        ]
    },
    { 
        id: 3, 
        type: 'rx', 
        title: 'Refill Request', 
        patient: 'Harvey Specter', 
        details: 'Lisinopril 10mg', 
        status: 'pending',
        timeAgo: '1h ago',
        rxDetails: {
            medication: 'Lisinopril',
            dosage: '10mg once daily',
            lastFilled: 'Dec 29, 2025',
            refillsUsed: 2,
            refillsTotal: 3,
            pharmacy: 'CVS Pharmacy - 5th Ave'
        }
    },
    { 
        id: 4, 
        type: 'rx', 
        title: 'Refill Request', 
        patient: 'Rachel Zane', 
        details: 'Metformin 500mg', 
        status: 'pending',
        timeAgo: '2h ago',
        rxDetails: {
            medication: 'Metformin',
            dosage: '500mg twice daily',
            lastFilled: 'Jan 15, 2026',
            refillsUsed: 1,
            refillsTotal: 5,
            pharmacy: 'Walgreens - Main St'
        }
    },
    { 
        id: 5, 
        type: 'message', 
        title: 'Patient Question', 
        patient: 'Donna Paulsen', 
        details: 'Side effects inquiry', 
        status: 'pending',
        timeAgo: '3h ago'
    },
]);

const filteredTasks = computed(() => {
    if (activeTab.value === 'all') return tasks.value;
    const typeMap: Record<string, string> = {
        'notes': 'note',
        'results': 'result',
        'rx': 'rx',
        'messages': 'message'
    };
    return tasks.value.filter(t => t.type === typeMap[activeTab.value]);
});

const toggleExpand = (task: Task) => {
    // Only allow expand for rx and result types
    if (task.type === 'rx' || task.type === 'result') {
        task.expanded = !task.expanded;
    }
};

const removeTask = (task: Task) => {
    const idx = tasks.value.findIndex(t => t.id === task.id);
    if (idx > -1) {
        tasks.value.splice(idx, 1);
        updateStats();
    }
};

const updateStats = () => {
    stats.pendingSignature = tasks.value.filter(t => t.type === 'note').length;
    stats.resultsToReview = tasks.value.filter(t => t.type === 'result').length;
    stats.refillRequests = tasks.value.filter(t => t.type === 'rx').length;
    stats.patientMessages = tasks.value.filter(t => t.type === 'message').length;
};

const approveRefill = (task: Task) => {
    removeTask(task);
    // In production: API call to approve refill
};

const denyRefill = (task: Task) => {
    removeTask(task);
    // In production: API call to deny refill, possibly with reason
};

const acknowledgeResult = (task: Task) => {
    removeTask(task);
    // In production: API call to acknowledge result
};

const orderFollowUp = (task: Task) => {
    // In production: Navigate to ordering or open order modal
    toast.info(`Opening order workflow for ${task.patient}`);
};

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
