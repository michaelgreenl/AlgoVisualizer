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
        <div
          ref="arrayDiv"
          v-if="visualizerSettings.visual.value === 'Array'"
          class="array"
          :style="{ aspectRatio: `${visualizerSettings.arraySize.value + 4}/2` }"
        >
          <Pointer class="pointer one" />
          <Pointer class="pointer two" />
          <div ref="elementsDiv" class="elements">
            <!-- for bounded fontSized style, Initial aspectRatio for 8 elements is 12, so add 4 -->
            <TransitionGroup name="element" appear>
              <div
                v-for="(element, i) in array"
                :key="i"
                class="element"
                :style="{ fontSize: `clamp(25px, ${arrayWidth / (2 * visualizerSettings.arraySize.value)}px, 45px)` }"
              >
                <span class="value">{{ element }}</span>
              </div>
            </TransitionGroup>
          </div>
          <div class="indices">
            <TransitionGroup name="element" appear>
              <div
                v-for="index in visualizerSettings.arraySize.value"
                :key="index"
                class="index"
                :style="{ fontSize: `clamp(12px, ${arrayWidth / (5 * visualizerSettings.arraySize.value)}px, 16px)` }"
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

import { onMounted, reactive } from 'vue';

const visualizerSettings = useVisualizerSettings();
visualizerSettings.value = {
  visual: {
    label: 'Visual',
    type: 'radio',
    options: ['Array', 'Bar Graph'],
    value: 'Array',
    requiresRestart: false,
  },
  speed: {
    label: 'Speed',
    type: 'range',
    min: 0,
    max: 100,
    value: 50,
    requiresRestart: false,
  },
  arraySize: {
    label: 'Elements',
    type: 'number',
    min: 8,
    get max() {
      return visualizerSettings.value.visual.value === 'Array' ? 15 : 200;
    },
    value: 8,
    requiresRestart: true,
  },
  elementType: {
    label: 'Element Type',
    type: 'radio',
    options: ['Range', 'Random'],
    value: 'Range',
    requiresRestart: true,
  },
  explanation: {
    label: 'Show Explanation',
    type: 'checkbox',
    value: true,
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

watch(
  () => visualizerSettings.value.elementType.value,
  (currVal) => {
    array.length = 0;
    if (currVal === 'Random') {
      for (let i = 1; i <= visualizerSettings.value.arraySize.value; i++) {
        array.push(Math.floor(Math.random() * 20));
      }
      array.sort((a, b) => a - b);
    } else {
      for (let i = 1; i <= visualizerSettings.value.arraySize.value; i++) {
        array.push(i);
      }
    }
  },
);

watch(
  () => visualizerSettings.value.arraySize.value,
  (currVal, oldVal) => {
    if (oldVal > currVal) {
      array.pop();
    } else if (visualizerSettings.value.elementType.value === 'Random') {
      array.push(Math.floor(Math.random() * 20));
      array.sort((a, b) => a - b);
    } else {
      array.push(visualizerSettings.value.arraySize.value);
    }
  },
);

onMounted(() => {
  const arraySizeObserver = new ResizeObserver(() => {
    arrayWidth.value = arrayDiv.value.offsetWidth;
  });
  arraySizeObserver.observe(arrayDiv.value);
  elementsDiv.value.children[0].classList.add('border-up-0');
});

function setCurrStep(val) {
  currStep.value = val;

  // If reset button was clicked
  if (currStep.value === 0) {
    // reset array, elements, settings, ...?
  }
}

function playClick() {
  if (currStep.value === 0) {
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

  // Shuffling array (FIXME: in the future, make sure the shuffling actually shuffles the array (i.e. more than just switching 2 elements))
  elements.sort(() => Math.random() - 0.5);

  setTimeout(() => {
    for (const [i, element] of elements.entries()) {
      // translateX((newIndex - oldIndex) * 100%)
      element.div.style.transitionDelay = `${i * 25}ms`
      element.div.style.transform = `translateX(${(i - element.oldIndex) * 100}%)`;
    }

    setTimeout(() => {
      for (const [i, element] of elements.entries()) {
        if (i !== 0) {
          element.div.classList.add('border-down');
        }
      }
    }, 400 + (visualizerSettings.value.arraySize.value * 25));
  }, 350);
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
        transition: all 0ms linear;
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
        transition: transform 350ms ease-out;

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
            animation: border-up 0ms ease forwards;
          }
        }

        &.border-up {
          &::after {
            animation: border-up 400ms ease forwards;
          }
        }

        &.border-down {
          &::after {
            animation: border-down 400ms ease forwards;
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
