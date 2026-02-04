import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../stores/auth';
import { showToast } from '../../utils/toast';

export default function LoginScreen() {
  const router = useRouter();
  const { login, loading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      showToast.error('Please fill in all fields');
      return;
    }

    try {
      await login(email, password);
      showToast.success('Login successful');
      router.replace('/(tabs)');
    } catch (error: any) {
      showToast.error(error.response?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <View className="flex-1 items-center justify-center p-6 bg-white">
      <Text className="text-3xl font-bold mb-8">Task Juggler</Text>
      <TextInput
        className="w-full border border-gray-300 rounded-lg p-3 mb-4"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />
      <TextInput
        className="w-full border border-gray-300 rounded-lg p-3 mb-6"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="password"
      />
      <TouchableOpacity
        className="w-full bg-blue-600 rounded-lg p-4 items-center"
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-semibold">Sign In</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        className="mt-4"
        onPress={() => router.push('/auth/register')}
      >
        <Text className="text-blue-600">Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}
