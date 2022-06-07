<template>
  <div class="insertion-sort">
    <VisualizerDSA title="Insertion Sort" :settings="settings">
      <template #visual></template>
      <template #explanation></template>
      <template #description></template>
    </VisualizerDSA>
  </div>
</template>

<script setup>
import { reactive } from 'vue';

const settings = reactive({
  visual: { label: 'Visual', type: 'radio', options: ['Array', 'Bar Graph'], value: 'Array' },
  speed: { label: 'Speed', type: 'range', min: 250, max: 750, value: 500 },
  arraySize: {
    label: 'Array Size',
    type: 'number',
    min: 8,
    get max() {
      return settings.visual.value === 'Array' ? 20 : 200;
    },
    value: 8,
  },
  elementType: { label: 'Element Type', type: 'radio', options: ['Range', 'Random'], value: 'Range' },
  instructions: { label: 'Instructions', type: 'checkbox', value: true },
});
</script>

<style lang="scss" scoped>
.insertion-sort {
  font-size: 12px;
  height: 100%;
  width: 100%;
}
</style>
