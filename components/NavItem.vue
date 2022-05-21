<template>
  <button class="nav-item" :class="{ greyscale: sidebarOpened && !itemToggled }" :disabled="disabled">
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

import { ref } from 'vue';

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

let disabled = ref(false);

defineExpose({ disabled });
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

  &:disabled,
  &.greyscale { 
      filter: grayscale(0.8);
  }

  .tooltip {
    display: none;
    align-items: center;
    position: absolute;
    background: $primary-black;
    border-radius: 7px;
    height: 24px;
    padding: 12px;
    top: 2px;
    left: 64px;

    &.hidden {
      visibility: hidden;
    }

    .polygon {
      position: absolute;
      top: 6px;
      left: -4px;
    }

    .tooltip-text {
      color: $primary-white;
      font-family: $secondary-font-stack;
      font-weight: 400;
      font-size: 14px;
    }
  }

  &:hover {
    .tooltip {
      display: flex;
    }
  }
}
</style>
