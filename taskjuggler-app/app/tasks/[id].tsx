import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTasksStore } from '../../stores/tasks';
import { useTeamStore } from '../../stores/team';

export default function TaskDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { currentTask, loading, fetchTask, updateTask, completeTask, deleteTask } = useTasksStore();
  const { teamMembers, fetchTeamMembers } = useTeamStore();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'normal' as 'low' | 'normal' | 'high' | 'urgent',
    due_date: '',
    team_member_id: '',
  });

  useEffect(() => {
    if (id) {
      fetchTask(id);
      fetchTeamMembers();
    }
  }, [id]);

  useEffect(() => {
    if (currentTask) {
      setForm({
        title: currentTask.title,
        description: currentTask.description || '',
        priority: currentTask.priority,
        due_date: currentTask.due_date || '',
        team_member_id: currentTask.team_member_id || '',
      });
    }
  }, [currentTask]);

  const handleSave = async () => {
    if (!id) return;
    try {
      await updateTask(id, form);
      Alert.alert('Success', 'Task updated successfully');
      setEditing(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update task');
    }
  };

  const handleComplete = async () => {
    if (!id) return;
    try {
      await completeTask(id);
      Alert.alert('Success', 'Task completed!');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to complete task');
    }
  };

  const handleDelete = () => {
    if (!id) return;
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTask(id);
              Alert.alert('Success', 'Task deleted');
              router.back();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete task');
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'normal':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && !currentTask) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!currentTask) {
    return (
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-gray-500">Task not found</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4 bg-blue-600 rounded px-4 py-2">
          <Text className="text-white">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        <View className="flex-row justify-between items-center mb-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-blue-600 text-lg">← Back</Text>
          </TouchableOpacity>
          {!editing && (
            <TouchableOpacity onPress={() => setEditing(true)}>
              <Text className="text-blue-600 text-lg">Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
          {editing ? (
            <>
              <Text className="text-sm font-medium text-gray-700 mb-1">Title *</Text>
              <TextInput
                className="border border-gray-300 rounded p-2 mb-4"
                value={form.title}
                onChangeText={(text) => setForm({ ...form, title: text })}
                placeholder="Task title"
              />
              <Text className="text-sm font-medium text-gray-700 mb-1">Description</Text>
              <TextInput
                className="border border-gray-300 rounded p-2 mb-4"
                value={form.description}
                onChangeText={(text) => setForm({ ...form, description: text })}
                placeholder="Task description"
                multiline
                numberOfLines={4}
              />
              <View className="flex-row gap-2 mb-4">
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-700 mb-1">Priority</Text>
                  <View className="border border-gray-300 rounded">
                    <Text className="p-2">{form.priority}</Text>
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
              <View className="flex-row gap-2">
                <TouchableOpacity
                  className="flex-1 bg-blue-600 rounded px-4 py-2"
                  onPress={handleSave}
                >
                  <Text className="text-white text-center font-medium">Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 bg-gray-300 rounded px-4 py-2"
                  onPress={() => {
                    setEditing(false);
                    if (currentTask) {
                      setForm({
                        title: currentTask.title,
                        description: currentTask.description || '',
                        priority: currentTask.priority,
                        due_date: currentTask.due_date || '',
                        team_member_id: currentTask.team_member_id || '',
                      });
                    }
                  }}
                >
                  <Text className="text-gray-800 text-center font-medium">Cancel</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text className="text-2xl font-bold mb-2">{currentTask.title}</Text>
              {currentTask.description && (
                <Text className="text-gray-700 mb-4">{currentTask.description}</Text>
              )}
              <View className="flex-row items-center flex-wrap gap-2 mb-4">
                <View className={`px-2 py-1 rounded ${getStatusColor(currentTask.status)}`}>
                  <Text className="text-xs font-medium">{currentTask.status}</Text>
                </View>
                <View className={`px-2 py-1 rounded ${getPriorityColor(currentTask.priority)}`}>
                  <Text className="text-xs font-medium">{currentTask.priority}</Text>
                </View>
              </View>
              <View className="space-y-2">
                {currentTask.due_date && (
                  <Text className="text-sm text-gray-600">
                    <Text className="font-medium">Due:</Text> {new Date(currentTask.due_date).toLocaleDateString()}
                  </Text>
                )}
                {currentTask.contact_name && (
                  <Text className="text-sm text-gray-600">
                    <Text className="font-medium">Contact:</Text> {currentTask.contact_name}
                  </Text>
                )}
                {currentTask.tags && currentTask.tags.length > 0 && (
                  <View className="flex-row flex-wrap gap-1 mt-2">
                    {currentTask.tags.map((tag, idx) => (
                      <View key={idx} className="bg-gray-100 rounded px-2 py-1">
                        <Text className="text-xs text-gray-700">{tag}</Text>
                      </View>
                    ))}
                  </View>
                )}
                <Text className="text-xs text-gray-500 mt-4">
                  Created: {new Date(currentTask.created_at).toLocaleString()}
                </Text>
              </View>
            </>
          )}
        </View>

        {!editing && (
          <View className="space-y-2">
            {currentTask.status !== 'completed' && (
              <TouchableOpacity
                className="bg-green-600 rounded-lg p-4"
                onPress={handleComplete}
              >
                <Text className="text-white text-center font-semibold">Mark as Complete</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              className="bg-red-600 rounded-lg p-4"
              onPress={handleDelete}
            >
              <Text className="text-white text-center font-semibold">Delete Task</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
