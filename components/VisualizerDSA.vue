<template>
  <section class="visualizer">
    <header class="header">
      <h1 class="title">{{ title }}</h1>
      <nav class="sidebar-nav">
        <transition name="close-button" appear :duration="300">
          <button v-if="Object.values(sidebarTabs).includes(true)" class="close-button" @click="closeSidebar">
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
        <div class="explanations">
          <Transition name="fade-in-out">
            <span
              v-show="timeline.currStep === 0 || visualizerSettings.settings.explanation.state"
              ref="explanation"
              class="explanation"
            >
              To start, hit play
            </span>
          </Transition>
        </div>
        <slot name="visual"></slot>
        <div class="controls">
          <button class="control-button" :disabled="timeline.currStep === 0" @click="restart">
            <RestartIcon class="icon restart" />
          </button>
          <button
            class="control-button"
            :disabled="timeline.currStep === 1"
            @click="timeline.currStep > 0 ? seek(-1) : null"
          >
            <SkipLeftIcon class="icon" />
          </button>
          <button class="control-button" @click="!timeline.restarting ? playClick() : null">
            <PauseIcon v-if="visualPlaying" class="icon" />
            <PlayIcon v-else class="icon play" />
          </button>
          <button
            class="control-button"
            :disabled="
              (timeline.currStep > 0 &&
                timeline.currStep === Object.keys(timeline.tl.labels).filter((key) => !isNaN(key)).length) ||
              timeline.currStep === timeline.numSteps
            "
            @click="timeline.currStep > 0 ? seek(1) : null"
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
              <VisualizerSettings ref="settings" @restart="restart" />
            </slot>
          </div>
          <div class="tab" :class="{ open: sidebarTabs.explanation }">
            <VisualizerExplanation :explanations="explanationList" />
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
import { ref, reactive } from 'vue';
import { timelineStore } from '../stores/timeline';
import { visualizerSettingsStore } from '../stores/visualizerSettings';
import isEqual from 'lodash.isequal';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/dist/TextPlugin';

import RestartIcon from '../assets/svgs/restart.svg';
import PauseIcon from '../assets/svgs/pause.svg';
import PlayIcon from '../assets/svgs/play.svg';
import SkipLeftIcon from '../assets/svgs/skipLeft.svg';
import SkipRightIcon from '../assets/svgs/skipRight.svg';

gsap.registerPlugin(TextPlugin);

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  transitionSpeed: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['start', 'restart']);

const timeline = timelineStore();
const visualizerSettings = visualizerSettingsStore();

const explanation = ref();
const explanationCount = ref(0);
const explanationTrack = reactive([]);
const explanationOnSeek = reactive({
  tl: null,
  explanationCount: null,
  tweensToKill: null,
  textLength: null,
  textAnimsAdded: null,
});
const explanationList = reactive({});
const visualPlaying = ref(false);
const sidebarOpen = ref(true);
const sidebarTabs = reactive({
  settings: true,
  explanation: false,
  description: false,
});

function playClick() {
  visualPlaying.value = !visualPlaying.value;
  if (timeline.currStep === 0) {
    // Always update selected when starting the animation
    visualizerSettings.selected = { ...JSON.parse(JSON.stringify(visualizerSettings.settings)) };
    emit('start');
  } else if (visualPlaying.value) {
    timeline.tl.resume();
  } else {
    timeline.tl.pause();
  }
}

