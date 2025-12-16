import { View, Text, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useChannelsStore } from '../stores/channels';
import { showToast } from '../utils/toast';

export default function ChannelsScreen() {
  const router = useRouter();
  const { channels, loading, fetchChannels, deleteChannel } = useChannelsStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchChannels();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchChannels();
    setRefreshing(false);
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteChannel(id);
      showToast.success('Channel deleted');
    } catch (error) {
      showToast.error('Failed to delete channel');
    }
  };

  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'phone':
        return '📞';
      case 'email':
        return '📧';
      case 'sms':
        return '💬';
      default:
        return '📥';
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View className="p-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold">Channels</Text>
          <View className="flex-row gap-2">
            <TouchableOpacity
              className="bg-blue-600 rounded px-3 py-2"
              onPress={() => showToast.info('Add phone channel coming soon')}
            >
              <Text className="text-white text-xs font-semibold">+ Phone</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-green-600 rounded px-3 py-2"
              onPress={() => showToast.info('Add email channel coming soon')}
            >
              <Text className="text-white text-xs font-semibold">+ Email</Text>
            </TouchableOpacity>
          </View>
        </View>

        {loading && channels.length === 0 ? (
          <View className="py-8">
            <ActivityIndicator size="large" color="#2563eb" />
          </View>
        ) : channels.length === 0 ? (
          <View className="py-12 items-center">
            <Text className="text-4xl mb-4">📡</Text>
            <Text className="text-lg font-semibold text-gray-700 mb-2">No channels configured yet</Text>
            <Text className="text-gray-500 text-center mb-4">Add a phone number or email address to start receiving messages</Text>
            <View className="flex-row gap-2">
              <TouchableOpacity
                className="bg-blue-600 rounded-lg px-6 py-3"
                onPress={() => showToast.info('Add phone channel coming soon')}
              >
                <Text className="text-white font-semibold">Add Phone</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-green-600 rounded-lg px-6 py-3"
                onPress={() => showToast.info('Add email channel coming soon')}
              >
                <Text className="text-white font-semibold">Add Email</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View className="space-y-3">
            {channels.map((channel) => (
              <View key={channel.id} className="bg-white rounded-lg p-4 shadow-sm">
                <View className="flex-row items-start">
                  <Text className="text-2xl mr-3">{getChannelIcon(channel.channel_type)}</Text>
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2 mb-2">
                      <Text className="text-lg font-semibold capitalize">{channel.channel_type}</Text>
                      <View className={`px-2 py-1 rounded ${channel.is_active ? 'bg-green-100' : 'bg-gray-100'}`}>
                        <Text className={`text-xs font-medium ${channel.is_active ? 'text-green-800' : 'text-gray-800'}`}>
                          {channel.is_active ? 'Active' : 'Inactive'}
                        </Text>
                      </View>
                    </View>
                    {channel.phone_number && (
                      <Text className="text-sm text-gray-600 mb-1">Phone: {channel.phone_number}</Text>
                    )}
                    {channel.email_address && (
                      <Text className="text-sm text-gray-600 mb-1">Email: {channel.email_address}</Text>
                    )}
                    {channel.greeting_message && (
                      <Text className="text-sm text-gray-600" numberOfLines={2}>
                        Greeting: {channel.greeting_message}
                      </Text>
                    )}
                  </View>
                </View>
                <View className="flex-row gap-2 mt-3">
                  <TouchableOpacity
                    className="flex-1 bg-blue-600 rounded px-3 py-2"
                    onPress={() => showToast.info('Edit channel coming soon')}
                  >
                    <Text className="text-white text-center text-sm font-medium">Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex-1 bg-red-600 rounded px-3 py-2"
                    onPress={() => handleDelete(channel.id, channel.phone_number || channel.email_address || 'channel')}
                  >
                    <Text className="text-white text-center text-sm font-medium">Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
