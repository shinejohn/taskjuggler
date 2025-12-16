import { View, Text, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useInboxStore } from '../../stores/inbox';
import { showToast } from '../../utils/toast';

export default function InboxScreen() {
  const router = useRouter();
  const { inboxItems, loading, fetchInboxItems, processItem, dismissItem, createTaskFromItem } = useInboxStore();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [sourceFilter, setSourceFilter] = useState<string>('');

  useEffect(() => {
    fetchInboxItems();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchInboxItems();
    setRefreshing(false);
  };

  const filteredItems = useMemo(() => {
    return inboxItems.filter((item) => {
      const matchesSearch = !searchQuery ||
        (item.subject && item.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.from_identifier.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.body.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = !statusFilter || item.status === statusFilter;
      const matchesSource = !sourceFilter || item.source_type === sourceFilter;
      return matchesSearch && matchesStatus && matchesSource;
    });
  }, [inboxItems, searchQuery, statusFilter, sourceFilter]);

  const handleProcess = async (id: string) => {
    try {
      await processItem(id);
      showToast.success('Inbox item processed successfully');
      fetchInboxItems();
    } catch (error) {
      showToast.error('Failed to process inbox item');
    }
  };

  const handleDismiss = async (id: string) => {
    try {
      await dismissItem(id);
      showToast.success('Inbox item dismissed');
      fetchInboxItems();
    } catch (error) {
      showToast.error('Failed to dismiss inbox item');
    }
  };

  const handleCreateTask = async (item: any) => {
    Alert.alert(
      'Create Task',
      `Create a task from this ${item.source_type}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Create Task',
          onPress: async () => {
            try {
              const title = item.subject || `Task from ${item.from_name || item.from_identifier}`;
              const description = item.body || '';
              await createTaskFromItem(item.id, {
                title,
                description,
                priority: 'normal',
              });
              showToast.success('Task created successfully');
              fetchInboxItems();
              router.push('/tasks');
            } catch (error) {
              showToast.error('Failed to create task');
            }
          },
        },
      ]
    );
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

        <View className="mb-4 space-y-2">
          <TextInput
            className="border border-gray-300 rounded-lg p-2 bg-white"
            placeholder="Search inbox items..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <View className="flex-row gap-2">
            <TouchableOpacity
              className={`flex-1 rounded px-3 py-2 ${!statusFilter ? 'bg-blue-600' : 'bg-gray-200'}`}
              onPress={() => setStatusFilter('')}
            >
              <Text className={`text-center text-xs ${!statusFilter ? 'text-white' : 'text-gray-700'}`}>All Status</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 rounded px-3 py-2 ${statusFilter === 'unprocessed' ? 'bg-blue-600' : 'bg-gray-200'}`}
              onPress={() => setStatusFilter('unprocessed')}
            >
              <Text className={`text-center text-xs ${statusFilter === 'unprocessed' ? 'text-white' : 'text-gray-700'}`}>Unprocessed</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 rounded px-3 py-2 ${statusFilter === 'processed' ? 'bg-blue-600' : 'bg-gray-200'}`}
              onPress={() => setStatusFilter('processed')}
            >
              <Text className={`text-center text-xs ${statusFilter === 'processed' ? 'text-white' : 'text-gray-700'}`}>Processed</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row gap-2">
            <TouchableOpacity
              className={`flex-1 rounded px-3 py-2 ${!sourceFilter ? 'bg-green-600' : 'bg-gray-200'}`}
              onPress={() => setSourceFilter('')}
            >
              <Text className={`text-center text-xs ${!sourceFilter ? 'text-white' : 'text-gray-700'}`}>All Sources</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 rounded px-3 py-2 ${sourceFilter === 'phone' ? 'bg-green-600' : 'bg-gray-200'}`}
              onPress={() => setSourceFilter('phone')}
            >
              <Text className={`text-center text-xs ${sourceFilter === 'phone' ? 'text-white' : 'text-gray-700'}`}>📞 Phone</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 rounded px-3 py-2 ${sourceFilter === 'email' ? 'bg-green-600' : 'bg-gray-200'}`}
              onPress={() => setSourceFilter('email')}
            >
              <Text className={`text-center text-xs ${sourceFilter === 'email' ? 'text-white' : 'text-gray-700'}`}>📧 Email</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 rounded px-3 py-2 ${sourceFilter === 'sms' ? 'bg-green-600' : 'bg-gray-200'}`}
              onPress={() => setSourceFilter('sms')}
            >
              <Text className={`text-center text-xs ${sourceFilter === 'sms' ? 'text-white' : 'text-gray-700'}`}>💬 SMS</Text>
            </TouchableOpacity>
          </View>
        </View>

        {loading && inboxItems.length === 0 ? (
          <View className="py-8">
            <ActivityIndicator size="large" color="#2563eb" />
          </View>
        ) : filteredItems.length === 0 ? (
          <View className="py-12 items-center">
            <Text className="text-4xl mb-4">📥</Text>
            <Text className="text-lg font-semibold text-gray-700 mb-2">
              {inboxItems.length === 0 ? 'No inbox items' : 'No items match your filters'}
            </Text>
            <Text className="text-gray-500 text-center">
              {inboxItems.length === 0 
                ? 'Inbox items will appear here when you receive messages' 
                : 'Try adjusting your search or filters'}
            </Text>
          </View>
        ) : (
          <View className="space-y-3">
            {filteredItems.map((item) => (
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
                  <View className="space-y-2">
                    <View className="flex-row gap-2">
                      <TouchableOpacity
                        className="flex-1 bg-green-600 rounded px-3 py-2"
                        onPress={() => handleCreateTask(item)}
                      >
                        <Text className="text-white text-center text-sm font-medium">Create Task</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="flex-1 bg-blue-600 rounded px-3 py-2"
                        onPress={() => handleProcess(item.id)}
                      >
                        <Text className="text-white text-center text-sm font-medium">Process</Text>
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                      className="bg-gray-600 rounded px-3 py-2"
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
