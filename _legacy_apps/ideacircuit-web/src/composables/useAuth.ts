import { computed, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';

interface UserProfile {
  user_id: string;
  tier: 'tier_1' | 'tier_2';
  user_type: 'meeting_host' | 'participant';
  display_name: string;
  can_create_meetings: boolean;
  can_enable_ai_participant: boolean;
  can_record_meetings: boolean;
  max_meeting_duration_minutes: number;
  max_participants_per_meeting: number;
  subscription_tier: string;
}

export const useAuth = () => {
  const authStore = useAuthStore();

  // Fetch user profile on mount if authenticated
  onMounted(() => {
    if (authStore.isAuthenticated && authStore.token && !authStore.user) {
      authStore.fetchUser();
    }
  });

  const login = async (email: string, password: string) => {
    try {
      await authStore.login(email, password);
      // Fetch user profile after successful login
      await authStore.fetchUser();
      return {
        user: authStore.user,
        error: null
      };
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        user: null,
        error: error.response?.data?.message || error.message || 'An error occurred during login'
      };
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      await authStore.register({
        name,
        email,
        password,
        password_confirmation: password
      });
      // Fetch user profile after successful registration
      await authStore.fetchUser();
      return {
        user: authStore.user,
        error: null
      };
    } catch (error: any) {
      console.error('Registration error:', error);
      return {
        user: null,
        error: error.response?.data?.message || error.message || 'An error occurred during registration'
      };
    }
  };

  const logout = async () => {
    try {
      authStore.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Derive profile from user (can be extended with API call if needed)
  const profile = computed<UserProfile | null>(() => {
    if (!authStore.user) return null;
    return {
      user_id: authStore.user.id,
      tier: 'tier_1', // Default tier, can be fetched from API
      user_type: 'meeting_host', // Default type, can be fetched from API
      display_name: authStore.user.name,
      can_create_meetings: true,
      can_enable_ai_participant: true,
      can_record_meetings: true,
      max_meeting_duration_minutes: 120,
      max_participants_per_meeting: 50,
      subscription_tier: 'premium'
    };
  });

  return {
    user: computed(() => authStore.user),
    profile,
    loading: computed(() => authStore.loading),
    isAuthenticated: computed(() => authStore.isAuthenticated),
    isTier1: computed(() => profile.value?.tier === 'tier_1'),
    canCreateMeetings: computed(() => profile.value?.can_create_meetings || false),
    canEnableAI: computed(() => profile.value?.can_enable_ai_participant || false),
    canRecordMeetings: computed(() => profile.value?.can_record_meetings || false),
    login,
    register,
    logout
  };
};

