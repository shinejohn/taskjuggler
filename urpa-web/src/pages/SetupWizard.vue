<template>
  <div class="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
    <!-- Animated background -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" />
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s" />
    </div>

    <div class="relative w-full max-w-4xl">
      <!-- Logo -->
      <div class="flex flex-col items-center justify-center mb-8">
        <div class="flex items-center gap-3 mb-2">
          <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 shadow-lg shadow-teal-500/20">
            <Command class="h-7 w-7 text-white" />
          </div>
          <span class="text-3xl font-bold text-white">Urpa</span>
        </div>
        <p class="text-teal-400 text-sm font-semibold tracking-wide mb-4">
          Your Personal Assistant
        </p>
        <div class="flex items-center gap-2">
          <Sparkles class="h-4 w-4 text-teal-400" />
          <p class="text-slate-400 text-sm">Setup Wizard</p>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-semibold text-slate-300">
            Step {{ currentStep + 1 }} of {{ integrations.length }}
          </span>
          <span class="text-sm font-semibold text-teal-400">
            {{ completedCount }} completed
          </span>
        </div>
        <div class="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-teal-600 to-blue-600 transition-all duration-500"
            :style="{ width: `${progress}%` }"
          />
        </div>
      </div>

      <!-- Integration Steps Overview -->
      <div class="grid grid-cols-3 md:grid-cols-9 gap-2 mb-8">
        <button
          v-for="(integration, idx) in integrations"
          :key="integration.id"
          @click="currentStep = idx"
          :class="['p-3 rounded-xl border-2 transition-all', idx === currentStep ? 'border-teal-500 bg-teal-500/10' : integration.completed ? 'border-green-500 bg-green-500/10' : 'border-slate-700 bg-slate-900/50 hover:border-slate-600']"
        >
          <component :is="integration.icon" :class="['h-5 w-5 mx-auto', integration.completed ? 'text-green-400' : integration.color]" />
          <Check v-if="integration.completed" class="h-3 w-3 text-green-400 mx-auto mt-1" />
        </button>
      </div>

      <!-- Main Card -->
      <div class="bg-slate-800/50 backdrop-blur-xl rounded-2xl border-2 border-slate-700/50 shadow-2xl p-8">
        <Transition name="slide" mode="out-in">
          <div :key="currentStep">
            <component :is="currentStepComponent" />
          </div>
        </Transition>

        <!-- Actions -->
        <div class="flex items-center justify-between mt-8 pt-6 border-t-2 border-slate-700">
          <button
            @click="currentStep > 0 && (currentStep--)"
            :disabled="currentStep === 0"
            class="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft class="h-4 w-4" />
            Back
          </button>

          <div class="flex items-center gap-3">
            <button
              @click="handleSkip"
              class="px-4 py-2 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              Skip for now
            </button>
            <button
              @click="handleConnect"
              :disabled="isConnecting"
              class="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Loader2 v-if="isConnecting" class="h-5 w-5 animate-spin" />
              <template v-else>
                <template v-if="currentStep === integrations.length - 1">
                  Complete Setup
                  <Check class="h-5 w-5" />
                </template>
                <template v-else>
                  {{ currentIntegration.requiresSubscription ? 'Activate' : 'Connect' }}
                  <ArrowRight class="h-5 w-5" />
                </template>
              </template>
            </button>
          </div>
        </div>
      </div>

      <!-- Completion Message -->
      <Transition name="fade">
        <div
          v-if="completedCount === integrations.length"
          class="mt-6 p-6 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 text-white text-center"
        >
          <Check class="h-12 w-12 mx-auto mb-3" />
          <h3 class="text-xl font-bold mb-2">Setup Complete!</h3>
          <p class="text-sm opacity-90 mb-4">
            All integrations are configured. You're ready to use Urpa!
          </p>
          <button
            @click="$router.push('/')"
            class="px-6 py-2 bg-white text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineComponent, h } from 'vue';
import { useRouter } from 'vue-router';
import {
  Command,
  Mail,
  MessageSquare,
  Calendar,
  Share2,
  Voicemail,
  CheckSquare,
  Phone,
  Check,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  Sparkles,
  MessageCircle,
  PhoneCall,
  Users,
  Upload,
} from 'lucide-vue-next';
import { useIntegrationsStore } from '@/stores/integrations';
import api from '@/utils/api';

interface IntegrationStep {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  gradient: string;
  completed: boolean;
  requiresSubscription?: boolean;
  subscriptionType?: 'texting' | 'phone';
}

interface Credentials {
  provider: string;
  email: string;
  password: string;
  imapServer?: string;
  imapPort?: string;
  smtpServer?: string;
  smtpPort?: string;
  useSsl?: boolean;
}

interface Provider {
  id: string;
  name: string;
  logo?: string;
  defaultConfig?: {
    imapServer?: string;
    imapPort?: string;
    smtpServer?: string;
    smtpPort?: string;
  };
}

const EMAIL_PROVIDERS: Provider[] = [
  { id: 'gmail', name: 'Gmail', defaultConfig: { imapServer: 'imap.gmail.com', imapPort: '993', smtpServer: 'smtp.gmail.com', smtpPort: '587' } },
  { id: 'outlook', name: 'Outlook / Office 365', defaultConfig: { imapServer: 'outlook.office365.com', imapPort: '993', smtpServer: 'smtp.office365.com', smtpPort: '587' } },
  { id: 'yahoo', name: 'Yahoo Mail', defaultConfig: { imapServer: 'imap.mail.yahoo.com', imapPort: '993', smtpServer: 'smtp.mail.yahoo.com', smtpPort: '587' } },
  { id: 'icloud', name: 'iCloud Mail', defaultConfig: { imapServer: 'imap.mail.me.com', imapPort: '993', smtpServer: 'smtp.mail.me.com', smtpPort: '587' } },
  { id: 'custom', name: 'Custom / Other' },
];

