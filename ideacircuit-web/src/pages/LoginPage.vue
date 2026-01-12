<template>
  <div class="min-h-screen flex flex-col justify-center bg-bg-secondary py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex justify-center">
        <div class="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white text-title-large font-bold">
          AI
        </div>
      </div>
      <h2 class="mt-6 text-center text-display-small font-bold text-text-primary">
        Sign in to your account
      </h2>
      <p class="mt-2 text-center text-body-medium text-text-secondary">
        Or
        <router-link to="/signup" class="font-medium text-primary hover:text-primary-hover transition-colors duration-fast">
          create a new account
        </router-link>
      </p>
    </div>
    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <Card class="glass-standard py-8 px-4 shadow-2 sm:rounded-xl sm:px-10">
        <CardContent class="p-0">
          <Alert v-if="error" variant="destructive" class="mb-4">
            <AlertCircleIcon :size="20" class="mr-2" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{{ error }}</AlertDescription>
          </Alert>
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="space-y-2">
              <Label for="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                v-model="formData.email"
                placeholder="you@example.com"
                class="min-h-[44px]"
              />
            </div>
            <div class="space-y-2">
              <Label for="password">Password</Label>
              <div class="relative">
                <Input
                  id="password"
                  name="password"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="current-password"
                  required
                  v-model="formData.password"
                  placeholder="••••••••"
                  class="pr-10 min-h-[44px]"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  class="absolute inset-y-0 right-0 pr-3"
                  @click="showPassword = !showPassword"
                  aria-label="Toggle password visibility"
                >
                  <EyeIcon v-if="!showPassword" :size="20" />
                  <EyeOffIcon v-else :size="20" />
                </Button>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <Checkbox
                  id="remember-me"
                  :checked="rememberMe"
                  @update:checked="rememberMe = $event"
                />
                <Label for="remember-me" class="text-body-small cursor-pointer">
                  Remember me
                </Label>
              </div>
              <div class="text-body-small">
                <a href="#" class="font-medium text-primary hover:text-primary-hover transition-colors duration-fast">
                  Forgot password?
                </a>
              </div>
            </div>
            <Button
              type="submit"
              :disabled="isLoading"
              class="w-full min-h-[44px]"
            >
              <LogInIcon v-if="!isLoading" :size="20" class="mr-2" />
              <span v-if="isLoading">Signing in...</span>
              <span v-else>Sign in</span>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { LogInIcon, EyeIcon, EyeOffIcon, AlertCircleIcon } from 'lucide-vue-next';
import { useAuth } from '@/composables/useAuth';
import { Card, CardContent, Input, Label, Button, Checkbox, Alert, AlertTitle, AlertDescription } from '@/components/ui';

const router = useRouter();
const { login } = useAuth();

const formData = ref({
  email: '',
  password: ''
});
const showPassword = ref(false);
const rememberMe = ref(false);
const isLoading = ref(false);
const error = ref('');

const handleSubmit = async () => {
  error.value = '';
  
  if (!formData.value.email || !formData.value.password) {
    error.value = 'Please fill in all fields';
    return;
  }
  
  isLoading.value = true;
  
  try {
    const result = await login(formData.value.email, formData.value.password);
    
    if (result.user) {
      router.push('/presentation');
    } else {
      error.value = result.error || 'Invalid email or password';
    }
  } catch (err: any) {
    console.error('Login error:', err);
    error.value = err.message || 'An error occurred. Please try again.';
  } finally {
    isLoading.value = false;
  }
};
</script>

