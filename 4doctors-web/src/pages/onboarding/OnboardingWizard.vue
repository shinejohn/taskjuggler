<template>
  <div class="flex h-screen bg-slate-50 font-sans overflow-hidden">
    <!-- Left Sidebar: Progress Checklist -->
    <SetupChecklist />

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col relative h-full overflow-hidden">
      
      <!-- Top Bar -->
      <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 flex-shrink-0 z-10">
        <div class="flex items-center gap-2 text-slate-400 text-sm">
          <span>Setup</span> 
          <ChevronRight class="w-4 h-4" />
          <span class="text-slate-900 font-medium capitalize">{{ currentStep.replace('-', ' ') }}</span>
        </div>
        
        <div class="flex items-center gap-4">
          <button 
            @click="toggleAssistant"
            class="flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all"
            :class="showAssistant ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'"
          >
            <Bot class="w-4 h-4" />
            <span class="text-sm font-medium">Assistant</span>
          </button>
          
          <div class="h-4 w-[1px] bg-slate-200"></div>
          
          <button class="text-slate-400 hover:text-slate-600 text-sm font-medium">
            Save & Exit
          </button>
        </div>
      </header>

      <!-- Step Content Container -->
      <div class="flex-1 overflow-y-auto p-8 md:p-12 pb-24 relative">
        <div class="max-w-2xl mx-auto space-y-8 fade-in">
            
          <!-- WELCOME STEP -->
          <div v-if="currentStep === 'welcome'" class="text-center py-10 space-y-6">
            <div class="w-20 h-20 bg-blue-100 rounded-3xl mx-auto flex items-center justify-center mb-6">
                <Sparkles class="w-10 h-10 text-blue-600" />
            </div>
            <h1 class="text-4xl font-bold text-slate-900 tracking-tight">Welcome to URPA</h1>
            <p class="text-xl text-slate-500 leading-relaxed max-w-lg mx-auto">
              Your Universal Resource & Practice Assistant. Let's spend a few minutes customizing the system to fit your workflow perfectly.
            </p>
            <div class="pt-8">
               <button 
                  @click="store.nextStep()"
                  class="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-200 hover:bg-blue-700 hover:scale-105 transition-all flex items-center gap-2 mx-auto"
                >
                  Start Setup <ChevronRight class="w-5 h-5" />
                </button>
            </div>
          </div>

          <!-- PROFILE STEP -->
          <div v-if="currentStep === 'profile'">
            <h2 class="text-2xl font-bold text-slate-900 mb-2">Confirm Your Details</h2>
            <p class="text-slate-500 mb-8">Ensure your basic information is correct for your professional profile.</p>

            <div class="space-y-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <div class="grid grid-cols-2 gap-6">
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-2">First Name</label>
                        <input v-model="store.profileSettings.firstName" type="text" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-2">Last Name</label>
                        <input v-model="store.profileSettings.lastName" type="text" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                    </div>
                </div>
                 <div>
                    <label class="block text-sm font-bold text-slate-700 mb-2">Clinical Specialty</label>
                    <input v-model="store.profileSettings.specialty" type="text" placeholder="e.g. Family Medicine, Cardiology" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                </div>
                 <div>
                    <label class="block text-sm font-bold text-slate-700 mb-2">Direct Phone (Private)</label>
                    <input v-model="store.profileSettings.phone" type="tel" placeholder="(555) 000-0000" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                </div>
            </div>
          </div>

          <!-- URPA SETUP STEP -->
          <div v-if="currentStep === 'urpa-setup'">
             <h2 class="text-2xl font-bold text-slate-900 mb-2">Customize Your Assistant</h2>
            <p class="text-slate-500 mb-8">Choose how URPA interacts with you and your patients.</p>
             
             <div class="space-y-6">
                 <!-- Voice Selection -->
                  <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                      <h3 class="font-bold text-slate-900 mb-4 flex items-center gap-2">
                          <Mic class="w-5 h-5 text-purple-500" /> Assistant Voice
                      </h3>
                      <div class="grid grid-cols-2 gap-4">
                          <button 
                            v-for="voice in ['alloy', 'echo', 'fable', 'onyx']" 
                            :key="voice"
                            @click="store.urpaSettings.voice = voice"
                            class="p-4 rounded-xl border text-left transition-all"
                            :class="store.urpaSettings.voice === voice ? 'border-purple-500 bg-purple-50 ring-1 ring-purple-500' : 'border-slate-200 hover:bg-slate-50'"
                          >
                              <div class="font-bold capitalize text-slate-900">{{ voice }}</div>
                              <div class="text-xs text-slate-500 mt-1">Play sample ▶</div>
                          </button>
                      </div>
                  </div>

                  <!-- Proactive Features -->
                  <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                      <h3 class="font-bold text-slate-900 mb-4 flex items-center gap-2">
                          <Zap class="w-5 h-5 text-amber-500" /> Proactive Intelligence
                      </h3>
                      <label class="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer">
                          <input type="checkbox" v-model="store.urpaSettings.proactiveCheckins" class="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-blue-500">
                          <div>
                              <span class="block font-bold text-slate-900">Morning Briefing</span>
                              <span class="text-sm text-slate-500">Receive a summary of your day, patient load, and critical tasks every morning at {{ store.urpaSettings.checkinTime }}.</span>
                          </div>
                      </label>
                  </div>
             </div>
          </div>
          
           <!-- 4CALLS SETUP STEP -->
          <div v-if="currentStep === 'calls-setup'">
             <h2 class="text-2xl font-bold text-slate-900 mb-2">Telephony & 4Calls</h2>
            <p class="text-slate-500 mb-8">Configure your professional line and voicemail handling.</p>

             <div class="space-y-6">
                 <!-- Availability -->
                <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 class="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Clock class="w-5 h-5 text-green-500" /> Availability Hours
                    </h3>
                    <div class="flex items-center gap-4">
                        <div class="flex-1">
                            <label class="text-xs font-bold text-slate-500 uppercase">Start Time</label>
                            <input v-model="store.callsSettings.availability.start" type="time" class="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg">
                        </div>
                        <div class="text-slate-300">to</div>
                         <div class="flex-1">
                            <label class="text-xs font-bold text-slate-500 uppercase">End Time</label>
                            <input v-model="store.callsSettings.availability.end" type="time" class="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg">
                        </div>
                    </div>
                    <p class="text-xs text-slate-500 mt-3">Calls outside these hours will go directly to AI voicemail.</p>
                </div>

                <!-- Voicemail Script -->
                <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="font-bold text-slate-900 flex items-center gap-2">
                            <Phone class="w-5 h-5 text-blue-500" /> AI Voicemail Greeting
                        </h3>
                        <div class="text-xs px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md font-bold">Try asking the Assistant!</div>
                    </div>
                    <textarea 
                        v-model="store.callsSettings.voicemailGreeting" 
                        rows="4" 
                        placeholder="e.g. You have reached Dr. Smith. I am with a patient..."
                        class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none text-sm"
                    ></textarea>
                </div>
             </div>
          </div>

          <!-- BUSINESS PROFILE (Placeholder) -->
          <div v-if="currentStep === 'business-profile'" class="text-center py-10">
              <div class="w-20 h-20 bg-slate-100 rounded-3xl mx-auto flex items-center justify-center mb-6">
                  <Building2 class="w-10 h-10 text-slate-400" />
              </div>
              <h2 class="text-2xl font-bold text-slate-900 mb-2">Business Profile</h2>
              <p class="text-slate-500 max-w-md mx-auto mb-8">Detailed business configuration options will be available soon. For now, we'll use your default practice settings.</p>
               <button 
                  @click="store.nextStep()"
                  class="px-6 py-3 bg-white border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all"
                >
                  Skip for Now
                </button>
          </div>

          <!-- COMPLETE -->
           <div v-if="currentStep === 'complete'" class="text-center py-10 space-y-6">
            <div class="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-6 animate-pulse">
                <Check class="w-10 h-10 text-green-600" />
            </div>
            <h1 class="text-3xl font-bold text-slate-900 tracking-tight">You're All Set!</h1>
            <p class="text-slate-500 leading-relaxed max-w-md mx-auto">
              Your profile is configured and URPA is ready to assist you.
            </p>
             <div class="pt-8">
               <button 
                  @click="handleComplete"
                  class="px-8 py-4 bg-green-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-green-200 hover:bg-green-700 hover:scale-105 transition-all flex items-center gap-2 mx-auto"
                >
                  Go to Dashboard <ArrowRight class="w-5 h-5" />
                </button>
            </div>
          </div>

        </div>
      </div>

      <!-- Bottom Navigation Footer (Hidden on Welcome/Complete) -->
      <footer 
        v-if="currentStep !== 'welcome' && currentStep !== 'complete'" 
        class="bg-white border-t border-slate-200 p-4 px-8 flex justify-between items-center z-10"
      >
        <button 
          @click="store.previousStep()"
          class="px-6 py-2.5 text-slate-500 font-bold hover:text-slate-800 transition-colors"
        >
          Back
        </button>
        <button 
          @click="store.nextStep()"
          class="px-8 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 shadow-lg shadow-slate-200 transition-all flex items-center gap-2"
        >
          Continue <ArrowRight class="w-4 h-4" />
        </button>
      </footer>

      <!-- Floating Assistant Panel -->
      <Transition name="slide-right">
        <SetupAssistant 
            v-if="showAssistant" 
            :current-step="currentStep" 
            @close="showAssistant = false" 
        /> 
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ChevronRight, Sparkles, Mic, Zap, Clock, Phone, Building2, Check, ArrowRight, Bot } from 'lucide-vue-next';
import { useOnboardingStore } from '@/stores/onboardingStore';
import SetupChecklist from '@/components/onboarding/SetupChecklist.vue';
import SetupAssistant from '@/components/onboarding/SetupAssistant.vue';

const router = useRouter();
const store = useOnboardingStore();
const currentStep = computed(() => store.currentStep);

const showAssistant = ref(true); // Default to open for help

const toggleAssistant = () => {
    showAssistant.value = !showAssistant.value;
};

const handleComplete = async () => {
    await store.completeOnboarding();
    router.push('/dashboard');
};
</script>

<style scoped>
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease;
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}

.fade-in {
    animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>