const MESSAGING_PROVIDERS: Provider[] = [
  { id: 'slack', name: 'Slack' },
  { id: 'teams', name: 'Microsoft Teams' },
  { id: 'discord', name: 'Discord' },
  { id: 'telegram', name: 'Telegram' },
  { id: 'whatsapp', name: 'WhatsApp Business' },
];

const MESSAGING_LAYERS: Provider[] = [
  { id: 'sms', name: 'SMS (Text Messages)' },
  { id: 'whatsapp', name: 'WhatsApp' },
  { id: 'telegram', name: 'Telegram' },
  { id: 'signal', name: 'Signal' },
  { id: 'webchat', name: 'Web Chat' },
];

const CALENDAR_PROVIDERS: Provider[] = [
  { id: 'google', name: 'Google Calendar' },
  { id: 'outlook', name: 'Outlook Calendar' },
  { id: 'apple', name: 'Apple Calendar' },
  { id: 'caldav', name: 'CalDAV (Custom)' },
];

const SOCIAL_PROVIDERS: Provider[] = [
  { id: 'linkedin', name: 'LinkedIn' },
  { id: 'twitter', name: 'Twitter / X' },
  { id: 'facebook', name: 'Facebook' },
  { id: 'instagram', name: 'Instagram' },
];

const VOICEMAIL_PROVIDERS: Provider[] = [
  { id: 'google', name: 'Google Voice' },
  { id: 'custom', name: 'Custom Provider' },
];

const TASK_PROVIDERS: Provider[] = [
  { id: 'taskjuggler', name: 'TaskJuggler' },
  { id: 'asana', name: 'Asana' },
  { id: 'trello', name: 'Trello' },
  { id: 'todoist', name: 'Todoist' },
  { id: 'jira', name: 'Jira' },
];

const CONTACT_SOURCES: Provider[] = [
  { id: 'google', name: 'Google Contacts' },
  { id: 'outlook', name: 'Outlook Contacts' },
  { id: 'apple', name: 'Apple Contacts (iCloud)' },
  { id: 'csv', name: 'CSV File Upload' },
  { id: 'vcard', name: 'vCard File Upload' },
];

const router = useRouter();
const integrationsStore = useIntegrationsStore();

const currentStep = ref(0);
const showPassword = ref<Record<string, boolean>>({});
const isConnecting = ref(false);

const integrations = ref<IntegrationStep[]>([
  { id: 'email', title: 'Email Integration', description: 'Connect your email to manage messages and communications', icon: Mail, color: 'text-blue-400', gradient: 'from-blue-600 to-cyan-600', completed: false },
  { id: 'contacts', title: 'Contact Database', description: 'Import and sync your contacts from various sources', icon: Users, color: 'text-emerald-400', gradient: 'from-emerald-600 to-teal-600', completed: false },
  { id: 'messaging', title: 'Messaging Platform', description: 'Connect Slack, Teams, or other messaging apps', icon: MessageSquare, color: 'text-purple-400', gradient: 'from-purple-600 to-pink-600', completed: false },
  { id: 'calendar', title: 'Calendar Sync', description: 'Sync your calendar for scheduling and reminders', icon: Calendar, color: 'text-green-400', gradient: 'from-green-600 to-emerald-600', completed: false },
  { id: 'social', title: 'Social Media', description: 'Connect social media accounts for unified management', icon: Share2, color: 'text-pink-400', gradient: 'from-pink-600 to-rose-600', completed: false },
  { id: 'voicemail', title: 'Voicemail', description: 'Set up voicemail transcription and management', icon: Voicemail, color: 'text-amber-400', gradient: 'from-amber-600 to-orange-600', completed: false },
  { id: 'tasks', title: 'Task Manager', description: 'Connect TaskJuggler for task management', icon: CheckSquare, color: 'text-teal-400', gradient: 'from-teal-600 to-cyan-600', completed: false },
  { id: 'texting', title: 'AI Text Assistant', description: 'Get a dedicated number for AI-powered text messaging', icon: MessageCircle, color: 'text-indigo-400', gradient: 'from-indigo-600 to-purple-600', completed: false, requiresSubscription: true, subscriptionType: 'texting' },
  { id: 'phone', title: 'AI Phone Assistant', description: 'Get a dedicated number for AI-powered phone calls', icon: PhoneCall, color: 'text-red-400', gradient: 'from-red-600 to-rose-600', completed: false, requiresSubscription: true, subscriptionType: 'phone' },
]);

const credentials = ref<Record<string, Credentials>>({
  email: { provider: '', email: '', password: '', imapServer: '', imapPort: '993', smtpServer: '', smtpPort: '587', useSsl: true },
  messaging: { provider: '', email: '', password: '' },
  calendar: { provider: '', email: '', password: '' },
  social: { provider: '', email: '', password: '' },
  voicemail: { provider: '', email: '', password: '' },
  tasks: { provider: '', email: '', password: '' },
  contacts: { provider: '', email: '', password: '' },
});

const messagingLayers = ref<string[]>([]);
const contactsSetup = ref({
  source: '',
  syncEnabled: true,
  autoUpdate: true,
  uploadedFile: null as File | null,
});

const textingSetup = ref({
  selectedNumber: '',
  areaCode: '',
  forwardFromNumber: '',
  enableAutoReply: true,
});

