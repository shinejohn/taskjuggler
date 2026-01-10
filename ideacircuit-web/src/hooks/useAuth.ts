import { useEffect } from 'react';
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
  const { user, token, loading, isAuthenticated, login: storeLogin, register: storeRegister, logout: storeLogout, fetchUser } = useAuthStore();

  // Fetch user profile on mount if authenticated
  useEffect(() => {
    if (isAuthenticated && token && !user) {
      fetchUser();
    }
  }, [isAuthenticated, token, user, fetchUser]);

  const login = async (email: string, password: string) => {
    try {
      await storeLogin(email, password);
      // Fetch user profile after successful login
      await fetchUser();
      return {
        user: useAuthStore.getState().user,
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
      await storeRegister({
        name,
        email,
        password,
        password_confirmation: password
      });
      // Fetch user profile after successful registration
      await fetchUser();
      return {
        user: useAuthStore.getState().user,
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
      storeLogout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Derive profile from user (can be extended with API call if needed)
  const profile: UserProfile | null = user ? {
    user_id: user.id,
    tier: 'tier_1', // Default tier, can be fetched from API
    user_type: 'meeting_host', // Default type, can be fetched from API
    display_name: user.name,
    can_create_meetings: true,
    can_enable_ai_participant: true,
    can_record_meetings: true,
    max_meeting_duration_minutes: 120,
    max_participants_per_meeting: 50,
    subscription_tier: 'premium'
  } : null;

  return {
    user,
    profile,
    loading,
    isAuthenticated,
    isTier1: profile?.tier === 'tier_1',
    canCreateMeetings: profile?.can_create_meetings || false,
    canEnableAI: profile?.can_enable_ai_participant || false,
    canRecordMeetings: profile?.can_record_meetings || false,
    login,
    register,
    logout
  };
};
