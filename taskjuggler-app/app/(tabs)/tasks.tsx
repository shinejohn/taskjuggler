import { View, Text, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useTasksStore } from '../../stores/tasks';

export default function TasksScreen() {
  const router = useRouter();
  const { tasks, loading, fetchTasks, completeTask, deleteTask } = useTasksStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  };

  const handleComplete = async (id: string) => {
    try {
      await completeTask(id);
      Alert.alert('Success', 'Task completed!');
    } catch (error) {
      Alert.alert('Error', 'Failed to complete task');
    }
  };

  const handleDelete = (id: string) => {
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

        {loading && tasks.length === 0 ? (
          <View className="py-8">
            <ActivityIndicator size="large" color="#2563eb" />
          </View>
        ) : tasks.length === 0 ? (
          <View className="py-8">
            <Text className="text-gray-500 text-center">No tasks yet</Text>
          </View>
        ) : (
          <View className="space-y-3">
            {tasks.map((task) => (
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
