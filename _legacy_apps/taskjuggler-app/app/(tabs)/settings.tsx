import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../stores/auth';
import { showToast } from '../../utils/toast';

export default function SettingsScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    showToast.success('Logged out successfully');
    router.replace('/auth/login');
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        <Text className="text-2xl font-bold mb-6">Settings</Text>

        <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
          <Text className="text-lg font-semibold mb-4">Profile</Text>
          <View className="space-y-2">
            <View>
              <Text className="text-sm text-gray-600">Name</Text>
              <Text className="text-base font-medium">{user?.name || 'N/A'}</Text>
            </View>
            <View>
              <Text className="text-sm text-gray-600">Email</Text>
              <Text className="text-base font-medium">{user?.email || 'N/A'}</Text>
            </View>
            <View>
              <Text className="text-sm text-gray-600">Plan</Text>
              <Text className="text-base font-medium capitalize">{user?.plan || 'N/A'}</Text>
            </View>
          </View>
        </View>

        <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
          <Text className="text-lg font-semibold mb-4">Features</Text>
          <TouchableOpacity
            className="border-b border-gray-200 pb-3 mb-3"
            onPress={() => router.push('/routing')}
          >
            <Text className="text-base">Routing Rules</Text>
            <Text className="text-sm text-gray-500">Manage your routing rules</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="border-b border-gray-200 pb-3 mb-3"
            onPress={() => router.push('/team')}
          >
            <Text className="text-base">Team Management</Text>
            <Text className="text-sm text-gray-500">Manage team members</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="border-b border-gray-200 pb-3 mb-3"
            onPress={() => router.push('/channels')}
          >
            <Text className="text-base">Channels</Text>
            <Text className="text-sm text-gray-500">Manage phone and email channels</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="border-b border-gray-200 pb-3 mb-3"
            onPress={() => router.push('/marketplace')}
          >
            <Text className="text-base">Marketplace</Text>
            <Text className="text-sm text-gray-500">Browse and manage marketplace listings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/contacts')}
          >
            <Text className="text-base">Contact Lists</Text>
            <Text className="text-sm text-gray-500">Manage contact lists and import contacts</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="bg-red-600 rounded-lg p-4"
          onPress={handleLogout}
        >
          <Text className="text-white text-center font-semibold">Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
