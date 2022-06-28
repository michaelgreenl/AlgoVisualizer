<template>
  <ul class="settings">
    <li class="input" v-for="(input, key) in visualizerSettings" :key="input">
      <label class="label" :for="input.label">{{ input.label }}:</label>
      <div v-if="input.type === 'radio'" class="radio">
        <div class="radio-input" v-for="option in input.options" :key="option">
          <input
            v-if="input.tempValue"
            :class="input.type"
            :type="input.type"
            :name="option"
            :value="option"
            v-model="input.tempValue"
            @input="onInput(key, input.requiresRestart, $event.target.value, true)"
          />
          <input
            v-else
            :class="input.type"
            :type="input.type"
            :name="option"
            :value="option"
            v-model="input.state.value"
            @input="onInput(key, input.requiresRestart)"
          />
          <label class="label" :for="option">{{ option }}</label>
        </div>
      </div>
      <input
        v-else-if="input.type === 'range'"
        :class="input.type"
        :type="input.type"
        :name="input.label"
        v-model="input.state.value"
        :min="input.min"
        :max="input.max"
        @input="onInput(key, input.requiresRestart)"
      />
      <input
        v-else-if="input.type === 'number'"
        :class="input.type"
        :type="input.type"
        :name="input.label"
        v-model="input.state.value"
        :min="input.min"
        :max="input.max"
        @input="onInput(key, input.requiresRestart)"
      />
      <input
        v-else-if="input.type === 'checkbox'"
        :class="input.type"
        :type="input.type"
        :name="input.label"
        v-model="input.state.value"
        :true-value="input.trueValue"
        :false-value="input.falseValue"
        @input="onInput(key, input.requiresRestart, $event.target.checked)"
      />
    </li>
    <li class="input">
      <!-- Change :disabled to v-if and transition comp -->
      <button class="settings-buttons" @click="reset" :disabled="currStep < 0 && enableRestartBtn">Reset</button>
      <button class="settings-buttons" @click="restart" :disabled="currStep < 0 && enableRestartBtn">Restart</button>
    </li>
  </ul>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  currStep: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['restart']);

const visualizerSettings = useVisualizerSettings();
// const defaultSettings = reactive({});
const enableRestartBtn = ref(false);

function onInput(key, requiresRestart, inputValue, multiInput) {
  if (requiresRestart && props.currStep !== 0 && multiInput) {
    enableRestartBtn.value = true;
    visualizerSettings.value[`${key}`].tempValue = inputValue;
  } else if (props.currStep !== 0 && requiresRestart) {
    // change this to check if the restart settings are equal to the right settings selected when play was clicked ( setUtilSettings() ? )
    enableRestartBtn.value = true;
  } else if (typeof inputValue !== 'undefined') {
    visualizerSettings.value[`${key}`].state = { value: inputValue };
  } else {
    visualizerSettings.value[`${key}`].state = { value: visualizerSettings.value[`${key}`].state.value };
  }
}

function restart() {
  Object.keys(visualizerSettings.value).forEach((setting) => {
    if (visualizerSettings.value[`${setting}`].requiresRestart && visualizerSettings.value[`${setting}`].hasOwnProperty('tempValue')) {
      visualizerSettings.value[`${setting}`].state = { value: visualizerSettings.value[`${setting}`].tempValue };
    } else if (visualizerSettings.value[`${setting}`].requiresRestart) {
      visualizerSettings.value[`${setting}`].state = { value: visualizerSettings.value[`${setting}`].state.value };
    }
  });
  emit('restart');
}
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
