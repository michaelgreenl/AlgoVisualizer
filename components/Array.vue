<template>
  <div ref="arrayDiv" class="array" :style="{ aspectRatio: `${visualizerSettings.arraySize.state.value + 4}/2` }">
    <!-- For bounded aspectRatio style, Initial aspectRatio for 8 elements is 12/2, so add 4 to 12. 
          Incrementing with the arraySize works to keep the div responsive -->
    <TransitionGroup name="fade-in-out" appear>
      <div
        v-for="pointer in numPointers"
        :key="pointer"
        ref="pointers"
        class="pointer-wrapper"
        :style="{ opacity: currStep > 0 ? '1' : '0', width: `${elementWidth}px` }"
      >
        <Pointer class="pointer" />
      </div>
    </TransitionGroup>
    <div ref="elementsDiv" class="elements">
      <TransitionGroup name="element" appear>
        <div
          v-for="(element, i) in array"
          :key="i"
          class="element"
          :style="{
            fontSize: `clamp(25px, ${elementWidth * 0.4}px, 45px)`,
          }"
        >
          <span class="value">{{ element }}</span>
        </div>
      </TransitionGroup>
      <div class="borders" :style="{ paddingLeft: `${elementWidth}px` }">
        <TransitionGroup name="border" appear>
          <div
            v-for="i in visualizerSettings.arraySize.state.value - 1"
            :key="i"
            ref="borders"
            class="border"
            :style="{
              width: `${elementWidth * 0.995}px`,
            }"
          >
            <slot name="borderSvg"></slot>
          </div>
        </TransitionGroup>
      </div>
    </div>
    <div class="indices">
      <TransitionGroup name="fade-in-out" appear>
        <div
          v-for="index in visualizerSettings.arraySize.state.value"
          :key="index"
          class="index"
          :style="{
            fontSize: `clamp(12px, ${elementWidth * 0.2}px, 16px)`,
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
  numPointers: {
    type: Number,
    default: 0,
  },
});

const timeline = useTimeline();
const visualizerSettings = useVisualizerSettings();

const elementWidth = computed(() => arrayWidth.value / visualizerSettings.value.arraySize.state.value);
const arrayDiv = ref();
const arrayHeight = ref(0);
const arrayWidth = ref(0);
const array = reactive([]);
const elementsDiv = ref();
const elements = reactive([]);
const borders = ref();
const pointers = ref([]);

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
      while (array.length < currVal) {
        array.push(array.length + 1);
      }
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
      arrayHeight.value = arrayDiv.value.offsetHeight;
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
  setBorderVisibility(tl, 'all', 0);

  // Doing the first element first *without the overlapping option* so the border animation is done first
  tl.to(elements[0].div, {
    duration: props.transitionSpeed.int * 0.8,
    xPercent: (0 - elements[0].oldIndex) * 100,
    ease: 'expo',
  });
  for (const [i, element] of elements.entries()) {
    // First animation is to compensate for the 2px gap;
    tl.to(element.div, { duration: 0, x: (i - element.oldIndex) * 2 }, '<10%').to(
      element.div,
      { duration: props.transitionSpeed.int * 0.8, xPercent: (i - element.oldIndex) * 100, ease: 'expo' },
      '<10%',
    );
  }
  setBorderVisibility(tl, 'all', '100%');
  tl.addLabel('0');

  timeline.value.add(tl);
}

// TODO: Make this account for long swaps
function swapElements(timeline, indices, delay) {
  timeline
    .to(
      elements[indices[0]].div,
      {
        duration: props.transitionSpeed.int * 0.8,
        delay: delay,
        xPercent: (indices[1] - elements[indices[0]].oldIndex) * 100,
        ease: 'expo',
      },
      '>',
    )
    .to(
      elements[indices[1]].div,
      {
        duration: props.transitionSpeed.int * 0.8,
        xPercent: (indices[0] - elements[indices[1]].oldIndex) * 100,
        ease: 'expo',
      },
      '<',
    )
    // to accommodate for 2px gap
    .to(
      elements[indices[1]].div,
      { duration: 0.1, x: (indices[0] - elements[indices[1]].oldIndex) * 2, ease: 'expo' },
      '<+=0.1',
    )
    .to(
      elements[indices[0]].div,
      { duration: 0.1, x: (indices[1] - elements[indices[0]].oldIndex) * 2, ease: 'expo' },
      '<+=0.1',
    );
}

