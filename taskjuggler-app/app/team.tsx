import { View, Text, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useTeamStore } from '../stores/team';
import { showToast } from '../utils/toast';

export default function TeamScreen() {
  const router = useRouter();
  const { teamMembers, loading, fetchTeamMembers, deleteTeamMember } = useTeamStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTeamMembers();
    setRefreshing(false);
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteTeamMember(id);
      showToast.success('Team member deleted');
    } catch (error) {
      showToast.error('Failed to delete team member');
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View className="p-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold">Team Members</Text>
          <TouchableOpacity
            className="bg-blue-600 rounded px-4 py-2"
            onPress={() => showToast.info('Add team member coming soon')}
          >
            <Text className="text-white font-semibold">+ Add</Text>
          </TouchableOpacity>
        </View>

        {loading && teamMembers.length === 0 ? (
          <View className="py-8">
            <ActivityIndicator size="large" color="#2563eb" />
          </View>
        ) : teamMembers.length === 0 ? (
          <View className="py-12 items-center">
            <Text className="text-4xl mb-4">👥</Text>
            <Text className="text-lg font-semibold text-gray-700 mb-2">No team members yet</Text>
            <Text className="text-gray-500 text-center mb-4">Add team members to collaborate on tasks</Text>
            <TouchableOpacity
              className="bg-blue-600 rounded-lg px-6 py-3"
              onPress={() => showToast.info('Add team member coming soon')}
            >
              <Text className="text-white font-semibold">Add Member</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="space-y-3">
            {teamMembers.map((member) => (
              <View key={member.id} className="bg-white rounded-lg p-4 shadow-sm">
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <Text className="text-lg font-semibold mb-1">{member.name}</Text>
                    <View className="flex-row items-center gap-2 mb-2">
                      {member.user ? (
                        <View className="bg-green-100 rounded px-2 py-1">
                          <Text className="text-xs font-medium text-green-800">Has Account</Text>
                        </View>
                      ) : (
                        <View className="bg-gray-100 rounded px-2 py-1">
                          <Text className="text-xs font-medium text-gray-800">No Account</Text>
                        </View>
                      )}
                      {member.can_receive_tasks && (
                        <View className="bg-blue-100 rounded px-2 py-1">
                          <Text className="text-xs font-medium text-blue-800">Can Receive Tasks</Text>
                        </View>
                      )}
                    </View>
                    {member.email && (
                      <Text className="text-sm text-gray-600 mb-1">Email: {member.email}</Text>
                    )}
                    {member.phone && (
                      <Text className="text-sm text-gray-600 mb-1">Phone: {member.phone}</Text>
                    )}
                    {member.role && (
                      <Text className="text-sm text-gray-600">Role: {member.role}</Text>
                    )}
                  </View>
                </View>
                <View className="flex-row gap-2 mt-3">
                  <TouchableOpacity
                    className="flex-1 bg-blue-600 rounded px-3 py-2"
                    onPress={() => showToast.info('Edit team member coming soon')}
                  >
                    <Text className="text-white text-center text-sm font-medium">Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex-1 bg-red-600 rounded px-3 py-2"
                    onPress={() => handleDelete(member.id, member.name)}
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
