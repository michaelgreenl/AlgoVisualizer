<template>
  <div ref="sidebar" class="sidebar">
    <div class="sidebar-nav">
      <LogoIcon />
      <NavItem
        ref="algoNavItem"
        class="nav-item"
        tooltip="Algorithms"
        :sidebarOpened="opened"
        :itemToggled="openSidebars.algorithms"
        @click="toggleSidebar('algorithms')"
      >
        <template #icon>
          <AlgorithmsIcon class="icon" />
        </template>
      </NavItem>
      <NavItem
        ref="optionsNavItem"
        class="nav-item"
        tooltip="Options"
        :sidebarOpened="opened"
        :itemToggled="openSidebars.options"
        @click="toggleSidebar('options')"
      >
        <template #icon>
          <OptionsIcon class="icon" />
        </template>
      </NavItem>
      <NavItem class="nav-item" tooltip="Contact" :sidebarOpened="opened">
        <template #icon>
          <ContactIcon class="icon" />
        </template>
      </NavItem>
    </div>
    <AlgorithmsSidebar ref="algoSidebar" :open="openSidebars.algorithms" class="sidebar-open" />
    <OptionsSidebar ref="optionsSidebar" :open="openSidebars.options" class="sidebar-open" />
  </div>
</template>

<script setup>
import LogoIcon from '../assets/svgs/logo.svg';
import AlgorithmsIcon from '../assets/svgs/algorithms.svg';
import OptionsIcon from '../assets/svgs/options.svg';
import ContactIcon from '../assets/svgs/contact.svg';

import { ref, reactive } from 'vue';

const emit = defineEmits(['sidebarToggled']);

const sidebar = ref(null);
let opened = ref(false);

/*
  Object with booleans to know if an sidebar component is open. These values are used as props to open and close 
  the sidebars and also to disable the tooltip for their relative NavItem.
*/
let openSidebars = reactive({
  algorithms: false,
  options: false,
});

const toggleSidebar = (sidebar) => {
  Object.keys(openSidebars).forEach((key) => {
    if (key !== sidebar) {
      openSidebars[key] = false;
    }
  });
  openSidebars[sidebar] = !openSidebars[sidebar];
  opened.value = openSidebars[sidebar];
  emit('sidebarToggled', { sidebar });
};

defineExpose({ sidebar, opened, openSidebars });
</script>

<style lang="scss" scoped>
.sidebar {
  position: absolute;
  left: 0;
  font-size: 12px;
  height: 100%;

  .sidebar-nav {
    position: relative;
    z-index: 1000;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2.5em;
    height: 100%;
    width: 5.33em;
    padding: 1.75em 0;
    background: $secondary-white;
    box-shadow: 3px 0 6px rgba(0, 0, 0, 0.1);

    .nav-item:last-child {
      margin-top: auto;
    }
  }

  .sidebar-open {
    position: absolute;
    z-index: 999;
    height: 100%;
    background-color: $primary-white;
    box-shadow: 3px 0 6px rgba(0, 0, 0, 0.1);
  }
}
</style>
