<template>
  <section class="visualizer">
    <header class="header">
      <h1 class="title">{{ title }}</h1>
      <nav class="sidebar-nav">
        <transition name="close-button" appear :duration="300">
          <button class="close-button" @click="closeSidebar" v-if="Object.values(sidebarTabs).includes(true)">
            <svg class="close-icon" width="12" height="12" viewBox="0 0 12 11" xmlns="http://www.w3.org/2000/svg">
              <line
                class="line-one"
                x1="1.75164"
                y1="1.09528"
                x2="10.7602"
                y2="10.1038"
                stroke="#52707C"
                stroke-width="1.5"
                stroke-linecap="round"
              />
              <line
                class="line-two"
                x1="1.71384"
                y1="10.1038"
                x2="10.7224"
                y2="1.09529"
                stroke="#52707C"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
          </button>
        </transition>
        <div class="tab-buttons">
          <button class="tab-button" :class="{ selected: sidebarTabs.settings }" @click="tabButtonClick('settings')">
            <span class="tab-button-text">Settings</span>
          </button>
          <button
            class="tab-button"
            :class="{ selected: sidebarTabs.explanation }"
            @click="tabButtonClick('explanation')"
          >
            <span class="tab-button-text">Explanation</span>
          </button>
          <button
            class="tab-button"
            :class="{ selected: sidebarTabs.description }"
            @click="tabButtonClick('description')"
          >
            <span class="tab-button-text">Description</span>
          </button>
        </div>
      </nav>
    </header>
    <div class="main">
      <div class="visual" :class="{ center: !sidebarOpen }">
        <h2 class="explanation" v-if="visualizerSettings.explanation.value">To start, hit play.</h2>
        <slot name="visual"></slot>
        <div class="controls">
          <button class="control-button" @click="restart">
            <RestartIcon class="icon restart" />
          </button>
          <button class="control-button" @click="emit('setCurrStep', currStep - 1)" :disabled="currStep < 1">
            <SkipLeftIcon class="icon" />
          </button>
          <button class="control-button" @click="playClick">
            <PauseIcon class="icon" v-if="visualPlaying" />
            <PlayIcon class="icon play" v-else />
          </button>
          <button
            class="control-button"
            @click="emit('setCurrStep', currStep + 1)"
            :disabled="currStep === steps.length"
          >
            <SkipRightIcon class="icon" />
          </button>
        </div>
      </div>
      <div class="sidebar" :class="{ open: sidebarOpen }">
        <div
          class="tabs"
          :class="{ one: sidebarTabs.settings, two: sidebarTabs.explanation, three: sidebarTabs.description }"
        >
          <div class="tab" :class="{ open: sidebarTabs.settings }">
            <slot name="settings">
              <VisualizerSettings :visualPlaying="visualPlaying" />
            </slot>
          </div>
          <div class="tab" :class="{ open: sidebarTabs.explanation }">
            <slot name="explanation">explanation</slot>
          </div>
          <div class="tab" :class="{ open: sidebarTabs.description }">
            <slot name="description">description</slot>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import RestartIcon from '../assets/svgs/restart.svg';
import PauseIcon from '../assets/svgs/pause.svg';
import PlayIcon from '../assets/svgs/play.svg';
import SkipLeftIcon from '../assets/svgs/skipLeft.svg';
import SkipRightIcon from '../assets/svgs/skipRight.svg';

import { ref, reactive } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  currStep: {
    type: Number,
    required: true,
  },
  steps: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['setCurrStep', 'playClick']);

const visualizerSettings = useVisualizerSettings();

const visualPlaying = ref(false);
const sidebarOpen = ref(true);
const sidebarTabs = reactive({
  settings: true,
  explanation: false,
  description: false,
});

function playClick() {
  visualPlaying.value = !visualPlaying.value;
  emit('playClick');
}

function restart() {
  emit('setCurrStep', 0);
  visualPlaying.value = false;
}

function tabButtonClick(tab) {
  sidebarTabs[tab] = true;
  Object.keys(sidebarTabs).forEach((key) => (sidebarTabs[key] = key === tab ? true : false));
  sidebarOpen.value = true;
}

function closeSidebar() {
  sidebarOpen.value = false;
  setTimeout(() => Object.keys(sidebarTabs).forEach((key) => (sidebarTabs[key] = false)), 100);
}

defineExpose({ visualPlaying });
</script>

<style lang="scss" scoped>
$sidebar-width: 43.2em;

