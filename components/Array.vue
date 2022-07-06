<template>
  <div ref="arrayDiv" class="array" :style="{ aspectRatio: `${visualizerSettings.arraySize.state.value + 4}/2` }">
    <Pointer class="pointer one" />
    <Pointer class="pointer two" />
    <div ref="elementsDiv" class="elements">
      <TransitionGroup name="element" appear>
        <!-- For bounded aspectRatio style, Initial aspectRatio for 8 elements is 12/2, so add 4 to 12. 
              Incrementing with the arraySize works to keep the div responsive -->
        <div
          v-for="(element, i) in array"
          :key="i"
          class="element"
          :style="{
            fontSize: `clamp(25px, ${(arrayWidth / visualizerSettings.arraySize.state.value) * 0.4}px, 45px)`,
          }"
        >
          <span class="value">{{ element }}</span>
        </div>
        <div v-for="(val, i) in array" :key="i" class="borders">
          <div
            v-if="i !== array.length - 1"
            class="border"
            :style="{
              transform: `translateX(${(arrayWidth / visualizerSettings.arraySize.state.value) * 0.99 * (i + 1)}px)`,
            }"
          ></div>
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
            fontSize: `clamp(12px, ${(arrayWidth / visualizerSettings.arraySize.state.value) * 0.2}px, 16px)`,
          }"
        >
          <span class="value">{{ index - 1 }}</span>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup>
import Pointer from '../assets/svgs/polygonPointer.svg';

import { ref, reactive, onMounted, nextTick } from 'vue';
import gsap from 'gsap';

const props = defineProps({
  transitionSpeed: {
    type: Object,
    default() {
      return { string: '400ms', int: 400 };
    },
  },
  currStep: {
    type: Number,
    required: true,
  },
});

const visualizerSettings = useVisualizerSettings();
const timeline = useTimeline();

const arrayDiv = ref();
const arrayWidth = ref(0);
const array = reactive([]);
const elementsDiv = ref();
const elements = reactive([]);

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
      while (array.length > currVal) {
        array.pop();
      }
    } else if (visualizerSettings.value.elementType.state.value === 'Random') {
      array.push(Math.floor(Math.random() * 20));
      array.sort((a, b) => a - b);
    } else {
      array.push(visualizerSettings.value.arraySize.state.value);
    }
  },
);

onMounted(() => {
  for (let i = 0; i++ < visualizerSettings.value.arraySize.state.value; ) {
    array.push(i);
  }
  nextTick(() => {
    const arraySizeObserver = new ResizeObserver(() => {
      arrayWidth.value = arrayDiv.value.offsetWidth;
    });
    arraySizeObserver.observe(arrayDiv.value);
  });
});

function setElements() {
  if (props.currStep === 0) {
    for (let i = 0; i < elementsDiv.value.children.length; i++) {
      // Since the border elements are last in the elements children nodes
      if (elementsDiv.value.children[i].classList.contains('borders')) {
        break;
      }
      elements.push({ div: elementsDiv.value.children[i], value: array[i], oldIndex: i });
    }
    for (let i = elements.length; i-- > 1; ) {
      const j = Math.floor(Math.random() * i);
      const tmp = elements[i];
      elements[i] = elements[j];
      elements[j] = tmp;
    }
  } else {
    elements.sort((a, b) => a.value - b.value);
  }
}

function setElementsAnim() {
  setElements();
  const tl = gsap.timeline({
    onComplete: () => {
      if (props.currStep === 0) {
        elements.length = 0;
        timeline.value.clear();
      }
    },
  });

  tl.to('.border', { duration: props.transitionSpeed.int * 0.75 * 0.001, bottom: '100%', ease: 'power2' });

  // Doing the first element first *without the overlapping option* so the border animation is done first
  tl.to(elements[0].div, {
    duration: props.transitionSpeed.int * 0.8 * 0.001,
    xPercent: (0 - elements[0].oldIndex) * 100,
    ease: 'expo',
  });
  for (const [i, element] of elements.entries()) {
    tl.to(
      element.div,
      { duration: props.transitionSpeed.int * 0.8 * 0.001, xPercent: (i - element.oldIndex) * 100, ease: 'expo' },
      '<10%',
    );
  }
  tl.to('.border', { duration: props.transitionSpeed.int * 0.75 * 0.001, bottom: 0, ease: 'expo' });
  tl.addLabel('1');

  timeline.value.add(tl);
}

defineExpose({ setElementsAnim });
</script>

<style lang="scss" scoped>
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

  .borders {
    position: absolute;
    height: 69%;

    .border {
      position: absolute;
      z-index: 1;
      top: 0;
      bottom: 0;
      width: 2px;
      background-color: $primary-black;
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
</style>
