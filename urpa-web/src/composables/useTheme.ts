import { ref, computed } from 'vue';

const theme = ref<'light' | 'dark'>('dark');

export function useTheme() {
  const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark', theme.value === 'dark');
  };

  const setTheme = (newTheme: 'light' | 'dark') => {
    theme.value = newTheme;
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return {
    theme: computed(() => theme.value),
    toggleTheme,
    setTheme,
  };
}

