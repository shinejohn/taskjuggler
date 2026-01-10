<template>
  <Card
    :class="[
      'transition-all duration-200',
      selected ? 'border-[#1B4F72] ring-2 ring-[#1B4F72]/20' : 'hover:shadow-md hover:-translate-y-0.5',
      sizeClasses[size]
    ]"
  >
    <CardHeader>
      <div class="flex justify-between items-start">
        <Badge
          :variant="status === 'active' ? 'default' : 'secondary'"
          :class="[
            'inline-flex items-center gap-1.5',
            status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-100 text-slate-600'
          ]"
        >
          <span
            :class="[
              'w-1.5 h-1.5 rounded-full',
              status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-slate-400'
            ]"
          />
          {{ status === 'active' ? 'Active' : 'Paused' }}
        </Badge>

        <DropdownMenu v-if="size !== 'small'">
          <DropdownMenuTrigger as-child>
            <Button variant="ghost" size="icon-sm" class="h-6 w-6">
              <MoreVertical :size="16" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem @click="handleAction('edit')">
              <Edit :size="14" class="mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem @click="handleAction('pause')">
              <Pause :size="14" class="mr-2" />
              {{ status === 'active' ? 'Pause' : 'Resume' }}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem @click="handleAction('delete')" class="text-red-600">
              <Trash2 :size="14" class="mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </CardHeader>

    <CardContent>
      <!-- Avatar & Info -->
      <div class="flex flex-col items-center text-center mb-4">
        <Avatar :size="avatarSizes[size].split(' ')[0]" :shape="'circle'" class="mb-3">
          <AvatarImage v-if="avatar" :src="avatar" :alt="name" />
          <AvatarFallback class="font-bold text-[#1B4F72]">
            {{ name.charAt(0) }}
          </AvatarFallback>
        </Avatar>
        <h3 :class="['font-bold text-slate-900', nameSizes[size]]">
          {{ name }}
        </h3>
        <div class="text-sm text-slate-500 flex items-center gap-1.5">
          {{ role }}
          <span v-if="price" class="text-slate-300">•</span>
          <span v-if="price">{{ price }}</span>
        </div>
      </div>

      <!-- Stats -->
      <div v-if="stats && size !== 'small'" class="grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 mb-4">
        <div v-if="stats.calls !== undefined" class="text-center">
          <div class="text-xs text-slate-400 mb-1 flex items-center justify-center gap-1">
            <Phone :size="10" />
            Calls
          </div>
          <div class="font-semibold text-slate-700">{{ stats.calls }}</div>
        </div>
        <div v-if="stats.appointments !== undefined" class="text-center border-l border-slate-100">
          <div class="text-xs text-slate-400 mb-1 flex items-center justify-center gap-1">
            <Calendar :size="10" />
            Appts
          </div>
          <div class="font-semibold text-slate-700">
            {{ stats.appointments }}
          </div>
        </div>
        <div v-if="stats.successRate" class="text-center border-l border-slate-100">
          <div class="text-xs text-slate-400 mb-1 flex items-center justify-center gap-1">
            <TrendingUp :size="10" />
            Success
          </div>
          <div class="font-semibold text-green-600">
            {{ stats.successRate }}
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div v-if="size !== 'small'" class="flex gap-2">
        <Button variant="outline" class="flex-1" @click="handleAction('view')">
          <Eye :size="14" class="mr-2" />
          View
        </Button>
        <Button variant="default" class="flex-1 bg-blue-50 text-[#1B4F72] hover:bg-blue-100" @click="handleAction('test')">
          <Play :size="14" class="mr-2" />
          Test
        </Button>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  Card,
  CardContent,
  CardHeader,
  Badge,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@taskjuggler/ui';
import { MoreVertical, Play, Eye, Edit, Pause, Trash2, Phone, Calendar, TrendingUp } from 'lucide-vue-next';

interface Props {
  name: string;
  role: string;
  status: 'active' | 'paused';
  avatar?: string;
  price?: string;
  stats?: {
    calls?: number;
    appointments?: number;
    successRate?: string;
  };
  size?: 'small' | 'medium' | 'large';
  selected?: boolean;
  className?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  selected: false,
});

const emit = defineEmits<{
  action: [action: 'edit' | 'pause' | 'delete' | 'test' | 'view'];
}>();

const sizeClasses = {
  small: 'p-3',
  medium: 'p-5',
  large: 'p-6',
};

const avatarSizes = {
  small: 'w-10 h-10 text-sm',
  medium: 'w-16 h-16 text-xl',
  large: 'w-20 h-20 text-2xl',
};

const nameSizes = {
  small: 'text-sm',
  medium: 'text-lg',
  large: 'text-2xl',
};

const handleAction = (action: 'edit' | 'pause' | 'delete' | 'test' | 'view') => {
  emit('action', action);
};
</script>



