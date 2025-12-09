import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // TODO: Implement login
    router.push('/(tabs)');
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
      />
      <TextInput
        className="w-full border border-gray-300 rounded-lg p-3 mb-6"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity
        className="w-full bg-primary-600 rounded-lg p-4 items-center"
        onPress={handleLogin}
      >
        <Text className="text-white font-semibold">Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}
