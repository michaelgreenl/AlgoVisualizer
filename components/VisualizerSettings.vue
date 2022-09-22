<template>
  <ul class="settings">
    <li class="input" v-for="(input, key) in visualizerSettings.settings" :key="input">
      <label class="label" :for="input.label">{{ input.label }}:</label>
      <div v-if="input.type === 'radio'" class="radio">
        <div class="radio-input" v-for="option in input.options" :key="option">
          <input
            :class="input.type"
            :type="input.type"
            :name="option"
            :value="option"
            :checked="
              timeline.currStep > 0 && input.requiresRestart
                ? visualizerSettings.localState[`${key}`].state === option
                : input.state === option
            "
            @input="visualizerSettings.onInput(key, input.requiresRestart, $event.target.value)"
          />
          <label class="label" :for="option">{{ option }}</label>
        </div>
      </div>
      <input
        v-else-if="input.type === 'range'"
        :class="input.type"
        :type="input.type"
        :name="input.label"
        :min="input.min"
        :max="input.max"
        :value="
          timeline.currStep > 0 && input.requiresRestart ? visualizerSettings.localState[`${key}`].state : input.state
        "
        @input="visualizerSettings.onInput(key, input.requiresRestart, parseInt($event.target.value, 10))"
      />
      <input
        v-else-if="input.type === 'number'"
        :class="input.type"
        :type="input.type"
        :name="input.label"
        :min="input.min"
        :max="input.max"
        :value="
          timeline.currStep > 0 && input.requiresRestart ? visualizerSettings.localState[`${key}`].state : input.state
        "
        @input="visualizerSettings.onInput(key, input.requiresRestart, parseInt($event.target.value, 10))"
      />
      <input
        v-else-if="input.type === 'checkbox'"
        :class="input.type"
        :type="input.type"
        :name="input.label"
        :true-value="input.trueValue"
        :false-value="input.falseValue"
        :checked="
          timeline.currStep > 0 && input.requiresRestart ? visualizerSettings.localState[`${key}`].state : input.state
        "
        @input="visualizerSettings.onInput(key, input.requiresRestart, $event.target.checked)"
      />
    </li>
    <li class="input">
      <transition name="" appear>
        <button class="settings-buttons" @click="visualizerSettings.reset()" v-show="visualizerSettings.enableReset">
          Reset
        </button>
      </transition>
      <transition name="" appear>
        <button
          class="settings-buttons"
          @click="emit('restart')"
          v-show="timeline.currStep > 0 && visualizerSettings.enableRestart"
        >
          Restart
        </button>
      </transition>
    </li>
  </ul>
</template>

<script setup>
import { onBeforeMount } from 'vue';
import isEqual from 'lodash.isequal';
import { timelineStore } from '../stores/timeline';
import { visualizerSettingsStore } from '../stores/visualizerSettings';

const emit = defineEmits(['restart']);

const visualizerSettings = visualizerSettingsStore();
const timeline = timelineStore();

onBeforeMount(() => {
  visualizerSettings.selected = { ...JSON.parse(JSON.stringify(visualizerSettings.settings)) };
  visualizerSettings.localState = { ...JSON.parse(JSON.stringify(visualizerSettings.settings)) };
});
</script>

<style lang="scss" scoped>
.settings {
  display: flex;
  flex-direction: column;
  gap: 1em;
  list-style: none;
  text-decoration: none;
  padding: 0;
  margin: 0;

  .input {
    display: flex;
    align-items: center;
    gap: 1em;

    .label {
      font-family: $secondary-font-stack;
      font-weight: 400;
      font-size: 15px;
      color: $primary-black;
    }

    .number {
      background: transparent;
      border: 0;
      border-bottom: solid $primary-dark 2px;
      text-align: center;
      font-family: $secondary-font-stack;
      font-weight: 400;
      font-size: 15px;
      color: $primary-black;

      &::-webkit-inner-spin-button,
      &::-webkit-outer-spin-button {
        opacity: 1;
      }

      &:focus {
        outline: none;
      }
    }

    .radio {
      display: flex;
      align-items: center;

      .radio-input {
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