.visualizer {
  display: flex;
  flex-direction: column;
  font-size: 12px;
  width: 100%;
  height: 100%;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 6rem;
    width: 100%;

    .title {
      font-family: $primary-font-stack;
      font-weight: 400;
      letter-spacing: 0.09ch;
      margin: 0 2.25rem;
      color: $primary-dark;
      font-size: 4em;
    }

    .sidebar-nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 0.5rem;
      height: 2.5rem;
      width: $sidebar-width;
      padding: 0 1.25em;
      box-shadow: 2px 1px 1px $primary-light-grey;

      .close-button-enter-active .close-icon .line-one,
      .close-button-leave-active .close-icon .line-one {
        transition: transform 100ms ease-out;
      }

      .close-button-enter-from .close-icon .line-one,
      .close-button-leave-to .close-icon .line-one {
        transform: translate(-12px, -11px);
      }

      .close-button-enter-active .close-icon .line-two,
      .close-button-leave-active .close-icon .line-two {
        transition: transform 100ms ease-out 75ms;
      }

      .close-button-enter-from .close-icon .line-two,
      .close-button-leave-to .close-icon .line-two {
        transform: translate(-12px, 11px);
      }

      .close-button {
        display: flex;
        align-items: center;
        justify-content: center;
        background: transparent;
        border: 0;
        padding: 0;
        height: 1.75em;
        width: 1.75em;
        border-radius: 7px;

        &:hover {
          background: $primary-bright;
        }
      }

      .tab-buttons {
        display: flex;
        margin-left: auto;
        gap: 1em;

        .tab-button {
          font-size: inherit;
          background: transparent;
          border: 0;
          outline: solid $primary-white 1px;
          padding: 3px 1em;
          border-radius: 7px;
          transition: all 75ms ease;

          &:hover:not(.selected) {
            outline: #eff1f1 solid 2px;
            outline-offset: -1px;
          }

          &:active,
          &.selected {
            background: $primary-bright;
          }

          .tab-button-text {
            color: $primary-dark;
            font-size: 15px;
            font-family: $secondary-font-stack;
          }
        }
      }
    }
  }

  .main {
    flex: 1;
    display: flex;
    justify-content: space-around;

    .visual {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 10vh 1em 20vh;
      margin-left: auto;

      // better than this
      height: 100%;
      width: 57%;
      transition: width 200ms ease-out;

      &.center {
        // Length of navbar + current padding
        padding-right: 6.33em;
        width: 100%;
      }

      .explanation {
        color: $primary-dark;
        font-size: 22px;
        font-family: $secondary-font-stack;
        font-weight: 400;
      }

      .controls {
        display: flex;
        justify-content: flex-end;
        gap: 3em;
        margin: 0 auto;
        padding-right: 9em;
        width: 90%;

        .control-button {
          padding: 0;
          border: 0;
          outline: solid 0px $primary-white;
          background: $primary-light;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          width: 12.5%;
          max-width: 5em;
          aspect-ratio: 1;
          border-radius: 100%;
          transition: all 50ms ease-out;

          &:first-child {
            margin-right: auto;
          }

          &:last-child {
            margin-right: auto;
          }

          &:hover {
            background: #d4cca7;
          }

          &:active {
            outline: solid 3px $primary-white;
            background: #d4cca7;
            outline-offset: -2px;
          }

          .icon {
            aspect-ratio: 1;
            filter: drop-shadow(0 2px 1px rgba(0, 0, 0, 0.08));
            height: 40%;
            width: 40%;

            &.restart {
              transform: translateX(-1px);
              height: 53.5%;
              width: 53.5%;
            }

            &.play {
              transform: translateX(2px);
            }
          }
        }
      }
    }

    .sidebar {
      position: relative;
      display: flex;
      overflow: hidden;
      margin-right: 0;
      margin-left: auto;
      width: 0;
      transition: width 200ms ease-out;

      &.open {
        width: $sidebar-width;
      }

      .tabs {
        display: flex;
        width: calc($sidebar-width * 3);
        transition: transform 200ms ease-out;

        &.one {
          // Default tab with translateX(0)
          transform: translateX(0);
        }

        &.two {
          transform: translateX(calc($sidebar-width * -1));
        }

        &.three {
          transform: translateX(calc($sidebar-width * -2));
        }

        .tab {
          width: $sidebar-width;
          padding: 0 1.5em;
          visibility: hidden;
          transition: visibility 200ms;

          /*
            Have at width 0 when tab is closed to prevent situation where switching from tab 1 to tab 3 has large space between.
            This causes the animation to be faster and look worse, and in the future if there were more tabs the situation would
            become worse.
          */
          // width: 0;

          &.open {
            visibility: visible;

            // Make the open width $sidebar-width for the issue stated above
            // Something also needs to be done about the .tabs width and the translate animations, along with the logic for it
            // width: $sidebar-width;
          }
        }
      }
    }
  }
}
</style>
