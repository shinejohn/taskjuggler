<template>
  <div class="verification-choice max-w-lg mx-auto p-6 bg-white rounded-lg shadow">
    <h2 class="text-xl font-semibold mb-4">Identity Verification</h2>
    
    <p class="text-gray-600 mb-6">
      Official Notice offers identity verification to confirm you are who you say you are.
      This creates a legally defensible record that YOU signed this document.
    </p>
    
    <!-- Show if no party has required verification -->
    <p v-if="!verificationRequired" class="text-sm text-amber-600 mb-4">
      No party to this transaction has requested ID verification.
    </p>
    
    <!-- Show if another party has required verification -->
    <div v-else class="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
      <p class="text-blue-800 font-medium">
        {{ requiredByPartyName }} has requested ID verification for all parties.
      </p>
      <p class="text-blue-600 text-sm mt-1">
        Verification is required to complete your signature.
      </p>
    </div>
    
    <div class="space-y-4">
      <!-- Verify Option -->
      <label 
        class="block p-4 border-2 rounded-lg cursor-pointer transition-all"
        :class="choice === 'verify' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'"
      >
        <input 
          type="radio" 
          v-model="choice" 
          value="verify" 
          class="sr-only"
        />
        <div class="flex items-start gap-3">
          <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5"
               :class="choice === 'verify' ? 'border-green-500' : 'border-gray-300'">
            <div v-if="choice === 'verify'" class="w-2.5 h-2.5 rounded-full bg-green-500"></div>
          </div>
          <div>
            <span class="font-medium text-green-700">VERIFY MY IDENTITY</span>
            <span class="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Recommended</span>
            <p class="text-sm text-gray-600 mt-1">
              Government ID + facial recognition. Takes 2 minutes.
              Creates verified signing record.
            </p>
          </div>
        </div>
      </label>
      
      <!-- Skip Option (only if not required) -->
      <label 
        v-if="!verificationRequired"
        class="block p-4 border-2 rounded-lg cursor-pointer transition-all"
        :class="choice === 'skip' ? 'border-amber-500 bg-amber-50' : 'border-gray-200 hover:border-gray-300'"
      >
        <input 
          type="radio" 
          v-model="choice" 
          value="skip" 
          class="sr-only"
        />
        <div class="flex items-start gap-3">
          <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5"
               :class="choice === 'skip' ? 'border-amber-500' : 'border-gray-300'">
            <div v-if="choice === 'skip'" class="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
          </div>
          <div>
            <span class="font-medium text-gray-700">SKIP VERIFICATION</span>
            <p class="text-sm text-gray-500 mt-1">
              I understand that without ID verification, this signature only proves 
              someone with access to my email clicked a button. I accept the risk 
              that this signature could be disputed or challenged. I was offered 
              verification and declined.
            </p>
          </div>
        </div>
      </label>
    </div>
    
    <button 
      @click="handleContinue"
      :disabled="!choice || (verificationRequired && choice !== 'verify')"
      class="w-full mt-6 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium 
             hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed
             transition-colors"
    >
      Continue to Sign
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  verificationRequired: boolean
  requiredByPartyName?: string
}>()

const emit = defineEmits<{
  (e: 'verify'): void
  (e: 'skip'): void
}>()

const choice = ref<'verify' | 'skip' | null>(null)

// Auto-select verify if required
if (props.verificationRequired) {
  choice.value = 'verify'
}

const handleContinue = () => {
  if (choice.value === 'verify') {
    emit('verify')
  } else if (choice.value === 'skip') {
    emit('skip')
  }
}
</script>
