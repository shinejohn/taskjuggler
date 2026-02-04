import { View, Text, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useRulesStore } from '../stores/rules';
import { showToast } from '../utils/toast';

export default function RoutingRulesScreen() {
  const router = useRouter();
  const { rules, loading, fetchRules, deleteRule } = useRulesStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchRules();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRules();
    setRefreshing(false);
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteRule(id);
      showToast.success('Rule deleted');
    } catch (error) {
      showToast.error('Failed to delete rule');
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View className="p-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold">Routing Rules</Text>
          <TouchableOpacity
            className="bg-blue-600 rounded px-4 py-2"
            onPress={() => showToast.info('Rule creation coming soon')}
          >
            <Text className="text-white font-semibold">+ New</Text>
          </TouchableOpacity>
        </View>

        {loading && rules.length === 0 ? (
          <View className="py-8">
            <ActivityIndicator size="large" color="#2563eb" />
          </View>
        ) : rules.length === 0 ? (
          <View className="py-12 items-center">
            <Text className="text-4xl mb-4">🔀</Text>
            <Text className="text-lg font-semibold text-gray-700 mb-2">No routing rules yet</Text>
            <Text className="text-gray-500 text-center mb-4">Create your first routing rule to automate task assignment</Text>
            <TouchableOpacity
              className="bg-blue-600 rounded-lg px-6 py-3"
              onPress={() => showToast.info('Rule creation coming soon')}
            >
              <Text className="text-white font-semibold">Create Rule</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="space-y-3">
            {rules.map((rule) => (
              <View key={rule.id} className="bg-white rounded-lg p-4 shadow-sm">
                <View className="flex-row justify-between items-start mb-2">
                  <View className="flex-1">
                    <Text className="text-lg font-semibold mb-1">{rule.name}</Text>
                    {rule.description && (
                      <Text className="text-sm text-gray-600 mb-2">{rule.description}</Text>
                    )}
                    <View className="flex-row items-center gap-2 mb-2">
                      <View className={`px-2 py-1 rounded ${rule.is_active ? 'bg-green-100' : 'bg-gray-100'}`}>
                        <Text className={`text-xs font-medium ${rule.is_active ? 'text-green-800' : 'text-gray-800'}`}>
                          {rule.is_active ? 'Active' : 'Inactive'}
                        </Text>
                      </View>
                      <Text className="text-xs text-gray-500">Priority: {rule.priority}</Text>
                    </View>
                    <Text className="text-sm text-gray-700">
                      Match: {rule.conditions.match_type === 'all' ? 'All' : 'Any'} conditions
                    </Text>
                    <Text className="text-sm text-gray-700">
                      Conditions: {rule.conditions.rules.length}
                    </Text>
                    <Text className="text-sm text-gray-700">
                      Assign to: {rule.actions.assignee_type.replace('_', ' ')}
                    </Text>
                    {rule.times_matched > 0 && (
                      <Text className="text-xs text-gray-500 mt-1">
                        Matched {rule.times_matched} time(s)
                      </Text>
                    )}
                  </View>
                </View>
                <View className="flex-row gap-2 mt-3">
                  <TouchableOpacity
                    className="flex-1 bg-blue-600 rounded px-3 py-2"
                    onPress={() => showToast.info('Rule editing coming soon')}
                  >
                    <Text className="text-white text-center text-sm font-medium">Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex-1 bg-red-600 rounded px-3 py-2"
                    onPress={() => handleDelete(rule.id, rule.name)}
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
