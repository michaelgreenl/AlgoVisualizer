<template>
  <section class="visualizer">
    <!-- Check if v-binding an attribute that is undefined causes an error  -->
    <!-- (like setting max on a number input when max isn't there in the input for loop) -->
    <header class="header">
      <h1 class="title">{{ title }}</h1>
      <nav class="sidebar-nav">
        <transition name="close-button" appear :duration="300">
          <button
            class="close-button"
            @click="closeSidebar"
            v-if="Object.values(sidebarTabs).includes(true)"
          >
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
      <div class="visual">
        <slot name="visual"></slot>
      </div>
      <div class="sidebar" :class="{ open: sidebarOpen }">
        <div
          class="tabs"
          :class="{ one: sidebarTabs.settings, two: sidebarTabs.explanation, three: sidebarTabs.description }"
        >
          <div class="tab" :class="{ open: sidebarTabs.settings }">
            <ul class="settings">
              <li class="input" v-for="input in settings" :key="input">
                <label class="label" :for="input.label">{{ input.label }}:</label>
                <input
                  :class="input.type"
                  :type="input.type"
                  :name="input.label"
                  v-model="input.value"
                  :min="input.min"
                  :max="input.max"
                />
                <output>{{ input.value }}</output>
              </li>
            </ul>
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
import { ref, reactive } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  settings: {
    type: Object,
    required: true,
  },
});

const sidebarTabs = reactive({
  settings: true,
  explanation: false,
  description: false,
});

const sidebarOpen = ref(true);

function tabButtonClick(tab) {
  Object.keys(sidebarTabs).forEach((key) => (sidebarTabs[key] = false));
  sidebarTabs[tab] = true;
  sidebarOpen.value = true;
}

function closeSidebar() {
  sidebarOpen.value = false;
  setTimeout(() => Object.keys(sidebarTabs).forEach((key) => (sidebarTabs[key] = false)), 100);
}
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
      border-bottom: solid $primary-light-grey 1px;

      .close-button-enter-active .close-icon .line-one,
      .close-button-leave-active .close-icon .line-one {
        transition: transform 200ms ease;
      }

      .close-button-enter-from .close-icon .line-one,
      .close-button-leave-to .close-icon .line-one {
        transform: translate(-12px, -11px);
      }

      .close-button-enter-active .close-icon .line-two,
      .close-button-leave-active .close-icon .line-two {
        transition: transform 200ms ease 50ms;
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
        border-radius: 10px;

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

    .visual {
      flex: 1;
    }

    .sidebar {
      position: relative;
      display: flex;
      overflow: hidden;
      width: $sidebar-width;
      transform: translateX($sidebar-width);
      transition: transform 200ms ease;

      &.open {
        transform: translateX(0);
      }

      .tabs {
        display: flex;
        width: calc($sidebar-width * 3);
        transition: transform 200ms ease-in-out;

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
          visibility: hidden;
          padding: 0 1.5em;
          width: $sidebar-width;

          &.open {
            visibility: visible;
          }

          .settings {
            list-style: none;
            text-decoration: none;
            padding: 0;
            margin: 0;

            .input {
              display: flex;
              align-items: center;

              .label {
                font-family: $secondary-font-stack;
                font-weight: 400;
                font-size: 15px;
                color: $primary-black;
              }
            }
          }
        }
      }
    }
  }
}
</style>
