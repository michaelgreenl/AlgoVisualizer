<template>
  <div class="explanation-container">
    <div v-if="!Object.keys(props.explanations).length" class="no-explanations-msg">
      <p>Explanations will appear here once you click play.</p>
    </div>
    <ul
      v-else
      v-for="(step, i) in explanations"
      :key="i"
      class="explanation-list"
      :class="{ active: timeline.currStep === parseInt(i, 10) }"
    >
      <p class="list-header">Step: {{ i }}</p>
      <li
        v-for="(text, j) in step"
        :key="j"
        class="explanation-item"
        :class="{ active: timeline.currExplanation === `${i}.${j + 1}` }"
      >
        <button @click="timeline.goto(`${i}.${j + 1}`)">{{ text }}</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { timelineStore } from '../stores/timeline.js';

const props = defineProps({
  explanations: {
    type: Object,
    required: true,
  },
});

const timeline = timelineStore();
</script>

<style lang="scss" scoped>
.explanation-container {
  font-family: $secondary-font-stack;
  max-height: 85vh;
  overflow-y: scroll;
}

.no-explanations-msg {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-text);
}

.explanation-list {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 0;
  margin: 0;
  text-decoration: none;
  list-style: none;

  &.active {
    background: $primary-grey;
  }
}

.explanation-item {
  &.active {
    background: red;
  }
}
</style>
