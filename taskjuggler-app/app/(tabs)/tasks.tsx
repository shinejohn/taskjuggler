import { View, Text, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useTasksStore } from '../../stores/tasks';
import { showToast } from '../../utils/toast';

export default function TasksScreen() {
  const router = useRouter();
  const { tasks, loading, fetchTasks, completeTask, deleteTask } = useTasksStore();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = !searchQuery || 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = !statusFilter || task.status === statusFilter;
      const matchesPriority = !priorityFilter || task.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchQuery, statusFilter, priorityFilter]);

  const handleComplete = async (id: string) => {
    try {
      await completeTask(id);
      showToast.success('Task completed!');
    } catch (error) {
      showToast.error('Failed to complete task');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTask(id);
      showToast.success('Task deleted');
    } catch (error) {
      showToast.error('Failed to delete task');
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

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View className="p-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold">Tasks</Text>
          <TouchableOpacity
            className="bg-blue-600 rounded-lg px-4 py-2"
            onPress={() => router.push('/tasks/new')}
          >
            <Text className="text-white font-semibold">+ New</Text>
          </TouchableOpacity>
        </View>

        <View className="mb-4 space-y-2">
          <TextInput
            className="border border-gray-300 rounded-lg p-2 bg-white"
            placeholder="Search tasks..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <View className="flex-row gap-2">
            <TouchableOpacity
              className={`flex-1 rounded px-3 py-2 ${!statusFilter ? 'bg-blue-600' : 'bg-gray-200'}`}
              onPress={() => setStatusFilter('')}
            >
              <Text className={`text-center text-sm ${!statusFilter ? 'text-white' : 'text-gray-700'}`}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 rounded px-3 py-2 ${statusFilter === 'pending' ? 'bg-blue-600' : 'bg-gray-200'}`}
              onPress={() => setStatusFilter('pending')}
            >
              <Text className={`text-center text-sm ${statusFilter === 'pending' ? 'text-white' : 'text-gray-700'}`}>Pending</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 rounded px-3 py-2 ${statusFilter === 'in_progress' ? 'bg-blue-600' : 'bg-gray-200'}`}
              onPress={() => setStatusFilter('in_progress')}
            >
              <Text className={`text-center text-sm ${statusFilter === 'in_progress' ? 'text-white' : 'text-gray-700'}`}>Active</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 rounded px-3 py-2 ${statusFilter === 'completed' ? 'bg-blue-600' : 'bg-gray-200'}`}
              onPress={() => setStatusFilter('completed')}
            >
              <Text className={`text-center text-sm ${statusFilter === 'completed' ? 'text-white' : 'text-gray-700'}`}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>

        {loading && tasks.length === 0 ? (
          <View className="py-8">
            <ActivityIndicator size="large" color="#2563eb" />
          </View>
        ) : filteredTasks.length === 0 ? (
          <View className="py-12 items-center">
            <Text className="text-4xl mb-4">📋</Text>
            <Text className="text-lg font-semibold text-gray-700 mb-2">
              {tasks.length === 0 ? 'No tasks yet' : 'No tasks match your filters'}
            </Text>
            <Text className="text-gray-500 text-center mb-4">
              {tasks.length === 0 
                ? 'Create your first task to get started' 
                : 'Try adjusting your search or filters'}
            </Text>
            {tasks.length === 0 && (
              <TouchableOpacity
                className="bg-blue-600 rounded-lg px-6 py-3"
                onPress={() => router.push('/tasks/new')}
              >
                <Text className="text-white font-semibold">Create Task</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View className="space-y-3">
            {filteredTasks.map((task) => (
              <TouchableOpacity
                key={task.id}
                onPress={() => router.push(`/tasks/${task.id}`)}
                className="bg-white rounded-lg p-4 shadow-sm"
              >
                <Text className="text-lg font-semibold mb-2">{task.title}</Text>
                {task.description && (
                  <Text className="text-gray-600 text-sm mb-2" numberOfLines={2}>
                    {task.description}
                  </Text>
                )}
                <View className="flex-row items-center flex-wrap gap-2">
                  <View className={`px-2 py-1 rounded ${getStatusColor(task.status)}`}>
                    <Text className="text-xs font-medium">{task.status}</Text>
                  </View>
                  <View className={`px-2 py-1 rounded ${getPriorityColor(task.priority)}`}>
                    <Text className="text-xs font-medium">{task.priority}</Text>
                  </View>
                  {task.due_date && (
                    <Text className="text-xs text-gray-500">
                      Due: {new Date(task.due_date).toLocaleDateString()}
                    </Text>
                  )}
                </View>
                <View className="flex-row justify-end gap-2 mt-3">
                  {task.status !== 'completed' && (
                    <TouchableOpacity
                      className="bg-green-600 rounded px-3 py-1"
                      onPress={(e) => {
                        e.stopPropagation();
                        handleComplete(task.id);
                      }}
                    >
                      <Text className="text-white text-xs">Complete</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    className="bg-red-600 rounded px-3 py-1"
                    onPress={(e) => {
                      e.stopPropagation();
                      handleDelete(task.id);
                    }}
                  >
                    <Text className="text-white text-xs">Delete</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
