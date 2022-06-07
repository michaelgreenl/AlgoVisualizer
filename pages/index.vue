<template>
  <main ref="index" class="index" @click="sidebarOpen ? closeSidebar($event) : null">
    <Sidebar ref="sidebar" @sidebarToggled="sidebarToggled" />
    <component v-if="selectedVisualizer" :is="visualizerComp" />
  </main>
</template>

<script setup>
import { shallowRef } from '@vue/reactivity';
import { ref, defineAsyncComponent, watch } from 'vue';

const selectedVisualizer = useSelectedVisualizer();
const visualizerComp = shallowRef();
const sidebar = ref(null);
const sidebarOpen = ref(false);
const openedSidebar = ref();

// Setting the Visualizer component and closing the sidebar every time a new Visualizer is selected
watch(selectedVisualizer, (currVal) => {
  visualizerComp.value = defineAsyncComponent(() =>
    import(`../components/${openedSidebar.value}/${currVal.replaceAll(/[\s\-*\']/g, '')}.vue`),
  );
  closeSidebar(true);
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
