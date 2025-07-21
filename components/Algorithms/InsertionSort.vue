<template>
  <div class="insertion-sort">
    <VisualizerDSA
      ref="visualizer"
      title="Insertion Sort"
      :transition-speed="transitionSpeed"
      @start="start"
      @restart="restart"
    >
      <template #visual>
        <Array ref="array" :transition-speed="transitionSpeed" :num-pointers="2">
          <template #borderSvg>
            <div class="icon-wrapper">
              <CompareIcon class="compare-icon" />
            </div>
          </template>
        </Array>
      </template>
      <template #description>
        <div class="description">
          <div class="description-section">
            <h3 class="description-header">High-Level Explanation</h3>
            <ol class="description-list">
              <li>
                <span class="item-text">Start with the second element</span>
              </li>
              <li>
                <span class="item-text">Compare with elements to the left</span>
              </li>
              <li>
                <span class="item-text">Shift larger elements one position right</span>
              </li>
              <li>
                <span class="item-text">Insert current element in correct position</span>
              </li>
              <li>
                <span class="item-text">Repeat for all elements</span>
              </li>
            </ol>
          </div>
          <div class="description-section">
            <h3 class="description-header">Algorithm Properties</h3>
            <ul class="description-list">
              <li>
                <span class="item-label">In-place - </span>
                <span class="item-text">Yes (requires only O(1) extra memory)</span>
              </li>
              <li>
                <span class="item-label">Stable - </span>
                <span class="item-text">Yes (equal elements maintain their relative order)</span>
              </li>
              <li>
                <span class="item-label">Online - </span>
                <span class="item-text">Yes (can sort elements as they arrive)</span>
              </li>
              <li>
                <span class="item-label">Adaptive - </span>
                <span class="item-text">Yes (performs better on partially sorted data)</span>
              </li>
              <li>
                <span class="item-label">Comparison-based - </span>
                <span class="item-text">Yes</span>
              </li>
            </ul>
          </div>
          <div class="description-section">
            <h3 class="description-header">Complexity Analysis</h3>
            <ul class="description-list">
              <li>
                <span class="item-label">Best Case - </span>
                <span class="item-text">O(n) when array is already sorted</span>
              </li>
              <li>
                <span class="item-label">Average Case - </span>
                <span class="item-text">O(n²)</span>
              </li>
              <li>
                <span class="item-label">Adaptive - </span>
                <span class="item-text">O(n²) when array is sorted in reverse</span>
              </li>
              <li>
                <span class="item-label">Space Complexity - </span>
                <span class="item-text">O(1) auxiliary space</span>
              </li>
            </ul>
          </div>
          <div class="description-section">
            <h3 class="description-header">When to Use</h3>
            <ul class="description-list">
              <li>
                <span class="item-text">Small datasets</span>
              </li>
              <li>
                <span class="item-text">Nearly sorted data</span>
              </li>
              <li>
                <span class="item-text">As a subroutine in hybrid algorithms (like Timsort)</span>
              </li>
              <li>
                <span class="item-text">When simplicity is preferred over efficiency</span>
              </li>
              <li>
                <span class="item-text">Online scenarios where data arrives incrementally</span>
              </li>
            </ul>
          </div>
          <div class="description-section">
            <h3 class="description-header">Advantages/Disadvantages</h3>
            <h4 class="sublist-header">Advantages:</h4>
            <ul class="description-list sublist">
              <li>
                <span class="item-text">Simple implementation</span>
              </li>
              <li>
                <span class="item-text">Efficiant for small datasets</span>
              </li>
              <li>
                <span class="item-text">Adaptive (faster on nearly sorted data)</span>
              </li>
              <li>
                <span class="item-text">Stable sorting</span>
              </li>
              <li>
                <span class="item-text">In-place sorting</span>
              </li>
              <li>
                <span class="item-text">Online algorithm</span>
              </li>
            </ul>
            <h4 class="sublist-header">Disadvantages:</h4>
            <ul class="description-list sublist">
              <li>
                <span class="item-text">Inefficient for large datasets</span>
              </li>
              <li>
                <span class="item-text">More writes compared to selection sort</span>
              </li>
              <li>
                <span class="item-text">O(n²) time complexity in average/worst case</span>
              </li>
            </ul>
          </div>
        </div>
      </template>
    </VisualizerDSA>
  </div>
</template>

<script setup>
import { computed, ref, reactive, nextTick, onBeforeMount } from 'vue';

import { timelineStore } from '../../stores/timeline';
import { visualizerSettingsStore } from '../../stores/visualizerSettings';
import CompareIcon from '../../assets/svgs/lessThanEqual.svg';
import gsap from 'gsap';

import { TextPlugin } from 'gsap/dist/TextPlugin';

gsap.registerPlugin(TextPlugin);

const timeline = timelineStore();
const visualizerSettings = visualizerSettingsStore();

