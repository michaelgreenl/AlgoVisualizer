<template>
  <div class="avl-tree">
    <VisualizerDSA title="AVL Tree" :settings="settings" />
  </div>
</template>

<script setup>
import { reactive } from 'vue';

const settings = reactive([
  { label: 'speed', input: 'slider', default: '50%' }
]);
</script>

<style lang="scss" scoped>
.avl-tree {
  height: 100%;
  width: 100%;
}
</style>