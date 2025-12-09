import { View, Text } from 'react-native';

export default function TasksScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-2xl font-bold">Tasks</Text>
      <Text className="text-gray-500 mt-2">Your tasks will appear here</Text>
    </View>
  );
}
