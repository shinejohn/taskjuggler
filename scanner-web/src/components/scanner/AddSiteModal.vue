<template>
  <Modal
    :is-open="isOpen"
    title="Add New Site"
    size="lg"
    @close="handleClose"
  >
    <form @submit.prevent="handleSubmit" class="add-site-form">
      <div>
        <Label for="site-name">Site Name</Label>
        <Input
          id="site-name"
          v-model="form.name"
          placeholder="My Website"
          :class="errors.name && 'border-destructive'"
        />
        <p v-if="errors.name" class="text-sm text-destructive mt-1">
          {{ errors.name }}
        </p>
      </div>
      <div>
        <Label for="site-url">Site URL</Label>
        <Input
          id="site-url"
          v-model="form.url"
          placeholder="https://example.com"
          type="url"
          :class="errors.url && 'border-destructive'"
        />
        <p v-if="errors.url" class="text-sm text-destructive mt-1">
          {{ errors.url }}
        </p>
      </div>
      
      <div class="add-site-section">
        <h4 class="add-site-section-title">Authentication</h4>
        <select v-model="form.auth_type" class="add-site-select">
          <option value="none">None</option>
          <option value="basic">Basic Auth</option>
          <option value="cookie">Cookie</option>
          <option value="header">Header</option>
        </select>
        
        <div v-if="form.auth_type === 'basic'" class="add-site-auth-config">
          <div>
            <Label for="auth-username">Username</Label>
            <Input
              id="auth-username"
              v-model="form.auth_config.username"
            />
          </div>
          <div>
            <Label for="auth-password">Password</Label>
            <Input
              id="auth-password"
              v-model="form.auth_config.password"
              type="password"
            />
          </div>
        </div>
        
        <div v-if="form.auth_type === 'cookie'" class="add-site-auth-config">
          <div>
            <Label for="cookie-name">Cookie Name</Label>
            <Input
              id="cookie-name"
              v-model="form.auth_config.cookie_name"
            />
          </div>
          <div>
            <Label for="cookie-value">Cookie Value</Label>
            <Input
              id="cookie-value"
              v-model="form.auth_config.cookie_value"
            />
          </div>
        </div>
        
        <div v-if="form.auth_type === 'header'" class="add-site-auth-config">
          <div>
            <Label for="header-name">Header Name</Label>
            <Input
              id="header-name"
              v-model="form.auth_config.header_name"
            />
          </div>
          <div>
            <Label for="header-value">Header Value</Label>
            <Input
              id="header-value"
              v-model="form.auth_config.header_value"
            />
          </div>
        </div>
      </div>

      <div class="add-site-section">
        <h4 class="add-site-section-title">Scan Settings</h4>
        <div>
          <Label for="max-pages">Max Pages to Scan</Label>
          <Input
            id="max-pages"
            v-model.number="form.max_pages"
            type="number"
            placeholder="50"
          />
          <p class="text-sm text-muted-foreground mt-1">
            Leave empty for unlimited
          </p>
        </div>
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
import { Input, Label, Button } from '@taskjuggler/ui'
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
