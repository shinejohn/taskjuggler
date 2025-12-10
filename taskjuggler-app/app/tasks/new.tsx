import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, Modal } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useTasksStore } from '../../stores/tasks';
import { useTeamStore } from '../../stores/team';

export default function TaskCreateScreen() {
  const router = useRouter();
  const { createTask, loading } = useTasksStore();
  const { teamMembers, fetchTeamMembers } = useTeamStore();
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'normal' as 'low' | 'normal' | 'high' | 'urgent',
    due_date: '',
    team_member_id: '',
  });
  const [tagsInput, setTagsInput] = useState('');

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      showToast.error('Please enter a task title');
      return;
    }

    try {
      const taskData: any = {
        title: form.title,
        description: form.description || undefined,
        priority: form.priority,
        team_member_id: form.team_member_id || undefined,
        tags: tagsInput
          ? tagsInput.split(',').map(t => t.trim()).filter(Boolean)
          : undefined,
      };

      if (form.due_date) {
        taskData.due_date = form.due_date;
      }

      await createTask(taskData);
      showToast.success('Task created successfully');
      router.back();
    } catch (error) {
      showToast.error('Failed to create task');
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold">Create Task</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-blue-600 text-lg">Cancel</Text>
          </TouchableOpacity>
        </View>

        <View className="bg-white rounded-lg p-4 shadow-sm space-y-4">
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">Title *</Text>
            <TextInput
              className="border border-gray-300 rounded p-2"
              value={form.title}
              onChangeText={(text) => setForm({ ...form, title: text })}
              placeholder="Task title"
            />
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">Description</Text>
            <TextInput
              className="border border-gray-300 rounded p-2"
              value={form.description}
              onChangeText={(text) => setForm({ ...form, description: text })}
              placeholder="Task description"
              multiline
              numberOfLines={4}
            />
          </View>

          <View className="flex-row gap-2">
            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-700 mb-1">Priority</Text>
              <View className="border border-gray-300 rounded p-2">
                <Text>{form.priority}</Text>
              </View>
            </View>
            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-700 mb-1">Due Date</Text>
              <TextInput
                className="border border-gray-300 rounded p-2"
                value={form.due_date}
                onChangeText={(text) => setForm({ ...form, due_date: text })}
                placeholder="YYYY-MM-DD"
              />
            </View>
          </View>

          {teamMembers.length > 0 && (
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1">Assign to Team Member</Text>
              <View className="border border-gray-300 rounded p-2 mb-2">
                <Text className="text-gray-900">
                  {form.team_member_id ? teamMembers.find(m => m.id === form.team_member_id)?.name || 'None' : 'None'}
                </Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
                <View className="flex-row gap-2">
                  <TouchableOpacity
                    className={`px-3 py-2 rounded ${!form.team_member_id ? 'bg-blue-600' : 'bg-gray-200'}`}
                    onPress={() => setForm({ ...form, team_member_id: '' })}
                  >
                    <Text className={!form.team_member_id ? 'text-white' : 'text-gray-700'}>None</Text>
                  </TouchableOpacity>
                  {teamMembers.map((member) => (
                    <TouchableOpacity
                      key={member.id}
                      className={`px-3 py-2 rounded ${form.team_member_id === member.id ? 'bg-blue-600' : 'bg-gray-200'}`}
                      onPress={() => setForm({ ...form, team_member_id: member.id })}
                    >
                      <Text className={form.team_member_id === member.id ? 'text-white' : 'text-gray-700'}>
                        {member.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</Text>
            <TextInput
              className="border border-gray-300 rounded p-2"
              value={tagsInput}
              onChangeText={setTagsInput}
              placeholder="tag1, tag2, tag3"
            />
          </View>

          <TouchableOpacity
            className="bg-blue-600 rounded-lg p-4 mt-4"
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-semibold">Create Task</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
