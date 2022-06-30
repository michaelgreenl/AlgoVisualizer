<template>
  <main ref="visualizer" class="visualizer" @click="sidebarOpen ? closeSidebar($event) : null">
    <Sidebar ref="sidebar" @sidebarToggled="sidebarToggled" />
    <component :is="visualizerComp" />
  </main>
</template>

<script setup>
import { shallowRef, ref, onMounted } from 'vue';

const route = useRoute();
const visualizerComp = shallowRef(
  defineAsyncComponent(() => import(`../components/${route.params.category}/${route.params.visualizer}.vue`)),
);

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
.visualizer {
  font-size: 12px;
  position: relative;
  z-index: 1;
  display: flex;
  height: 100vh;
  width: 100vw;
  background: $primary-white;
}
</style>
