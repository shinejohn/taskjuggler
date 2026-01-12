import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import api from '../services/api';

interface UserPermissions {
  tier: 'tier_1' | 'tier_2';
  userType: 'meeting_host' | 'participant';
  canCreateMeetings: boolean;
  canEnableAI: boolean;
  canRecordMeetings: boolean;
  maxDuration: number;
  maxParticipants: number;
  loading: boolean;
}

export const useUserPermissions = () => {
  const authStore = useAuthStore();
  const permissions = ref<UserPermissions>({
    tier: 'tier_2',
    userType: 'participant',
    canCreateMeetings: false,
    canEnableAI: false,
    canRecordMeetings: false,
    maxDuration: 60,
    maxParticipants: 10,
    loading: true
  });

  const loadPermissions = async () => {
    if (!authStore.isAuthenticated || !authStore.user) {
      permissions.value.loading = false;
      return;
    }

    try {
      // Fetch user profile/permissions from API
      const response = await api.get('/ideacircuit/user/profile');
      const profile = response.data.data || response.data;
      
      if (profile) {
        permissions.value = {
          tier: profile.tier || 'tier_2',
          userType: profile.user_type || 'participant',
          canCreateMeetings: profile.can_create_meetings || false,
          canEnableAI: profile.can_enable_ai_participant || false,
          canRecordMeetings: profile.can_record_meetings || false,
          maxDuration: profile.max_meeting_duration_minutes || 60,
          maxParticipants: profile.max_participants_per_meeting || 10,
          loading: false
        };
      } else {
        permissions.value.loading = false;
      }
    } catch (error) {
      console.error('Error loading permissions:', error);
      // Set default permissions on error
      permissions.value = {
        tier: 'tier_2',
        userType: 'participant',
        canCreateMeetings: false,
        canEnableAI: false,
        canRecordMeetings: false,
        maxDuration: 60,
        maxParticipants: 10,
        loading: false
      };
    }
  };

  onMounted(() => {
    loadPermissions();
  });

  return computed(() => permissions.value);
};

