<template>
  <button class="nav-item" :class="{ greyscale: sidebarOpened && !itemToggled }">
    <slot name="icon" class="nav-icon"></slot>
    <div class="tooltip" :class="{ hidden: itemToggled }">
      <PolygonTT class="polygon" />
      <span class="tooltip-text">
        {{ tooltip }}
      </span>
    </div>
  </button>
</template>

<script setup>
import PolygonTT from '../assets/svgs/polygon.svg';

const props = defineProps({
  tooltip: {
    type: String,
    required: true,
  },
  sidebarOpened: {
    type: Boolean,
    required: true,
  },
  itemToggled: {
    type: Boolean,
    default: false,
  }
});
</script>

<style lang="scss" scoped>
.nav-item {
  border: 0;
  background: transparent;
  padding: 0;
  font-size: inherit;
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;

  &.greyscale { 
    filter: grayscale(0.8);
  }

  .tooltip {
    position: absolute;
    top: 2px;
    left: 64px;
    display: none;
    align-items: center;
    height: 24px;
    padding: 12px;
    border-radius: 7px;
    background: $primary-black;

    &.hidden {
      visibility: hidden;
    }

    .polygon {
      position: absolute;
      top: 6px;
      left: -4px;
    }

    .tooltip-text {
      font-size: 14px;
      font-family: $secondary-font-stack;
      font-weight: 400;
      color: $primary-white;
      white-space: nowrap;
    }
  }

  &:hover {
    .tooltip {
      display: flex;
    }
  }
}
</style>
