<template>
  <button
    class="nav-item"
    :class="{ greyscale: sidebarOpened && !itemToggled }"
    @mouseenter="mouseEntered = true"
    @mouseleave="mouseEntered = false"
  >
    <slot name="icon" class="nav-icon"></slot>
    <transition name="fade" appear>
      <div class="tooltip" :class="{ hidden: itemToggled }" @mouseenter="mouseEntered = false" v-if="mouseEntered && !itemToggled">
        <PolygonTT class="polygon" />
        <span class="tooltip-text">
          {{ tooltip }}
        </span>
      </div>
    </transition>
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
  },
});

const mouseEntered = ref(false);
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

  .fade-enter-active {
    transition: all 100ms ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .tooltip {
    position: absolute;
    top: 2px;
    left: 64px;
    display: flex;
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
      height: 12px;
      width: 6px;
    }

    .tooltip-text {
      font-size: 14px;
      font-family: $secondary-font-stack;
      font-weight: 400;
      color: $primary-white;
      white-space: nowrap;
    }
  }

  // &:hover {
  //   .tooltip {
  //     opacity: 1;
  //   }
  // }
}
</style>
