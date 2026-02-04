import { View, Text, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useMessagesStore } from '../stores/messages';
import { showToast } from '../utils/toast';

export default function MessagesScreen() {
  const router = useRouter();
  const { conversations, loading, fetchConversations, fetchDirectUnreadCount } = useMessagesStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await fetchConversations();
    await fetchDirectUnreadCount();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View className="p-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold">Direct Messages</Text>
        </View>

        {loading && conversations.length === 0 ? (
          <View className="py-8">
            <ActivityIndicator size="large" color="#2563eb" />
          </View>
        ) : conversations.length === 0 ? (
          <View className="py-12 items-center">
            <Text className="text-4xl mb-4">💬</Text>
            <Text className="text-lg font-semibold text-gray-700 mb-2">No conversations yet</Text>
            <Text className="text-gray-500 text-center">Start messaging someone!</Text>
          </View>
        ) : (
          <View className="space-y-3">
            {conversations.map((conv) => (
              <TouchableOpacity
                key={conv.user.id}
                className="bg-white rounded-lg p-4 shadow-sm"
                onPress={() => router.push(`/messages/${conv.user.id}`)}
              >
                <View className="flex-row items-center gap-3">
                  <View className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                    <Text className="text-white font-semibold">
                      {conv.user.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2 mb-1">
                      <Text className="font-semibold">{conv.user.name}</Text>
                      {conv.unread_count > 0 && (
                        <View className="bg-blue-600 rounded-full px-2 py-1">
                          <Text className="text-white text-xs font-medium">{conv.unread_count}</Text>
                        </View>
                      )}
                    </View>
                    <Text className="text-sm text-gray-600 truncate" numberOfLines={1}>
                      {conv.last_message.content}
                    </Text>
                    <Text className="text-xs text-gray-400 mt-1">
                      {formatTime(conv.last_message.sent_at)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
