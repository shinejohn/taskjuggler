<template>
  <SignUpPageTemplate
    app-name="Projects"
    app-tagline="Project Delivery Hub"
    :logo-icon="FolderKanban"
    logo-gradient="bg-gradient-to-br from-orange-500 to-red-600 shadow-orange-500/20"
    tagline-color="text-orange-400"
    primary-glow="bg-orange-500/10"
    secondary-glow="bg-red-500/10"
    input-focus-color="focus:border-orange-500"
    button-gradient="bg-gradient-to-r from-orange-600 to-red-600 shadow-orange-500/30 hover:shadow-orange-500/40"
    link-color="text-orange-400 hover:text-orange-300"
    checkbox-color="text-orange-500 focus:ring-orange-500"
    sign-in-route="/login"
    :on-submit="handleRegister"
  >
    <template #extra-fields>
      <div>
        <label class="block text-sm font-semibold text-slate-300 mb-2">
          Organization Name
        </label>
        <div class="relative">
          <Building2 class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            v-model="organizationName"
            type="text"
            placeholder="Acme Corp"
            class="w-full pl-11 pr-4 py-3 bg-slate-900/50 border-2 border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
            required
          />
        </div>
      </div>
    </template>
  </SignUpPageTemplate>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SignUpPageTemplate from '../../../shared-ui/src/templates/auth/SignUpPageTemplate.vue'
import { FolderKanban, Building2 } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { Input } from '@taskjuggler/ui'

const authStore = useAuthStore()
const router = useRouter()
const organizationName = ref('')

async function handleRegister(data: { name: string; email: string; password: string; password_confirmation: string }): Promise<void> {
  await authStore.register({
    ...data,
    organization_name: organizationName.value,
  })
  router.push('/app/projects')
}
</script>
