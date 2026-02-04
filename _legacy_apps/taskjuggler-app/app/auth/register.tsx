import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../stores/auth';
import { showToast } from '../../utils/toast';

export default function RegisterScreen() {
  const router = useRouter();
  const { register, loading } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !password || !passwordConfirmation) {
      showToast.error('Please fill in all fields');
      return;
    }

    if (password !== passwordConfirmation) {
      showToast.error('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      showToast.error('Password must be at least 8 characters');
      return;
    }

    try {
      await register({ name, email, password, password_confirmation: passwordConfirmation });
      showToast.success('Registration successful');
      router.replace('/(tabs)');
    } catch (error: any) {
      showToast.error(error.response?.data?.message || 'Failed to create account');
    }
  };

  return (
    <View className="flex-1 items-center justify-center p-6 bg-white">
      <Text className="text-3xl font-bold mb-8">Create Account</Text>
      <TextInput
        className="w-full border border-gray-300 rounded-lg p-3 mb-4"
        placeholder="Name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />
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
        className="w-full border border-gray-300 rounded-lg p-3 mb-4"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="password"
      />
      <TextInput
        className="w-full border border-gray-300 rounded-lg p-3 mb-6"
        placeholder="Confirm Password"
        value={passwordConfirmation}
        onChangeText={setPasswordConfirmation}
        secureTextEntry
        autoComplete="password"
      />
      <TouchableOpacity
        className="w-full bg-blue-600 rounded-lg p-4 items-center"
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-semibold">Create Account</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        className="mt-4"
        onPress={() => router.back()}
      >
        <Text className="text-blue-600">Already have an account? Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}
