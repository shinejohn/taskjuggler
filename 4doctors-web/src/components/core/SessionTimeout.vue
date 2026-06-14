<template>
  <Teleport to="body">
    <div
      v-if="showWarning"
      class="fixed inset-0 z-[120] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Session timeout warning"
    >
      <div class="absolute inset-0 bg-slate-900/60"></div>
      <div class="relative bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 text-center">
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-50 text-amber-600 mb-4">
          <TimerOff class="w-6 h-6" />
        </div>
        <h3 class="text-lg font-bold text-slate-900 mb-2">Are you still there?</h3>
        <p class="text-sm text-slate-600 mb-6">
          For your security, you'll be signed out in
          <span class="font-bold text-slate-900">{{ secondsLeft }}</span> seconds due to inactivity.
        </p>
        <div class="flex justify-center gap-3">
          <button
            type="button"
            class="px-4 py-2 border border-slate-300 bg-white text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50"
            @click="signOut"
          >
            Sign Out
          </button>
          <button
            ref="stayButton"
            type="button"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
            @click="staySignedIn"
          >
            Stay Signed In
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { TimerOff } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';

// HIPAA-friendly idle timeout: warn after 14 minutes idle, sign out 60s later.
const IDLE_MS = 14 * 60 * 1000;
const WARNING_SECONDS = 60;

const router = useRouter();
const authStore = useAuthStore();

const showWarning = ref(false);
const secondsLeft = ref(WARNING_SECONDS);
const stayButton = ref<HTMLButtonElement | null>(null);

let idleTimer: ReturnType<typeof setTimeout> | null = null;
let countdownInterval: ReturnType<typeof setInterval> | null = null;

const clearTimers = () => {
  if (idleTimer) clearTimeout(idleTimer);
  if (countdownInterval) clearInterval(countdownInterval);
  idleTimer = null;
  countdownInterval = null;
};

const startIdleTimer = () => {
  clearTimers();
  idleTimer = setTimeout(openWarning, IDLE_MS);
};

const openWarning = () => {
  showWarning.value = true;
  secondsLeft.value = WARNING_SECONDS;
  countdownInterval = setInterval(() => {
    secondsLeft.value--;
    if (secondsLeft.value <= 0) {
      signOut();
    }
  }, 1000);
};

const staySignedIn = () => {
  showWarning.value = false;
  startIdleTimer();
};

const signOut = async () => {
  clearTimers();
  showWarning.value = false;
  await authStore.logout();
  router.push('/login');
};

const handleActivity = () => {
  // Activity only resets the timer while the warning is not showing;
  // once warned, the user must explicitly choose to stay signed in.
  if (!showWarning.value) {
    startIdleTimer();
  }
};

const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'] as const;

watch(showWarning, async (open) => {
  if (open) {
    await nextTick();
    stayButton.value?.focus();
  }
});

onMounted(() => {
  activityEvents.forEach(event => window.addEventListener(event, handleActivity, { passive: true }));
  startIdleTimer();
});

onBeforeUnmount(() => {
  activityEvents.forEach(event => window.removeEventListener(event, handleActivity));
  clearTimers();
});
</script>
