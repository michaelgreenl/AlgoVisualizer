<template>
  <div class="horspool">
    <VisualizerDSA title="Horspool" :settings="settings" />
  </div>
</template>

<script setup>
import { reactive } from 'vue';

const settings = reactive([
  { label: 'speed', input: 'slider', default: '50%' }
]);
</script>

<style lang="scss" scoped>
.horspool {
  height: 100%;
  width: 100%;
}
</style>