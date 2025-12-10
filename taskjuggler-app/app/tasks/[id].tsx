import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, TextInput, Linking, Platform, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTasksStore } from '../../stores/tasks';
import { useTeamStore } from '../../stores/team';
import { showToast } from '../../utils/toast';
import api from '../../utils/api';

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
      showToast.success('Task updated successfully');
      setEditing(false);
    } catch (error) {
      showToast.error('Failed to update task');
    }
  };

  const handleComplete = async () => {
    if (!id) return;
    try {
      await completeTask(id);
      showToast.success('Task completed!');
      router.back();
    } catch (error) {
      showToast.error('Failed to complete task');
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteTask(id);
      showToast.success('Task deleted');
      router.back();
    } catch (error) {
      showToast.error('Failed to delete task');
    }
  };

  const handleExportIcal = async () => {
    if (!id) return;
    try {
      // For mobile, we'll open the download URL directly
      // The browser/calendar app will handle the .ics file
      const apiUrl = api.defaults.baseURL?.replace('/api', '') || 'https://taskjuggler-production.up.railway.app';
      const url = `${apiUrl}/api/tasks/${id}/export/ical`;
      
      // Try to open the URL - on mobile, this will trigger download or open in calendar app
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
        showToast.info('Opening calendar file...');
      } else {
        // Fallback: show URL to copy
        Alert.alert(
          'Calendar Export',
          `Copy this URL to download the calendar file:\n\n${url}`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      showToast.error('Failed to export calendar');
    }
  };

  const handleOpenGoogleCalendar = async () => {
    if (!id) return;
    try {
      const response = await api.get(`/tasks/${id}/calendar/google`);
      const url = response.data.url;
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
        showToast.info('Opening Google Calendar...');
      } else {
        showToast.error('Cannot open Google Calendar');
      }
    } catch (error) {
      showToast.error('Failed to open Google Calendar');
    }
  };

  const handleOpenOutlookCalendar = async () => {
    if (!id) return;
    try {
      const response = await api.get(`/tasks/${id}/calendar/outlook`);
      const url = response.data.url;
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
        showToast.info('Opening Outlook Calendar...');
      } else {
        showToast.error('Cannot open Outlook Calendar');
      }
    } catch (error) {
      showToast.error('Failed to open Outlook Calendar');
    }
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
            {(currentTask.due_date || currentTask.start_date) && (
              <View className="bg-gray-50 rounded-lg p-4 mb-2">
                <Text className="font-semibold mb-2">Add to Calendar</Text>
                <View className="space-y-2">
                  <TouchableOpacity
                    className="bg-blue-600 rounded-lg p-3"
                    onPress={handleExportIcal}
                  >
                    <Text className="text-white text-center font-medium">📅 Download iCal (.ics)</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="bg-blue-500 rounded-lg p-3"
                    onPress={handleOpenGoogleCalendar}
                  >
                    <Text className="text-white text-center font-medium">📅 Add to Google Calendar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="bg-blue-400 rounded-lg p-3"
                    onPress={handleOpenOutlookCalendar}
                  >
                    <Text className="text-white text-center font-medium">📅 Add to Outlook</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
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
