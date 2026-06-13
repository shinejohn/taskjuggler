import { ref, onUnmounted } from 'vue';

export interface AudioCaptureOptions {
    visitId: string;
    onTranscriptUpdate?: (text: string, isFinal: boolean) => void;
    onError?: (error: Error) => void;
}

/**
 * Composable for capturing audio from the browser microphone.
 * Uses Web Audio API and MediaRecorder to capture audio chunks
 * that are sent to the backend for speech-to-text processing.
 */
export function useAudioCapture(options: AudioCaptureOptions) {
    const isRecording = ref(false);
    const isSupported = ref(true);
    const permissionStatus = ref<'prompt' | 'granted' | 'denied'>('prompt');
    const currentLevel = ref(0); // Audio level for visualization (0-100)

    let mediaRecorder: MediaRecorder | null = null;
    let audioStream: MediaStream | null = null;
    let audioContext: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let levelCheckInterval: number | null = null;

    // Check browser support
    if (typeof window !== 'undefined' && !navigator.mediaDevices?.getUserMedia) {
        isSupported.value = false;
    }

    /**
     * Request microphone permission and start recording
     */
    async function startRecording(): Promise<boolean> {
        if (!isSupported.value) {
            options.onError?.(new Error('Audio capture not supported'));
            return false;
        }

        try {
            // Request microphone access
            audioStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 16000, // Optimal for speech recognition
                },
            });

            permissionStatus.value = 'granted';

            // Setup audio visualization
            setupAudioVisualization(audioStream);

            // Create MediaRecorder with WebM/Opus codec
            const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
                ? 'audio/webm;codecs=opus'
                : 'audio/webm';

            mediaRecorder = new MediaRecorder(audioStream, {
                mimeType,
                audioBitsPerSecond: 16000,
            });

            // Collect audio chunks and send to backend
            mediaRecorder.ondataavailable = async (event) => {
                if (event.data.size > 0) {
                    await sendAudioChunk(event.data);
                }
            };

            // Start recording with 1-second intervals for streaming
            mediaRecorder.start(1000);
            isRecording.value = true;

            return true;
        } catch (err) {
            if (err instanceof Error && err.name === 'NotAllowedError') {
                permissionStatus.value = 'denied';
            }
            options.onError?.(err instanceof Error ? err : new Error('Failed to start recording'));
            return false;
        }
    }

    /**
     * Setup audio level visualization
     */
    function setupAudioVisualization(stream: MediaStream) {
        audioContext = new AudioContext();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;

        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);

        // Monitor audio levels for UI feedback
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        levelCheckInterval = window.setInterval(() => {
            if (analyser) {
                analyser.getByteFrequencyData(dataArray);
                const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
                currentLevel.value = Math.round((average / 255) * 100);
            }
        }, 100);
    }

    /**
     * Send audio chunk to backend for processing
     */
    async function sendAudioChunk(blob: Blob) {
        try {
            const formData = new FormData();
            formData.append('audio', blob, 'chunk.webm');
            formData.append('visit_id', options.visitId);
            formData.append('timestamp', String(Date.now()));

            // Send to transcription endpoint
            const response = await fetch('/api/doctors/scribemd/transcribe', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
                },
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                if (data.text) {
                    options.onTranscriptUpdate?.(data.text, data.is_final ?? false);
                }
            }
        } catch (err) {
            options.onError?.(err instanceof Error ? err : new Error('Failed to send audio chunk'));
        }
    }

    /**
     * Stop recording and cleanup
     */
    function stopRecording() {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
        }

        if (audioStream) {
            audioStream.getTracks().forEach(track => track.stop());
            audioStream = null;
        }

        if (levelCheckInterval) {
            clearInterval(levelCheckInterval);
            levelCheckInterval = null;
        }

        if (audioContext) {
            audioContext.close();
            audioContext = null;
        }

        analyser = null;
        mediaRecorder = null;
        isRecording.value = false;
        currentLevel.value = 0;
    }

    /**
     * Toggle recording state
     */
    async function toggleRecording(): Promise<boolean> {
        if (isRecording.value) {
            stopRecording();
            return false;
        } else {
            return startRecording();
        }
    }

    // Cleanup on unmount
    onUnmounted(() => {
        stopRecording();
    });

    return {
        isRecording,
        isSupported,
        permissionStatus,
        currentLevel,
        startRecording,
        stopRecording,
        toggleRecording,
    };
}
