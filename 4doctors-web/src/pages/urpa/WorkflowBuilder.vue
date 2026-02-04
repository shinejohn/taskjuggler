<template>
  <div class="h-[calc(100vh-6rem)] flex flex-col">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6 flex-shrink-0">
        <div class="flex items-center gap-4">
            <button @click="$router.back()" class="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                <ArrowLeft class="w-6 h-6" />
            </button>
            <div>
                <h1 class="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    New Workflow
                    <span class="px-2 py-0.5 rounded-full bg-slate-100 text-xs text-slate-500 font-normal border border-slate-200">Draft</span>
                </h1>
                <p class="text-slate-500 text-sm">Automate clinic tasks with visual rules.</p>
            </div>
        </div>
        <div class="flex gap-3">
             <button class="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2">
                <Play class="w-4 h-4 text-emerald-600" /> Test Run
            </button>
            <button class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg transition-all flex items-center gap-2">
                <Save class="w-4 h-4" /> Publish Workflow
            </button>
        </div>
    </div>

    <!-- Builder Workspace -->
    <div class="flex-1 flex gap-6 min-h-0 overflow-hidden">
        <!-- Canvas -->
        <div class="flex-1 bg-slate-50/50 rounded-2xl border border-slate-200 shadow-inner overflow-hidden flex flex-col relative" @drop="onDrop" @dragover="onDragOver">
             <VueFlow v-model="elements" :default-viewport="{ zoom: 1.2 }" :min-zoom="0.2" :max-zoom="4">
                <Background pattern-color="#cbd5e1" :gap="20" />
                <Controls />
                <MiniMap />
             </VueFlow>
        </div>

        <!-- Toolbar (Right) -->
        <div class="w-80 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
            <div class="p-4 border-b border-slate-100 bg-slate-50 font-bold text-slate-700 text-sm uppercase tracking-wide">
                Toolbox
            </div>
            
            <div class="flex-1 overflow-y-auto p-4 space-y-6">
                <!-- Logic -->
                <div class="space-y-3">
                    <h4 class="text-xs font-bold text-slate-400 uppercase">Logic & Control</h4>
                    <div class="grid grid-cols-2 gap-2">
                        <div class="p-3 bg-slate-50 border border-slate-200 rounded-lg hover:border-indigo-400 cursor-grab active:cursor-grabbing text-center hover:shadow-sm transition-all" draggable="true" @dragstart="onDragStart($event, 'logic', 'branch')">
                             <GitBranch class="w-6 h-6 mx-auto text-slate-500 mb-1" />
                             <span class="text-xs font-medium text-slate-600">Branch</span>
                        </div>
                        <div class="p-3 bg-slate-50 border border-slate-200 rounded-lg hover:border-indigo-400 cursor-grab active:cursor-grabbing text-center hover:shadow-sm transition-all" draggable="true" @dragstart="onDragStart($event, 'logic', 'delay')">
                             <Clock class="w-6 h-6 mx-auto text-slate-500 mb-1" />
                             <span class="text-xs font-medium text-slate-600">Delay</span>
                        </div>
                    </div>
                </div>

                <!-- Actions -->
                <div class="space-y-3">
                     <h4 class="text-xs font-bold text-slate-400 uppercase">Clinical Actions</h4>
                     <div class="space-y-2">
                         <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer" draggable="true" @dragstart="onDragStart($event, 'action', 'email')">
                            <div class="p-1.5 bg-blue-100 text-blue-600 rounded">
                                <Mail class="w-4 h-4" />
                            </div>
                            <span class="text-sm font-medium text-slate-700">Send Email</span>
                         </div>
                         <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer" draggable="true" @dragstart="onDragStart($event, 'action', 'sms')">
                            <div class="p-1.5 bg-emerald-100 text-emerald-600 rounded">
                                <MessageSquare class="w-4 h-4" />
                            </div>
                            <span class="text-sm font-medium text-slate-700">Send SMS</span>
                         </div>
                         <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer" draggable="true" @dragstart="onDragStart($event, 'action', 'task')">
                            <div class="p-1.5 bg-purple-100 text-purple-600 rounded">
                                <CheckSquare class="w-4 h-4" />
                            </div>
                            <span class="text-sm font-medium text-slate-700">Create Task</span>
                         </div>
                         <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer" draggable="true" @dragstart="onDragStart($event, 'action', 'schedule')">
                            <div class="p-1.5 bg-rose-100 text-rose-600 rounded">
                                <Calendar class="w-4 h-4" />
                            </div>
                            <span class="text-sm font-medium text-slate-700">Schedule Appt</span>
                         </div>
                     </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { VueFlow, useVueFlow } from '@vue-flow/core';
import { Background } from '@vue-flow/background';
import { Controls } from '@vue-flow/controls';
import { MiniMap } from '@vue-flow/minimap';
import '@vue-flow/core/dist/style.css';
import '@vue-flow/core/dist/theme-default.css';
import '@vue-flow/controls/dist/style.css';
import '@vue-flow/minimap/dist/style.css';

import { 
    ArrowLeft, Play, Save, Plus, Minus, Zap, Mail, GitBranch, Clock,
    MessageSquare, CheckSquare, Calendar
} from 'lucide-vue-next';

const { addNodes } = useVueFlow();

const elements = ref([
  { 
    id: '1', 
    type: 'input', 
    label: 'New Patient Registration', 
    position: { x: 250, y: 5 },
    class: 'bg-white border-2 border-purple-500 rounded-xl shadow-lg p-3 font-bold text-slate-800 w-64 text-center'
  },
  { 
    id: '2', 
    label: 'Send Welcome Email', 
    position: { x: 100, y: 150 },
    class: 'bg-white border border-slate-200 rounded-xl shadow-sm p-3 text-slate-700 w-64 text-center'
  },
  { 
    id: '3', 
    label: 'Create Onboarding Task', 
    position: { x: 400, y: 150 },
    class: 'bg-white border border-slate-200 rounded-xl shadow-sm p-3 text-slate-700 w-64 text-center'
  },
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3', animated: true }
]);

const onDragStart = (event: DragEvent, type: string, subtype: string) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('application/vueflow', JSON.stringify({ type, subtype }));
    event.dataTransfer.effectAllowed = 'move';
  }
};

const onDragOver = (event: DragEvent) => {
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move';
  }
};

const onDrop = (event: DragEvent) => {
  const data = event.dataTransfer?.getData('application/vueflow');
  if (!data) return;
  
  const { type, subtype } = JSON.parse(data);
  const position = {
      x: event.clientX - 300, // Adjust for sidebar offset approximation
      y: event.clientY - 100
  };

  const newNode = {
    id: Math.random().toString(),
    label: `${subtype.charAt(0).toUpperCase() + subtype.slice(1)} Node`,
    position,
    class: 'bg-white border border-slate-200 rounded-xl shadow-sm p-3 text-slate-700 w-64 text-center'
  };

  addNodes([newNode]);
};
</script>

<style>
/* Vue Flow Customization Overrides */
.vue-flow__node {
    /* Styles handled by tailwind classes on node object */
}
</style>
