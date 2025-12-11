import { View, Text, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useTasksStore } from '../../stores/tasks';
import { useAuthStore } from '../../stores/auth';

export default function DashboardScreen() {
  const router = useRouter();
  const { tasks, loading, fetchTasks } = useTasksStore();
  const { user } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  };

  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const activeTasks = tasks.filter(t => ['accepted', 'in_progress'].includes(t.status));
  const completedTasks = tasks.filter(t => t.status === 'completed');

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View className="p-4">
        <Text className="text-2xl font-bold mb-2">Welcome, {user?.name || 'User'}!</Text>
        <Text className="text-gray-600 mb-6">Here's your task overview</Text>

        <View className="flex-row justify-between mb-6">
          <View className="flex-1 bg-white rounded-lg p-4 mr-2 shadow-sm">
            <Text className="text-gray-600 text-sm mb-1">Pending</Text>
            <Text className="text-3xl font-bold text-yellow-600">{pendingTasks.length}</Text>
          </View>
          <View className="flex-1 bg-white rounded-lg p-4 mx-1 shadow-sm">
            <Text className="text-gray-600 text-sm mb-1">Active</Text>
            <Text className="text-3xl font-bold text-blue-600">{activeTasks.length}</Text>
          </View>
          <View className="flex-1 bg-white rounded-lg p-4 ml-2 shadow-sm">
            <Text className="text-gray-600 text-sm mb-1">Completed</Text>
            <Text className="text-3xl font-bold text-green-600">{completedTasks.length}</Text>
          </View>
        </View>

        <TouchableOpacity
          className="bg-blue-600 rounded-lg p-4 mb-4 shadow-sm"
          onPress={() => router.push('/tasks/new')}
        >
          <Text className="text-white text-center font-semibold text-lg">+ Create New Task</Text>
        </TouchableOpacity>

        <View className="bg-white rounded-lg p-4 shadow-sm">
          <Text className="text-lg font-semibold mb-4">Recent Tasks</Text>
          {loading && tasks.length === 0 ? (
            <ActivityIndicator size="small" color="#2563eb" />
          ) : tasks.length === 0 ? (
            <View className="py-12 items-center">
              <Text className="text-4xl mb-4">📋</Text>
              <Text className="text-lg font-semibold text-gray-700 mb-2">No tasks yet</Text>
              <Text className="text-gray-500 text-center mb-4">Create your first task to get started</Text>
              <TouchableOpacity
                className="bg-blue-600 rounded-lg px-6 py-3"
                onPress={() => router.push('/tasks/new')}
              >
                <Text className="text-white font-semibold">Create Task</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="space-y-2">
              {tasks.slice(0, 5).map((task) => (
                <TouchableOpacity
                  key={task.id}
                  onPress={() => router.push(`/tasks/${task.id}`)}
                  className="border-b border-gray-200 pb-2 mb-2"
                >
                  <Text className="font-medium text-gray-900">{task.title}</Text>
                  <View className="flex-row items-center mt-1">
                    <Text
                      className={`text-xs px-2 py-1 rounded ${
                        task.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : task.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {task.status}
                    </Text>
                    <Text className="text-xs text-gray-500 ml-2">
                      {new Date(task.created_at).toLocaleDateString()}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
