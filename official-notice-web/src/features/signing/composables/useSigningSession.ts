import { ref } from 'vue'
import axios from 'axios'

export function useSigningSession(sessionId: string) {
    const session = ref<any>(null)
    const myStatus = ref<any>(null)
    const loading = ref(true)
    const error = ref<string | null>(null)

    const fetchSession = async () => {
        try {
            const { data } = await axios.get(`/api/official-notice/signing-sessions/${sessionId}`)
            session.value = data.data
        } catch (e: any) {
            error.value = e.message
        }
    }

    const fetchMyStatus = async () => {
        try {
            const { data } = await axios.get(`/api/official-notice/signing-sessions/${sessionId}/my-status`)
            myStatus.value = data.data
        } catch (e: any) {
            error.value = e.message
        } finally {
            loading.value = false
        }
    }

    const acceptWaiver = async () => {
        await axios.post(`/api/official-notice/signing-sessions/${sessionId}/accept-waiver`)
        await fetchMyStatus()
    }

    const requestVerification = async () => {
        await axios.post(`/api/official-notice/signing-sessions/${sessionId}/request-verification`)
        await fetchMyStatus()
    }

    const submitSignature = async (payload: { signature_image_base64: string, signature_method: string, geolocation?: any }) => {
        const { data } = await axios.post(`/api/official-notice/signing-sessions/${sessionId}/sign`, payload)
        return data.data
    }

    const verifyFace = async (imageBase64: string) => {
        const { data } = await axios.post(`/api/official-notice/signing-sessions/${sessionId}/verify-face`, { face_image_base64: imageBase64 })
        return data
    }

    const startVerification = async () => {
        const { data } = await axios.post(`/api/official-notice/identity/start-verification`)
        return data // Returns { verification_id, client_secret, url }
    }

    return {
        session,
        myStatus,
        loading,
        error,
        fetchSession,
        fetchMyStatus,
        acceptWaiver,
        requestVerification,
        submitSignature,
        verifyFace,
        startVerification
    }
}
