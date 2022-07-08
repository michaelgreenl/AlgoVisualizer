<template>
  <div class="insertion-sort">
    <VisualizerDSA
      ref="visualizer"
      title="Insertion Sort"
      :currStep="currStep"
      :explanations="explanations"
      @setCurrStep="setCurrStep"
      @playClick="playClick"
    >
      <template #visual>
        <Array
          v-if="visualizerSettings.visual.state.value === 'Array'"
          ref="array"
          :transitionSpeed="transitionSpeed"
          :currStep="currStep"
          :numPointers="2"
        />
      </template>
      <template #explanation></template>
      <template #description></template>
    </VisualizerDSA>
  </div>
</template>

<script setup>
import { computed, ref, reactive, shallowReactive } from 'vue';
import gsap from 'gsap';

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

const explanations = reactive(['1. This is the first step']);
const visualizer = ref();
const array = ref();
const currStep = ref(0);
const transitionSpeed = reactive({
  string: computed(() => `${(100 - visualizerSettings.value.speed.state.value) * 0.01}s`),
  int: computed(() => (100 - visualizerSettings.value.speed.state.value) * 0.01),
});

function playClick() {
  if (currStep.value === 0) {
    array.value.setElementsAnim();
    array.value.setPointerPosition('all', 0);
    currStep.value += 1;
    setTimeout(() => {
      insertionSort();
    }, 3000);
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
      array.value.setPointerPosition('all', 0);
      array.value.setElementsAnim();
    });
    nextTick(() => {
      currStep.value = val;
    });
  } else {
    currStep.value = val;
  }
}

function insertionSort() {
  const n = array.value.elements.length;
  let i, key, j;
  for (i = 1; i < n; i++) {
    key = array.value.elements[i].value;
    j = i - 1;

    const tl = gsap.timeline();
    while (j >= 0 && array.value.elements[j].value > key) {
      // swapping the elements
      array.value.setBorderVisibility(tl, j, '100%', '<');
      array.value.swapElements(tl, [j, j + 1]);
      array.value.setBorderVisibility(tl, j, 0, '<');
      [array.value.elements[j], array.value.elements[j + 1]] = [array.value.elements[j + 1], array.value.elements[j]];
      j = j - 1;
    }
    // element is sorted
    console.log(i);

    tl.addLabel(`${i}`);
    timeline.value.add(tl);
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
