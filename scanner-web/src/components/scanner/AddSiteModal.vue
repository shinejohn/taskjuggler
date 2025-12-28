<template>
  <Modal
    :is-open="isOpen"
    title="Add New Site"
    size="lg"
    @close="handleClose"
  >
    <form @submit.prevent="handleSubmit" class="add-site-form">
      <Input
        v-model="form.name"
        label="Site Name"
        placeholder="My Website"
        :required="true"
        :error="errors.name"
      />
      <Input
        v-model="form.url"
        label="Site URL"
        placeholder="https://example.com"
        type="url"
        :required="true"
        :error="errors.url"
      />
      
      <div class="add-site-section">
        <h4 class="add-site-section-title">Authentication</h4>
        <select v-model="form.auth_type" class="add-site-select">
          <option value="none">None</option>
          <option value="basic">Basic Auth</option>
          <option value="cookie">Cookie</option>
          <option value="header">Header</option>
        </select>
        
        <div v-if="form.auth_type === 'basic'" class="add-site-auth-config">
          <Input
            v-model="form.auth_config.username"
            label="Username"
            :required="true"
          />
          <Input
            v-model="form.auth_config.password"
            label="Password"
            type="password"
            :required="true"
          />
        </div>
        
        <div v-if="form.auth_type === 'cookie'" class="add-site-auth-config">
          <Input
            v-model="form.auth_config.cookie_name"
            label="Cookie Name"
            :required="true"
          />
          <Input
            v-model="form.auth_config.cookie_value"
            label="Cookie Value"
            :required="true"
          />
        </div>
        
        <div v-if="form.auth_type === 'header'" class="add-site-auth-config">
          <Input
            v-model="form.auth_config.header_name"
            label="Header Name"
            :required="true"
          />
          <Input
            v-model="form.auth_config.header_value"
            label="Header Value"
            :required="true"
          />
        </div>
      </div>

      <div class="add-site-section">
        <h4 class="add-site-section-title">Scan Settings</h4>
        <Input
          v-model.number="form.max_pages"
          label="Max Pages to Scan"
          type="number"
          placeholder="50"
          hint="Leave empty for unlimited"
        />
      </div>

      <template #footer>
        <Button variant="ghost" @click="handleClose">Cancel</Button>
        <Button type="submit" :disabled="loading">Add Site</Button>
      </template>
    </form>
  </Modal>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import Modal from '@/components/ui/Modal.vue'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'
import type { CreateSiteRequest, AuthType } from '@/types'
import { useSitesStore } from '@/stores/sites'

interface Props {
  isOpen: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  created: [site: any]
}>()

const sitesStore = useSitesStore()
const loading = ref(false)
const errors = reactive<Record<string, string>>({})

const form = reactive<CreateSiteRequest & { auth_config: any }>({
  name: '',
  url: '',
  auth_type: 'none',
  auth_config: {},
  max_pages: undefined,
})

const handleClose = () => {
  emit('close')
  // Reset form
  form.name = ''
  form.url = ''
  form.auth_type = 'none'
  form.auth_config = {}
  form.max_pages = undefined
  Object.keys(errors).forEach(key => delete errors[key])
}

const handleSubmit = async () => {
  Object.keys(errors).forEach(key => delete errors[key])
  
  if (!form.name.trim()) {
    errors.name = 'Site name is required'
    return
  }
  
  if (!form.url.trim()) {
    errors.url = 'Site URL is required'
    return
  }
  
  try {
    const url = new URL(form.url)
    form.url = url.href
  } catch {
    errors.url = 'Invalid URL format'
    return
  }
  
  loading.value = true
  try {
    const site = await sitesStore.createSite({
      name: form.name,
      url: form.url,
      auth_type: form.auth_type as AuthType,
      auth_config: form.auth_type !== 'none' ? form.auth_config : undefined,
      max_pages: form.max_pages,
    })
    emit('created', site)
    handleClose()
  } catch (error: any) {
    if (error.response?.data?.errors) {
      Object.assign(errors, error.response.data.errors)
    } else {
      errors.general = error.response?.data?.message || 'Failed to create site'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.add-site-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.add-site-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border);
}

.add-site-section-title {
  font-size: var(--font-title-small);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.add-site-select {
  width: 100%;
  min-height: 44px;
  padding: var(--space-3) var(--space-4);
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 1rem;
  color: var(--color-text-primary);
}

.add-site-auth-config {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
</style>
