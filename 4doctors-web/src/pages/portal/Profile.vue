<template>
  <div class="max-w-4xl mx-auto space-y-8">
    <!-- Profile Header -->
    <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div class="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
      <div class="p-6 -mt-16">
        <div class="flex flex-col md:flex-row md:items-end gap-4">
          <div class="w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center text-3xl font-bold text-blue-600">
            {{ initials }}
          </div>
          <div class="flex-1">
            <h1 class="text-2xl font-bold text-slate-900">{{ profile.firstName }} {{ profile.lastName }}</h1>
            <p class="text-slate-500">Member since {{ profile.memberSince }}</p>
          </div>
          <button 
            @click="editing = !editing"
            class="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-200 transition-colors flex items-center gap-2"
          >
            <Edit3 class="w-4 h-4" /> {{ editing ? 'Cancel' : 'Edit Profile' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left Column: Personal Info -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Personal Information -->
        <section class="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 class="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <User class="w-5 h-5 text-slate-400" /> Personal Information
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-1">
              <label class="text-xs font-bold text-slate-400 uppercase">First Name</label>
              <input 
                v-model="profile.firstName"
                :disabled="!editing"
                :class="inputClass"
              >
            </div>
            <div class="space-y-1">
              <label class="text-xs font-bold text-slate-400 uppercase">Last Name</label>
              <input 
                v-model="profile.lastName"
                :disabled="!editing"
                :class="inputClass"
              >
            </div>
            <div class="space-y-1">
              <label class="text-xs font-bold text-slate-400 uppercase">Date of Birth</label>
              <input 
                v-model="profile.dob"
                type="date"
                :disabled="!editing"
                :class="inputClass"
              >
            </div>
            <div class="space-y-1">
              <label class="text-xs font-bold text-slate-400 uppercase">Gender</label>
              <select v-model="profile.gender" :disabled="!editing" :class="inputClass">
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not">Prefer not to say</option>
              </select>
            </div>
          </div>
        </section>

        <!-- Contact Information -->
        <section class="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 class="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Phone class="w-5 h-5 text-slate-400" /> Contact Information
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-1">
              <label class="text-xs font-bold text-slate-400 uppercase">Email</label>
              <input 
                v-model="profile.email"
                type="email"
                :disabled="!editing"
                :class="inputClass"
              >
            </div>
            <div class="space-y-1">
              <label class="text-xs font-bold text-slate-400 uppercase">Phone</label>
              <input 
                v-model="profile.phone"
                type="tel"
                :disabled="!editing"
                :class="inputClass"
              >
            </div>
            <div class="md:col-span-2 space-y-1">
              <label class="text-xs font-bold text-slate-400 uppercase">Address</label>
              <input 
                v-model="profile.address"
                :disabled="!editing"
                :class="inputClass"
              >
            </div>
            <div class="space-y-1">
              <label class="text-xs font-bold text-slate-400 uppercase">City</label>
              <input 
                v-model="profile.city"
                :disabled="!editing"
                :class="inputClass"
              >
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-xs font-bold text-slate-400 uppercase">State</label>
                <input 
                  v-model="profile.state"
                  :disabled="!editing"
                  :class="inputClass"
                >
              </div>
              <div class="space-y-1">
                <label class="text-xs font-bold text-slate-400 uppercase">ZIP</label>
                <input 
                  v-model="profile.zip"
                  :disabled="!editing"
                  :class="inputClass"
                >
              </div>
            </div>
          </div>
        </section>

        <!-- Emergency Contact -->
        <section class="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 class="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <AlertCircle class="w-5 h-5 text-red-400" /> Emergency Contact
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="space-y-1">
              <label class="text-xs font-bold text-slate-400 uppercase">Name</label>
              <input 
                v-model="profile.emergencyName"
                :disabled="!editing"
                :class="inputClass"
              >
            </div>
            <div class="space-y-1">
              <label class="text-xs font-bold text-slate-400 uppercase">Relationship</label>
              <input 
                v-model="profile.emergencyRelation"
                :disabled="!editing"
                :class="inputClass"
              >
            </div>
            <div class="space-y-1">
              <label class="text-xs font-bold text-slate-400 uppercase">Phone</label>
              <input 
                v-model="profile.emergencyPhone"
                type="tel"
                :disabled="!editing"
                :class="inputClass"
              >
            </div>
          </div>
        </section>

        <!-- Save Button -->
        <div v-if="editing" class="flex justify-end">
          <button 
            @click="saveProfile"
            class="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 flex items-center gap-2"
          >
            <Save class="w-4 h-4" /> Save Changes
          </button>
        </div>
      </div>

      <!-- Right Column: Settings & Insurance -->
      <div class="space-y-6">
        <!-- Insurance Card -->
        <section class="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 class="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <CreditCard class="w-5 h-5 text-slate-400" /> Insurance
          </h2>
          <div class="p-4 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl text-white">
            <p class="text-[10px] uppercase tracking-widest opacity-70 mb-2">Primary Insurance</p>
            <p class="font-bold text-lg">{{ profile.insuranceProvider }}</p>
            <div class="mt-4 flex justify-between text-xs">
              <div>
                <p class="opacity-70">Member ID</p>
                <p class="font-mono font-bold">{{ profile.insuranceId }}</p>
              </div>
              <div class="text-right">
                <p class="opacity-70">Group</p>
                <p class="font-mono font-bold">{{ profile.insuranceGroup }}</p>
              </div>
            </div>
          </div>
          <button class="w-full mt-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            Update Insurance
          </button>
        </section>

        <!-- Preferences -->
        <section class="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 class="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Settings class="w-5 h-5 text-slate-400" /> Preferences
          </h2>
          <div class="space-y-4">
            <label class="flex items-center justify-between cursor-pointer">
              <span class="text-sm text-slate-700">Email Notifications</span>
              <input type="checkbox" v-model="preferences.emailNotifications" class="w-5 h-5 rounded text-blue-600">
            </label>
            <label class="flex items-center justify-between cursor-pointer">
              <span class="text-sm text-slate-700">SMS Reminders</span>
              <input type="checkbox" v-model="preferences.smsReminders" class="w-5 h-5 rounded text-blue-600">
            </label>
            <label class="flex items-center justify-between cursor-pointer">
              <span class="text-sm text-slate-700">Appointment Reminders</span>
              <input type="checkbox" v-model="preferences.appointmentReminders" class="w-5 h-5 rounded text-blue-600">
            </label>
            <label class="flex items-center justify-between cursor-pointer">
              <span class="text-sm text-slate-700">Marketing Emails</span>
              <input type="checkbox" v-model="preferences.marketingEmails" class="w-5 h-5 rounded text-blue-600">
            </label>
          </div>
        </section>

        <!-- Security -->
        <section class="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 class="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Shield class="w-5 h-5 text-slate-400" /> Security
          </h2>
          <div class="space-y-3">
            <button class="w-full py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-2">
              <Lock class="w-4 h-4" /> Change Password
            </button>
            <button class="w-full py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-2">
              <Smartphone class="w-4 h-4" /> Enable 2FA
            </button>
            <button class="w-full py-2.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
              Sign Out All Devices
            </button>
          </div>
        </section>

        <!-- Connected Apps -->
        <section class="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 class="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Link class="w-5 h-5 text-slate-400" /> Connected Apps
          </h2>
          <div class="space-y-3">
            <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <Heart class="w-4 h-4 text-red-500" />
                </div>
                <span class="text-sm font-medium text-slate-700">Apple Health</span>
              </div>
              <span class="text-xs font-bold text-emerald-600">Connected</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Activity class="w-4 h-4 text-blue-500" />
                </div>
                <span class="text-sm font-medium text-slate-700">Fitbit</span>
              </div>
              <button class="text-xs font-bold text-blue-600">Connect</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { 
  User, Phone, AlertCircle, CreditCard, Settings, Shield, 
  Lock, Smartphone, Link, Heart, Activity, Edit3, Save
} from 'lucide-vue-next';
import { useToast } from '@/composables/useToast';

const toast = useToast();
const editing = ref(false);

const profile = reactive({
  firstName: 'John',
  lastName: 'Patient',
  dob: '1985-05-12',
  gender: 'male',
  email: 'john.patient@email.com',
  phone: '(555) 123-4567',
  address: '123 Main Street',
  city: 'New York',
  state: 'NY',
  zip: '10001',
  emergencyName: 'Jane Patient',
  emergencyRelation: 'Spouse',
  emergencyPhone: '(555) 987-6543',
  insuranceProvider: 'Blue Cross Blue Shield',
  insuranceId: 'BCB-12345678',
  insuranceGroup: 'GRP-1001',
  memberSince: 'January 2024'
});

const preferences = reactive({
  emailNotifications: true,
  smsReminders: true,
  appointmentReminders: true,
  marketingEmails: false
});

const initials = computed(() => {
  const first = profile.firstName?.[0] || '';
  const last = profile.lastName?.[0] || '';
  return (first + last).toUpperCase();
});

const inputClass = computed(() => {
  return editing.value
    ? 'w-full p-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500'
    : 'w-full p-2.5 bg-slate-50 border border-transparent rounded-xl text-sm text-slate-700';
});

const saveProfile = () => {
  editing.value = false;
  toast.success('Profile saved successfully.');
};
</script>
