<template>
  <div class="binary-search-tree">
    <VisualizerDSA title="Binary Search Tree" :settings="settings" />
  </div>
</template>

<script setup>
import { reactive } from 'vue';

const settings = reactive([
  { label: 'speed', input: 'slider', default: '50%' }
]);
</script>

<style lang="scss" scoped>
.binary-search-tree {
  height: 100%;
  width: 100%;
}
</style>