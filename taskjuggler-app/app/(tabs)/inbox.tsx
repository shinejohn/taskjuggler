import { View, Text, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useInboxStore } from '../../stores/inbox';

export default function InboxScreen() {
  const router = useRouter();
  const { inboxItems, loading, fetchInboxItems, processItem, dismissItem } = useInboxStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchInboxItems();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchInboxItems();
    setRefreshing(false);
  };

  const handleProcess = async (id: string) => {
    try {
      await processItem(id);
      Alert.alert('Success', 'Inbox item processed successfully');
      fetchInboxItems();
    } catch (error) {
      Alert.alert('Error', 'Failed to process inbox item');
    }
  };

  const handleDismiss = async (id: string) => {
    try {
      await dismissItem(id);
      Alert.alert('Success', 'Inbox item dismissed');
      fetchInboxItems();
    } catch (error) {
      Alert.alert('Error', 'Failed to dismiss inbox item');
    }
  };

  const getSourceIcon = (sourceType: string) => {
    switch (sourceType) {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unprocessed':
        return 'bg-yellow-100 text-yellow-800';
      case 'processed':
        return 'bg-green-100 text-green-800';
      case 'dismissed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View className="p-4">
        <Text className="text-2xl font-bold mb-4">Inbox</Text>

        {loading && inboxItems.length === 0 ? (
          <View className="py-8">
            <ActivityIndicator size="large" color="#2563eb" />
          </View>
        ) : inboxItems.length === 0 ? (
          <View className="py-8">
            <Text className="text-gray-500 text-center">No inbox items</Text>
          </View>
        ) : (
          <View className="space-y-3">
            {inboxItems.map((item) => (
              <View key={item.id} className="bg-white rounded-lg p-4 shadow-sm">
                <View className="flex-row items-center mb-2">
                  <Text className="text-2xl mr-2">{getSourceIcon(item.source_type)}</Text>
                  <View className="flex-1">
                    <Text className="font-semibold" numberOfLines={1}>
                      {item.subject || item.from_identifier}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      {item.from_name || item.from_identifier}
                    </Text>
                  </View>
                  <View className={`px-2 py-1 rounded ${getStatusColor(item.status)}`}>
                    <Text className="text-xs font-medium">{item.status}</Text>
                  </View>
                </View>
                <Text className="text-gray-700 text-sm mb-3" numberOfLines={3}>
                  {item.body}
                </Text>
                <Text className="text-xs text-gray-500 mb-3">
                  {new Date(item.received_at).toLocaleString()}
                </Text>
                {item.status === 'unprocessed' && (
                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      className="flex-1 bg-blue-600 rounded px-3 py-2"
                      onPress={() => handleProcess(item.id)}
                    >
                      <Text className="text-white text-center text-sm font-medium">Process</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="flex-1 bg-gray-600 rounded px-3 py-2"
                      onPress={() => handleDismiss(item.id)}
                    >
                      <Text className="text-white text-center text-sm font-medium">Dismiss</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
