<template>
  <div>
    <NuxtLayout>
      <main class="app" @click="sidebarOpen ? closeSidebar($event) : null">
        <Sidebar ref="sidebar" @sidebarToggled="sidebarToggled" />
        <NuxtPage />
      </main>
    </NuxtLayout>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const sidebar = ref(null);
const sidebarOpen = ref(false);
const openedSidebar = ref();

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

html,
body {
  height: 100% !important;
  margin: 0;
  padding: 0;
}

#__nuxt {
  min-height: 100% !important;
  background: $primary-white;
}

.app {
  font-size: 12px;
  position: relative;
  z-index: 1;
  display: flex;
  height: 100vh;
  width: 100vw;
  background: $primary-white;
}
</style>