const visualizer = ref();
const array = ref();
const transitionSpeed = reactive({
  string: computed(() => `${(100 - visualizerSettings.settings.speed.state) * 0.01}s`),
  int: computed(() => (100 - visualizerSettings.settings.speed.state) * 0.01),
});
const arrayHeight = computed(() => array.value.arrayHeight * 0.675 + 'px');

onBeforeMount(() => {
  // Define the initial settings
  const initialSettings = {
    explanation: {
      label: 'Explanation in Visual',
      type: 'toggle',
      trueValue: 'On',
      falseValue: 'Off',
      state: true,
      requiresRestart: false,
    },
    speed: {
      label: 'Animation Speed',
      type: 'range',
      min: 30,
      max: 70,
      state: 50,
      requiresRestart: true,
    },
    arraySize: {
      label: 'Elements',
      type: 'number',
      min: 8,
      max: 15,
      state: 8,
      requiresRestart: true,
      validateInput: (input) => {
        if (input > visualizerSettings.settings.arraySize.max || input < visualizerSettings.settings.arraySize.min) {
          return false;
        }
        return true;
      },
    },
    elementType: {
      label: 'Element Type',
      type: 'radio',
      options: ['Range', 'Random'],
      state: 'Range',
      requiresRestart: true,
    },
  };

  // Set the initial state
  visualizerSettings.initial = { ...JSON.parse(JSON.stringify(initialSettings)) };

  // Initialize settings if empty
  if (Object.keys(visualizerSettings.settings).length === 0) {
    visualizerSettings.settings = { ...JSON.parse(JSON.stringify(initialSettings)) };
  }

  // Always ensure selected and localState are properly initialized
  visualizerSettings.selected = { ...JSON.parse(JSON.stringify(visualizerSettings.settings)) };
  visualizerSettings.localState = { ...JSON.parse(JSON.stringify(visualizerSettings.settings)) };
});

function start() {
  array.value.setElementsAnim();
  timeline.currStep += 1;
  timeline.currExplanation = '1.1';
  insertionSort();
}

async function restart() {
  // Clear any visible SVG elements first
  array.value.clearSvgs();

  // Reset array to initial state
  array.value.setPointerPosition(timeline.tl, 'all', 0);
  await nextTick();

  // Reset array elements to their initial shuffled state
  array.value.setElementsAnim(true).then(async () => {
    await nextTick();

    // Start the animation with new settings
    array.value.setElementsAnim().then(() => {
      timeline.currStep += 1;
      timeline.currExplanation = '1.1';
      insertionSort();
    });
  });
}

function insertionSort() {
  let i, key, j;

  for (i = 1; i < array.value.elements.arr.length; i++) {
    key = array.value.elements.arr[i].value;
    j = i - 1;

    const tl = gsap.timeline({
      delay: 1,
      onComplete: () => {
        timeline.currStep += 1;
        timeline.currExplanation = `${timeline.currStep}.1`;
      },
    });

    explanations(tl, i !== 1 ? 'next' : 'start', j, i);
    while (j >= 0) {
      if (array.value.elements.arr[j].value > key) {
        // animation for comparing and swapping element's that are unsorted, and swapping the values in elements[]
        compareElements(tl, i, j, [j, j + 1]);
        [array.value.elements.arr[j], array.value.elements.arr[j + 1]] = [
          array.value.elements.arr[j + 1],
          array.value.elements.arr[j],
        ];
        j = j - 1;
      } else if (array.value.elements.arr[j].value <= key) {
        // animation for comparing element's that are sorted
        compareElements(tl, i, j);
        break;
      }
    }
    // pointers to next element, adding timeline to global timeline with label
    array.value.setPointerPosition(tl, 'all', i);

    // getting duration before adding tl to timeline.tl
    const currDuration = timeline.tl.duration();

    timeline.tl.add(tl);

    // setting labels for each explanation step
    Object.keys(tl.labels).forEach((key) => {
      timeline.tl.addLabel(key, currDuration + tl.labels[`${key}`] + transitionSpeed.int * 1.4);
    });
  }
}