function setBorderVisibility(timeline, border, direction, delay, timing) {
  // Arg - border: Can either be 'all' (string), indicating to set all border's visibility, or an index (int) indicating to set set border's visibility.
  // Arg - direction: Can either be 0 (down/visible) or '100%' (up/hidden).
  if (border === 'all') {
    timeline.to('.border', {
      duration: props.transitionSpeed.int * 0.75,
      delay: delay,
      height: direction,
      ease: 'power2',
    });
  } else {
    timeline.to(
      borders.value[border],
      {
        duration: props.transitionSpeed.int * 0.75,
        delay: delay,
        height: direction,
        ease: 'power2',
      },
      timing,
    );
  }
}

function toggleBorderSvg(timeline, border, timing, change, to, delay) {
  switch (change) {
    case 'opacity':
      timeline.to(
        borders.value[border].children[0],
        { duration: props.transitionSpeed.int * 0.4, delay: delay, opacity: to, ease: 'power2' },
        timing,
      );
      break;
    case 'fill':
      timeline.to(
        borders.value[border].children[0].children[0],
        { duration: props.transitionSpeed.int * 0.4, delay: delay, fill: to, ease: 'power2' },
        timing,
      );
      break;
    default:
      break;
  }
}

function setPointerPosition(timeline, pointer, positionIndex, timing) {
  // Arg - pointer: Can either be 'all' (string), indicating to move all pointers, or an index (int) indicating to move one pointer.
  if (pointer === 'all') {
    timeline.to(
      '.pointer-wrapper',
      {
        duration: props.transitionSpeed.int * 0.3,
        left: `${(100 / visualizerSettings.value.arraySize.state.value) * positionIndex}%`,
        ease: 'power2',
      },
      timing,
    );
  } else {
    timeline.to(
      pointers.value[pointer],
      {
        duration: props.transitionSpeed.int * 0.3,
        left: `${(100 / visualizerSettings.value.arraySize.state.value) * positionIndex}%`,
        ease: 'power2',
      },
      timing,
    );
  }
}

defineExpose({
  elements,
  pointers,
  setElementsAnim,
  setPointerPosition,
  setBorderVisibility,
  swapElements,
  toggleBorderSvg,
  arrayHeight,
});
</script>

<style lang="scss" scoped>
.fade-in-out-move,
.fade-in-out-enter-active,
.fade-in-out-leave-active {
  transition: all 150ms ease-out;
}

.fade-in-out-enter-from,
.fade-in-out-leave-to {
  opacity: 0;
}

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

  .pointer-wrapper {
    position: absolute;
    top: -25%;
    display: flex;
    justify-content: center;
    transition: opacity 200ms ease;

    .pointer {
      width: 25%;
      max-width: 25px;
      min-width: 12px;
      // transform: translateX(-250%);
    }
  }

  .element-move,
  .element-enter-active,
  .element-leave-active {
    transition: all 150ms ease-out;
  }

  .element-enter-from,
  .element-leave-to,
  .border-leave-to {
    transform: translateX(5vw);
  }

  .elements {
    position: relative;
    display: flex;
    border: solid $primary-black 2px;
    overflow: hidden;
    flex: 4;
    gap: 2px;
    max-height: 16vh;

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

    .border-move,
    .border-leave-active {
      transition: all 150ms ease-out;
    }

    .border-enter-active {
      transition: all 150ms ease-out 100ms;
    }

    .border-enter-to {
      height: 100%;
    }

    .border-enter-from {
      height: 0 !important;
    }

    .borders {
      position: absolute;
      z-index: 1;
      display: flex;
      width: 100%;
      height: 100%;

      .border {
        flex: 1;
        height: 100%;
        border-left: 2px solid $primary-black;
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
