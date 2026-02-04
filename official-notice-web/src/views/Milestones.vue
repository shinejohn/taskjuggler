<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { milestonesApi } from '../services/api'
import type { Milestone } from '../types'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isToday } from 'date-fns'

const milestones = ref<Milestone[]>([])
const loading = ref(true)
const currentDate = ref(new Date())

const viewMode = ref<'calendar' | 'list'>('calendar')
const showCreateModal = ref(false)

// Form
const newMilestone = ref<Partial<Milestone>>({
    title: '',
    start_date: format(new Date(), 'yyyy-MM-ddTHH:mm'),
    is_all_day: true
})

onMounted(() => {
    fetchMilestones()
})

const fetchMilestones = async () => {
    loading.value = true
    try {
        milestones.value = await milestonesApi.list()
    } catch (e) {
        console.error(e)
    } finally {
        loading.value = false
    }
}

// Calendar Logic
const calendarDays = computed(() => {
    const start = startOfMonth(currentDate.value)
    const end = endOfMonth(currentDate.value)
    const days = eachDayOfInterval({ start, end })
    
    // Add padding days? For simple grid we usually pad to start of week.
    // For MVP just listing days of month.
    return days
})

const getMilestonesForDay = (day: Date) => {
    return milestones.value.filter(m => isSameDay(new Date(m.start_date), day))
}

const nextMonth = () => currentDate.value = addMonths(currentDate.value, 1)
const prevMonth = () => currentDate.value = subMonths(currentDate.value, 1)

const createMilestone = async () => {
    try {
        await milestonesApi.create(newMilestone.value)
        showCreateModal.value = false
        // Reset form
        newMilestone.value = { title: '', start_date: format(new Date(), 'yyyy-MM-ddTHH:mm'), is_all_day: true }
        fetchMilestones()
    } catch (e) {
        alert("Failed to create milestone")
    }
}

const deleteMilestone = async (id: string) => {
    if(!confirm("Delete this milestone?")) return
    try {
        await milestonesApi.delete(id)
        fetchMilestones()
    } catch(e) {
        alert("Failed to delete")
    }
}

</script>