function compareElements(tl, i, j, elements) {
  // setting the pointers to the next 2 elements to be compared and removing the border in between
  array.value.setPointerPosition(tl, 0, j);
  array.value.setPointerPosition(tl, 1, j + 1, '<');

  array.value.setBorderVisibility(tl, j, 0, i !== 1 ? 1.5 : 2.5, '>');

  if (elements) {
    // arr[j] > key
    explanations(tl, 'invalid', j, i);

    // compareIcon appearing, compareIcon and pointer color to red
    array.value.toggleBorderSvg(tl, j, '>', 'opacity', 1);
    array.value.toggleBorderSvg(tl, j, '>', 'fill', '#C77F7F', 1);
    tl.to('.pointer', { duration: transitionSpeed.int * 0.4, fill: '#C77F7F', ease: 'power2' }, '<');

    // compareIcon disappearing before swapping the elements (with 1s delay)
    array.value.toggleBorderSvg(tl, j, '>', 'opacity', 0, 1);
    array.value.swapElements(tl, elements, 0.5);

    explanations(tl, 'swapped', j, i);
    // compareIcon is green immediately after appearing again
    array.value.toggleBorderSvg(tl, j, '>', 'fill', '#8FBF7F');
    array.value.toggleBorderSvg(tl, j, '>', 'opacity', 1);
  } else {
    // arr[j] <= key
    explanations(tl, 'valid', j, i);

    // compareIcon fill change delays before changing (just like if what happens for the color red).
    array.value.toggleBorderSvg(tl, j, '>', 'opacity', 1);
    array.value.toggleBorderSvg(tl, j, '>', 'fill', '#8FBF7F', 1);
  }

  // pointer color to green
  tl.to('.pointer', { duration: transitionSpeed.int * 0.4, fill: '#8FBF7F', ease: 'power2' }, '<');

  // compare icon disappears and color back to default, the border back to visible
  array.value.toggleBorderSvg(tl, j, '>', 'opacity', 0, 1);
  array.value.toggleBorderSvg(tl, j, '>', 'fill', '#bfb47c');
  array.value.setBorderVisibility(tl, j, '100%', 0.5, '>');

  // pointer color to default
  tl.to('.pointer', { duration: transitionSpeed.int * 0.4, fill: '#D7D0AE', ease: 'power2' }, '>');
}

function explanations(tl, explanation, j, i) {
  switch (explanation) {
    case 'start':
      visualizer.value.changeExplanation(
        tl,
        [
          {
            string: 'Starting at the beginning of the array',
            underlined: [{ text: 'beginning of the array', i: 0 }],
          },
          {
            string: `, compare element ${j} and element ${j + 1}`,
            underlined: [
              { text: `element ${j}`, i: 1 },
              { text: `element ${j + 1}`, i: 2 },
            ],
          },
        ],
        i,
        false,
      );
      break;
    case 'next':
      visualizer.value.changeExplanation(
        tl,
        [
          { string: 'Next', underlined: [] },
          {
            string: ` compare element ${j} and element ${j + 1}`,
            underlined: [
              { text: `element ${j}`, i: 0 },
              { text: `element ${j + 1}`, i: 1 },
            ],
          },
        ],
        i,
        false,
      );
      break;
    case 'invalid':
      visualizer.value.changeExplanation(
        tl,
        [
          {
            string: `Since element ${j} is greater than element ${j + 1}`,
            underlined: [
              { text: `element ${j}`, i: 0 },
              { text: 'greater', i: 1 },
              { text: `element ${j + 1}`, i: 2 },
            ],
          },
          { string: " the element's are swapped", underlined: [{ text: 'swapped', i: 3 }] },
        ],
        i,
        false,
      );
      break;
    case 'swapped':
      visualizer.value.changeExplanation(
        tl,
        [
          {
            string: `Now element ${j + 1} is greater than element ${j}`,
            underlined: [
              { text: `element ${j + 1}`, i: 0 },
              { text: 'greater', i: 1 },
              { text: `element ${j}`, i: 2 },
            ],
          },
          {
            string: ', so the elements are in the correct position',
            underlined: [{ text: 'correct position', i: 3 }],
          },
        ],
        i,
        true,
      );
      break;
    case 'valid':
      visualizer.value.changeExplanation(
        tl,
        [
          {
            string: `Element ${j + 1} is greater than element ${j}`,
            underlined: [
              { text: `Element ${j + 1}`, i: 0 },
              { text: 'greater', i: 1 },
              { text: `element ${j}`, i: 2 },
            ],
          },
          {
            string: ', so the elements are in the correct position',
            underlined: [{ text: 'correct position', i: 3 }],
          },
        ],
        i,
        true,
      );
      break;
    default:
      break;
  }
}
</script>

<style lang="scss" scoped>
.insertion-sort {
  width: 100%;
  height: 100%;
  font-size: 12px;

  .icon-wrapper {
    display: flex;
    align-items: center;
    height: v-bind(arrayHeight);
    opacity: 0;

    .compare-icon {
      width: 23%;
      margin-left: -15%;

      // fill slightly darker than $primary-bright since icon is thin and to make it more visible
      fill: #bfb47c;
    }
  }

  .description {
    font-family: $secondary-font-stack;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    max-height: 85vh;

    .description-header {
      font-family: $primary-font-stack;
      font-size: 1.5em;
      margin: 0;
      color: var(--primary-dark);
      font-weight: 700;
      border-bottom: solid 1px var(--primary-light-grey);
      padding: 3px;
    }

    .description-list {
      display: flex;
      flex-direction: column;
      gap: 0.25em;
      font-size: 1.2em;
      margin-top: 0.75em;
      padding: 0 0 0 2em;

      .item-label {
        font-weight: 600;
      }
    }

    .sublist-header {
      font-size: 1.2em;
      font-weight: 600;
      margin: 0.8em 0 0.2em 0.4em;
    }

    .sublist {
      margin-top: 0;
    }
  }
}
</style>
