<template>
  <div class="explanation-container">
    <div v-if="!Object.keys(props.explanations).length" class="no-explanations-msg">
      <p>Explanations will appear here once you click play.</p>
    </div>
    <ul v-else v-for="(step, i) in explanations" :key="i" class="explanation-list">
      <p>Step: {{ i }}</p>
      <li v-for="(text, j) in step" :key="j">
        <button @click="timeline.goto(`${i}.${j + 1}`)">j: {{ text }}</button>
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
}

.no-explanations-msg {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-text);
}

.visualizer-explanation {
  display: flex;
  flex-direction: column;
  gap: 1.5em;
  padding: 0;
  margin: 0;
  text-decoration: none;
  list-style: none;
  max-height: 60vh;
  overflow-y: auto;
}

.explanation-step-group {
  margin-bottom: 0.5em;
}

.step-label {
  font-weight: 600;
  cursor: pointer;
  padding: 0.5em 1em;
  border-radius: 6px;
  background: #f7f6ed;
  margin-bottom: 0.25em;
  transition: background 0.15s;

  &:hover,
  &:focus {
    background: #f5f5e6;
  }
}

.active-step > .step-label {
  background: #e6e2c7;
  color: #2d2d2d;
}

.step-explanations {
  list-style: none;
  padding-left: 1.5em;
  margin: 0;
}

.explanation-item {
  padding: 0.5em 1em;
  border-radius: 6px;
  margin-bottom: 0.25em;
}
</style>
