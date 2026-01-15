<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        @click="onClose"
      >
        <div
          :class="['fixed right-0 top-0 bottom-0 w-full max-w-5xl shadow-2xl flex', panelBg]"
          @click.stop
        >
          <!-- Sidebar - Artifact List -->
          <div :class="['w-80 border-r-2 flex flex-col', sidebarBg, borderColor]">
            <!-- Sidebar Header -->
            <div :class="['p-4 border-b-2', borderColor]">
              <div class="flex items-center justify-between mb-4">
                <h3 :class="['text-lg font-bold', textPrimary]">Artifacts</h3>
                <span :class="['text-sm font-semibold px-2 py-1 rounded-full', theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-gray-300 text-gray-700']">
                  {{ artifacts.length }}
                </span>
              </div>

              <!-- Dropbox Connection -->
              <button
                v-if="!isDropboxConnected"
                @click="handleConnectDropbox"
                class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-shadow"
              >
                <Cloud class="h-5 w-5" />
                Connect Dropbox
              </button>
              <div
                v-else
                :class="['flex items-center gap-2 px-3 py-2 rounded-lg border-2', theme === 'dark' ? 'bg-green-500/20 border-green-500/50' : 'bg-green-100 border-green-300']"
              >
                <Check :class="['h-5 w-5', theme === 'dark' ? 'text-green-400' : 'text-green-600']" />
                <span :class="['text-sm font-semibold', theme === 'dark' ? 'text-green-300' : 'text-green-700']">
                  Dropbox Connected
                </span>
              </div>
            </div>

            <!-- Artifact List -->
            <div class="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
              <button
                v-for="artifact in artifacts"
                :key="artifact.id"
                @click="selectedArtifact = artifact"
                :class="['w-full text-left p-3 rounded-lg border-2 transition-all', selectedArtifact?.id === artifact.id ? selectedBg : [itemBg, 'border-transparent']]"
              >
                <div class="flex items-start gap-3">
                  <div :class="['p-2 rounded-lg', theme === 'dark' ? 'bg-slate-600/50' : 'bg-gray-300', getLanguageColor(artifact.language)]">
                    <component :is="getArtifactIcon(artifact.artifact_type)" class="h-5 w-5" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <h4 :class="['text-sm font-bold truncate', textPrimary]">
                      {{ artifact.title }}
                    </h4>
                    <p :class="['text-xs mt-1', textSecondary]">
                      {{ formatTime(artifact.created_at) }}
                    </p>
                    <span
                      v-if="artifact.language"
                      :class="['text-xs font-semibold mt-1 inline-block', getLanguageColor(artifact.language)]"
                    >
                      {{ artifact.language }}
                    </span>
                  </div>
                  <Cloud v-if="artifact.savedToDropbox" :class="['h-4 w-4', theme === 'dark' ? 'text-blue-400' : 'text-blue-600']" />
                </div>
              </button>
            </div>
          </div>

          <!-- Main Content Area -->
          <div class="flex-1 flex flex-col">
            <!-- Header -->
            <div :class="['flex items-center justify-between p-4 border-b-2', borderColor]">
              <div class="flex items-center gap-3">
                <template v-if="selectedArtifact">
                  <div :class="['p-2 rounded-lg', theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200', getLanguageColor(selectedArtifact.language)]">
                    <component :is="getArtifactIcon(selectedArtifact.artifact_type)" class="h-5 w-5" />
                  </div>
                  <div>
                    <h2 :class="['text-xl font-bold', textPrimary]">
                      {{ selectedArtifact.title }}
                    </h2>
                    <p v-if="selectedArtifact.language" :class="['text-sm', getLanguageColor(selectedArtifact.language)]">
                      {{ selectedArtifact.language }}
                    </p>
                  </div>
                </template>
              </div>

              <div class="flex items-center gap-2">
                <template v-if="selectedArtifact">
                  <!-- Copy Button -->
                  <button
                    @click="handleCopy(selectedArtifact)"
                    :class="['p-2 rounded-lg transition-colors', theme === 'dark' ? 'hover:bg-slate-700 text-slate-400 hover:text-white' : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900']"
                    title="Copy to clipboard"
                  >
                    <Check v-if="copiedId === selectedArtifact.id" class="h-5 w-5 text-green-500" />
                    <Copy v-else class="h-5 w-5" />
                  </button>

                  <!-- Download Button -->
                  <button
                    @click="handleDownload(selectedArtifact)"
                    :class="['p-2 rounded-lg transition-colors', theme === 'dark' ? 'hover:bg-slate-700 text-slate-400 hover:text-white' : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900']"
                    title="Download"
                  >
                    <Download class="h-5 w-5" />
                  </button>

                  <!-- Save to Dropbox Button -->
                  <button
                    v-if="isDropboxConnected"
                    @click="handleSaveToDropbox(selectedArtifact.id)"
                    :disabled="savingId === selectedArtifact.id || selectedArtifact.savedToDropbox"
                    :class="['flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed', selectedArtifact.savedToDropbox ? (theme === 'dark' ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700') : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg']"
                  >
                    <Cloud v-if="savingId === selectedArtifact.id" class="h-4 w-4 animate-spin" />
                    <Check v-else-if="selectedArtifact.savedToDropbox" class="h-4 w-4" />
                    <Save v-else class="h-4 w-4" />
                    {{ savingId === selectedArtifact.id ? 'Saving...' : selectedArtifact.savedToDropbox ? 'Saved' : 'Save to Dropbox' }}
                  </button>
                </template>

                <!-- Close Button -->
                <button
                  @click="onClose"
                  :class="['p-2 rounded-lg transition-colors', theme === 'dark' ? 'hover:bg-slate-700 text-slate-400 hover:text-white' : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900']"
                >
                  <X class="h-6 w-6" />
                </button>
              </div>
            </div>

            <!-- Content Display -->
            <div class="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <template v-if="selectedArtifact">
                <Transition name="fade" mode="out-in">
                  <div :key="selectedArtifact.id">
                    <pre
                      v-if="selectedArtifact.artifact_type === 'code'"
                      :class="['p-6 rounded-xl overflow-x-auto text-sm font-mono leading-relaxed border-2', codeBg, 'text-gray-100', borderColor]"
                    >
                      <code>{{ selectedArtifact.content }}</code>
                    </pre>
                    <div
                      v-else-if="selectedArtifact.artifact_type === 'document'"
                      :class="['p-6 rounded-xl border-2', theme === 'dark' ? 'bg-slate-800/30' : 'bg-gray-50', borderColor]"
                    >
                      <p :class="['text-base leading-relaxed whitespace-pre-wrap', textPrimary]">
                        {{ selectedArtifact.content }}
                      </p>
                    </div>
                    <div
                      v-else
                      :class="['p-6 rounded-xl border-2 flex items-center justify-center min-h-[400px]', theme === 'dark' ? 'bg-slate-800/30' : 'bg-gray-50', borderColor]"
                    >
                      <div class="text-center">
                        <component :is="getArtifactIcon(selectedArtifact.artifact_type)" class="h-16 w-16 mx-auto mb-4" />
                        <p :class="['mt-4', textSecondary]">
                          {{ selectedArtifact.artifact_type === 'image' ? 'Image preview' : 'File preview' }}
                        </p>
                      </div>
                    </div>
                  </div>
                </Transition>
              </template>
              <div v-else class="h-full flex items-center justify-center">
                <div class="text-center">
                  <Folder :class="['h-16 w-16 mx-auto mb-4', textSecondary]" />
                  <p :class="['text-lg font-semibold', textPrimary]">
                    No artifact selected
                  </p>
                  <p :class="['text-sm mt-2', textSecondary]">
                    Select an artifact from the sidebar to view
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { X, Download, Copy, Check, Code, FileText, Image as ImageIcon, File, Cloud, Save, Folder } from 'lucide-vue-next';
import { useTheme } from '@/composables/useTheme';
import type { UrpaArtifact } from '@/types/ai';
import api from '@/utils/api';

