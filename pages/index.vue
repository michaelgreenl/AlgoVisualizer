<template>
  <div ref="index" class="index" @click="sidebarOpen ? closeSidebar($event) : null">
    <Sidebar ref="sidebar" @sidebarToggled="sidebarToggled" />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const sidebar = ref(null);
let sidebarOpen = ref(false);
let openedSidebar = ref();

function closeSidebar($event) {
  if (!sidebar.value.sidebar.contains($event.target)) {
    sidebar.value.openSidebars[openedSidebar.value] = false;
    sidebar.value.opened = false;
    sidebarOpen.value = false;
  }
}

function sidebarToggled(currSidebar) {
  if (sidebar.value.opened) {
    sidebarOpen.value = true;
    openedSidebar.value = Object.values(currSidebar)[0];
  } else {
    sidebarOpen.value = false;
  }
}
</script>

<style lang="scss" scoped>
.index {
  font-size: 12px;
  position: relative;
  z-index: 1;
  display: flex;
  height: 100vh;
  width: 100vw;
  background: $primary-white;
}
</style>
