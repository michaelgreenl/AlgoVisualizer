<template>
  <component :is="visualizerComp" />
</template>

<script setup>
import { shallowRef } from 'vue';

const route = useRoute();
const visualizerComp = shallowRef(
  defineAsyncComponent(() => import(`../components/${route.params.category}/${route.params.visualizer}.vue`)),
);
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
