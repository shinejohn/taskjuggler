import { Tabs } from 'expo-router';
import { useInboxStore } from '../../stores/inbox';
import { useTasksStore } from '../../stores/tasks';
import { useModulesStore } from '../../stores/modules';
import { useAuthStore } from '../../stores/auth';
import { useEffect } from 'react';
import { Home, CheckSquare, Inbox, Settings } from 'lucide-react-native';

export default function TabLayout() {
  const { inboxItems, fetchInboxItems } = useInboxStore();
  const { tasks, fetchTasks } = useTasksStore();
  const { setEnabledModuleIds } = useModulesStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchInboxItems();
    fetchTasks();
  }, []);

  useEffect(() => {
    const ids = user?.enabled_modules;
    if (ids?.length) {
      setEnabledModuleIds(ids);
    }
  }, [user?.enabled_modules]);

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
