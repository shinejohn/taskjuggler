<template>
  <Card
    :class="[
      'transition-all duration-200 overflow-hidden group',
      status === 'active' && !compact ? 'border-l-4 border-l-[#1B4F72]' : ''
    ]"
  >
    <CardHeader>
      <div class="flex justify-between items-start">
        <Badge
          :variant="status === 'active' ? 'default' : 'secondary'"
          :class="[
            'inline-flex items-center gap-1.5',
            status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'
          ]"
        >
          <span
            :class="[
              'w-1.5 h-1.5 rounded-full',
              status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-amber-500'
            ]"
          />
          {{ status === 'active' ? 'Active' : 'Paused' }}
        </Badge>
        <Button variant="ghost" size="icon-sm" class="h-6 w-6">
          <MoreVertical :size="16" />
        </Button>
      </div>
    </CardHeader>

    <CardContent>
      <div class="flex flex-col items-center text-center mb-4">
        <Avatar size="base" shape="circle" class="mb-3">
          <AvatarImage v-if="avatar" :src="avatar" :alt="name" />
          <AvatarFallback class="text-xl font-bold text-[#1B4F72]">
            {{ name.charAt(0) }}
          </AvatarFallback>
        </Avatar>
        <h3 class="text-lg font-bold text-slate-900">{{ name }}</h3>
        <div class="text-sm text-slate-500 flex items-center gap-1.5">
          {{ role }}
          <span v-if="price" class="text-slate-300">•</span>
          <span v-if="price">{{ price }}</span>
        </div>
        <Badge v-if="phone" variant="outline" class="mt-2 font-mono text-xs">
          {{ phone }}
        </Badge>
      </div>

      <div v-if="!compact && stats" class="grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 mt-2">
        <div class="text-center">
          <div class="text-xs text-slate-400 mb-1">Calls</div>
          <div class="font-semibold text-slate-700">{{ stats.calls }}</div>
        </div>
        <div class="text-center border-l border-slate-100">
          <div class="text-xs text-slate-400 mb-1">Appts</div>
          <div class="font-semibold text-slate-700">
            {{ stats.appointments }}
          </div>
        </div>
        <div class="text-center border-l border-slate-100">
          <div class="text-xs text-slate-400 mb-1">Success</div>
          <div class="font-semibold text-green-600">
            {{ stats.successRate }}
          </div>
        </div>
      </div>

      <div v-if="compact" class="text-sm text-slate-500 text-center border-t border-slate-100 pt-3 mt-1">
        <span class="font-medium text-slate-900">{{ compactStats }}</span> today
      </div>

      <div v-if="!compact" class="flex gap-3 mt-5">
        <Button variant="outline" class="flex-1" as-child>
          <router-link :to="`/coordinators/${id}`">
            View Details
          </router-link>
        </Button>
        <Button variant="default" class="flex-1 bg-blue-50 text-[#1B4F72] hover:bg-blue-100">
          Test Call
        </Button>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { Card, CardContent, CardHeader, Badge, Avatar, AvatarImage, AvatarFallback, Button } from '@taskjuggler/ui';
import { MoreVertical } from 'lucide-vue-next';

interface Props {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'paused';
  avatar?: string;
  stats?: {
    calls?: number;
    appointments?: number;
    successRate?: string;
  };
  phone?: string;
  price?: string;
  compact?: boolean;
  compactStats?: string;
}

defineProps<Props>();
</script>

