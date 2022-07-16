<template>
  <div class="insertion-sort">
    <VisualizerDSA
      ref="visualizer"
      title="Insertion Sort"
      :currStep="currStep"
      :transitionSpeed="transitionSpeed"
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
        >
          <template #borderSvg>
            <div class="icon-wrapper">
              <CompareIcon class="compare-icon" />
            </div>
          </template>
        </Array>
      </template>
      <template #explanation></template>
      <template #description></template>
    </VisualizerDSA>
  </div>
</template>

<script setup>
import CompareIcon from '../../assets/svgs/lessThanEqual.svg';

import { computed, ref, reactive, shallowReactive, nextTick } from 'vue';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/dist/TextPlugin';
gsap.registerPlugin(TextPlugin);

const timeline = useTimeline();
const visualizerSettings = useVisualizerSettings();

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

const visualizer = ref();
const array = ref();
const currStep = ref(0);
const transitionSpeed = reactive({
  string: computed(() => `${(100 - visualizerSettings.value.speed.state.value) * 0.01}s`),
  int: computed(() => (100 - visualizerSettings.value.speed.state.value) * 0.01),
});
const arrayHeight = computed(() => array.value.arrayHeight * 0.675 + 'px');

function playClick() {
  if (currStep.value === 0) {
    array.value.setPointerPosition(timeline.value, 'all', 0);
    array.value.setElementsAnim();
    currStep.value += 1;
    insertionSort();
  } else if (visualizer.value.visualPlaying) {
    timeline.value.resume();
  } else {
    timeline.value.pause();
  }
}

function setCurrStep(val) {
  // If restart button was clicked
  if (val === 0) {
    array.value.setPointerPosition(timeline.value, 'all', 0);
    nextTick(() => {
      array.value.setElementsAnim();
    });
    nextTick(() => {
      currStep.value = val;
    });
  } else {
    currStep.value = val;
    timeline.value.seek(`${val}`);
  }
}

function insertionSort() {
  let i, key, j;
  for (i = 1; i < array.value.elements.length; i++) {
    key = array.value.elements[i].value;
    j = i - 1;

    const tl = gsap.timeline({
      delay: 1,
      onComplete: () => {
        currStep.value += 1;
      },
    });

    while (j >= 0) {
      if (array.value.elements[j].value > key) {
        // animation for comparing and swapping element's that are unsorted, and swapping the values in elements[]
        compareElements(tl, j, [j, j + 1]);
        [array.value.elements[j], array.value.elements[j + 1]] = [array.value.elements[j + 1], array.value.elements[j]];
        j = j - 1;
      } else if (array.value.elements[j].value <= key) {
        // animation for comparing element's that are sorted
        compareElements(tl, j);

        // Add dynamic explanation here
        // element is sorted (explanation explain either j === 0 or arr[j] > key)
        break;
      }
    }

    // pointers to next element, adding timeline to global timeline with label
    array.value.setPointerPosition(tl, 'all', i);
    timeline.value.add(tl);
    timeline.value.addLabel(`${i}`);
  }
}

function compareElements(timeline, j, elements) {
  // visualizer.value.changeExplanation(timeline, [
  //   { string: 'Starting at the beginning of the array', underlined: [{ text: 'beginning of the array', i: 0 }] },
  //   {
  //     string: `, compare element ${j} and element ${j + 1}`,
  //     underlined: [
  //       { text: `element ${j}`, i: 1 },
  //       { text: `element ${j + 1}`, i: 2 },
  //     ],
  //   },
  // ]);
  visualizer.value.changeExplanation(timeline, [
    { string: 'Next', underlined: [] },
    {
      string: ` compare element ${j} and element ${j + 1}`,
      underlined: [
        { text: `element ${j}`, i: 0 },
        { text: `element ${j + 1}`, i: 1 },
      ],
    },
  ]);

  // setting the pointers to the next 2 elements to be compared and removing the border in between
  array.value.setPointerPosition(timeline, 0, j);
  array.value.setPointerPosition(timeline, 1, j + 1, '<');
  array.value.setBorderVisibility(timeline, j, 0, 0.5, '>');

  if (elements) {
    // compareIcon appearing and color to red
    array.value.toggleBorderSvg(timeline, j, '>', 'opacity', 1);
    array.value.toggleBorderSvg(timeline, j, '>', 'fill', '#C77F7F', 1);

    // pointer color to red
    timeline.to('.pointer', { duration: transitionSpeed.int * 0.4, fill: '#C77F7F', ease: 'power2' }, '<');
    visualizer.value.changeExplanation(timeline, [
      {
        string: `Since element ${j} is greater than element ${j + 1}`,
        underlined: [
          { text: `element ${j}`, i: 0 },
          { text: 'greater than', i: 1 },
          { text: `element ${j + 1}`, i: 2 },
        ],
      },
      { string: " the element's are swapped", underlined: [{ text: 'swapped', i: 3 }] },
    ]);

    // compareIcon disappearing before swapping the elements (with 1s delay)
    array.value.toggleBorderSvg(timeline, j, '>', 'opacity', 0, 1);
    array.value.swapElements(timeline, elements, 0.5);

    // compareIcon is green immediately after appearing again
    array.value.toggleBorderSvg(timeline, j, '>', 'fill', '#8FBF7F');
    array.value.toggleBorderSvg(timeline, j, '>', 'opacity', 1);
  } else {
    // compareIcon fill change delays before changing (just like if what happens for the color red).
    array.value.toggleBorderSvg(timeline, j, '>', 'opacity', 1);
    array.value.toggleBorderSvg(timeline, j, '>', 'fill', '#8FBF7F', 1);
  }

  // pointer color to green
  timeline.to('.pointer', { duration: transitionSpeed.int * 0.4, fill: '#8FBF7F', ease: 'power2' }, '<');

  // compare icon disappears and color back to default, the border back to visible
  array.value.toggleBorderSvg(timeline, j, '>', 'opacity', 0, 1);
  array.value.toggleBorderSvg(timeline, j, '>', 'fill', '#bfb47c');
  array.value.setBorderVisibility(timeline, j, '100%', 0.5, '>');

  // pointer color to default
  timeline.to('.pointer', { duration: transitionSpeed.int * 0.4, fill: '#D7D0AE', ease: 'power2' }, '>');
}
</script>

<style lang="scss" scoped>
.insertion-sort {
  font-size: 12px;
  height: 100%;
  width: 100%;

  .icon-wrapper {
    display: flex;
    align-items: center;
    height: v-bind(arrayHeight);
    opacity: 0;

    .compare-icon {
      // fill slightly darker than $primary-bright since icon is thin and to make it more visible
      fill: #bfb47c;
      width: 23%;
      margin-left: -15%;
    }
  }
}
</style>
