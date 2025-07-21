<template>
  <div>
    <NuxtLayout>
      <main class="app" @click="sidebarOpen ? closeSidebar($event) : null">
        <Sidebar ref="sidebar" @sidebartoggled="sidebarToggled" />
        <NuxtPage />
      </main>
    </NuxtLayout>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useThemeStore } from './stores/theme.js';

const themeStore = useThemeStore();
const router = useRouter();

const sidebar = ref();
const sidebarOpen = ref(false);
const openedSidebar = ref();

onMounted(() => {
  themeStore.toggleTheme();

  router.afterEach(() => {
    nextTick(() => {
      sidebar.value.toggleSidebar(openedSidebar.value);
    });
  });
});

// Closing Sidebar if click event was fired on the index element.
function closeSidebar($event, forceClose) {
  if (!sidebar.value.sidebar.contains($event.target) || forceClose) {
    sidebar.value.toggleSidebar(openedSidebar.value);
  }
}

/*
  Emitted function when NavItem is clicked in Sidebar. Enabling the click event listener if the sidebar is open, disabling it if
  it was closed by the user clicking a NavItem.
*/
function sidebarToggled(currSidebar) {
  if (sidebar.value.opened) {
    sidebarOpen.value = true;
    openedSidebar.value = Object.values(currSidebar)[0];
  } else {
    sidebarOpen.value = false;
  }
}
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}

/* stylelint-disable selector-max-type */
html,
body {
  height: 100% !important;
  padding: 0;
  margin: 0;
}

/* stylelint-disable-next-line selector-id-pattern */
#__nuxt {
  min-height: 100% !important;
  background: var(--bg-primary);
}

.app {
  position: relative;
  z-index: 1;
  display: flex;
  width: 100vw;
  height: 100vh;
  font-size: 12px;
  background: var(--bg-primary);
}
</style>
