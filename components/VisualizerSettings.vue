<template>
  <ul class="settings">
    <li
      v-for="(input, key) in visualizerSettings.settings"
      :ref="
        (el) => {
          settingsRefs.parents[`${key}`] = el;
        }
      "
      :key="input"
      class="input-wrapper"
    >
      <div class="setting-label">
        <label class="label label--setting" :for="input.label">{{ input.label }}</label>
      </div>
      <div v-if="input.type === 'radio'" class="input radio">
        <div v-for="option in input.options" :key="option" class="radio-input">
          <input
            :ref="
              (el) => {
                settingsRefs.inputs[`${key}`] = el;
              }
            "
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
        :ref="
          (el) => {
            settingsRefs.inputs[`${key}`] = el;
          }
        "
        class="input range"
        :class="input.type"
        :type="input.type"
        :name="input.label"
        :min="input.min"
        :max="input.max"
        :step="input.step"
        :value="
          timeline.currStep > 0 && input.requiresRestart ? visualizerSettings.localState[`${key}`].state : input.state
        "
        @input="visualizerSettings.onInput(key, input.requiresRestart, parseInt($event.target.value, 10))"
      />
      <div v-else-if="input.type === 'number'" class="input number">
        <button class="number-step number-step--down" @click="stepNumber(key, -1)">
          <Polygon class="number-step-svg" />
        </button>
        <input
          :ref="
            (el) => {
              settingsRefs.inputs[`${key}`] = el;
            }
          "
          class="number-input"
          :class="input.type"
          :type="input.type"
          :name="input.label"
          :min="input.min"
          :max="input.max"
          :value="
            timeline.currStep > 0 && input.requiresRestart ? visualizerSettings.localState[`${key}`].state : input.state
          "
          @input="
            !keydown ? visualizerSettings.onInput(key, input.requiresRestart, parseInt($event.target.value, 10)) : null
          "
          @keydown="onKeydown"
          @keyup="
            onKeyup(settingsRefs.inputs[`${key}`], input, [
              key,
              input.requiresRestart,
              parseInt($event.target.value, 10),
            ])
          "
        />
        <button class="number-step number-step--up" @click="stepNumber(key, 1)">
          <Polygon class="number-step-svg" />
        </button>
      </div>
      <div
        v-else-if="input.type === 'toggle'"
        class="input toggle"
        :class="
          timeline.currStep > 0 && input.requiresRestart
            ? visualizerSettings.localState[`${key}`].state
            : input.state
            ? 'toggle--on'
            : 'toggle--off'
        "
      >
        <span class="toggle-value toggle-value--false">{{ input.falseValue }}</span>
        <span class="toggle-value toggle-value--true">{{ input.trueValue }}</span>
        <input
          :ref="
            (el) => {
              settingsRefs.inputs[`${key}`] = el;
            }
          "
          class="toggle-checkbox"
          type="checkbox"
          :name="input.label"
          :false-value="input.falseValue"
          :true-value="input.trueValue"
          :data-before="input.falseValue"
          :data-after="input.trueValue"
          :checked="
            timeline.currStep > 0 && input.requiresRestart ? visualizerSettings.localState[`${key}`].state : input.state
          "
          @input="visualizerSettings.onInput(key, input.requiresRestart, $event.target.checked)"
        />
      </div>
    </li>
    <li class="settings-buttons">
      <transition-group name="settings-buttons" appear>
        <button v-for="button of activeButtons" :key="button.text" class="settings-button" @click="button.click">
          {{ button.text }}
        </button>
      </transition-group>
    </li>
  </ul>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
// import isEqual from 'lodash.isequal';
import { timelineStore } from '../stores/timeline';
import { visualizerSettingsStore } from '../stores/visualizerSettings';

import Polygon from '../assets/svgs/polygon.svg';

const emit = defineEmits(['restart']);

const visualizerSettings = visualizerSettingsStore();
const timeline = timelineStore();

const keydown = ref(false);
const settingsRefs = reactive({
  parents: {},
  inputs: {},
});

const activeButtons = computed(() => {
  const buttons = {
    reset: {
      active: hasSettingsChanges(),
      click: () => {
        visualizerSettings.reset();
      },
      text: 'Reset',
    },
    restart: {
      active: timeline.currStep > 0 && hasRestartChanges(),
      click: () => {
        emit('restart');
      },
      text: 'Restart',
    },
  };

  Object.keys(buttons).forEach((button) => {
    if (!buttons[`${button}`].active) {
      delete buttons[`${button}`];
    }
  });
  return buttons;
});

function onKeydown() {
  keydown.value = true;
  console.log('here');
}

function hasSettingsChanges() {
  // Check if any settings have changed from their initial state
  for (const key of Object.keys(visualizerSettings.settings)) {
    const setting = visualizerSettings.settings[key];
    const initialValue = visualizerSettings.initial[key]?.state;

    if (timeline.currStep > 0 && setting.requiresRestart) {
      // For settings that require restart during animation, check localState
      const currentValue = visualizerSettings.localState[key]?.state;
      if (currentValue !== initialValue) {
        return true;
      }
    } else {
      // For other settings, check the main settings state
      const currentValue = visualizerSettings.settings[key]?.state;
      if (currentValue !== initialValue) {
        return true;
      }
    }
  }
  return false;
}

function hasRestartChanges() {
  // Check if any settings with requiresRestart: true have been changed
  for (const key of Object.keys(visualizerSettings.settings)) {
    const setting = visualizerSettings.settings[key];
    if (setting.requiresRestart) {
      const localValue = visualizerSettings.localState[key]?.state;
      const selectedValue = visualizerSettings.selected[key]?.state;
      if (localValue !== selectedValue) {
        return true;
      }
    }
  }
  return false;
}

