<template>
  <div class="min-h-screen flex flex-col justify-center bg-bg-secondary py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex justify-center">
        <div class="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white text-title-large font-bold">
          AI
        </div>
      </div>
      <h2 class="mt-6 text-center text-display-small font-bold text-text-primary">
        Create a new account
      </h2>
      <p class="mt-2 text-center text-body-medium text-text-secondary">
        Or
        <router-link to="/login" class="font-medium text-primary hover:text-primary-hover transition-colors duration-fast">
          sign in to your existing account
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
              <Label for="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                autocomplete="name"
                required
                v-model="formData.name"
                placeholder="John Doe"
                class="min-h-[44px]"
              />
            </div>
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
                  autocomplete="new-password"
                  required
                  v-model="formData.password"
                  @input="updatePasswordStrength"
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
              <div v-if="formData.password" class="mt-2 space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-caption text-text-tertiary">Password strength:</span>
                  <span :class="`text-caption font-medium ${getPasswordStrengthColor()}`">
                    {{ getPasswordStrengthText() }}
                  </span>
                </div>
                <Progress :model-value="(passwordStrength / 4) * 100" class="h-1" />
                <ul class="space-y-1">
                  <li class="text-caption flex items-center text-text-secondary">
                    <CheckCircleIcon
                      v-if="/^.{8,}$/.test(formData.password)"
                      :size="12"
                      class="text-success mr-1"
                    />
                    <AlertCircleIcon
                      v-else
                      :size="12"
                      class="text-text-tertiary mr-1"
                    />
                    At least 8 characters
                  </li>
                  <li class="text-caption flex items-center text-text-secondary">
                    <CheckCircleIcon
                      v-if="/[A-Z]/.test(formData.password)"
                      :size="12"
                      class="text-success mr-1"
                    />
                    <AlertCircleIcon
                      v-else
                      :size="12"
                      class="text-text-tertiary mr-1"
                    />
                    At least one uppercase letter
                  </li>
                  <li class="text-caption flex items-center text-text-secondary">
                    <CheckCircleIcon
                      v-if="/[0-9]/.test(formData.password)"
                      :size="12"
                      class="text-success mr-1"
                    />
                    <AlertCircleIcon
                      v-else
                      :size="12"
                      class="text-text-tertiary mr-1"
                    />
                    At least one number
                  </li>
                  <li class="text-caption flex items-center text-text-secondary">
                    <CheckCircleIcon
                      v-if="/[^A-Za-z0-9]/.test(formData.password)"
                      :size="12"
                      class="text-success mr-1"
                    />
                    <AlertCircleIcon
                      v-else
                      :size="12"
                      class="text-text-tertiary mr-1"
                    />
                    At least one special character
                  </li>
                </ul>
              </div>
            </div>
            <div class="space-y-2">
              <Label for="confirmPassword">Confirm password</Label>
              <div class="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="new-password"
                  required
                  v-model="formData.confirmPassword"
                  placeholder="••••••••"
                  class="min-h-[44px]"
                />
                <div
                  v-if="formData.password && formData.confirmPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <CheckCircleIcon
                    v-if="formData.password === formData.confirmPassword"
                    :size="20"
                    class="text-success"
                  />
                  <AlertCircleIcon
                    v-else
                    :size="20"
                    class="text-destructive"
                  />
                </div>
              </div>
              <div v-if="formData.password && formData.confirmPassword" class="flex items-center">
                <span
                  :class="`text-caption ${
                    formData.password === formData.confirmPassword ? 'text-success' : 'text-destructive'
                  }`"
                >
                  {{
                    formData.password === formData.confirmPassword
                      ? 'Passwords match'
                      : 'Passwords do not match'
                  }}
                </span>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <Checkbox
                id="terms"
                :checked="agreeToTerms"
                @update:checked="agreeToTerms = $event"
              />
              <Label for="terms" class="text-body-small cursor-pointer">
                I agree to the
                <a href="#" class="font-medium text-primary hover:text-primary-hover">Terms of Service</a>
                and
                <a href="#" class="font-medium text-primary hover:text-primary-hover">Privacy Policy</a>
              </Label>
            </div>
            <Button
              type="submit"
              :disabled="isLoading"
              class="w-full min-h-[44px]"
            >
              <UserPlusIcon v-if="!isLoading" :size="20" class="mr-2" />
              <span v-if="isLoading">Creating account...</span>
              <span v-else>Create account</span>
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
import {
  UserPlusIcon,
  EyeIcon,
  EyeOffIcon,
  AlertCircleIcon,
  CheckCircleIcon
} from 'lucide-vue-next';
import { useAuth } from '@/composables/useAuth';
import {
  Card,
  CardContent,
  Input,
  Label,
  Button,
  Checkbox,
  Alert,
  AlertTitle,
  AlertDescription,
  Progress
} from '@/components/ui';

const router = useRouter();
const { register } = useAuth();

const formData = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
});
const showPassword = ref(false);
const agreeToTerms = ref(false);
const isLoading = ref(false);
const error = ref('');
const passwordStrength = ref(0);

const updatePasswordStrength = () => {
  const value = formData.value.password;
  let strength = 0;
  if (value.length >= 8) strength += 1;
  if (/[A-Z]/.test(value)) strength += 1;
  if (/[0-9]/.test(value)) strength += 1;
  if (/[^A-Za-z0-9]/.test(value)) strength += 1;
  passwordStrength.value = strength;
};

const getPasswordStrengthText = () => {
  if (passwordStrength.value === 0) return 'Very weak';
  if (passwordStrength.value === 1) return 'Weak';
  if (passwordStrength.value === 2) return 'Medium';
  if (passwordStrength.value === 3) return 'Strong';
  return 'Very strong';
};

const getPasswordStrengthColor = () => {
  if (passwordStrength.value === 0) return 'text-destructive';
  if (passwordStrength.value === 1) return 'text-warning';
  if (passwordStrength.value === 2) return 'text-warning';
  if (passwordStrength.value === 3) return 'text-success';
  return 'text-success';
};

const handleSubmit = async () => {
  error.value = '';
  
  if (!formData.value.name || !formData.value.email || !formData.value.password) {
    error.value = 'Please fill in all required fields';
    return;
  }
  if (formData.value.password !== formData.value.confirmPassword) {
    error.value = 'Passwords do not match';
    return;
  }
  if (passwordStrength.value < 3) {
    error.value = 'Please use a stronger password';
    return;
  }
  if (!agreeToTerms.value) {
    error.value = 'You must agree to the terms and conditions';
    return;
  }
  isLoading.value = true;
  
  try {
    const result = await register(
      formData.value.email,
      formData.value.password,
      formData.value.name
    );
    
    if (result.user) {
      router.push('/login');
    } else {
      error.value = result.error || 'Failed to create account';
    }
  } catch (err: any) {
    console.error('Signup error:', err);
    error.value = err.message || 'An error occurred. Please try again.';
  } finally {
    isLoading.value = false;
  }
};
</script>
