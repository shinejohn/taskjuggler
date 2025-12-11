import { View, Text, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useTeamsStore } from '../stores/teams';
import { showToast } from '../utils/toast';

export default function TeamsScreen() {
  const router = useRouter();
  const { teams, loading, fetchTeams, createTeam, deleteTeam } = useTeamsStore();
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [teamForm, setTeamForm] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchTeams();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTeams();
    setRefreshing(false);
  };

  const handleCreateTeam = async () => {
    if (!teamForm.name.trim()) {
      showToast.error('Team name is required');
      return;
    }

    try {
      const team = await createTeam(teamForm);
      showToast.success('Team created successfully');
      setShowCreateModal(false);
      setTeamForm({ name: '', description: '' });
      router.push(`/teams/${team.id}`);
    } catch (error) {
      showToast.error('Failed to create team');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    Alert.alert(
      'Delete Team',
      `Are you sure you want to delete "${name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTeam(id);
              showToast.success('Team deleted');
            } catch (error) {
              showToast.error('Failed to delete team');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View className="p-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold">Teams</Text>
          <TouchableOpacity
            className="bg-blue-600 rounded px-4 py-2"
            onPress={() => setShowCreateModal(true)}
          >
            <Text className="text-white font-semibold">+ Create</Text>
          </TouchableOpacity>
        </View>

        {loading && teams.length === 0 ? (
          <View className="py-8">
            <ActivityIndicator size="large" color="#2563eb" />
          </View>
        ) : teams.length === 0 ? (
          <View className="py-12 items-center">
            <Text className="text-4xl mb-4">👥</Text>
            <Text className="text-lg font-semibold text-gray-700 mb-2">No teams yet</Text>
            <Text className="text-gray-500 text-center mb-4">Create a team to collaborate on tasks</Text>
            <TouchableOpacity
              className="bg-blue-600 rounded-lg px-6 py-3"
              onPress={() => setShowCreateModal(true)}
            >
              <Text className="text-white font-semibold">Create Team</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="space-y-3">
            {teams.map((team) => (
              <TouchableOpacity
                key={team.id}
                className="bg-white rounded-lg p-4 shadow-sm"
                onPress={() => router.push(`/teams/${team.id}`)}
              >
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <Text className="text-lg font-semibold mb-1">{team.name}</Text>
                    {team.description && (
                      <Text className="text-sm text-gray-600 mb-2">{team.description}</Text>
                    )}
                    <View className="flex-row gap-4 text-sm text-gray-500">
                      <Text className="text-sm text-gray-500">{team.members_count || 0} members</Text>
                      <Text className="text-sm text-gray-500">{team.tasks_count || 0} tasks</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      handleDelete(team.id, team.name);
                    }}
                    className="ml-2"
                  >
                    <Text className="text-red-600 text-sm">Delete</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Create Team Modal */}
      {showCreateModal && (
        <View className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <View className="bg-white rounded-lg w-full max-w-md p-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold">Create Team</Text>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <Text className="text-gray-400 text-xl">×</Text>
              </TouchableOpacity>
            </View>

            <View className="space-y-4">
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1">Team Name *</Text>
                <TextInput
                  className="border border-gray-300 rounded p-2"
                  value={teamForm.name}
                  onChangeText={(text) => setTeamForm({ ...teamForm, name: text })}
                  placeholder="My Team"
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1">Description</Text>
                <TextInput
                  className="border border-gray-300 rounded p-2"
                  value={teamForm.description}
                  onChangeText={(text) => setTeamForm({ ...teamForm, description: text })}
                  placeholder="Team description..."
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View className="flex-row gap-2 pt-4 border-t">
                <TouchableOpacity
                  className="flex-1 bg-blue-600 rounded px-4 py-2"
                  onPress={handleCreateTeam}
                >
                  <Text className="text-white text-center font-medium">Create</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 bg-gray-300 rounded px-4 py-2"
                  onPress={() => {
                    setShowCreateModal(false);
                    setTeamForm({ name: '', description: '' });
                  }}
                >
                  <Text className="text-gray-800 text-center font-medium">Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}
