import { ref, computed, watch } from 'vue';

const savedTheme = localStorage.getItem('urpa_theme') as 'light' | 'dark' | null;
const theme = ref<'light' | 'dark'>(savedTheme || 'dark');

// Initialize class on load
if (typeof document !== 'undefined') {
  document.documentElement.classList.toggle('dark', theme.value === 'dark');
}

watch(theme, (newTheme) => {
  localStorage.setItem('urpa_theme', newTheme);
  document.documentElement.classList.toggle('dark', newTheme === 'dark');
});

export function useTheme() {
  const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark';
  };

  const setTheme = (newTheme: 'light' | 'dark') => {
    theme.value = newTheme;
  };

  return {
    theme: computed(() => theme.value),
    toggleTheme,
    setTheme,
  };
}

