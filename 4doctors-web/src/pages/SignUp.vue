<template>
  <div class="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex justify-center items-center gap-2 mb-6">
        <div class="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg">
          <Activity class="h-6 w-6 text-white" />
        </div>
        <span class="text-2xl font-black tracking-tight text-slate-900">
          4Doctors<span class="text-blue-500">.ai</span>
        </span>
      </div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-slate-900">
        Start your 14-day free trial
      </h2>
      <p class="mt-2 text-center text-sm text-slate-600">
        Already have an account?
        <router-link to="/login" class="font-medium text-blue-600 hover:text-blue-500">
          Sign in
        </router-link>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-slate-100">
        <form class="space-y-6" @submit.prevent="handleSignUp">
          <div>
            <label for="name" class="block text-sm font-medium text-slate-700"> Practice / Doctor Name </label>
            <div class="mt-1">
              <input id="name" v-model="name" name="name" type="text" required class="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-slate-700"> Email address </label>
            <div class="mt-1">
              <input id="email" v-model="email" name="email" type="email" autocomplete="email" required class="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-slate-700"> Password </label>
            <div class="mt-1">
              <input id="password" v-model="password" name="password" type="password" autocomplete="new-password" required class="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
          </div>
          
           <div>
            <label for="phone" class="block text-sm font-medium text-slate-700"> Practice Phone (Optional) </label>
            <div class="mt-1">
              <input id="phone" v-model="phone" name="phone" type="tel" autocomplete="tel" class="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
          </div>

          <div>
            <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
              Create Account
            </button>
          </div>
        </form>
        
        <p class="mt-4 text-xs text-center text-slate-400">
            By signing up, you agree to our <a href="#" class="underline">Terms of Service</a> and <a href="#" class="underline">Privacy Policy</a>.
            <br>
            HIPAA Compliant & Secure.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Activity } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const name = ref('');
const email = ref('');
const password = ref('');
const phone = ref('');

const handleSignUp = async () => {
    try {
        await authStore.register({
            name: name.value,
            email: email.value,
            password: password.value,
            password_confirmation: password.value, // Simple confirmation logic for now
        });
        router.push('/subscribe');
    } catch (error) {
        console.error('Registration failed', error);
        alert('Registration failed. Please try again.');
    }
};
</script>
