<template>
  <main class="contact" @click="sidebarOpen ? closeSidebar($event) : null">
    <Sidebar ref="sidebar" @sidebarToggled="sidebarToggled" />
    <header class="header">
      <h1 class="text">Contact</h1>
    </header>
  </main>
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

<style lang="scss" scoped>
.contact {
  font-size: 12px;
  position: relative;
  z-index: 1;
  display: flex;
  height: 100vh;
  width: 100vw;
  background: $primary-white;

  .header {
    display: flex;
    width: 100%;

    .text {
      font-family: $primary-font-stack;
      font-weight: 400;
      letter-spacing: 0.09ch;
      margin: 1.25rem 2.25rem;
      color: $primary-dark;
      font-size: 4em;
    }
  }
}
</style>