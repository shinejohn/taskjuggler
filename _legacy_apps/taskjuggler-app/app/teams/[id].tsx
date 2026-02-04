import { View, Text, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTeamsStore } from '../../stores/teams';
import { showToast } from '../../utils/toast';

export default function TeamDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { currentTeam, teamMembers, loading, fetchTeam, fetchTeamMembers, inviteToTeam, removeMember } = useTeamsStore();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'members' | 'tasks'>('members');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: '', name: '' });
  const [teamTasks, setTeamTasks] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      loadTeam();
    }
  }, [id]);

  const loadTeam = async () => {
    if (!id) return;
    await fetchTeam(id);
    await fetchTeamMembers(id);
    await loadTeamTasks();
  };

  const loadTeamTasks = async () => {
    if (!id) return;
    try {
      const response = await useTeamsStore.getState().fetchTeamTasks(id);
      setTeamTasks(response.data || []);
    } catch (error) {
      // Error handled
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTeam();
    setRefreshing(false);
  };

  const handleInvite = async () => {
    if (!id || (!inviteForm.email.trim())) {
      showToast.error('Email or phone is required');
      return;
    }

    try {
      const invitation = await inviteToTeam(id, {
        email: inviteForm.email.includes('@') ? inviteForm.email : undefined,
        phone: !inviteForm.email.includes('@') ? inviteForm.email : undefined,
        name: inviteForm.name || undefined,
      });
      showToast.success('Invitation sent');
      setShowInviteModal(false);
      setInviteForm({ email: '', name: '' });
      
      // Show invitation URL
      if (invitation.invite_url) {
        Alert.alert(
          'Invitation Created',
          `Invitation link: ${invitation.invite_url}\n\nShare this link with the person you want to invite.`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      showToast.error('Failed to send invitation');
    }
  };

  const handleRemoveMember = async (userId: string, userName: string) => {
    if (!id) return;
    Alert.alert(
      'Remove Member',
      `Remove ${userName} from this team?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeMember(id, userId);
              showToast.success('Member removed');
            } catch (error) {
              showToast.error('Failed to remove member');
            }
          },
        },
      ]
    );
  };

  if (loading && !currentTeam) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!currentTeam) {
    return (
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-gray-500">Team not found</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4 bg-blue-600 rounded px-4 py-2">
          <Text className="text-white">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View className="p-4">
        {/* Header */}
        <View className="flex-row justify-between items-start mb-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-blue-600 text-lg">← Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-blue-600 rounded px-4 py-2"
            onPress={() => setShowInviteModal(true)}
          >
            <Text className="text-white font-semibold">Invite</Text>
          </TouchableOpacity>
        </View>

        {/* Team Info */}
        <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
          <Text className="text-2xl font-bold mb-2">{currentTeam.name}</Text>
          {currentTeam.description && (
            <Text className="text-gray-600 mb-3">{currentTeam.description}</Text>
          )}
          <View className="flex-row gap-4 text-sm text-gray-500">
            <Text className="text-sm text-gray-500">{currentTeam.members_count || 0} members</Text>
            <Text className="text-sm text-gray-500">{currentTeam.tasks_count || 0} tasks</Text>
          </View>
        </View>

        {/* Tabs */}
        <View className="flex-row border-b mb-4">
          <TouchableOpacity
            className={`flex-1 py-2 border-b-2 ${activeTab === 'members' ? 'border-blue-600' : 'border-transparent'}`}
            onPress={() => setActiveTab('members')}
          >
            <Text className={`text-center font-medium ${activeTab === 'members' ? 'text-blue-600' : 'text-gray-500'}`}>
              Members
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-2 border-b-2 ${activeTab === 'tasks' ? 'border-blue-600' : 'border-transparent'}`}
            onPress={() => setActiveTab('tasks')}
          >
            <Text className={`text-center font-medium ${activeTab === 'tasks' ? 'text-blue-600' : 'text-gray-500'}`}>
              Tasks
            </Text>
          </TouchableOpacity>
        </View>

        {/* Members Tab */}
        {activeTab === 'members' && (
          <View className="bg-white rounded-lg p-4 shadow-sm">
            {teamMembers.length === 0 ? (
              <View className="py-8 items-center">
                <Text className="text-gray-500">No members yet</Text>
              </View>
            ) : (
              <View className="space-y-3">
                {teamMembers.map((member) => (
                  <View key={member.id} className="flex-row items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <View className="flex-row items-center gap-3 flex-1">
                      <View className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                        <Text className="text-white font-semibold">
                          {member.name.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View className="flex-1">
                        <Text className="font-medium">{member.name}</Text>
                        {member.email && (
                          <Text className="text-sm text-gray-500">{member.email}</Text>
                        )}
                      </View>
                      {member.is_admin && (
                        <View className="bg-blue-100 rounded px-2 py-1">
                          <Text className="text-xs font-medium text-blue-800">Admin</Text>
                        </View>
                      )}
                    </View>
                    <TouchableOpacity
                      onPress={() => handleRemoveMember(member.id, member.name)}
                      className="ml-2"
                    >
                      <Text className="text-red-600 text-sm">Remove</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <View className="bg-white rounded-lg p-4 shadow-sm">
            {teamTasks.length === 0 ? (
              <View className="py-8 items-center">
                <Text className="text-gray-500">No tasks assigned to this team yet</Text>
              </View>
            ) : (
              <View className="space-y-3">
                {teamTasks.map((task: any) => (
                  <TouchableOpacity
                    key={task.id}
                    className="p-3 bg-gray-50 rounded-lg"
                    onPress={() => router.push(`/tasks/${task.id}`)}
                  >
                    <Text className="font-medium">{task.title}</Text>
                    <Text className="text-sm text-gray-500">{task.status}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}
      </View>

      {/* Invite Modal */}
      {showInviteModal && (
        <View className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <View className="bg-white rounded-lg w-full max-w-md p-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold">Invite to Team</Text>
              <TouchableOpacity onPress={() => setShowInviteModal(false)}>
                <Text className="text-gray-400 text-xl">×</Text>
              </TouchableOpacity>
            </View>

            <View className="space-y-4">
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1">Email or Phone *</Text>
                <TextInput
                  className="border border-gray-300 rounded p-2"
                  value={inviteForm.email}
                  onChangeText={(text) => setInviteForm({ ...inviteForm, email: text })}
                  placeholder="email@example.com or +1234567890"
                  keyboardType="email-address"
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1">Name (optional)</Text>
                <TextInput
                  className="border border-gray-300 rounded p-2"
                  value={inviteForm.name}
                  onChangeText={(text) => setInviteForm({ ...inviteForm, name: text })}
                  placeholder="John Doe"
                />
              </View>

              <View className="flex-row gap-2 pt-4 border-t">
                <TouchableOpacity
                  className="flex-1 bg-blue-600 rounded px-4 py-2"
                  onPress={handleInvite}
                >
                  <Text className="text-white text-center font-medium">Send Invitation</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 bg-gray-300 rounded px-4 py-2"
                  onPress={() => {
                    setShowInviteModal(false);
                    setInviteForm({ email: '', name: '' });
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
