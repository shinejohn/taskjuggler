import { Tabs } from 'expo-router';
import { Text, View } from 'react-native';
import { useInboxStore } from '../../stores/inbox';
import { useTasksStore } from '../../stores/tasks';
import { useEffect } from 'react';

export default function TabLayout() {
  const { inboxItems, fetchInboxItems } = useInboxStore();
  const { tasks, fetchTasks } = useTasksStore();

  useEffect(() => {
    fetchInboxItems();
    fetchTasks();
  }, []);

  const unprocessedCount = inboxItems.filter(item => item.status === 'unprocessed').length;
  const pendingTasksCount = tasks.filter(task => task.status === 'pending').length;

  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: () => <Text>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tasks',
          tabBarBadge: pendingTasksCount > 0 ? (pendingTasksCount > 9 ? '9+' : pendingTasksCount) : undefined,
          tabBarIcon: () => <Text>✓</Text>,
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          title: 'Inbox',
          tabBarBadge: unprocessedCount > 0 ? (unprocessedCount > 9 ? '9+' : unprocessedCount) : undefined,
          tabBarIcon: () => <Text>📥</Text>,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: () => <Text>⚙️</Text>,
        }}
      />
    </Tabs>
  );
}
