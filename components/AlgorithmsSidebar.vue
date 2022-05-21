<template>
  <div class="algo-sidebar" :class="{ open: open }">
    <h1>Algorithms</h1>
  </div>
</template>

<script setup>
const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  }
});
</script>

<style lang="scss" scoped>
.algo-sidebar {
  font-size: inherit;
  position: absolute;
  top: 0;
  left: -11em;
  width: 15.42em;
  transition: transform 150ms ease-in-out;

  &.open {
    transform: translateX(16.42em);
  }
}
</style>