function stepNumber(key, direction) {
  const input = visualizerSettings.settings[key];
  const currentValue =
    timeline.currStep > 0 && input.requiresRestart ? visualizerSettings.localState[key].state : input.state;

  const newValue = currentValue + direction;

  // Check bounds
  if (newValue >= input.min && newValue <= input.max) {
    visualizerSettings.onInput(key, input.requiresRestart, newValue);
  }
}

function onKeyup(inputRef, setting, inputParams) {
  // dont need the old value cuz if the value is invalid and there needs to be a reset (on the invalid input field) the reset
  // function can just be called with a parameter(?) changing only that input back to it's local/current state.
  // since the actual state never changed and the old value can be gotten through there
  console.log(setting);
  if (setting.validateInput(parseInt(inputRef.value, 10))) {
    console.log('here');
    visualizerSettings.onInput(...inputParams);
    keydown.value = false;
  } else {
    console.log('here1');
    // enable invalid style
    // add reset button to input div
    // make sure reset/restart buttons acknoledge for this (state variable saying there is an current invalid input field?)
    // show error messege

    // TODO: subtle style if the input is still in focus (user is still typing), error message if input blurred
  }
}
</script>

<style lang="scss" scoped>
.settings {
  display: flex;
  flex-direction: column;
  gap: 1.5em;
  padding: 0;
  margin: 0;
  text-decoration: none;
  list-style: none;

  .settings-buttons-move,
  .settings-buttons-enter-active,
  .settings-buttons-leave-active {
    transition: all 150ms ease, opacity 200ms ease;
  }

  .settings-buttons-enter-from,
  .settings-buttons-leave-to {
    opacity: 0;
    transform: translateX(1.5em);
  }

  &-buttons {
    display: flex;
    gap: 1em;
    justify-content: flex-end;
    padding: 0.5em;
  }

  &-button {
    height: 1.9em;
    padding: 0.2em 1em;
    font-family: $secondary-font-stack;
    font-size: 1.375em;
    font-weight: 400;
    color: $primary-white;
    letter-spacing: 0.04em;
    cursor: pointer;
    background: $primary-darker-light;
    border: 0;
    border-radius: 11px;
    transition: background 75ms ease-in;

    &:hover {
      background: #cec8a6;
    }

    &:active {
      background: #c5bf9e;
    }
  }

  .input-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.6em;
    width: 65%;

    .setting-label {
      border-bottom: solid 1px $primary-light-grey;
    }

    .label {
      font-family: $secondary-font-stack;
      font-size: 1.25em;
      font-weight: 300;
      color: $primary-black;

      &--setting {
        font-size: 1.1em;
        color: $primary-light-dark;
      }
    }

    input {
      cursor: pointer;
    }

    .input {
      margin: 0 0.5em;
    }

    .radio {
      display: flex;
      gap: 1em;
      align-items: center;

      .radio-input {
        display: flex;
        gap: 0.5em;
        align-items: center;

        input[type='radio'] {
          width: 1.25em;
          height: 1.25em;
          margin: 0;
          background-color: $primary-white;
          border: solid 1px $primary-dark-grey;
          border-radius: 100%;
          appearance: none;

          &:checked {
            background-color: $primary-dark-grey;
            box-shadow: inset 0 0 0 2px $primary-white;
          }
        }
      }
    }

    .range {
      width: 80%;
      height: 0.5em;
      margin: 0.6em auto 0;
      background: $primary-light-grey;
      border-radius: 10px;
      appearance: none;

      &::-webkit-slider-thumb {
        width: 1em;
        height: 1em;
        cursor: grab;
        background: $primary-dark;
        border-radius: 50%;
        appearance: none;

        &:active {
          cursor: grabbing;
        }
      }
    }

    .number {
      display: flex;
      align-items: center;

      &-input {
        font-family: $secondary-font-stack;
        font-size: 16px;
        font-weight: 300;
        color: $primary-black;
        text-align: center;
        background: transparent;
        border: 0;

        &::-webkit-inner-spin-button,
        &::-webkit-outer-spin-button {
          appearance: none;
          margin: 0;
        }

        &:focus {
          outline: none;
        }
      }

      &-step {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 0.8em;
        height: 0.8em;
        padding: 0;
        cursor: pointer;
        background: transparent;
        border: 0;

        &-svg {
          width: 1em;
          height: 1em;
          fill: $primary-light-dark;
        }

        &--up {
          transform: rotate(180deg);
        }
      }
    }

    .toggle {
      position: relative;
      display: flex;
      gap: 0.05em;
      width: fit-content;
      height: 1.9em;
      padding: 0 0.1em;
      color: $primary-white;
      border-radius: 0.8em;

      &-value {
        position: relative;
        z-index: 1;
        padding: 0 0.55em;
        margin-top: 1px;
        margin-bottom: 1px;
        font-family: $secondary-font-stack;
        font-size: 15px;
        font-weight: 300;
        border-radius: 0.6em;

        &--true {
          background: $primary-light-dark;
        }

        &--false {
          background: $primary-dark-bright;
        }
      }

      &--on .toggle-value {
        &--false {
          background: transparent;
        }
      }

      &--off .toggle-value {
        &--true {
          background: transparent;
        }
      }

      &--on {
        background-color: $primary-light-grey;
      }

      &--off {
        background-color: $primary-grey;
      }

      &-checkbox {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 1;
        width: 100%;
        height: 100%;
        margin: 0;
        border-radius: 9px;
        appearance: none;
      }
    }
  }
}
</style>
