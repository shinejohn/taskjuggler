<template>
  <div class="w-full">
    <div class="text-center mb-8">
      <h1 class="text-3xl md:text-4xl font-heading font-bold text-[#1B4F72] mb-2">
        Choose Your Coordinator
      </h1>
      <p class="text-lg text-slate-600">
        What role do you need help with?
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      <!-- Inbound Column -->
      <div class="space-y-4">
        <div class="flex items-center gap-3 mb-4 px-1">
          <Separator class="flex-1" />
          <h2 class="text-sm font-bold text-slate-400 uppercase tracking-wider">
            Inbound Roles
          </h2>
          <Separator class="flex-1" />
        </div>
        <div class="grid grid-cols-1 gap-3">
          <RoleCard
            v-for="role in inboundRoles"
            :key="role.id"
            :id="role.id"
            :title="role.title"
            :price="role.price"
            :description="role.description"
            :icon="role.icon"
            :selected="selectedRole === role.id"
            @select="selectedRole = role.id"
          />
        </div>
      </div>

      <!-- Outbound Column -->
      <div class="space-y-4">
        <div class="flex items-center gap-3 mb-4 px-1">
          <Separator class="flex-1" />
          <h2 class="text-sm font-bold text-slate-400 uppercase tracking-wider">
            Outbound Roles
          </h2>
          <Separator class="flex-1" />
        </div>
        <div class="grid grid-cols-1 gap-3">
          <RoleCard
            v-for="role in outboundRoles"
            :key="role.id"
            :id="role.id"
            :title="role.title"
            :price="role.price"
            :description="role.description"
            :icon="role.icon"
            :selected="selectedRole === role.id"
            @select="selectedRole = role.id"
          />
        </div>
      </div>
    </div>

    <!-- Continue Button -->
    <div class="mt-10 flex justify-end">
      <Button
        @click="handleNext"
        :disabled="!selectedRole"
        class="bg-[#1B4F72] hover:bg-[#153e5a] flex items-center gap-2"
      >
        Continue
        <ArrowRight :size="18" />
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
  Phone,
  Calendar,
  Truck,
  Utensils,
  Headset,
  Shield,
  CheckCircle,
  TrendingUp,
  DollarSign,
  Megaphone,
  ClipboardList,
  ArrowRight,
} from 'lucide-vue-next';
import RoleCard from './RoleCard.vue';
import { onboardingApi, type RoleTemplate } from '@/api/onboarding';
import { Button, Separator } from '@taskjuggler/ui';

const emit = defineEmits<{
  next: [data: { role_template_id: string }];
}>();

const selectedRole = ref<string | null>(null);
const roleTemplates = ref<RoleTemplate[]>([]);
const loading = ref(true);

// Icon mapping for role types
const iconMap: Record<string, any> = {
  receptionist: Phone,
  scheduler: Calendar,
  dispatcher: Truck,
  hostess: Utensils,
  support: Headset,
  tipline: Shield,
  confirmer: CheckCircle,
  sales: TrendingUp,
  collector: DollarSign,
  introducer: Megaphone,
  survey: ClipboardList,
};

const inboundRoles = computed(() => {
  return roleTemplates.value
    .filter(role => role.name.toLowerCase().includes('receptionist') || 
                   role.name.toLowerCase().includes('scheduler') ||
                   role.name.toLowerCase().includes('dispatcher') ||
                   role.name.toLowerCase().includes('hostess') ||
                   role.name.toLowerCase().includes('support') ||
                   role.name.toLowerCase().includes('tipline'))
    .map(role => ({
      id: role.id,
      title: role.name,
      price: `$${role.base_price}/mo`,
      description: role.description || '',
      icon: iconMap[role.name.toLowerCase().replace(/\s+/g, '')] || Phone,
    }));
});

const outboundRoles = computed(() => {
  return roleTemplates.value
    .filter(role => role.name.toLowerCase().includes('confirmer') ||
                   role.name.toLowerCase().includes('sales') ||
                   role.name.toLowerCase().includes('collector') ||
                   role.name.toLowerCase().includes('introducer') ||
                   role.name.toLowerCase().includes('survey'))
    .map(role => ({
      id: role.id,
      title: role.name,
      price: `$${role.base_price}/mo`,
      description: role.description || '',
      icon: iconMap[role.name.toLowerCase().replace(/\s+/g, '')] || CheckCircle,
    }));
});

function handleNext() {
  if (selectedRole.value) {
    emit('next', { role_template_id: selectedRole.value });
  }
}

onMounted(async () => {
  try {
    const response = await onboardingApi.getRoleTemplates();
    roleTemplates.value = response.data;
  } catch (error) {
    console.error('Failed to load role templates:', error);
    // Fallback to empty array - UI will show no roles
  } finally {
    loading.value = false;
  }
});
</script>

