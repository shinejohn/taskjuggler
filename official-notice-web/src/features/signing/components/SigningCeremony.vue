<template>
  <div class="signing-ceremony min-h-screen bg-gray-50 flex flex-col">
    <!-- Header -->
    <header class="bg-white border-b px-6 py-4 flex justify-between items-center">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">ON</div>
        <span class="font-semibold text-gray-900">Official Notice Verified Signing</span>
      </div>
      <div v-if="!loading && session" class="text-sm text-gray-500">
        Session ID: <span class="font-mono">{{ session.id.substring(0, 8) }}</span>
      </div>
    </header>
    
    <!-- Main Content -->
    <main class="flex-1 max-w-5xl w-full mx-auto p-6">
        
        <!-- Loading State -->
        <div v-if="loading" class="flex flex-col items-center justify-center h-64 space-y-4">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p class="text-gray-500">Preparing secure session...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-md mx-auto">
            <h3 class="text-red-800 font-semibold mb-2">Session Error</h3>
            <p class="text-red-600 mb-4">{{ error }}</p>
            <button @click="retryLoad" class="text-sm underline text-red-700">Retry</button>
        </div>

        <!-- Signing Flow -->
        <div v-else>
            
            <!-- Step 1: Verification Choice -->
            <div v-if="step === 'choice'" class="max-w-2xl mx-auto py-12">
                <VerificationChoice 
                    :verification-required="myStatus.verification_required || myStatus.session_status === 'verification_required'" 
                    @verify="handleVerifyChoice"
                    @skip="handleSkipChoice"
                />
            </div>

            <!-- Step 2: Face Match (The 'Second Pass') -->
            <div v-else-if="step === 'face-match'" class="max-w-md mx-auto bg-white p-8 rounded-lg shadow py-12">
                <h2 class="text-2xl font-bold text-center mb-2">Verify Your Identity</h2>
                <p class="text-center text-gray-500 mb-8">
                    We need to confirm it's really you signing this document.
                </p>
                
                <FaceMatchCapture @capture="handleFaceMatch" />
                
                <div v-if="faceMatchError" class="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded text-center">
                    {{ faceMatchError }}
                </div>
            </div>

            <!-- Step 3: Document + Signing -->
            <div v-else-if="step === 'signing'" class="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)]">
                <!-- Document Viewer (Left) -->
                <div class="lg:col-span-8 bg-gray-800 rounded-lg overflow-hidden shadow-inner flex items-center justify-center">
                   <iframe 
                      v-if="pdfUrl"
                      :src="pdfUrl"
                      class="w-full h-full border-none"
                      title="Document Preview"
                   ></iframe>
                   <div v-else class="text-white text-center p-8">
                       <p>Loading document preview...</p>
                   </div>
                </div>

                <!-- Signature Panel (Right) -->
                <div class="lg:col-span-4 flex flex-col space-y-4">
                    <div class="bg-white p-6 rounded-lg shadow border border-gray-200">
                        <h3 class="font-semibold text-gray-900 mb-4">Your Signature</h3>
                        
                        <SignaturePad 
                            ref="signaturePad"
                            @update:signature="updateSignature"
                        />
                        
                        <div class="mt-6">
                            <button 
                                @click="submitSignatureFlow"
                                :disabled="!currentSignature || submitting"
                                class="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium 
                                       hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed
                                       transition-colors flex items-center justify-center gap-2"
                            >
                                <span v-if="submitting" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                                {{ submitting ? 'Finalizing...' : 'Sign & Complete' }}
                            </button>
                        </div>
                    </div>

                    <div class="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800">
                        <p class="font-medium mb-1">Status: {{ verified_status_label }}</p>
                        <p v-if="isVerified">Your identity has been verified.</p>
                        <p v-else>Standard electronic signature.</p>
                    </div>
                </div>
            </div>
            
            <!-- Step 4: Success -->
             <div v-else-if="step === 'completed'" class="max-w-md mx-auto py-24 text-center">
                <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                    <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h2 class="text-3xl font-bold text-gray-900 mb-2">Signing Complete</h2>
                <p class="text-gray-600 mb-8">
                    The document has been securely signed and recorded.
                    A copy will be emailed to all parties.
                </p>
                <button class="text-blue-600 hover:text-blue-800 font-medium">Return to Dashboard</button>
            </div>
        </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSigningSession } from '../composables/useSigningSession'
