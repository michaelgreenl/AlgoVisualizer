<template>
  <div class="insertion-sort">
    <VisualizerDSA
      ref="visualizer"
      title="Insertion Sort"
      :currStep="currStep"
      :steps="steps"
      @setCurrStep="setCurrStep"
      @playClick="playClick"
    >
      <template #visual>
        <Array
          v-if="visualizerSettings.visual.state.value === 'Array'"
          ref="array"
          :transitionSpeed="transitionSpeed"
          :currStep="currStep"
        />
      </template>
      <template #explanation></template>
      <template #description></template>
    </VisualizerDSA>
  </div>
</template>

<script setup>
import { computed, ref, reactive, shallowReactive } from 'vue';

const visualizerSettings = useVisualizerSettings();
const timeline = useTimeline();

const arraySize = shallowReactive({
  label: 'Elements',
  type: 'number',
  min: 8,
  get max() {
    return visualizerSettings.value.visual.state.value === 'Array' ? 15 : 200;
  },
  state: { value: 8 },
  requiresRestart: true,
});

const elementType = shallowReactive({
  label: 'Element Type',
  type: 'radio',
  options: ['Range', 'Random'],
  state: { value: 'Range' },
  requiresRestart: true,
});

visualizerSettings.value = {
  visual: {
    label: 'Visual',
    type: 'radio',
    options: ['Array', 'Bar Graph'],
    state: { value: 'Array' },
    requiresRestart: false,
  },
  speed: {
    label: 'Speed',
    type: 'range',
    min: 0,
    max: 100,
    state: { value: 50 },
    requiresRestart: false,
  },
  arraySize,
  elementType,
  explanation: {
    label: 'Show Explanation',
    type: 'checkbox',
    trueValue: true,
    falseValue: false,
    state: { value: true },
    requiresRestart: false,
  },
};

const steps = reactive([{ explanation: '' }]);
const visualizer = ref();
const array = ref();
const currStep = ref(0);
const transitionSpeed = reactive({
  string: computed(() => `${1000 - visualizerSettings.value.speed.state.value * 10}ms`),
  int: computed(() => 1000 - visualizerSettings.value.speed.state.value * 10),
});

function playClick() {
  if (currStep.value === 0) {
    array.value.setElementsAnim();
    currStep.value += 1;
  } else if (visualizer.value.visualPlaying) {
    timeline.value.resume();
  } else {
    timeline.value.pause();
  }
}

function setCurrStep(val) {
  // If restart button was clicked
  if (val === 0) {
    nextTick(() => {
      array.value.setElementsAnim();
    });
    nextTick(() => {
      currStep.value = val;
    });
  } else {
    currStep.value = val;
  }
}
</script>

<style lang="scss" scoped>
.insertion-sort {
  font-size: 12px;
  height: 100%;
  width: 100%;
}
</style>