const props = defineProps<{
  isOpen: boolean;
  artifacts: UrpaArtifact[];
}>();

const emit = defineEmits<{
  close: [];
  saveToDropbox: [artifactId: string];
}>();

const { theme } = useTheme();

const selectedArtifact = ref<UrpaArtifact | null>(props.artifacts[0] || null);
const copiedId = ref<string | null>(null);
const isDropboxConnected = ref(false);
const savingId = ref<string | null>(null);
const artifacts = ref<UrpaArtifact[]>(props.artifacts);

const panelBg = computed(() => theme.value === 'dark' ? 'bg-slate-900/95' : 'bg-white/95');
const sidebarBg = computed(() => theme.value === 'dark' ? 'bg-slate-800/50' : 'bg-gray-100');
const itemBg = computed(() => theme.value === 'dark' ? 'bg-slate-700/30 hover:bg-slate-700/50' : 'bg-gray-200 hover:bg-gray-300');
const selectedBg = computed(() => theme.value === 'dark' ? 'bg-slate-700 border-teal-500' : 'bg-purple-100 border-purple-500');
const codeBg = computed(() => theme.value === 'dark' ? 'bg-slate-950' : 'bg-gray-900');
const textPrimary = computed(() => theme.value === 'dark' ? 'text-white' : 'text-gray-900');
const textSecondary = computed(() => theme.value === 'dark' ? 'text-slate-400' : 'text-gray-600');
const borderColor = computed(() => theme.value === 'dark' ? 'border-slate-700' : 'border-gray-300');

function getArtifactIcon(type: string) {
  switch (type) {
    case 'code':
      return Code;
    case 'document':
      return FileText;
    case 'image':
      return ImageIcon;
    case 'file':
      return File;
    default:
      return File;
  }
}

function getLanguageColor(language?: string) {
  switch (language) {
    case 'typescript':
    case 'tsx':
      return 'text-blue-400';
    case 'javascript':
    case 'jsx':
      return 'text-yellow-400';
    case 'python':
      return 'text-green-400';
    case 'html':
      return 'text-orange-400';
    case 'css':
      return 'text-pink-400';
    default:
      return theme.value === 'dark' ? 'text-slate-400' : 'text-gray-600';
  }
}

function formatTime(dateStr?: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function handleCopy(artifact: UrpaArtifact) {
  navigator.clipboard.writeText(artifact.content || '');
  copiedId.value = artifact.id;
  setTimeout(() => {
    copiedId.value = null;
  }, 2000);
}

function handleDownload(artifact: UrpaArtifact) {
  const blob = new Blob([artifact.content || ''], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${artifact.title}.${artifact.language || 'txt'}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function handleSaveToDropbox(artifactId: string) {
  savingId.value = artifactId;
  try {
    // TODO: Implement Dropbox save API call via integration
    // For now, simulate save
    await new Promise(resolve => setTimeout(resolve, 1500));
    const artifact = artifacts.value.find(a => a.id === artifactId);
    if (artifact) {
      artifact.savedToDropbox = true;
    }
    emit('saveToDropbox', artifactId);
  } catch (error) {
    // Handle error
  } finally {
    savingId.value = null;
  }
}

async function handleConnectDropbox() {
  try {
    // Redirect to OAuth flow
    const response = await api.get('/urpa/integrations/oauth/dropbox/redirect');
    if (response.data.url) {
      window.location.href = response.data.url;
    }
  } catch (error) {
    // Handle error
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

