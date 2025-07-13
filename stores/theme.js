import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useThemeStore = defineStore(
  'theme',
  () => {
    const theme = ref('light');

    const toggleTheme = () => {
      if (theme.value === 'system') {
        theme.value = isDarkMode.value ? 'light' : 'dark';
      } else {
        theme.value = theme.value === 'light' ? 'dark' : 'light';
      }
      document.documentElement.setAttribute('data-theme', theme.value);
    };

    return {
      theme,
      toggleTheme,
    };
  },
  {
    persist: true,
  },
);