<template>
    <div class="h-full flex flex-col">
        <!-- Header -->
        <header class="flex justify-between items-center mb-6">
            <div>
                <h2 class="text-2xl font-bold tracking-tight">Milestones</h2>
                <p class="text-gray-500">Track critical deadlines and dates.</p>
            </div>
            
            <div class="flex items-center gap-3">
                 <div class="flex bg-gray-100 rounded-lg p-1">
                    <button 
                        @click="viewMode = 'calendar'"
                        class="px-3 py-1.5 text-sm font-medium rounded-md transition-all"
                        :class="viewMode === 'calendar' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'"
                    >
                        Calendar
                    </button>
                    <button 
                        @click="viewMode = 'list'"
                        class="px-3 py-1.5 text-sm font-medium rounded-md transition-all"
                        :class="viewMode === 'list' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'"
                    >
                        List
                    </button>
                </div>
                
                <button 
                    @click="showCreateModal = true"
                    class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    Add Milestone
                </button>
            </div>
        </header>

        <!-- Calendar View -->
        <div v-if="viewMode === 'calendar'" class="flex-1 bg-white rounded-xl shadow border border-gray-200 flex flex-col overflow-hidden">
            <!-- Calendar Navigation -->
            <div class="flex items-center justify-between p-4 border-b">
                <h3 class="font-semibold text-lg text-gray-900">{{ format(currentDate, 'MMMM yyyy') }}</h3>
                <div class="flex gap-2">
                    <button @click="prevMonth" class="p-1 hover:bg-gray-100 rounded">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
                    </button>
                    <button @click="currentDate = new Date()" class="text-sm font-medium px-2">Today</button>
                    <button @click="nextMonth" class="p-1 hover:bg-gray-100 rounded">
                         <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                    </button>
                </div>
            </div>

            <!-- Calendar Grid (Simple) -->
            <div class="flex-1 p-4 grid grid-cols-7 gap-2 overflow-y-auto">
                <div v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" :key="day" class="text-center text-xs font-semibold text-gray-500 uppercase py-2">
                    {{ day }}
                </div>
                
                <!-- Blank days padding logic would ideally go here, simplifying for MVP to just list days -->
                
                <div 
                    v-for="day in calendarDays" 
                    :key="day.toISOString()" 
                    class="aspect-square border border-gray-100 rounded-lg p-2 hover:border-blue-300 transition-colors flex flex-col"
                    :class="{ 'bg-blue-50/30': isToday(day) }"
                >
                    <span class="text-sm font-medium" :class="isToday(day) ? 'text-blue-600' : 'text-gray-700'">{{ format(day, 'd') }}</span>
                    
                    <div class="mt-1 space-y-1 overflow-y-auto custom-scrollbar">
                        <div 
                            v-for="m in getMilestonesForDay(day)" 
                            :key="m.id"
                            class="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded truncate cursor-pointer hover:bg-blue-200"
                            :title="m.title"
                        >
                            {{ m.title }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- List View -->
        <div v-else class="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
             <table class="w-full text-left text-sm text-gray-600">
                <thead class="bg-gray-50 text-gray-900 border-b">
                    <tr>
                        <th class="px-6 py-3 font-semibold">Title</th>
                        <th class="px-6 py-3 font-semibold">Date</th>
                        <th class="px-6 py-3 font-semibold">Status</th>
                        <th class="px-6 py-3 font-semibold text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    <tr v-for="m in milestones" :key="m.id" class="hover:bg-gray-50 transition-colors">
                        <td class="px-6 py-4 font-medium text-gray-900">{{ m.title }}</td>
                        <td class="px-6 py-4">{{ format(new Date(m.start_date), 'PPP p') }}</td>
                        <td class="px-6 py-4">
                            <span class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs" v-if="m.status === 'pending'">Pending</span>
                            <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs" v-else>Completed</span>
                        </td>
                        <td class="px-6 py-4 text-right">
                            <button @click="deleteMilestone(m.id)" class="text-red-600 hover:text-red-800 text-xs font-medium">Delete</button>
                        </td>
                    </tr>
                     <tr v-if="milestones.length === 0">
                        <td colspan="4" class="px-6 py-8 text-center text-gray-400">No milestones found.</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Create Modal -->
        <div v-if="showCreateModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-lg font-bold">New Milestone</h3>
                    <button @click="showCreateModal = false" class="text-gray-400 hover:text-gray-600">✕</button>
                </div>
                
                <form @submit.prevent="createMilestone" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input v-model="newMilestone.title" required class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Contract Renewal" />
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input type="datetime-local" v-model="newMilestone.start_date" required class="w-full border rounded-lg px-3 py-2 outline-none" />
                    </div>
                
                    <div class="flex items-center gap-2">
                        <input type="checkbox" id="allDay" v-model="newMilestone.is_all_day" class="rounded text-blue-600" />
                        <label for="allDay" class="text-sm text-gray-700">All Day</label>
                    </div>

                     <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Repeats (RRULE)</label>
                         <input v-model="newMilestone.rrule" class="w-full border rounded-lg px-3 py-2 outline-none text-sm font-mono" placeholder="FREQ=YEARLY;INTERVAL=1" />
                         <p class="text-xs text-gray-500 mt-1">Optional. RFC-5545 format.</p>
                    </div>

                    <div class="pt-4 flex justify-end gap-3">
                        <button type="button" @click="showCreateModal = false" class="text-gray-600 font-medium px-4 py-2 hover:bg-gray-100 rounded-lg">Cancel</button>
                        <button type="submit" class="bg-blue-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-blue-700 shadow-sm">Create Milestone</button>
                    </div>
                </form>
            </div>
        </div>

    </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 2px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #CBD5E1;
    border-radius: 20px;
}
</style>
