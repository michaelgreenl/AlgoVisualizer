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
  color: var(--text-explanation);
  background: var(--bg-secondary);
  max-height: 85vh;
  overflow-y: auto;
  padding: 0.5em;
  border-radius: 10px;
  box-shadow: 0 2px 8px var(--shadow-color);
}

.no-explanations-msg {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 8em;
  color: var(--text-muted);
  font-size: 1.1em;
  font-weight: 400;
  letter-spacing: 0.02em;
}

.explanation-list {
  display: flex;
  flex-direction: column;
  gap: 0.25em;
  padding: 0.75em;
  margin: 0 0 0.5em 0;
  background: transparent;
  border-radius: 7px;
  box-shadow: none;
  text-decoration: none;
  list-style: none;
  transition: background 0.15s;

  &.active {
    background: var(--primary-light-grey);
    box-shadow: 0 1px 4px var(--shadow-color);
  }

  .list-header {
    margin: 0 0 0.5em 0;
    font-size: 1.05em;
    font-weight: 500;
    color: var(--text-primary);
    letter-spacing: 0.01em;
    border-left: 3px solid $primary-dark;
    padding-left: 0.5em;
  }
}

.explanation-item {
  margin-bottom: 0.15em;
  border-radius: 6px;
  transition: background 0.12s, color 0.12s;

  &.active {
    background: $primary-dark;
    button {
      color: #f8f8f8;
      font-weight: 600;
    }
  }

  button {
    width: 100%;
    text-align: left;
    padding: 0.5em 0.75em;
    font-family: $secondary-font-stack;
    font-size: 1em;
    font-weight: 400;
    color: var(--text-explanation);
    background: transparent;
    border: none;
    border-radius: 6px;
    outline: none;
    transition: background 0.12s, color 0.12s;
    cursor: pointer;

    &:hover {
      background: var(--primary-dark);
      color: #f8f8f8;
      font-weight: 600;
    }

    &:focus-visible {
      outline: 2px solid $primary-dark;
      outline-offset: 1px;
    }

    &:active {
      background: $primary-dark;
    }
  }
}

@media (max-width: 768px) {
  .explanation-container {
    padding: 0.5em 0.2em;
    font-size: 0.98em;
  }

  .explanation-list {
    padding: 0.5em 0.2em 0.5em 0.7em;
  }
}
</style>
