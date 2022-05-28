<template>
  <div class="insertion-sort">
    <VisualizerDSA :options="options" />
  </div>  
</template>

<script setup>
import { reactive } from 'vue';

const options = reactive([
  { label: 'speed', input: 'slider', default: '50%' }
]);
</script>

<style lang="scss" scoped></style>