const phoneSetup = ref({
  selectedNumber: '',
  areaCode: '',
  forwardFromNumber: '',
  enableCallScreening: true,
  enableVoicemail: true,
});

const currentIntegration = computed(() => integrations.value[currentStep.value]);
const completedCount = computed(() => integrations.value.filter(i => i.completed).length);
const progress = computed(() => (completedCount.value / integrations.value.length) * 100);

function getProviders(stepId: string): Provider[] {
  switch (stepId) {
    case 'email': return EMAIL_PROVIDERS;
    case 'messaging': return MESSAGING_PROVIDERS;
    case 'calendar': return CALENDAR_PROVIDERS;
    case 'social': return SOCIAL_PROVIDERS;
    case 'voicemail': return VOICEMAIL_PROVIDERS;
    case 'tasks': return TASK_PROVIDERS;
    case 'contacts': return CONTACT_SOURCES;
    default: return [];
  }
}

function handleProviderSelect(stepId: string, providerId: string) {
  const provider = getProviders(stepId).find(p => p.id === providerId);
  const updatedCredentials = {
    ...credentials.value[stepId],
    provider: providerId,
  };
  if (provider?.defaultConfig) {
    Object.assign(updatedCredentials, provider.defaultConfig);
  }
  credentials.value[stepId] = updatedCredentials;
}

function toggleMessagingLayer(layerId: string) {
  if (messagingLayers.value.includes(layerId)) {
    messagingLayers.value = messagingLayers.value.filter(id => id !== layerId);
  } else {
    messagingLayers.value.push(layerId);
  }
}

function handleFileUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    contactsSetup.value.uploadedFile = file;
  }
}

async function handleConnect() {
  if (currentIntegration.value.requiresSubscription) {
    router.push('/subscribe');
    return;
  }

  isConnecting.value = true;
  try {
    const currentCreds = credentials.value[currentIntegration.value.id];
    if (!currentCreds.provider) {
      return;
    }

    // Connect integration via API
    await integrationsStore.connectIntegration({
      integration_type: currentIntegration.value.id,
      provider: currentCreds.provider,
      config: currentCreds,
    });

    integrations.value[currentStep.value].completed = true;
    
    if (currentStep.value < integrations.value.length - 1) {
      setTimeout(() => {
        currentStep.value++;
      }, 500);
    }
  } catch (error) {
    // Error handled by store
  } finally {
    isConnecting.value = false;
  }
}

function handleSkip() {
  if (currentStep.value < integrations.value.length - 1) {
    currentStep.value++;
  }
}

