<template>
  <div class="visualizer-sidebar" :class="{ open: open }">
    <h1 class="header">{{ title }}</h1>

    <div class="search">
      <SearchIcon class="search-icon" />
      <input
        class="search-input"
        :placeholder="`Search ${title}`"
        spellcheck="false"
        v-model="userInput"
        @input="filterSearch"
      />
    </div>

    <div class="search-results" v-if="userInput">
      <ul class="result-list" v-if="Object.keys(searchResults).length">
        <li v-for="content in Object.keys(searchResults)" :key="content">
          <button
            class="result"
            :disabled="route.params.visualizer === content.replaceAll(/[\s\-*\']/g, '')"
            @click="router.push(`visualizer/${title}-${content.replaceAll(/[\s\-*\']/g, '')}`)"
          >
            <div class="item">
              <span class="item-text" v-for="(contentIndex, index) in searchResults[content].indices" :key="contentIndex">
                <span v-if="!index">
                  <mark class="highlight" v-if="content.toLowerCase().startsWith(userInput.toLowerCase())">
                    {{ content.substring(0, userInput.length) }}
                  </mark>
                  <span v-else>
                    {{ content.substring(0, contentIndex) }}
                  </span>
                </span>
                <mark class="highlight" v-if="index || !content.toLowerCase().startsWith(userInput.toLowerCase())">
                  {{ content.substring(contentIndex, contentIndex + userInput.length) }}
                </mark>
                <span v-if="searchResults[content].indices.length - 1 === index" class="item">
                  {{ content.substring(contentIndex + userInput.length) }}
                </span>
                <span v-else>
                  {{ content.substring(contentIndex + userInput.length, searchResults[content].indices[index + 1]) }}
                </span>
              </span>
            </div>
            <span class="category">{{
              `${searchResults[content].category.charAt(0).toUpperCase()}${searchResults[content].category.substring(1)}`
            }}</span>
          </button>
        </li>
      </ul>
      <h2 class="no-results" v-else>No results match your search</h2>
    </div>

    <ul class="categories" v-if="!userInput">
      <li v-for="category in Object.keys(dropdownContent)" :key="category">
        <button class="category" :class="{ selected: openDropdowns.has(category) }" @click="categoryClick(category)">
          <!-- Changing capital first letter to capital letters and putting space before any other capital letter -->
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
              : { maxHeight: `${dropdownContent[category].length * 29.06}px` },
          ]"
        >
          <li v-for="content in dropdownContent[category]" :key="content">
            <button
              class="item"
              :disabled="route.params.visualizer === content.replaceAll(/[\s\-*\']/g, '')"
              @click="router.push(`visualizer/${title}-${content.replaceAll(/[\s\-*\']/g, '')}`)"
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

import { ref, reactive } from 'vue';

const router = useRouter();
const route = useRoute();

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

const userInput = ref(null);
const searchResults = reactive({});
const openDropdowns = reactive(new Set());

function filterSearch() {
  // Resetting the search results object
  Object.keys(searchResults).forEach((key) => {
    delete searchResults[key];
  });

  // Preventing infinite while loop caused from a blank string input
  if (userInput.value !== '') {
    Object.keys(props.dropdownContent).forEach((key) => {
      for (const val of props.dropdownContent[key]) {
        const compareVal = val.toLowerCase();
        if (compareVal.includes(userInput.value.toLowerCase())) {
          searchResults[val] = { category: key, indices: [] };

          // FIXME: account for special characters (* currently causes error since 'A* Tree Search' exists in algorithms data)

          // Looking for the indices of userInput to eventually emphasize in the item
          const regexInp = new RegExp(userInput.value.toLowerCase(), 'g');
          let match;
          while ((match = regexInp.exec(compareVal))) {
            searchResults[val].indices.push(match.index);
          }
        }
      }
    });
  }
}

function categoryClick(category) {
  if (!openDropdowns.has(category)) {
    openDropdowns.add(category);
  } else {
    openDropdowns.delete(category);
  }
}

defineExpose({ openDropdowns, userInput });
</script>

<style lang="scss" scoped>
.visualizer-sidebar {
  font-size: inherit;
  position: absolute;
  top: 0;
  left: -24em;
  display: flex;
  flex-direction: column;
  gap: 1.66em;
  width: 28.42em;
  padding: 0.66em 1.33em;
  color: $primary-black;
  transition: transform 150ms ease-in-out;

  &.open {
    transform: translateX(29.32em);
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

    .search-icon {
      height: 12px;
      width: 12px;
    }

    .search-input {
      border: 0;
      background: transparent;
      flex: 1;
      height: 100%;
      font-family: $secondary-font-stack;
      color: $primary-black;
      padding: 3px 0;

      &::placeholder {
        color: $primary-black;
      }

      &:focus {
        border: 0;
        outline: none;
      }
    }
  }

  .search-results {
    height: 100%;
    display: flex;
    flex-direction: column;
    width: 108.5%;
    overflow-y: scroll;
    overflow-x: hidden;

    .result-list {
      list-style: none;
      text-decoration: none;
      padding: 0;
      margin: 0;
      height: fit-content;
      width: 100%;
      border-left: 2px solid $primary-light;

      .result {
        background: transparent;
        border: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 2.5em;
        width: 100%;
        margin-right: -1.33em;
        padding-left: 0.9em;
        padding-right: 1.33em;
        font-family: $secondary-font-stack;

        &:hover {
          background: #f3f3f3;
        }

        &:active {
          background: #ededed;
        }

        .item {
          font-size: 14px;
          color: $primary-black;

          .highlight {
            color: $primary-black;
            background-color: #dfe3e3;
          }
        }

        .category {
          font-size: 10px;
          color: $primary-grey;
        }

        &:disabled {
          text-decoration: line-through;
        }
      }
    }

    .no-results {
      font-size: 1em;
      font-family: $secondary-font-stack;
      font-weight: 400;
      align-self: center;
      margin: 0 auto;
    }
  }

  .categories {
    list-style: none;
    text-decoration: none;
    padding: 0;
    margin: 0;
    margin-right: -1.33em;
    display: flex;
    flex-direction: column;
    gap: 0.7em;
    height: 100%;
    overflow-y: auto;

    .category {
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
        width: 9px;
        height: 6px;
        opacity: 0;
        transform: rotate(180deg);
        transition: opacity 100ms ease, transform 125ms ease-in-out;
      }

      &:hover {
        color: $primary-dark;

        .arrow-icon {
          opacity: 1;
        }
      }

      &:active,
      &.selected {
        color: $primary-dark;

        .arrow-icon {
          transform: rotate(0deg);
        }
      }

      &.selected:active {
        .arrow-icon {
          transform: rotate(180deg);
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

      .item {
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

        &:active {
          background: #ededed;
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
