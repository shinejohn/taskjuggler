import { Tabs } from 'expo-router';
import { useInboxStore } from '../../stores/inbox';
import { useTasksStore } from '../../stores/tasks';
import { useEffect } from 'react';
import { Home, CheckSquare, Inbox, Settings } from 'lucide-react-native';

export default function TabLayout() {
  const { inboxItems, fetchInboxItems } = useInboxStore();
  const { tasks, fetchTasks } = useTasksStore();

  useEffect(() => {
    fetchInboxItems();
    fetchTasks();
  }, []);

  const unprocessedCount = inboxItems.filter(
    (item) => item.status === 'unprocessed'
  ).length;
  const pendingTasksCount = tasks.filter(
    (task) => task.status === 'pending'
  ).length;

  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tasks',
          tabBarBadge:
            pendingTasksCount > 0
              ? pendingTasksCount > 9
                ? '9+'
                : pendingTasksCount
              : undefined,
          tabBarIcon: ({ color, size }) => (
            <CheckSquare color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          title: 'Inbox',
          tabBarBadge:
            unprocessedCount > 0
              ? unprocessedCount > 9
                ? '9+'
                : unprocessedCount
              : undefined,
          tabBarIcon: ({ color, size }) => (
            <Inbox color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Settings color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
