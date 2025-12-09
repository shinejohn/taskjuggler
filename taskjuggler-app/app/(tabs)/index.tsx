import { View, Text } from 'react-native';

export default function DashboardScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-2xl font-bold">Dashboard</Text>
      <Text className="text-gray-500 mt-2">Task Juggler Mobile App</Text>
    </View>
  );
}