import VerificationChoice from './VerificationChoice.vue'
import FaceMatchCapture from './FaceMatchCapture.vue'
import SignaturePad from './SignaturePad.vue'

const route = useRoute()
const sessionId = route.params.id as string

const { 
    session, myStatus, loading, error, 
    fetchSession, fetchMyStatus, acceptWaiver, 
    requestVerification, submitSignature, verifyFace,
    startVerification 
} = useSigningSession(sessionId)

const step = ref<'choice' | 'stripe-redirect' | 'face-match' | 'signing' | 'completed'>('choice')
const faceMatchError = ref<string | null>(null)
const currentSignature = ref<string | null>(null)
const submitting = ref(false)

const isVerified = computed(() => {
    return myStatus.value?.my_signature?.verification_status === 'verified'
})

const verified_status_label = computed(() => {
    if (isVerified.value) return 'Verified Signing'
    if (myStatus.value?.my_signature?.verification_status === 'skipped') return 'Unverified'
    return 'Pending'
})

const pdfUrl = computed(() => {
    if (!session.value?.document?.id) return null
    return `/api/official-notice/documents/${session.value.document.id}/file`
})

// Initialize
onMounted(async () => {
    await fetchSession()
    await fetchMyStatus()
    
    // Determine initial step based on status
    if (myStatus.value) {
        const sig = myStatus.value.my_signature
        // If already signed?
        if (sig.signed_at) {
            step.value = 'completed'
            return
        }

        // Logic for steps
        // If 'verified' -> go to Face Match (2nd pass) if not done, or Signing if check logic allows
        // If 'pending' -> Stay at Choice
        // If 'skipped' -> Go to Signing
        
        if (sig.verification_status === 'verified') {
             // For Verified Signing, do we enforce Face Match every time? YES.
             step.value = 'face-match'
        } else if (sig.verification_status === 'skipped') {
             step.value = 'signing'
        } else {
             step.value = 'choice'
        }
    }
})

const retryLoad = () => {
    loading.value = true
    error.value = null
    fetchSession().then(() => fetchMyStatus())
}

const handleVerifyChoice = async () => {
    try {
        // Record intent to verify (enforces 'ratchet' logic in backend)
        await requestVerification()
        
        const result = await startVerification()
        if (result.url) {
            // Redirect to Stripe Identity verification page
            window.location.href = result.url
        } else if (result.client_secret) {
            // If using Stripe.js embedded flow, would initialize here
            console.log('Stripe client_secret received:', result.client_secret)
            alert('Stripe Identity flow would initialize here with Stripe.js')
        }
    } catch (e: any) {
        console.error('Verification start failed:', e)
        alert('Failed to start verification: ' + (e.response?.data?.message || e.message))
    }
}

const handleSkipChoice = async () => {
    try {
        await acceptWaiver()
        step.value = 'signing'
    } catch (e) {
        alert("Error skipping verification")
    }
}

const handleFaceMatch = async (imageBase64: string) => {
    faceMatchError.value = null
    try {
        await verifyFace(imageBase64)
        // Success
        step.value = 'signing'
    } catch (e: any) {
        faceMatchError.value = e.response?.data?.error || "Face match failed. Please try again."
    }
}

const updateSignature = (data: string | null) => {
    currentSignature.value = data
}

const submitSignatureFlow = async () => {
    if (!currentSignature.value) return
    submitting.value = true
    
    let geo = { lat: 0, lng: 0 }
    if (navigator.geolocation) {
        try {
            const pos = await new Promise<GeolocationPosition>((res, rej) => 
                navigator.geolocation.getCurrentPosition(res, rej, { timeout: 5000 })
            )
            geo = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        } catch (e) {
            console.warn("Geolocation failed, continuing without it")
        }
    }

    try {
        await submitSignature({
            signature_image_base64: currentSignature.value.replace(/^data:image\/\w+;base64,/, ''),
            signature_method: 'draw',
            geolocation: geo
        })
        step.value = 'completed'
    } catch (e: any) {
        alert("Error signing document: " + e.message)
    } finally {
        submitting.value = false
    }
}
</script>
