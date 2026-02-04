import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, Modal, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useTasksStore } from '../../stores/tasks';
import { useTeamStore } from '../../stores/team';
import { showToast } from '../../utils/toast';
import DateTimePicker from '@react-native-community/datetimepicker';

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
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (date) {
      setSelectedDate(date);
      setForm({ ...form, due_date: formatDate(date) });
    }
  };

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

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">Priority</Text>
            <View className="flex-row gap-2">
              <TouchableOpacity
                className={`flex-1 rounded px-3 py-2 ${form.priority === 'low' ? 'bg-gray-600' : 'bg-gray-200'}`}
                onPress={() => setForm({ ...form, priority: 'low' })}
              >
                <Text className={`text-center text-sm ${form.priority === 'low' ? 'text-white' : 'text-gray-700'}`}>Low</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 rounded px-3 py-2 ${form.priority === 'normal' ? 'bg-blue-600' : 'bg-gray-200'}`}
                onPress={() => setForm({ ...form, priority: 'normal' })}
              >
                <Text className={`text-center text-sm ${form.priority === 'normal' ? 'text-white' : 'text-gray-700'}`}>Normal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 rounded px-3 py-2 ${form.priority === 'high' ? 'bg-orange-600' : 'bg-gray-200'}`}
                onPress={() => setForm({ ...form, priority: 'high' })}
              >
                <Text className={`text-center text-sm ${form.priority === 'high' ? 'text-white' : 'text-gray-700'}`}>High</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 rounded px-3 py-2 ${form.priority === 'urgent' ? 'bg-red-600' : 'bg-gray-200'}`}
                onPress={() => setForm({ ...form, priority: 'urgent' })}
              >
                <Text className={`text-center text-sm ${form.priority === 'urgent' ? 'text-white' : 'text-gray-700'}`}>Urgent</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">Due Date</Text>
            <TouchableOpacity
              className="border border-gray-300 rounded p-2 bg-white"
              onPress={() => setShowDatePicker(true)}
            >
              <Text className={form.due_date ? 'text-gray-900' : 'text-gray-400'}>
                {form.due_date || 'Select date'}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={selectedDate || new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
                minimumDate={new Date()}
              />
            )}
            {Platform.OS === 'ios' && showDatePicker && (
              <View className="flex-row gap-2 mt-2">
                <TouchableOpacity
                  className="flex-1 bg-gray-300 rounded px-4 py-2"
                  onPress={() => {
                    setShowDatePicker(false);
                    if (!selectedDate) {
                      setForm({ ...form, due_date: '' });
                    }
                  }}
                >
                  <Text className="text-center">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 bg-blue-600 rounded px-4 py-2"
                  onPress={() => setShowDatePicker(false)}
                >
                  <Text className="text-white text-center">Done</Text>
                </TouchableOpacity>
              </View>
            )}
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
