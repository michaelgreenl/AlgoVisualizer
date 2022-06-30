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
            @input="onInput(key, input.requiresRestart, $event.target.value)"
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
        @input="onInput(key, input.requiresRestart, parseInt($event.target.value, 10))"
      />
      <input
        v-else-if="input.type === 'number'"
        :class="input.type"
        :type="input.type"
        :name="input.label"
        v-model.number="input.state.value"
        :min="input.min"
        :max="input.max"
        @input="onInput(key, input.requiresRestart, parseInt($event.target.value, 10))"
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
      <transition name="">
        <button class="settings-buttons" @click="reset" v-show="showResetBtn">Reset</button>
      </transition>
      <transition name="">
        <button class="settings-buttons" @click="restart" v-show="currStep > 0 && showRestartBtn">Restart</button>
      </transition>
    </li>
  </ul>
</template>

<script setup>
import { onMounted, reactive } from 'vue';

const props = defineProps({
  currStep: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['restart']);

const visualizerSettings = useVisualizerSettings();
const defaultSettings = reactive({});
const restartSettings = reactive({});
const showResetBtn = computed(() =>
  Object.values(defaultSettings)
    .map((setting) => setting.equal)
    .includes(false),
);
const showRestartBtn = computed(() =>
  Object.values(restartSettings)
    .map((setting) => setting.equal)
    .includes(false),
);

onMounted(() => {
  Object.keys(visualizerSettings.value).forEach((setting) => {
    defaultSettings[`${setting}`] = { value: visualizerSettings.value[`${setting}`].state.value, equal: true };
    restartSettings[`${setting}`] = { value: visualizerSettings.value[`${setting}`].state.value, equal: true };
  });
});

function onInput(key, requiresRestart, inputValue, multiInput) {
  defaultSettings[`${key}`].equal = defaultSettings[`${key}`].value === inputValue;
  restartSettings[`${key}`].equal = props.currStep === 0 ? true : restartSettings[`${key}`].value === inputValue;

  if (requiresRestart && props.currStep !== 0 && multiInput) {
    visualizerSettings.value[`${key}`].tempValue = inputValue;
  } else if (props.currStep === 0 || !requiresRestart) {
    visualizerSettings.value[`${key}`].state = { value: inputValue };
  }
}

function setRestartSettings() {
  Object.keys(visualizerSettings.value).forEach((setting) => {
    restartSettings[`${setting}`].value = visualizerSettings.value[`${setting}`].state.value;
  });
}

function restart() {
  Object.keys(visualizerSettings.value).forEach((setting) => {
    if (visualizerSettings.value[`${setting}`].hasOwnProperty('tempValue')) {
      visualizerSettings.value[`${setting}`].state = { value: visualizerSettings.value[`${setting}`].tempValue };
    } else if (visualizerSettings.value[`${setting}`].requiresRestart) {
      visualizerSettings.value[`${setting}`].state = { value: visualizerSettings.value[`${setting}`].state.value };
    }
    restartSettings[`${setting}`] = { value: visualizerSettings.value[`${setting}`].state.value, equal: true };
  });
  emit('restart');
}

function reset() {
  Object.keys(visualizerSettings.value).forEach((setting) => {
    if (props.currStep > 0 && visualizerSettings.value[`${setting}`].requiresRestart) {
      visualizerSettings.value[`${setting}`].state.value = defaultSettings[`${setting}`].value;
      restartSettings[`${setting}`].equal = restartSettings[`${setting}`] === defaultSettings[`${setting}`].value;
    } else if (props.currStep > 0 && visualizerSettings.value[`${setting}`].hasOwnProperty('tempValue')) {
      visualizerSettings.value[`${setting}`].tempValue = defaultSettings[`${setting}`].value;
    } else {
      visualizerSettings.value[`${setting}`].state = { value: defaultSettings[`${setting}`].value };
      restartSettings[`${setting}`] = { value: visualizerSettings.value[`${setting}`].state.value, equal: true };
    }
  });
}

defineExpose({ setRestartSettings });
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
