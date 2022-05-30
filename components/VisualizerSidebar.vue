<template>
  <div class="visualizer-sidebar" :class="{ open: open }">
    <h1 class="header">{{ title }}</h1>

    <div class="search">
      <SearchIcon />
      <input class="search-input" :placeholder="`Search ${title}`" v-model="searchModel" />
    </div>

    <ul class="categories">
      <li class="category" v-for="category in Object.keys(dropdownContent)" :key="category">
        <button
          class="category-button"
          :class="{ selected: openDropdowns.has(category) }"
          @click="categoryClick(category)"
        >
          <span v-if="/[A-Z]/.test(category)">
            {{
              `${category.charAt(0).toUpperCase()}${category.substring(
                1,
                category.search(/[A-Z]/g),
              )} ${category.substring(category.search(/[A-Z]/g))}`
            }}
          </span>
          <span v-else>
            {{ `${category.charAt(0).toUpperCase()}${category.substring(1)}` }}
          </span>
          <ArrowDownIcon class="arrow-icon" />
        </button>
        <ul
          class="items"
          :class="{ selected: openDropdowns.has(category) }"
          :style="[
            !openDropdowns.has(category)
              ? { maxHeight: '0' }
              : { maxHeight: `${dropdownContent[category].size * 29.06}px` },
          ]"
        >
          <li class="item" v-for="content in dropdownContent[category]" :key="content">
            <button
              class="item-button"
              :disabled="selectedVisualizer === content"
              @click="selectedVisualizer = content"
            >
              <span class="content">{{ content }}</span>
            </button>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script setup>
import ArrowDownIcon from '../assets/svgs/arrowDown.svg';
import SearchIcon from '../assets/svgs/search.svg';

import { reactive } from 'vue';

const props = defineProps({
  dropdownContent: {
    type: Object,
    required: true,
  },
  open: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
});

const selectedVisualizer = useSelectedVisualizer();
const searchModel = ref();

const openDropdowns = reactive(new Set());

function categoryClick(category) {
  if (!openDropdowns.has(category)) {
    openDropdowns.add(category);
  } else {
    openDropdowns.delete(category);
  }
}

defineExpose({ openDropdowns });
</script>

<style lang="scss" scoped>
.visualizer-sidebar {
  font-size: inherit;
  position: absolute;
  top: 0;
  left: -20em;
  display: flex;
  flex-direction: column;
  gap: 1.66em;
  width: 24.42em;
  padding: 0.66em 1.33em;
  color: $primary-black;
  transition: transform 150ms ease-in-out;

  &.open {
    transform: translateX(25.42em);
  }

  .header {
    font-size: 20px;
    font-family: $primary-font-stack;
    font-weight: 300;
    margin-bottom: 0;
  }

  .search {
    display: flex;
    align-items: center;
    gap: 0.75em;
    min-height: 2.5em;
    width: 100%;
    padding: 0 1em;
    border-radius: 8px;
    background-color: $primary-bright;
    color: $primary-black;

    .search-input {
      border: 0;
      background: transparent;
      flex: 1;
      height: 100%;
      font-family: $secondary-font-stack;
      color: $primary-black;

      &::placeholder {
        color: $primary-black;
      }

      &:focus {
        border: 0;
        outline: none;
      }
    }
  }

  .categories {
    list-style: none;
    text-decoration: none;
    flex-direction: column;
    padding: 0;
    margin: 0;
    margin-right: -1.33em;
    display: flex;
    gap: 0.7em;
    height: 100%;
    overflow-y: auto;

    .category {
      &-button {
        background: transparent;
        border: 0;
        padding: 0;
        display: flex;
        align-items: center;
        gap: 0.33em;
        font-size: 14px;
        font-family: $secondary-font-stack;
        font-weight: 400;
        letter-spacing: 0.09ch;
        color: $primary-black;
        transition: color 100ms ease;

        .arrow-icon {
          opacity: 0;
          transition: opacity 100ms ease, transform 125ms ease-in-out;
        }

        &:hover {
          color: $primary-dark;

          .arrow-icon {
            opacity: 1;
          }
        }

        &.selected {
          color: $primary-dark;

          .arrow-icon {
            opacity: 1;
            transform: rotate(180deg);
          }
        }
      }
    }

    .items {
      list-style: none;
      text-decoration: none;
      padding: 0;
      overflow: hidden;
      height: auto;
      max-height: 0;
      margin-left: 0.625rem;
      border-left: 2px solid $primary-light;
      transition: max-height 200ms ease-out, margin 0ms 200ms;

      &.selected {
        transition: max-height 200ms ease-out, margin 0ms;
        margin: 0.4em 0 0.4em 0.75em;
        margin-bottom: -4px;
      }

      .item-button {
        font-size: inherit;
        background: transparent;
        border: 0;
        display: flex;
        align-items: center;
        gap: 0.5em;
        padding: 0.35em 0;
        padding-left: 1em;
        width: 100%;
        font-family: $secondary-font-stack;
        font-weight: 400;
        transition: all 100ms ease;

        &:hover {
          background: #f3f3f3;
        }

        .content {
          font-size: 14px;
          letter-spacing: 0.09ch;
          white-space: nowrap;
          color: $primary-black;
        }

        &:disabled {
          .content {
            text-decoration: line-through;
          }
        }
      }
    }
  }
}
</style>
