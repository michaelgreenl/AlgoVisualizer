<template>
  <transition name="fade" appear>
    <div ref="tooltipDiv" class="tooltip" @mouseenter="mouseEntered = false" v-show="mouseEntered && !itemToggled">
      <PolygonTT class="polygon" />
      <span class="tooltip-text">
        {{ tooltip }}
      </span>
    </div>
  </transition>
</template>

<script setup>
import PolygonTT from '../assets/svgs/polygon.svg';

import { ref, onMounted } from 'vue';

const props = defineProps({
  tooltip: {
    type: String,
    default: '',
  },
  itemToggled: {
    type: Boolean,
    default: false,
  },
});

const tooltipDiv = ref();
const mouseEntered = ref(false);

onMounted(() => {
  tooltipDiv.value.parentNode.addEventListener('mouseenter', () => {
    mouseEntered.value = true;
  });
  tooltipDiv.value.parentNode.addEventListener('mouseleave', () => {
    mouseEntered.value = false;
  });
});

defineExpose({ mouseEntered });
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
}
</style>
