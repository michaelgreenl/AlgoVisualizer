import { defineStore } from 'pinia';

/**
 * Default "app" store.
 * "persist: true" is a pinia-plugin-persistedstate setting to persist data between sessions into localStorage.
 * View the documentation for more advanced setup: https://www.npmjs.com/package/pinia-plugin-persistedstate
 */
export default defineStore({
  id: 'app',
  persist: true,
  state: () => ({
    test: false,
  }),
  getters: {},
  actions: {},
});
