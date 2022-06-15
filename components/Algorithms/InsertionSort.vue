<template>
  <div class="insertion-sort">
    <VisualizerDSA title="Insertion Sort" :settings="settings">
      <template #visual>
        <div
          ref="array"
          v-if="settings.visual.value === 'Array'"
          class="array"
          :style="{ aspectRatio: `${settings.arraySize.value + 4}/2` }"
        >
          <!-- Initial aspectRatio for 8 elements is 12, so add 4 -->
          <div class="elements">
            <transition-group name="elements">
              <div
                v-for="element in settings.arraySize.value"
                :key="element"
                class="element"
                :style="{ fontSize: `clamp(25px, ${arrayWidth / (2 * settings.arraySize.value)}px, 45px)` }"
              >
                <span v-if="settings.elementType.value === 'Range'" class="value">{{ element }}</span>
                <!-- FIXME: Make the random numbers not generate a whole new list of random numbers if a user is on ElementType: random and changes the ArraySize. -->
                <span v-if="settings.elementType.value === 'Random'" class="value">{{
                  Math.floor(Math.random() * 20)
                }}</span>
              </div>
            </transition-group>
          </div>
          <div class="indices">
            <transition-group name="elements">
              <div
                v-for="index in settings.arraySize.value"
                :key="index"
                class="index"
                :style="{ fontSize: `clamp(12px, ${arrayWidth / (5 * settings.arraySize.value)}px, 16px)` }"
              >
                <span class="value">{{ index - 1 }}</span>
              </div>
            </transition-group>
          </div>
        </div>
      </template>
      <template #explanation></template>
      <template #description></template>
    </VisualizerDSA>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue';

const array = ref(null);
const arrayWidth = ref(0);

onMounted(() => {
  const arraySizeObserver = new ResizeObserver(() => {
    arrayWidth.value = array.value.offsetWidth;
  });
  arraySizeObserver.observe(array.value);
});

const settings = reactive({
  visual: { label: 'Visual', type: 'radio', options: ['Array', 'Bar Graph'], value: 'Array' },
  speed: { label: 'Speed', type: 'range', min: 0, max: 100, value: 50 },
  arraySize: {
    label: 'Array Size',
    type: 'number',
    min: 8,
    get max() {
      return settings.visual.value === 'Array' ? 15 : 200;
    },
    value: 8,
  },
  elementType: { label: 'Element Type', type: 'radio', options: ['Range', 'Random'], value: 'Range' },
  explanation: { label: 'Show Explanation', type: 'checkbox', value: true },
});
</script>

<style lang="scss" scoped>
.insertion-sort {
  font-size: 12px;
  height: 100%;
  width: 100%;

  .array {
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

    .elements-move,
    .elements-enter-active,
    .elements-leave-active {
      transition: all 150ms ease-in-out;
    }

    .elements-enter-from {
      opacity: 0;
    }

    .elements-leave-to {
      opacity: 0;

      // FIXME: Make this translate the width of the element div.
      // SOL?: Make the leave-to class a style with a dynamic variable? (v-bind an object?)
      transform: translateX(30px);
    }

    .elements {
      display: flex;
      border: solid $primary-black 2px;
      overflow: hidden;
      flex: 4;
      max-height: 16vh;

      .element {
        position: relative;
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 300%;

        &::after {
          content: '';
          position: absolute;
          z-index: -1;
          height: 100%;
          width: 100%;
          border-left: solid $primary-black 2px;
        }

        &:first-child::after {
          border-left: 0;
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