const currentStepComponent = computed(() => {
  return defineComponent({
    setup() {
      const Icon = currentIntegration.value.icon;
      const providers = getProviders(currentIntegration.value.id);
      const currentCreds = credentials.value[currentIntegration.value.id];

      // Contact Database Setup
      if (currentIntegration.value.id === 'contacts') {
        return () => h('div', { class: 'space-y-6' }, [
          h('div', { class: 'text-center mb-8' }, [
            h('div', { class: `inline-flex p-4 rounded-2xl bg-gradient-to-r ${currentIntegration.value.gradient} mb-4` }, [
              h(Icon, { class: 'h-12 w-12 text-white' }),
            ]),
            h('h2', { class: 'text-2xl font-bold text-white mb-2' }, currentIntegration.value.title),
            h('p', { class: 'text-slate-400' }, currentIntegration.value.description),
          ]),
          h('div', { class: 'p-4 rounded-xl bg-emerald-500/10 border-2 border-emerald-500/50 mb-6' }, [
            h('div', { class: 'flex gap-3' }, [
              h(Users, { class: 'h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5' }),
              h('div', [
                h('p', { class: 'text-sm font-semibold text-emerald-400 mb-1' }, 'Unified Contact Database'),
                h('p', { class: 'text-xs text-slate-400' }, 'Import contacts from multiple sources and keep them synced automatically. Your AI assistant will have access to all your contacts.'),
              ]),
            ]),
          ]),
          h('div', { class: 'space-y-4' }, [
            h('div', [
              h('label', { class: 'block text-sm font-semibold text-slate-300 mb-3' }, 'Select Contact Source'),
              h('div', { class: 'grid grid-cols-2 gap-3' }, CONTACT_SOURCES.map(source => 
                h('button', {
                  key: source.id,
                  onClick: () => contactsSetup.value.source = source.id,
                  class: `p-4 rounded-xl border-2 transition-all text-left ${contactsSetup.value.source === source.id ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'}`,
                }, [
                  h('p', { class: 'text-sm font-bold text-white' }, source.name),
                  contactsSetup.value.source === source.id && h(Check, { class: 'h-4 w-4 text-emerald-400 mt-1' }),
                ])
              )),
            ]),
            contactsSetup.value.source && (contactsSetup.value.source === 'csv' || contactsSetup.value.source === 'vcard') ? h('div', [
              h('label', { class: 'block text-sm font-semibold text-slate-300 mb-3' }, 'Upload Contact File'),
              h('div', { class: 'border-2 border-dashed border-slate-700 rounded-xl p-8 text-center hover:border-emerald-500 transition-colors' }, [
                h('input', {
                  type: 'file',
                  accept: contactsSetup.value.source === 'csv' ? '.csv' : '.vcf,.vcard',
                  onChange: handleFileUpload,
                  class: 'hidden',
                  id: 'contact-upload',
                }),
                h('label', { for: 'contact-upload', class: 'cursor-pointer' }, [
                  h(Upload, { class: 'h-12 w-12 text-slate-400 mx-auto mb-3' }),
                  h('p', { class: 'text-sm font-semibold text-white mb-1' }, contactsSetup.value.uploadedFile ? contactsSetup.value.uploadedFile.name : 'Click to upload or drag and drop'),
                  h('p', { class: 'text-xs text-slate-400' }, contactsSetup.value.source === 'csv' ? 'CSV files only' : 'vCard (.vcf) files only'),
                ]),
              ]),
            ]) : contactsSetup.value.source ? h('div', { class: 'space-y-4' }, [
              h('div', [
                h('label', { class: 'block text-sm font-semibold text-slate-300 mb-2' }, 'Email / Username'),
                h('input', {
                  type: 'email',
                  modelValue: currentCreds.email,
                  'onUpdate:modelValue': (val: string) => credentials.value.contacts.email = val,
                  placeholder: 'you@example.com',
                  class: 'w-full px-4 py-3 bg-slate-900/50 border-2 border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors',
                }),
              ]),
              h('div', [
                h('label', { class: 'block text-sm font-semibold text-slate-300 mb-2' }, 'Password'),
                h('div', { class: 'relative' }, [
                  h('input', {
                    type: showPassword.value['contacts'] ? 'text' : 'password',
                    modelValue: currentCreds.password,
                    'onUpdate:modelValue': (val: string) => credentials.value.contacts.password = val,
                    placeholder: '••••••••',
                    class: 'w-full pl-4 pr-12 py-3 bg-slate-900/50 border-2 border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors',
                  }),
                  h('button', {
                    type: 'button',
                    onClick: () => showPassword.value['contacts'] = !showPassword.value['contacts'],
                    class: 'absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors',
                  }, [
                    showPassword.value['contacts'] ? h(EyeOff, { class: 'h-5 w-5' }) : h(Eye, { class: 'h-5 w-5' }),
                  ]),
                ]),
              ]),
            ]) : null,
            h('div', { class: 'space-y-3 pt-4 border-t-2 border-slate-700' }, [
              h('label', { class: 'flex items-center gap-3 p-4 rounded-xl bg-slate-900/50 border-2 border-slate-700 cursor-pointer hover:border-slate-600 transition-colors' }, [
                h('input', {
                  type: 'checkbox',
                  checked: contactsSetup.value.syncEnabled,
                  onChange: (e: Event) => contactsSetup.value.syncEnabled = (e.target as HTMLInputElement).checked,
                  class: 'w-5 h-5 rounded border-slate-700 bg-slate-900/50 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0',
                }),
                h('div', [
                  h('p', { class: 'text-sm font-semibold text-white' }, 'Enable Contact Sync'),
                  h('p', { class: 'text-xs text-slate-400' }, 'Keep contacts automatically synced'),
                ]),
              ]),
              h('label', { class: 'flex items-center gap-3 p-4 rounded-xl bg-slate-900/50 border-2 border-slate-700 cursor-pointer hover:border-slate-600 transition-colors' }, [
                h('input', {
                  type: 'checkbox',
                  checked: contactsSetup.value.autoUpdate,
                  onChange: (e: Event) => contactsSetup.value.autoUpdate = (e.target as HTMLInputElement).checked,
                  class: 'w-5 h-5 rounded border-slate-700 bg-slate-900/50 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0',
                }),
                h('div', [
                  h('p', { class: 'text-sm font-semibold text-white' }, 'Auto-Update Contacts'),
                  h('p', { class: 'text-xs text-slate-400' }, 'Automatically update when contacts change'),
                ]),
              ]),
            ]),
            h('div', { class: 'p-4 rounded-xl bg-slate-900/50 border-2 border-slate-700' }, [
              h('p', { class: 'text-sm font-semibold text-slate-300 mb-2' }, "What We'll Import:"),
              h('ul', { class: 'space-y-2 text-xs text-slate-400' }, [
                h('li', { class: 'flex items-center gap-2' }, [h(Check, { class: 'h-4 w-4 text-green-400' }), 'Names, emails, and phone numbers']),
                h('li', { class: 'flex items-center gap-2' }, [h(Check, { class: 'h-4 w-4 text-green-400' }), 'Company and job titles']),
                h('li', { class: 'flex items-center gap-2' }, [h(Check, { class: 'h-4 w-4 text-green-400' }), 'Addresses and notes']),
                h('li', { class: 'flex items-center gap-2' }, [h(Check, { class: 'h-4 w-4 text-green-400' }), 'Custom fields and tags']),
              ]),
            ]),
          ]),
        ]);
      }

      // AI Text Assistant Setup
      if (currentIntegration.value.id === 'texting') {
        return () => h('div', { class: 'space-y-6' }, [
          h('div', { class: 'text-center mb-8' }, [
            h('div', { class: `inline-flex p-4 rounded-2xl bg-gradient-to-r ${currentIntegration.value.gradient} mb-4` }, [
              h(Icon, { class: 'h-12 w-12 text-white' }),
            ]),
            h('h2', { class: 'text-2xl font-bold text-white mb-2' }, currentIntegration.value.title),
            h('p', { class: 'text-slate-400' }, currentIntegration.value.description),
          ]),
          h('div', { class: 'p-4 rounded-xl bg-indigo-500/10 border-2 border-indigo-500/50 mb-6' }, [
            h('div', { class: 'flex gap-3' }, [
              h(Sparkles, { class: 'h-5 w-5 text-indigo-400 flex-shrink-0 mt-0.5' }),
              h('div', [
                h('p', { class: 'text-sm font-semibold text-indigo-400 mb-1' }, 'AI-Powered Text Assistant'),
                h('p', { class: 'text-xs text-slate-400' }, 'Get a dedicated phone number that your AI assistant will use to send and receive texts on your behalf. Forward texts from your personal number or use it standalone.'),
              ]),
            ]),
          ]),
          h('div', { class: 'space-y-4' }, [
            h('div', [
              h('label', { class: 'block text-sm font-semibold text-slate-300 mb-2' }, 'Select Number Type'),
              h('div', { class: 'grid grid-cols-2 gap-3' }, [
                h('button', {
                  onClick: () => textingSetup.value.selectedNumber = 'new',
                  class: `p-4 rounded-xl border-2 transition-all ${textingSetup.value.selectedNumber === 'new' ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'}`,
                }, [
                  h('p', { class: 'text-sm font-bold text-white mb-1' }, 'Get New Number'),
                  h('p', { class: 'text-xs text-slate-400' }, "We'll assign you a new number"),
                ]),
                h('button', {
                  onClick: () => textingSetup.value.selectedNumber = 'forward',
                  class: `p-4 rounded-xl border-2 transition-all ${textingSetup.value.selectedNumber === 'forward' ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'}`,
                }, [
                  h('p', { class: 'text-sm font-bold text-white mb-1' }, 'Forward Existing'),
                  h('p', { class: 'text-xs text-slate-400' }, 'Forward from your current number'),
                ]),
              ]),
            ]),
            textingSetup.value.selectedNumber === 'new' && h('div', { class: 'space-y-3' }, [
              h('label', { class: 'block text-sm font-semibold text-slate-300 mb-2' }, 'Preferred Area Code'),
              h('input', {
                type: 'text',
                modelValue: textingSetup.value.areaCode,
                'onUpdate:modelValue': (val: string) => textingSetup.value.areaCode = val,
                placeholder: '212 (New York)',
                class: 'w-full px-4 py-3 bg-slate-900/50 border-2 border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors',
              }),
            ]),
            textingSetup.value.selectedNumber === 'forward' && h('div', { class: 'space-y-3' }, [
              h('label', { class: 'block text-sm font-semibold text-slate-300 mb-2' }, 'Your Current Phone Number'),
              h('input', {
                type: 'tel',
                modelValue: textingSetup.value.forwardFromNumber,
                'onUpdate:modelValue': (val: string) => textingSetup.value.forwardFromNumber = val,
                placeholder: '+1 (555) 123-4567',
                class: 'w-full px-4 py-3 bg-slate-900/50 border-2 border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors',
              }),
              h('p', { class: 'text-xs text-slate-400' }, "We'll provide instructions to forward texts from this number to your AI assistant"),
            ]),
            h('label', { class: 'flex items-center gap-3 p-4 rounded-xl bg-slate-900/50 border-2 border-slate-700 cursor-pointer hover:border-slate-600 transition-colors' }, [
              h('input', {
                type: 'checkbox',
                checked: textingSetup.value.enableAutoReply,
                onChange: (e: Event) => textingSetup.value.enableAutoReply = (e.target as HTMLInputElement).checked,
                class: 'w-5 h-5 rounded border-slate-700 bg-slate-900/50 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-0',
              }),
              h('div', [
                h('p', { class: 'text-sm font-semibold text-white' }, 'Enable Auto-Reply'),
                h('p', { class: 'text-xs text-slate-400' }, 'AI will automatically respond to incoming texts'),
              ]),
            ]),
            h('div', { class: 'p-4 rounded-xl bg-slate-900/50 border-2 border-slate-700' }, [
              h('p', { class: 'text-sm font-semibold text-slate-300 mb-2' }, "What's Included:"),
              h('ul', { class: 'space-y-2 text-xs text-slate-400' }, [
                h('li', { class: 'flex items-center gap-2' }, [h(Check, { class: 'h-4 w-4 text-green-400' }), 'Dedicated phone number for texting']),
                h('li', { class: 'flex items-center gap-2' }, [h(Check, { class: 'h-4 w-4 text-green-400' }), 'AI-powered message handling']),
                h('li', { class: 'flex items-center gap-2' }, [h(Check, { class: 'h-4 w-4 text-green-400' }), 'Unlimited text messages']),
                h('li', { class: 'flex items-center gap-2' }, [h(Check, { class: 'h-4 w-4 text-green-400' }), 'Smart auto-reply capabilities']),
              ]),
            ]),
          ]),
        ]);
      }

      // AI Phone Assistant Setup
      if (currentIntegration.value.id === 'phone') {
        return () => h('div', { class: 'space-y-6' }, [
          h('div', { class: 'text-center mb-8' }, [
            h('div', { class: `inline-flex p-4 rounded-2xl bg-gradient-to-r ${currentIntegration.value.gradient} mb-4` }, [
              h(Icon, { class: 'h-12 w-12 text-white' }),
            ]),
            h('h2', { class: 'text-2xl font-bold text-white mb-2' }, currentIntegration.value.title),
            h('p', { class: 'text-slate-400' }, currentIntegration.value.description),
          ]),
          h('div', { class: 'p-4 rounded-xl bg-red-500/10 border-2 border-red-500/50 mb-6' }, [
            h('div', { class: 'flex gap-3' }, [
              h(Sparkles, { class: 'h-5 w-5 text-red-400 flex-shrink-0 mt-0.5' }),
              h('div', [
                h('p', { class: 'text-sm font-semibold text-red-400 mb-1' }, 'AI-Powered Phone Assistant'),
                h('p', { class: 'text-xs text-slate-400' }, 'Get a dedicated phone number that your AI assistant will use to make and receive calls on your behalf. Forward calls from your cell phone or use it standalone.'),
              ]),
            ]),
          ]),
          h('div', { class: 'space-y-4' }, [
            h('div', [
              h('label', { class: 'block text-sm font-semibold text-slate-300 mb-2' }, 'Select Number Type'),
              h('div', { class: 'grid grid-cols-2 gap-3' }, [
                h('button', {
                  onClick: () => phoneSetup.value.selectedNumber = 'new',
                  class: `p-4 rounded-xl border-2 transition-all ${phoneSetup.value.selectedNumber === 'new' ? 'border-red-500 bg-red-500/10' : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'}`,
                }, [
                  h('p', { class: 'text-sm font-bold text-white mb-1' }, 'Get New Number'),
                  h('p', { class: 'text-xs text-slate-400' }, "We'll assign you a new number"),
                ]),
                h('button', {
                  onClick: () => phoneSetup.value.selectedNumber = 'forward',
                  class: `p-4 rounded-xl border-2 transition-all ${phoneSetup.value.selectedNumber === 'forward' ? 'border-red-500 bg-red-500/10' : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'}`,
                }, [
                  h('p', { class: 'text-sm font-bold text-white mb-1' }, 'Forward Existing'),
                  h('p', { class: 'text-xs text-slate-400' }, 'Forward from your cell phone'),
                ]),
              ]),
            ]),
            phoneSetup.value.selectedNumber === 'new' && h('div', { class: 'space-y-3' }, [
              h('label', { class: 'block text-sm font-semibold text-slate-300 mb-2' }, 'Preferred Area Code'),
              h('input', {
                type: 'text',
                modelValue: phoneSetup.value.areaCode,
                'onUpdate:modelValue': (val: string) => phoneSetup.value.areaCode = val,
                placeholder: '212 (New York)',
                class: 'w-full px-4 py-3 bg-slate-900/50 border-2 border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors',
              }),
            ]),
            phoneSetup.value.selectedNumber === 'forward' && h('div', { class: 'space-y-3' }, [
              h('label', { class: 'block text-sm font-semibold text-slate-300 mb-2' }, 'Your Cell Phone Number'),
              h('input', {
                type: 'tel',
                modelValue: phoneSetup.value.forwardFromNumber,
                'onUpdate:modelValue': (val: string) => phoneSetup.value.forwardFromNumber = val,
                placeholder: '+1 (555) 123-4567',
                class: 'w-full px-4 py-3 bg-slate-900/50 border-2 border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors',
              }),
              h('p', { class: 'text-xs text-slate-400' }, "We'll provide instructions to forward calls from this number to your AI assistant"),
            ]),
            h('div', { class: 'space-y-3' }, [
              h('label', { class: 'flex items-center gap-3 p-4 rounded-xl bg-slate-900/50 border-2 border-slate-700 cursor-pointer hover:border-slate-600 transition-colors' }, [
                h('input', {
                  type: 'checkbox',
                  checked: phoneSetup.value.enableCallScreening,
                  onChange: (e: Event) => phoneSetup.value.enableCallScreening = (e.target as HTMLInputElement).checked,
                  class: 'w-5 h-5 rounded border-slate-700 bg-slate-900/50 text-red-500 focus:ring-red-500 focus:ring-offset-0',
                }),
                h('div', [
                  h('p', { class: 'text-sm font-semibold text-white' }, 'Enable Call Screening'),
                  h('p', { class: 'text-xs text-slate-400' }, "AI screens calls and asks for caller's purpose"),
                ]),
              ]),
              h('label', { class: 'flex items-center gap-3 p-4 rounded-xl bg-slate-900/50 border-2 border-slate-700 cursor-pointer hover:border-slate-600 transition-colors' }, [
                h('input', {
                  type: 'checkbox',
                  checked: phoneSetup.value.enableVoicemail,
                  onChange: (e: Event) => phoneSetup.value.enableVoicemail = (e.target as HTMLInputElement).checked,
                  class: 'w-5 h-5 rounded border-slate-700 bg-slate-900/50 text-red-500 focus:ring-red-500 focus:ring-offset-0',
                }),
                h('div', [
                  h('p', { class: 'text-sm font-semibold text-white' }, 'Enable AI Voicemail'),
                  h('p', { class: 'text-xs text-slate-400' }, 'AI transcribes and summarizes voicemails'),
                ]),
              ]),
            ]),
            h('div', { class: 'p-4 rounded-xl bg-slate-900/50 border-2 border-slate-700' }, [
              h('p', { class: 'text-sm font-semibold text-slate-300 mb-2' }, "What's Included:"),
              h('ul', { class: 'space-y-2 text-xs text-slate-400' }, [
                h('li', { class: 'flex items-center gap-2' }, [h(Check, { class: 'h-4 w-4 text-green-400' }), 'Dedicated phone number for calls']),
                h('li', { class: 'flex items-center gap-2' }, [h(Check, { class: 'h-4 w-4 text-green-400' }), 'AI-powered call handling']),
                h('li', { class: 'flex items-center gap-2' }, [h(Check, { class: 'h-4 w-4 text-green-400' }), 'Unlimited incoming calls']),
                h('li', { class: 'flex items-center gap-2' }, [h(Check, { class: 'h-4 w-4 text-green-400' }), 'Call screening & voicemail transcription']),
                h('li', { class: 'flex items-center gap-2' }, [h(Check, { class: 'h-4 w-4 text-green-400' }), 'Call forwarding from your cell phone']),
              ]),
            ]),
          ]),
        ]);
      }

      // Enhanced Messaging Platform Setup
      if (currentIntegration.value.id === 'messaging') {
        return () => h('div', { class: 'space-y-6' }, [
          h('div', { class: 'text-center mb-8' }, [
            h('div', { class: `inline-flex p-4 rounded-2xl bg-gradient-to-r ${currentIntegration.value.gradient} mb-4` }, [
              h(Icon, { class: 'h-12 w-12 text-white' }),
            ]),
            h('h2', { class: 'text-2xl font-bold text-white mb-2' }, currentIntegration.value.title),
            h('p', { class: 'text-slate-400' }, currentIntegration.value.description),
          ]),
          h('div', { class: 'space-y-4' }, [
            h('div', [
              h('label', { class: 'block text-sm font-semibold text-slate-300 mb-3' }, 'Select Primary Platform'),
              h('div', { class: 'grid grid-cols-2 gap-3' }, providers.map(provider =>
                h('button', {
                  key: provider.id,
                  onClick: () => handleProviderSelect('messaging', provider.id),
                  class: `p-4 rounded-xl border-2 transition-all text-left ${currentCreds?.provider === provider.id ? 'border-purple-500 bg-purple-500/10' : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'}`,
                }, [
                  h('p', { class: 'text-sm font-bold text-white' }, provider.name),
                  currentCreds?.provider === provider.id && h(Check, { class: 'h-4 w-4 text-purple-400 mt-1' }),
                ])
              )),
            ]),
            h('div', { class: 'pt-4 border-t-2 border-slate-700' }, [
              h('label', { class: 'block text-sm font-semibold text-slate-300 mb-2' }, 'Additional Messaging Layers (Optional)'),
              h('p', { class: 'text-xs text-slate-400 mb-3' }, 'Select additional messaging channels to integrate with your contact database'),
              h('div', { class: 'space-y-2' }, MESSAGING_LAYERS.map(layer =>
                h('label', {
                  key: layer.id,
                  class: 'flex items-center gap-3 p-3 rounded-lg bg-slate-900/50 border-2 border-slate-700 cursor-pointer hover:border-slate-600 transition-colors',
                }, [
                  h('input', {
                    type: 'checkbox',
                    checked: messagingLayers.value.includes(layer.id),
                    onChange: () => toggleMessagingLayer(layer.id),
                    class: 'w-4 h-4 rounded border-slate-700 bg-slate-900/50 text-purple-500 focus:ring-purple-500 focus:ring-offset-0',
                  }),
                  h('span', { class: 'text-sm text-white' }, layer.name),
                ])
              )),
            ]),
            currentCreds?.provider && h('div', { class: 'space-y-4 pt-4 border-t-2 border-slate-700' }, [
              h('div', [
                h('label', { class: 'block text-sm font-semibold text-slate-300 mb-2' }, 'Email / Username'),
                h('input', {
                  type: 'email',
                  modelValue: currentCreds.email,
                  'onUpdate:modelValue': (val: string) => credentials.value.messaging.email = val,
                  placeholder: 'you@example.com',
                  class: 'w-full px-4 py-3 bg-slate-900/50 border-2 border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors',
                }),
              ]),
              h('div', [
                h('label', { class: 'block text-sm font-semibold text-slate-300 mb-2' }, 'Password'),
                h('div', { class: 'relative' }, [
                  h('input', {
                    type: showPassword.value['messaging'] ? 'text' : 'password',
                    modelValue: currentCreds.password,
                    'onUpdate:modelValue': (val: string) => credentials.value.messaging.password = val,
                    placeholder: '••••••••',
                    class: 'w-full pl-4 pr-12 py-3 bg-slate-900/50 border-2 border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors',
                  }),
                  h('button', {
                    type: 'button',
                    onClick: () => showPassword.value['messaging'] = !showPassword.value['messaging'],
                    class: 'absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors',
                  }, [
                    showPassword.value['messaging'] ? h(EyeOff, { class: 'h-5 w-5' }) : h(Eye, { class: 'h-5 w-5' }),
                  ]),
                ]),
              ]),
              h('div', { class: 'p-4 rounded-xl bg-slate-900/50 border-2 border-slate-700' }, [
                h('div', { class: 'flex items-start gap-3' }, [
                  h(AlertCircle, { class: 'h-5 w-5 text-slate-400 flex-shrink-0 mt-0.5' }),
                  h('div', [
                    h('p', { class: 'text-sm font-semibold text-slate-300 mb-1' }, 'Secure Connection'),
                    h('p', { class: 'text-xs text-slate-400' }, 'Your credentials are encrypted and stored securely. Additional messaging layers will be configured automatically.'),
                  ]),
                ]),
              ]),
            ]),
          ]),
        ]);
      }

      // Regular integration setup
      return () => h('div', { class: 'space-y-6' }, [
        h('div', { class: 'text-center mb-8' }, [
          h('div', { class: `inline-flex p-4 rounded-2xl bg-gradient-to-r ${currentIntegration.value.gradient} mb-4` }, [
            h(Icon, { class: 'h-12 w-12 text-white' }),
          ]),
          h('h2', { class: 'text-2xl font-bold text-white mb-2' }, currentIntegration.value.title),
          h('p', { class: 'text-slate-400' }, currentIntegration.value.description),
        ]),
        h('div', { class: 'space-y-4' }, [
          h('div', [
            h('label', { class: 'block text-sm font-semibold text-slate-300 mb-3' }, 'Select Provider / Platform'),
            h('div', { class: 'grid grid-cols-2 gap-3' }, providers.map(provider =>
              h('button', {
                key: provider.id,
                onClick: () => handleProviderSelect(currentIntegration.value.id, provider.id),
                class: `p-4 rounded-xl border-2 transition-all text-left ${currentCreds?.provider === provider.id ? 'border-teal-500 bg-teal-500/10' : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'}`,
              }, [
                h('p', { class: 'text-sm font-bold text-white' }, provider.name),
                currentCreds?.provider === provider.id && h(Check, { class: 'h-4 w-4 text-teal-400 mt-1' }),
              ])
            )),
          ]),
          currentCreds?.provider && h('div', { class: 'space-y-4' }, [
            h('div', [
              h('label', { class: 'block text-sm font-semibold text-slate-300 mb-2' }, 'Email / Username'),
              h('input', {
                type: 'email',
                modelValue: currentCreds.email,
                'onUpdate:modelValue': (val: string) => {
                  credentials.value[currentIntegration.value.id] = { ...currentCreds, email: val };
                },
                placeholder: 'you@example.com',
                class: 'w-full px-4 py-3 bg-slate-900/50 border-2 border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors',
              }),
            ]),
            h('div', [
              h('label', { class: 'block text-sm font-semibold text-slate-300 mb-2' }, 'Password'),
              h('div', { class: 'relative' }, [
                h('input', {
                  type: showPassword.value[currentIntegration.value.id] ? 'text' : 'password',
                  modelValue: currentCreds.password,
                  'onUpdate:modelValue': (val: string) => {
                    credentials.value[currentIntegration.value.id] = { ...currentCreds, password: val };
                  },
                  placeholder: '••••••••',
                  class: 'w-full pl-4 pr-12 py-3 bg-slate-900/50 border-2 border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors',
                }),
                h('button', {
                  type: 'button',
                  onClick: () => showPassword.value[currentIntegration.value.id] = !showPassword.value[currentIntegration.value.id],
                  class: 'absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors',
                }, [
                  showPassword.value[currentIntegration.value.id] ? h(EyeOff, { class: 'h-5 w-5' }) : h(Eye, { class: 'h-5 w-5' }),
                ]),
              ]),
            ]),
            currentIntegration.value.id === 'email' && h('div', { class: 'space-y-4 pt-4 border-t-2 border-slate-700' }, [
              h('p', { class: 'text-sm font-semibold text-slate-300' }, 'Email Server Configuration'),
              h('div', { class: 'grid grid-cols-2 gap-4' }, [
                h('div', [
                  h('label', { class: 'block text-xs font-semibold text-slate-400 mb-2' }, 'IMAP Server'),
                  h('input', {
                    type: 'text',
                    modelValue: currentCreds.imapServer,
                    'onUpdate:modelValue': (val: string) => {
                      credentials.value.email = { ...currentCreds, imapServer: val };
                    },
                    placeholder: 'imap.example.com',
                    class: 'w-full px-3 py-2 bg-slate-900/50 border-2 border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors',
                  }),
                ]),
                h('div', [
                  h('label', { class: 'block text-xs font-semibold text-slate-400 mb-2' }, 'IMAP Port'),
                  h('input', {
                    type: 'text',
                    modelValue: currentCreds.imapPort,
                    'onUpdate:modelValue': (val: string) => {
                      credentials.value.email = { ...currentCreds, imapPort: val };
                    },
                    placeholder: '993',
                    class: 'w-full px-3 py-2 bg-slate-900/50 border-2 border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors',
                  }),
                ]),
                h('div', [
                  h('label', { class: 'block text-xs font-semibold text-slate-400 mb-2' }, 'SMTP Server'),
                  h('input', {
                    type: 'text',
                    modelValue: currentCreds.smtpServer,
                    'onUpdate:modelValue': (val: string) => {
                      credentials.value.email = { ...currentCreds, smtpServer: val };
                    },
                    placeholder: 'smtp.example.com',
                    class: 'w-full px-3 py-2 bg-slate-900/50 border-2 border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors',
                  }),
                ]),
                h('div', [
                  h('label', { class: 'block text-xs font-semibold text-slate-400 mb-2' }, 'SMTP Port'),
                  h('input', {
                    type: 'text',
                    modelValue: currentCreds.smtpPort,
                    'onUpdate:modelValue': (val: string) => {
                      credentials.value.email = { ...currentCreds, smtpPort: val };
                    },
                    placeholder: '587',
                    class: 'w-full px-3 py-2 bg-slate-900/50 border-2 border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors',
                  }),
                ]),
              ]),
              h('label', { class: 'flex items-center gap-2 cursor-pointer' }, [
                h('input', {
                  type: 'checkbox',
                  checked: currentCreds.useSsl,
                  onChange: (e: Event) => {
                    credentials.value.email = { ...currentCreds, useSsl: (e.target as HTMLInputElement).checked };
                  },
                  class: 'w-4 h-4 rounded border-slate-700 bg-slate-900/50 text-teal-500 focus:ring-teal-500 focus:ring-offset-0',
                }),
                h('span', { class: 'text-sm text-slate-300' }, 'Use SSL/TLS encryption'),
              ]),
            ]),
            h('div', { class: 'p-4 rounded-xl bg-slate-900/50 border-2 border-slate-700' }, [
              h('div', { class: 'flex items-start gap-3' }, [
                h(AlertCircle, { class: 'h-5 w-5 text-slate-400 flex-shrink-0 mt-0.5' }),
                h('div', [
                  h('p', { class: 'text-sm font-semibold text-slate-300 mb-1' }, 'Secure Connection'),
                  h('p', { class: 'text-xs text-slate-400' }, 'Your credentials are encrypted and stored securely. We use industry-standard security practices to protect your data.'),
                ]),
              ]),
            ]),
          ]),
        ]),
      ]);
    },
  });
});
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
