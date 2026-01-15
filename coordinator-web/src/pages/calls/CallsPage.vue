<template>
  <DashboardLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-3xl font-heading font-bold text-[#1B4F72]">
            Call History
          </h1>
          <p class="text-slate-500 mt-1">{{ callsStore.total }} total calls</p>
        </div>
        <div class="flex gap-3">
          <Button variant="outline" @click="showDateFilter = !showDateFilter">
            <Calendar :size="18" class="mr-2" />
            Last 30 Days
          </Button>
          <Button variant="outline" @click="exportCalls">
            <Download :size="18" class="mr-2" />
            Export
          </Button>
        </div>
      </div>

      <!-- Stats Summary -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent class="p-4 flex items-center gap-4">
            <div class="p-3 bg-blue-50 text-[#1B4F72] rounded-lg">
              <Phone :size="24" />
            </div>
            <div>
              <div class="text-2xl font-bold text-slate-900">
                {{ callsStore.stats?.calls_today || 0 }}
              </div>
              <div class="text-sm text-slate-500">Calls Today</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent class="p-4 flex items-center gap-4">
            <div class="p-3 bg-amber-50 text-amber-600 rounded-lg">
              <Clock :size="24" />
            </div>
            <div>
              <div class="text-2xl font-bold text-slate-900">
                {{ formatDuration(callsStore.stats?.avg_duration || 0) }}
              </div>
              <div class="text-sm text-slate-500">Avg Duration</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent class="p-4 flex items-center gap-4">
            <div class="p-3 bg-green-50 text-green-600 rounded-lg">
              <Calendar :size="24" />
            </div>
            <div>
              <div class="text-2xl font-bold text-slate-900">
                {{ callsStore.stats?.booking_rate || 0 }}%
              </div>
              <div class="text-sm text-slate-500">Booking Rate</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Search & Filters -->
      <Card>
        <CardContent class="p-4 space-y-4">
          <div class="relative">
            <Search class="absolute left-3 top-3 text-slate-400" :size="20" />
            <Input
              v-model="searchQuery"
              type="text"
              placeholder="Search by contact name or phone..."
              class="pl-10"
              @input="handleSearch"
            />
          </div>

        <div class="flex flex-wrap gap-3 items-center">
          <div class="relative">
            <select
              v-model="filterDirection"
              class="appearance-none pl-3 pr-8 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] cursor-pointer hover:bg-slate-50"
              @change="handleFilter"
            >
              <option value="">Direction: All</option>
              <option value="inbound">Inbound</option>
              <option value="outbound">Outbound</option>
            </select>
            <Filter class="absolute right-2.5 top-2 text-slate-400 pointer-events-none" :size="12" />
          </div>
          <div class="relative">
            <select
              v-model="filterOutcome"
              class="appearance-none pl-3 pr-8 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] cursor-pointer hover:bg-slate-50"
              @change="handleFilter"
            >
              <option value="">Outcome: All</option>
              <option value="booked">Appointment Booked</option>
              <option value="confirmed">Confirmed</option>
              <option value="info">Info Only</option>
            </select>
            <Filter class="absolute right-2.5 top-2 text-slate-400 pointer-events-none" :size="12" />
          </div>
        </div>
        </CardContent>
      </Card>

      <!-- Loading State -->
      <div v-if="callsStore.loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B4F72]"></div>
        <p class="mt-4 text-slate-500">Loading calls...</p>
      </div>

      <!-- Table -->
      <Card v-else class="overflow-hidden">
        <div class="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date/Time</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Coordinator</TableHead>
                <TableHead>Direction</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Outcome</TableHead>
                <TableHead class="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow
                v-for="call in callsStore.calls"
                :key="call.id"
                class="hover:bg-slate-50 transition-colors cursor-pointer"
                @click="viewCall(call)"
              >
                <TableCell class="text-slate-500">
                  <div class="font-medium text-slate-900">
                    {{ formatTime(call.started_at) }}
                  </div>
                  <div class="text-xs">{{ formatDate(call.started_at) }}</div>
                </TableCell>
                <TableCell class="font-medium text-slate-900">
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                      {{ getContactInitial(call) }}
                    </div>
                    {{ getContactName(call) }}
                  </div>
                </TableCell>
                <TableCell class="text-slate-500 font-mono text-xs">
                  {{ call.from_number }}
                </TableCell>
                <TableCell>
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-full bg-blue-50 text-[#1B4F72] flex items-center justify-center text-[10px] font-bold">
                      {{ getCoordinatorInitial(call) }}
                    </div>
                    <span class="text-sm text-slate-600">
                      {{ getCoordinatorName(call) }}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    :variant="call.direction === 'inbound' ? 'default' : 'secondary'"
                    :class="call.direction === 'inbound' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'"
                  >
                    <ArrowDownLeft v-if="call.direction === 'inbound'" :size="12" class="mr-1" />
                    <ArrowUpRight v-else :size="12" class="mr-1" />
                    {{ call.direction === 'inbound' ? 'Inbound' : 'Outbound' }}
                  </Badge>
                </TableCell>
                <TableCell class="text-slate-500 font-mono text-xs">
                  {{ formatDuration(call.duration_seconds) }}
                </TableCell>
                <TableCell>
                  <Badge
                    :variant="getOutcomeVariant(call.outcome ?? null)"
                    :class="getOutcomeClass(call.outcome)"
                  >
                    {{ call.outcome || 'Completed' }}
                  </Badge>
                </TableCell>
                <TableCell class="text-right" @click.stop>
                  <div class="flex items-center justify-end gap-2">
                    <Button
                      v-if="call.recording_url"
                      variant="ghost"
                      size="sm"
                      @click.stop="playRecording(call)"
                      title="Play Recording"
                    >
                      <Play :size="16" />
                    </Button>
                    <Button
                      v-if="call.transcript"
                      variant="ghost"
                      size="sm"
                      @click.stop="viewTranscript(call)"
                      title="View Transcript"
                    >
                      <FileText :size="16" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      @click.stop="viewCall(call)"
                    >
                      <MoreVertical :size="16" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow v-if="callsStore.calls.length === 0">
                <TableCell colspan="8" class="text-center text-slate-500 py-8">
                  No calls found
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <!-- Pagination -->
        <div class="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <span class="text-sm text-slate-500">
            Showing {{ (callsStore.page - 1) * callsStore.perPage + 1 }}-
            {{ Math.min(callsStore.page * callsStore.perPage, callsStore.total) }}
            of {{ callsStore.total }}
          </span>
          <div class="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              :disabled="callsStore.page === 1"
              @click="goToPage(callsStore.page - 1)"
            >
              <ChevronLeft :size="16" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              :disabled="callsStore.page * callsStore.perPage >= callsStore.total"
              @click="goToPage(callsStore.page + 1)"
            >
              <ChevronRight :size="16" />
            </Button>
          </div>
        </div>
      </Card>
    </div>

    <!-- Call Detail Panel -->
    <CallDetailPanel
      :call="selectedCall"
      :is-open="showCallPanel"
      @close="showCallPanel = false"
    />
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  Search,
  Filter,
  Download,
  Calendar,
  Play,
  FileText,
  MoreVertical,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  Phone,
  ChevronLeft,
  ChevronRight,
} from 'lucide-vue-next';
import { Card, CardContent, Input, Button, Table, TableHeader, TableRow, TableHead, TableBody, TableCell, Badge } from '@taskjuggler/ui';
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import CallDetailPanel from '@/components/calls/CallDetailPanel.vue';
import { useCallsStore } from '@/stores/calls';
import { useOrganizationsStore } from '@/stores/organizations';
import type { CallLog } from '@/api/calls';
import { formatTime, formatRelativeDate, formatDurationSeconds } from '@/utils/format';
import { getCallOutcomeClass } from '@/utils/status';
import { getContactName as getContactNameUtil, getContactInitial as getContactInitialUtil, getCoordinatorName as getCoordinatorNameUtil, getCoordinatorInitial as getCoordinatorInitialUtil } from '@/utils/contact';
import { createDebounced } from '@/utils/request';

const callsStore = useCallsStore();
const organizationsStore = useOrganizationsStore();

const searchQuery = ref('');
const filterDirection = ref<'inbound' | 'outbound' | ''>('');
const filterOutcome = ref('');
const showDateFilter = ref(false);

// Use utility functions for formatting
const formatDate = formatRelativeDate;
const formatDuration = formatDurationSeconds;
const getOutcomeClass = getCallOutcomeClass;
const getContactName = (call: CallLog) => getContactNameUtil(call as any);
const getContactInitial = (call: CallLog) => getContactInitialUtil(call as any);
const getCoordinatorName = (call: CallLog) => getCoordinatorNameUtil(call as any);
const getCoordinatorInitial = (call: CallLog) => getCoordinatorInitialUtil(call as any);

function getOutcomeVariant(outcome: string | null): 'default' | 'secondary' | 'destructive' {
  if (!outcome) return 'secondary';
  const lower = outcome.toLowerCase();
  if (lower.includes('booked') || lower.includes('confirmed')) return 'default';
  if (lower.includes('spam') || lower.includes('blocked')) return 'destructive';
  return 'secondary';
}

const selectedCall = ref<CallLog | null>(null);
const showCallPanel = ref(false);

function viewCall(call: CallLog) {
  selectedCall.value = call;
  showCallPanel.value = true;
}

function playRecording(call: CallLog) {
  if (call.recording_url) {
    window.open(call.recording_url, '_blank');
  }
}

function viewTranscript(call: CallLog) {
  // TODO: Implement transcript modal
  // For now, show transcript in the call detail panel
  selectedCall.value = call;
  showCallPanel.value = true;
}

// Debounced search to reduce API calls
const handleSearch = createDebounced(() => {
  fetchCalls();
}, 300);

function handleFilter() {
  fetchCalls();
}

function goToPage(page: number) {
  fetchCalls({ page });
}

function exportCalls() {
  // TODO: Implement export functionality
  // await callsApi.exportCalls(filters);
}

async function fetchCalls(filters?: any) {
  try {
    await Promise.all([
      callsStore.fetchCalls({
        search: searchQuery.value || undefined,
        direction: filterDirection.value || undefined,
        outcome: filterOutcome.value || undefined,
        ...filters,
      }),
      callsStore.fetchStats({
        direction: filterDirection.value && (filterDirection.value === 'inbound' || filterDirection.value === 'outbound') 
          ? filterDirection.value as 'inbound' | 'outbound' 
          : undefined,
        outcome: filterOutcome.value || undefined,
      }),
    ]);
  } catch (error) {
    console.error('Failed to fetch calls:', error);
  }
}

onMounted(async () => {
  try {
    if (!organizationsStore.currentOrganization) {
      await organizationsStore.fetchOrganizations();
      if (organizationsStore.organizations.length > 0) {
        organizationsStore.setCurrentOrganization(organizationsStore.organizations[0]);
      }
    }
    if (organizationsStore.currentOrganization?.id) {
      await fetchCalls();
    }
  } catch (error) {
    console.error('Failed to load calls:', error);
  }
});
</script>