function restart() {
  if (!isEqual(visualizerSettings.localState, visualizerSettings.selected)) {
    timeline.restarting = true;

    // Stop any current animations
    timeline.tl.kill();

    // Reset timeline state
    timeline.tl.clear(true);
    timeline.currStep = 0;

    // Reset visual state - set to playing since restart will start the animation
    visualPlaying.value = true;

    // Reset explanation state
    explanationCount.value = 0;
    explanationTrack.length = 0;
    explanationOnSeek.tl = null;
    explanationOnSeek.explanationCount = null;
    explanationOnSeek.tweensToKill = null;
    explanationOnSeek.textLength = null;
    explanationOnSeek.textAnimsAdded = null;

    // Apply the new settings
    visualizerSettings.restart();

    // Clear explanation text
    if (explanation.value) {
      explanation.value.innerHTML = '';
    }

    emit('restart');

    timeline.restarting = false;
  } else {
    timeline.goto('1.1');
  }
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

function seek(value) {
  if (explanationOnSeek.tl) {
    if (
      !explanationTrack[explanationOnSeek.explanationCount] &&
      explanationOnSeek.textAnimsAdded === explanationOnSeek.textLength &&
      explanationOnSeek.tweensToKill.length !== 0
    ) {
      /*
        If the explanation hasn't been ran through completely allowing the last onComplete to run,
        and all of the text animations have been added,
        and some of the underlining animations have been added.
      */

      // Carrying out the last onComplete that would haved ran.
      explanationOnSeek.tweensToKill.forEach((id) => {
        if (explanationOnSeek.tl.getById(id)) {
          explanationOnSeek.tl.getById(id).kill();
        }
      });
      explanationTrack[explanationOnSeek.explanationCount] = true;
    } else if (
      !explanationTrack[explanationOnSeek.explanationCount] &&
      explanationOnSeek.textAnimsAdded !== explanationOnSeek.textLength &&
      explanationOnSeek.tweensToKill.length !== 0
    ) {
      /*
        If the explanation hasn't been ran through completely allowing the last onComplete to run,
        and not all of the text animations have been added,
        and some of the underlining animations have been added.
      */

      // Killing all the animations except the first text animation. Allowing the timeline to be recalculated when needed again.
      for (let i = 1; i < explanationOnSeek.tl.getChildren(true).length; i++) {
        explanationOnSeek.tl.getChildren(true)[i].kill();
      }
    }
  }
  timeline.seek(value);
}

function changeExplanation(tl, text, i, addStepLabel) {
  // Building the explanationList object
  if (typeof explanationList[`${i}`] === 'undefined') {
    explanationList[`${i}`] = [];
  }
  const combinedText = text[0].string + text[1].string;
  explanationList[`${i}`].push(combinedText);

  // Making the origninal explanation slide to the left and fade away
  tl.to('.explanation', { duration: props.transitionSpeed.int * 0.4, xPercent: 20, opacity: 0, ease: 'power2' }, '>');

  /*
    For ending explanations, adding a label. Also making sure it's added after the explanation has gone off to the side
    for the previous steps last explanation.
  */
  if (addStepLabel) {
    timeline.tl.addLabel(`${i}`, `+=${props.transitionSpeed.int * 0.4 + 1}`);
  }

  // Making the explanation div go back to the center and have an opacity of 1
  tl.to('.explanation', { duration: 0, xPercent: 0, text: '', opacity: 1 }, '>');

  explanationTrack.push(false);
  const util = {
    tweensToKill: new Set([]),
    textAnimsAdded: 0,
  };

  // Adding a different timeline so the explanation animation can play along with other animations on the global timeline
  const tl2 = gsap.timeline();
  onCompleteExplanation(tl2, text, explanationCount.value, util, 0, `${i}.${explanationList[`${i}`].length}`);
  // onCompleteExplanation(tl2, text, explanationCount.value, util, 0);
  tl.add(tl2);

  // Adding labels for each explanation step to use for labels on the main timeline.tl
  tl.addLabel(`${i}.${explanationList[`${i}`].length}`);

  timeline.numSteps = i;
  explanationCount.value += 1;
}

function onCompleteExplanation(tl, text, explanationCount, util, i, explanationLabel) {
  // function onCompleteExplanation(tl, text, explanationCount, util, i) {
  const prevInnerHTML = explanation.value.innerHTML;

  // Only adding another text animation if the animation hasn't gone through yet
  if (!explanationTrack[explanationCount]) {
    util.textAnimsAdded += 1;
    tl.to('.explanation', {
      id: `text${i}`,
      duration: props.transitionSpeed.int * 0.6,
      text: {
        value: i === 0 ? text[i].string : `${prevInnerHTML}${text[i].string}`,
        speed: visualizerSettings.settings.speed.state * 0.01 * 6,
        type: 'diff',
      },
      ease: 'power1',
      onStart: () => {
        if (explanationLabel) {
          timeline.currExplanation = explanationLabel;
        }
      },
      onComplete: () => {
        explanationOnSeek.tl = tl;
        explanationOnSeek.explanationCount = explanationCount;
        explanationOnSeek.tweensToKill = util.tweensToKill;
        explanationOnSeek.textLength = text.length;
        explanationOnSeek.textAnimsAdded = util.textAnimsAdded;

        if (text[i].underlined.length) {
          // If there is underlined animations for this text animation, surrounding the text that's going to be underlined with a span tag so it can be accessed as a child node.
          let innerHTML = text[i].string;
          for (const underlined of text[i].underlined) {
            innerHTML = innerHTML.replace(
              underlined.text,
              `<span class="explanation-no-underline">${underlined.text}</span>`,
            );
          }

          // Combining the previous innerHTML and the newly editted text unless the previous innerHTML comes from the last explanation.
          explanation.value.innerHTML = i === 0 ? innerHTML : `${prevInnerHTML}${innerHTML}`;

          for (const [j, underlined] of text[i].underlined.entries()) {
            // Getting the end time of the last added underline animation or text animation depending on if there are any previously added underline animations in this current loop.
            const position = j !== 0 ? tl.getById(`underline${i}${j - 1}`)._end : tl.getById(`text${i}`)._end;

            util.tweensToKill.add(`underline${i}${j}`);
            const underline = (config) => {
              return tl.to(
                explanation.value.children[underlined.i],
                {
                  id: `underline${i}${j}`,
                  duration: props.transitionSpeed.int * 0.4,
                  text: {
                    value: text[i].underlined[j].text,
                    speed: visualizerSettings.settings.speed.state * 0.01 * 6,
                    newClass: 'explanation-underline',
                  },
                  ease: 'power1',
                  onCompleteParams: config.onCompleteParams,
                  onComplete: config.onComplete,
                },
                position,
              );
            };
            if (i !== text.length - 1 && j === text[i].underlined.length - 1) {
              // If this is the last underline animation but not the last text animation, run this function again.
              underline({
                onCompleteParams: [tl, text, explanationCount, util, i + 1],
                onComplete: onCompleteExplanation,
              });
            } else {
              // If this is the last underline animation and the last text animation, kill the underline animations and set the explanation tracker to true.
              underline({
                onComplete: () => {
                  if (i === text.length - 1 && j === text[i].underlined.length - 1) {
                    explanationTrack[explanationCount] = true;
                    util.tweensToKill.forEach((id) => {
                      tl.getById(id).kill();
                    });
                    util.tweensToKill.clear();
                  }
                },
              });
            }
          }
        } else {
          onCompleteExplanation(tl, text, explanationCount, util, i + 1);
        }
      },
    });
  }
}

defineExpose({ visualPlaying, changeExplanation });
</script>

<style>
.explanation-no-underline {
  text-decoration: none;
}

.explanation-underline {
  text-decoration: underline var(--underline-color);
}
</style>

<style lang="scss" scoped>
.fade-in-out-enter-active {
  transition: all 200ms ease 200ms;
}

.fade-in-out-leave-active {
  transition: all 200ms ease;
}

.fade-in-out-enter-from {
  position: absolute;
  opacity: 0;
  transform: translateX(-100%);
}

.fade-in-out-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

$sidebar-width: 43.2em;

.visualizer {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  font-size: 12px;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 6rem;

    .title {
      width: 45%;
      padding: 10px 25px;
      margin: 0 2.25rem;
      margin: 0;
      font-family: $primary-font-stack;
      font-size: 4em;
      font-weight: 400;
      color: $primary-dark;
      letter-spacing: 0.09ch;
      border-bottom: solid 1px var(--border-primary);
    }

    .sidebar-nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: $sidebar-width;
      height: 2.5rem;
      padding: 0 1.25em;
      margin-top: 0.5rem;
      box-shadow: 2px 0.75px 1px $primary-light-grey;

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
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1.75em;
        height: 1.75em;
        padding: 0;
        background: transparent;
        border: 0;
        border-radius: 7px;

        &:hover {
          background: $primary-bright;
        }
      }

      .tab-buttons {
        display: flex;
        gap: 1em;
        margin-left: auto;

        .tab-button {
          cursor: pointer;
          padding: 3px 1em;
          font-size: inherit;
          background: transparent;
          border: 0;
          border-radius: 7px;
          outline: solid $primary-white 1px;
          transition: all 75ms ease;

          &:active,
          &.selected {
            background: $primary-bright;
          }

          &:hover:not(.selected) {
            outline: $primary-dark-bright solid 1px;
            outline-offset: -1px;
          }

          .tab-button-text {
            font-family: $secondary-font-stack;
            font-size: 15px;
            color: $primary-dark;
          }
        }
      }
    }
  }

  .main {
    display: flex;
    flex: 1;
    justify-content: space-around;

    .visual {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 57%;

      // better than this
      height: 100%;
      padding: 10vh 1em 20vh;
      margin-left: auto;
      transition: width 200ms ease-out;

      .explanations {
        position: relative;
        display: flex;
        justify-content: center;
        width: 100%;
        max-width: 50em;

        .underline {
          text-decoration: underline var(--underline-color);
        }

        .explanation {
          height: 2em;
          margin-bottom: 2vh;
          font-family: $secondary-font-stack;
          font-size: 22px;
          font-weight: 300;
          color: var(--text-explanation);
          text-align: center;
          letter-spacing: 0.05ch;

          .underline {
            text-decoration: underline var(--underline-color);
          }
        }
      }

      &.center {
        width: 100%;

        // Length of navbar + current padding
        padding-right: 6.33em;

        .explanations {
          max-width: none;

          @include bp-lg-laptop {
            max-width: 50em;
          }
        }
      }

      .controls {
        display: flex;
        gap: 3em;
        justify-content: flex-end;
        width: 90%;
        padding-right: 9em;
        margin: 0 auto;

        .control-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 12.5%;
          max-width: 5em;
          height: 100%;
          aspect-ratio: 1;
          padding: 0;
          cursor: pointer;
          background: $primary-light;
          border: 0;
          border-radius: 100%;
          outline: solid 0 $primary-white;
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
            background: #cbbf9b;
            outline: solid 3px $primary-white;
            outline-offset: -2px;
          }

          &:disabled {
            background-color: #eae8e0;
          }

          .icon {
            width: 40%;
            height: 40%;
            aspect-ratio: 1;
            filter: drop-shadow(0 2px 1px rgb(0 0 0 / 8%));

            &.restart {
              width: 53.5%;
              height: 53.5%;
              transform: translateX(-1px);
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
      width: 0;
      margin-right: 0;
      margin-left: auto;
      overflow: hidden;
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
