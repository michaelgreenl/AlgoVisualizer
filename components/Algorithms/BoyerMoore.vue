<template>
  <div class="boyer-moore">
    <VisualizerDSA title="Boyer-Moore" :settings="settings" />
  </div>
</template>

<script setup>
import { reactive } from 'vue';

const settings = reactive([
  { label: 'speed', input: 'slider', default: '50%' }
]);
</script>

<style lang="scss" scoped>
.boyer-moore {
  height: 100%;
  width: 100%;
}
</style>