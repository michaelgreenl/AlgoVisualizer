import { defineStore } from 'pinia';

export default defineStore({
  id: 'app',
  persist: true,
  state: () => ({
    test: false,
  }),
  getters: {},
  actions: {},
});
