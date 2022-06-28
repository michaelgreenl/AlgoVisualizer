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
        <!-- For bounded aspectRatio style, Initial aspectRatio for 8 elements is 12/2, so add 4 to 12. 
              Incrementing with the arraySize works to keep the div responsive -->
        <div
          ref="arrayDiv"
          v-if="visualizerSettings.visual.state.value === 'Array'"
          class="array"
          :style="{ aspectRatio: `${visualizerSettings.arraySize.state.value + 4}/2` }"
        >
          <Pointer class="pointer one" />
          <Pointer class="pointer two" />
          <div ref="elementsDiv" class="elements">
            <TransitionGroup name="element" appear>
              <div
                v-for="(element, i) in array"
                :key="i"
                class="element"
                :style="{
                  fontSize: `clamp(25px, ${arrayWidth / (2 * visualizerSettings.arraySize.state.value)}px, 45px)`,
                }"
              >
                <span class="value">{{ element }}</span>
              </div>
            </TransitionGroup>
          </div>
          <div class="indices">
            <TransitionGroup name="element" appear>
              <div
                v-for="index in visualizerSettings.arraySize.state.value"
                :key="index"
                class="index"
                :style="{
                  fontSize: `clamp(12px, ${arrayWidth / (5 * visualizerSettings.arraySize.state.value)}px, 16px)`,
                }"
              >
                <span class="value">{{ index - 1 }}</span>
              </div>
            </TransitionGroup>
          </div>
        </div>
      </template>
      <template #explanation></template>
      <template #description></template>
    </VisualizerDSA>
  </div>
</template>

<script setup>
import Pointer from '../../assets/svgs/polygonPointer.svg';

import { computed, onMounted, reactive, shallowReactive } from 'vue';

const visualizerSettings = useVisualizerSettings();

const arraySize = shallowReactive({
  label: 'Elements',
  type: 'number',
  min: 8,
  get max() {
    return visualizerSettings.value.visual.value === 'Array' ? 15 : 200;
  },
  state: { value: 8 },
  requiresRestart: true,
});

const elementType = shallowReactive({
  label: 'Element Type',
  type: 'radio',
  options: ['Range', 'Random'],
  state: { value: 'Range' },
  tempValue: 'Range',
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
const visualizer = ref(null);
const currStep = ref(0);
const arrayDiv = ref(null);
const arrayWidth = ref(0);
const elementsDiv = ref(null);
const elements = reactive([]);
const array = reactive([1, 2, 3, 4, 5, 6, 7, 8]);
const transitionSpeed = reactive({
  string: computed(() => `${1000 - visualizerSettings.value.speed.state.value * 10}ms`),
  int: computed(() => 1000 - visualizerSettings.value.speed.state.value * 10),
});

watch(
  () => visualizerSettings.value.elementType.state.value,
  (currVal) => {
    array.length = 0;
    if (currVal === 'Random') {
      for (let i = 1; i <= visualizerSettings.value.arraySize.state.value; i++) {
        array.push(Math.floor(Math.random() * 20));
      }
      array.sort((a, b) => a - b);
    } else {
      for (let i = 1; i <= visualizerSettings.value.arraySize.state.value; i++) {
        array.push(i);
      }
    }
  },
);

watch(
  () => visualizerSettings.value.arraySize.state.value,
  (currVal, oldVal) => {
    if (oldVal > currVal) {
      array.pop();
    } else if (visualizerSettings.value.elementType.state.value === 'Random') {
      array.push(Math.floor(Math.random() * 20));
      array.sort((a, b) => a - b);
    } else {
      array.push(visualizerSettings.value.arraySize.state.value);
    }
  },
);

onMounted(() => {
  elementsDiv.value.children[0].classList.add('border-up-0');
  const arraySizeObserver = new ResizeObserver(() => {
    arrayWidth.value = arrayDiv.value.offsetWidth;
  });
  arraySizeObserver.observe(arrayDiv.value);
});

function playClick() {
  if (currStep.value === 0) {
    currStep.value += 1;
    start();
  } else if (visualizer.value.visualPlaying) {
    // start animations
  } else {
    // pause animations
  }
}

function start() {
  for (let i = 0; i < elementsDiv.value.children.length; i++) {
    elements.push({ div: elementsDiv.value.children[i], value: array[i], oldIndex: i });
    elements[i].div.classList.add('border-up');
  }
  shuffleArray(elements);

  setTimeout(() => {
    for (const [i, element] of elements.entries()) {
      element.div.style.transition = `transform calc(${transitionSpeed.string} * 0.8) ease-out ${i * 25}ms`;
      element.div.style.transform = `translateX(${(i - element.oldIndex) * 100}%)`;
    }

    setTimeout(() => {
      for (const [i, element] of elements.entries()) {
        if (i !== 0) {
          element.div.classList.add('border-down');
          element.div.classList.remove('border-up');
        }
      }
    }, transitionSpeed.int + visualizerSettings.value.arraySize.state.value * 25);
  }, transitionSpeed.int * 0.75);
}

function shuffleArray(arr) {
  for (let i = arr.length; i-- > 1; ) {
    const j = Math.floor(Math.random() * i);
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
}

function setCurrStep(val) {
  currStep.value = val;
  // If restart button was clicked
  if (currStep.value === 0) {
    // reset array, elements, settings, border-up/down classes on element div's?
  }
}
</script>

<style lang="scss" scoped>
.insertion-sort {
  font-size: 12px;
  height: 100%;
  width: 100%;

  .array {
    position: relative;
    margin: auto 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 90%;
    max-width: 90em;

    @include bp-xxl-desktop-large {
      max-width: 80em;
    }

    @include bp-xl-desktop {
      max-width: 75em;
    }

    .pointer {
      position: absolute;
      width: 3%;
      min-width: 20px;
      max-width: 30px;
      top: -20%;

      &.one {
        right: 5%;
      }

      &.two {
        right: 17.5%;
      }
    }

    .elements {
      display: flex;
      border: solid $primary-black 2px;
      overflow: hidden;
      flex: 4;
      max-height: 16vh;

      .element-move,
      .element-enter-active,
      .element-leave-active {
        transition: all 150ms ease-out;
      }

      .element-enter-from,
      .element-leave-to {
        transform: translateX(5vw);
      }

      .element {
        position: relative;
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;

        &::after {
          content: '';
          position: absolute;
          z-index: -1;
          top: 0;
          bottom: 0;
          left: 0;
          border-left: solid $primary-black 2px;
        }

        &.border-up-0 {
          &::after {
            animation: border-up ease forwards;
          }
        }

        &.border-up {
          &::after {
            animation: border-up calc(v-bind('transitionSpeed.string') * 0.75) ease forwards;
          }
        }

        &.border-down {
          &::after {
            animation: border-down calc(v-bind('transitionSpeed.string') * 0.75) ease forwards;
          }
        }

        @keyframes border-up {
          0% {
            bottom: 0;
          }
          100% {
            bottom: 100%;
          }
        }

        @keyframes border-down {
          0% {
            bottom: 100%;
          }
          100% {
            bottom: 0;
          }
        }

        .value {
          font-family: $secondary-font-stack;
          font-weight: 300;
          color: $primary-black;
        }
      }
    }

    .indices {
      display: flex;
      flex: 1.65;

      .index {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;

        .value {
          font-family: $secondary-font-stack;
          font-weight: 300;
          color: $primary-black;
        }
      }
    }
  }
}
</style>
