<template>
  <div class="visualizer">
    <h1>{{ options }}</h1>
  </div>
</template>

<script setup>
const props = defineProps({
  options: {
    type: Object,
    required: true,
  },
});
</script>

<style lang="scss" scoped>

</style>