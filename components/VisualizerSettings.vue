<template>
  <ul class="settings">
    <li class="input" v-for="(input, key) in visualizerSettings" :key="input">
      <label class="label" :for="input.label">{{ input.label }}:</label>
      <div v-if="input.type === 'radio' && !input.requiresRestart" class="radio">
        <div class="radio-input" v-for="option in input.options" :key="option">
          <input :class="input.type" :type="input.type" :name="option" :value="option" v-model="input.value" />
          <label class="label" :for="option">{{ option }}</label>
        </div>
      </div>
      <input
        v-else-if="input.type === 'range' && !input.requiresRestart"
        :class="input.type"
        :type="input.type"
        :name="input.label"
        v-model="input.value"
        :min="input.min"
        :max="input.max"
      />
      <input
        v-else-if="input.type === 'number' && !input.requiresRestart"
        :class="input.type"
        :type="input.type"
        :name="input.label"
        v-model="input.value"
        :min="input.min"
        :max="input.max"
      />
      <input
        v-else-if="input.type === 'checkbox' && !input.requiresRestart"
        :class="input.type"
        :type="input.type"
        :name="input.label"
        v-model="input.value"
      />
      <div v-else-if="input.type === 'radio' && input.requiresRestart" class="radio">
        <div class="radio-input" v-for="(option, index) in input.options" :key="option">
          <input
            :class="input.type"
            :type="input.type"
            :name="input.label"
            :value="option"
            :checked="index === 0"
            @input="inputCheck(key, $event.target.value)"
          />
          <label class="label" :for="option">{{ option }}</label>
        </div>
      </div>
      <input
        v-else-if="input.type === 'range' && input.requiresRestart"
        :class="input.type"
        :type="input.type"
        :name="input.label"
        :value="currStep === 0 ? input.value : restartSettings[`${key}`]"
        :min="input.min"
        :max="input.max"
        @input="inputCheck(key, $event.target.value)"
      />
      <input
        v-else-if="input.type === 'number' && input.requiresRestart"
        :class="input.type"
        :type="input.type"
        :name="input.label"
        :value="currStep === 0 ? input.value : restartSettings[`${key}`]"
        :min="input.min"
        :max="input.max"
        @input="inputCheck(key, parseInt($event.target.value, 10))"
      />
      <input
        v-else-if="input.type === 'checkbox' && input.requiresRestart"
        :class="input.type"
        :type="input.type"
        :name="input.label"
        :checked="currStep === 0 ? input.value : restartSettings[`${key}`]"
        @input="inputCheck(key, $event.target.checked)"
      />
    </li>
    <li class="input">
      <button class="restart" @click="restart" :disabled="enableRestartBtn">Restart</button>
    </li>
  </ul>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  visualPlaying: {
    type: Boolean,
    required: true,
  },
  currStep: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['restart']);

const visualizerSettings = useVisualizerSettings();
const defaultSettings = reactive({});
const restartSettings = reactive({});
const enableRestartBtn = computed(() => {
  // If the visual hasn't been played yet or there are no restart settings
  // (also used to prevent errors since there are no properties in restartSettings before component is mounted)
  if (props.currStep === 0 || Object.keys(restartSettings).length === 0) {
    return true;
  }
  let btnDisabled = true;
  Object.keys(restartSettings).forEach((setting) => {
    if (restartSettings[`${setting}`] !== visualizerSettings.value[`${setting}`].value) {
      btnDisabled = false;
    }
  });
  return btnDisabled;
});

onMounted(() => {
  setUtilSettings(true);
});

function setUtilSettings(setDefault) {
  Object.keys(visualizerSettings.value).forEach((setting) => {
    if (visualizerSettings.value[`${setting}`].requiresRestart) {
      restartSettings[`${setting}`] = visualizerSettings.value[`${setting}`].value;
    }
    if (setDefault) {
      defaultSettings[`${setting}`] = visualizerSettings.value[`${setting}`].value;
    }
  });
}

function inputCheck(key, inputVal) {
  if (props.currStep === 0) {
    visualizerSettings.value[`${key}`].value = inputVal;
  } else {
    restartSettings[`${key}`] = inputVal;
  }
}

function restart() {
  Object.keys(restartSettings).forEach((setting) => {
    visualizerSettings.value[`${setting}`].value = restartSettings[`${setting}`];
  });
  emit('restart');
}

defineExpose({ setUtilSettings });
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
