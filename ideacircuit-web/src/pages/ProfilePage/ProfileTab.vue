<template>
  <div class="glass-standard rounded-lg overflow-hidden shadow-1">
    <div class="p-6 border-b border-border flex justify-between items-center">
      <h2 class="text-headline font-semibold text-text-primary">Profile Information</h2>
      <div v-if="isEditing" class="flex space-x-2">
        <button
          @click="$emit('save')"
          class="px-3 py-1.5 bg-primary text-white rounded-md text-label font-medium min-h-[44px] flex items-center hover:bg-primary-hover transition-colors duration-fast"
        >
          <SaveIcon :size="14" class="mr-1" />
          Save
        </button>
        <button
          @click="$emit('cancel')"
          class="px-3 py-1.5 border border-border text-text-primary rounded-md text-label font-medium min-h-[44px] hover:bg-bg-secondary transition-colors duration-fast"
        >
          Cancel
        </button>
      </div>
      <button
        v-else
        @click="$emit('edit')"
        class="px-3 py-1.5 border border-border text-text-primary rounded-md text-label font-medium min-h-[44px] flex items-center hover:bg-bg-secondary transition-colors duration-fast"
      >
        <EditIcon :size="14" class="mr-1" />
        Edit
      </button>
    </div>

    <div class="p-6 space-y-6">
      <div class="grid grid-cols-2 gap-6">
        <div>
          <label class="block text-label font-medium text-text-primary mb-2">First Name</label>
          <input
            v-if="isEditing"
            v-model="localFormData.firstName"
            type="text"
            class="w-full border border-border rounded-md px-4 py-3 text-body-large bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-h-[44px]"
          />
          <p v-else class="text-body-medium text-text-primary">{{ userData.firstName }}</p>
        </div>
        <div>
          <label class="block text-label font-medium text-text-primary mb-2">Last Name</label>
          <input
            v-if="isEditing"
            v-model="localFormData.lastName"
            type="text"
            class="w-full border border-border rounded-md px-4 py-3 text-body-large bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-h-[44px]"
          />
          <p v-else class="text-body-medium text-text-primary">{{ userData.lastName }}</p>
        </div>
      </div>

      <div>
        <label class="block text-label font-medium text-text-primary mb-2 flex items-center">
          <MailIcon :size="16" class="mr-2" />
          Email
        </label>
        <input
          v-if="isEditing"
          v-model="localFormData.email"
          type="email"
          class="w-full border border-border rounded-md px-4 py-3 text-body-large bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-h-[44px]"
        />
        <p v-else class="text-body-medium text-text-primary">{{ userData.email }}</p>
      </div>

      <div>
        <label class="block text-label font-medium text-text-primary mb-2 flex items-center">
          <PhoneIcon :size="16" class="mr-2" />
          Phone
        </label>
        <input
          v-if="isEditing"
          v-model="localFormData.phone"
          type="tel"
          class="w-full border border-border rounded-md px-4 py-3 text-body-large bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-h-[44px]"
        />
        <p v-else class="text-body-medium text-text-primary">{{ userData.phone || 'Not provided' }}</p>
      </div>

      <div class="grid grid-cols-2 gap-6">
        <div>
          <label class="block text-label font-medium text-text-primary mb-2 flex items-center">
            <BriefcaseIcon :size="16" class="mr-2" />
            Company
          </label>
          <input
            v-if="isEditing"
            v-model="localFormData.company"
            type="text"
            class="w-full border border-border rounded-md px-4 py-3 text-body-large bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-h-[44px]"
          />
          <p v-else class="text-body-medium text-text-primary">{{ userData.company || 'Not provided' }}</p>
        </div>
        <div>
          <label class="block text-label font-medium text-text-primary mb-2">Role</label>
          <input
            v-if="isEditing"
            v-model="localFormData.role"
            type="text"
            class="w-full border border-border rounded-md px-4 py-3 text-body-large bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-h-[44px]"
          />
          <p v-else class="text-body-medium text-text-primary">{{ userData.role || 'Not provided' }}</p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-6">
        <div>
          <label class="block text-label font-medium text-text-primary mb-2 flex items-center">
            <GlobeIcon :size="16" class="mr-2" />
            Location
          </label>
          <input
            v-if="isEditing"
            v-model="localFormData.location"
            type="text"
            class="w-full border border-border rounded-md px-4 py-3 text-body-large bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-h-[44px]"
          />
          <p v-else class="text-body-medium text-text-primary">{{ userData.location || 'Not provided' }}</p>
        </div>
        <div>
          <label class="block text-label font-medium text-text-primary mb-2 flex items-center">
            <ClockIcon :size="16" class="mr-2" />
            Timezone
          </label>
          <input
            v-if="isEditing"
            v-model="localFormData.timezone"
            type="text"
            class="w-full border border-border rounded-md px-4 py-3 text-body-large bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-h-[44px]"
          />
          <p v-else class="text-body-medium text-text-primary">{{ userData.timezone }}</p>
        </div>
      </div>

      <div>
        <label class="block text-label font-medium text-text-primary mb-2">Bio</label>
        <textarea
          v-if="isEditing"
          v-model="localFormData.bio"
          rows="4"
          class="w-full border border-border rounded-md px-4 py-3 text-body-large bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 resize-y min-h-[88px]"
        />
        <p v-else class="text-body-medium text-text-primary">{{ userData.bio || 'No bio provided' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import {
  MailIcon,
  PhoneIcon,
  BriefcaseIcon,
  GlobeIcon,
  ClockIcon,
  EditIcon,
  SaveIcon
} from 'lucide-vue-next';

const props = defineProps<{
  userData: any;
  formData: any;
  isEditing: boolean;
}>();

const emit = defineEmits<{
  'update:form-data': [data: any];
  'save': [];
  'cancel': [];
  'edit': [];
}>();

const localFormData = ref({ ...props.formData });

watch(() => props.formData, (newVal) => {
  localFormData.value = { ...newVal };
}, { deep: true });

watch(localFormData, (newVal) => {
  emit('update:form-data', newVal);
}, { deep: true });
</script>

