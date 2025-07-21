<template>
  <div class="visualizer-sidebar" :class="{ open: open }">
    <h1 class="header">{{ title }}</h1>

    <div class="search">
      <SearchIcon class="search-icon" />
      <input
        v-model="userInput"
        class="search-input"
        :placeholder="`Search ${title}`"
        spellcheck="false"
        @input="filterSearch"
      />
    </div>

    <div v-if="userInput" class="search-results">
      <ul v-if="Object.keys(searchResults).length" class="result-list">
        <li v-for="content in Object.keys(searchResults)" :key="content">
          <button
            class="result"
            :disabled="route.params.visualizer === content.replaceAll(/[\s\-*\']/g, '')"
            @click="router.push(`${title}-${content.replaceAll(/[\s\-*\']/g, '')}`)"
          >
            <div class="item">
              <span
                v-for="(contentIndex, index) in searchResults[content].indices"
                :key="contentIndex"
                class="item-text"
              >
                <span v-if="!index">
                  <mark v-if="content.toLowerCase().startsWith(userInput.toLowerCase())" class="highlight">
                    {{ content.substring(0, userInput.length) }}
                  </mark>
                  <span v-else>
                    {{ content.substring(0, contentIndex) }}
                  </span>
                </span>
                <mark v-if="index || !content.toLowerCase().startsWith(userInput.toLowerCase())" class="highlight">
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
              `${searchResults[content].category.charAt(0).toUpperCase()}${searchResults[content].category.substring(
                1,
              )}`
            }}</span>
          </button>
        </li>
      </ul>
      <h2 v-else class="no-results">No results match your search</h2>
    </div>

    <ul v-if="!userInput" class="categories">
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
              @click="router.push(`/${title}-${content.replaceAll(/[\s\-*\']/g, '')}`)"
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
import { ref, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import ArrowDownIcon from '../assets/svgs/arrowDown.svg';
import SearchIcon from '../assets/svgs/search.svg';

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

const userInput = ref();
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
  position: absolute;
  top: 0;
  left: -24em;
  display: flex;
  flex-direction: column;
  gap: 1.66em;
  width: 28.42em;
  padding: 0.66em 1.33em;
  font-size: inherit;
  color: var(--text-primary);
  transition: transform 150ms ease-in-out;

  &.open {
    transform: translateX(29.32em);
  }

  .header {
    margin-bottom: 0;
    font-family: $primary-font-stack;
    font-size: 20px;
    font-weight: 300;
  }

  .categories {
    display: flex;
    flex-direction: column;
    gap: 0.7em;
    height: 100%;
    padding: 0;
    margin: 0;
    margin-right: -1.33em;
    overflow-y: auto;
    text-decoration: none;
    list-style: none;

    .category {
      cursor: pointer;
      display: flex;
      gap: 0.33em;
      align-items: center;
      padding: 0;
      font-family: $secondary-font-stack;
      font-size: 14px;
      font-weight: 400;
      color: var(--text-primary);
      letter-spacing: 0.09ch;
      background: transparent;
      border: 0;
      transition: color 100ms ease;

      .arrow-icon {
        width: 9px;
        height: 6px;
        opacity: 0;
        transition: opacity 100ms ease, transform 125ms ease-in-out;
        transform: rotate(180deg);
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
      height: auto;
      max-height: 0;
      padding: 0;
      margin-left: 0.625rem;
      overflow: hidden;
      text-decoration: none;
      list-style: none;
      border-left: 2px solid $primary-light;
      transition: max-height 200ms ease-out, margin 0ms 200ms;

      &.selected {
        margin: 0.4em 0 0.4em 0.75em;
        margin-bottom: -4px;
        transition: max-height 200ms ease-out, margin 0ms;
      }

      .item {
        cursor: pointer;
        display: flex;
        gap: 0.5em;
        align-items: center;
        width: 100%;
        padding: 0.35em 0;
        padding-left: 1em;
        font-family: $secondary-font-stack;
        font-size: inherit;
        font-weight: 400;
        background: transparent;
        border: 0;
        transition: all 100ms ease;

        &:hover {
          background: var(--bg-secondary);
        }

        &:active {
          background: var(--primary-light-grey);
        }

        .content {
          font-size: 14px;
          color: var(--text-primary);
          letter-spacing: 0.09ch;
          white-space: nowrap;
        }

        &:disabled {
          .content {
            text-decoration: line-through;
          }
        }
      }
    }
  }

  .search {
    display: flex;
    gap: 0.75em;
    align-items: center;
    width: 100%;
    min-height: 2.5em;
    padding: 0 1em;
    color: var(--text-primary);
    background-color: var(--bg-secondary);
    border-radius: 8px;

    .search-icon {
      fill: var(--text-muted);
      width: 12px;
      height: 12px;
    }

    .search-input {
      flex: 1;
      height: 100%;
      padding: 3px 0;
      font-family: $secondary-font-stack;
      color: var(--text-primary);
      background: transparent;
      border: 0;

      &::placeholder {
        color: var(--text-muted);
      }

      &:focus {
        border: 0;
        outline: none;
      }
    }
  }

  .search-results {
    display: flex;
    flex-direction: column;
    width: 108.5%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;

    .result-list {
      width: 100%;
      height: fit-content;
      padding: 0;
      margin: 0;
      text-decoration: none;
      list-style: none;
      border-left: 2px solid $primary-light;

      .result {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 2.5em;
        padding-right: 1.33em;
        padding-left: 0.9em;
        margin-right: -1.33em;
        font-family: $secondary-font-stack;
        background: transparent;
        border: 0;

        &:hover {
          background: var(--bg-secondary);
        }

        &:active {
          background: var(--primary-light-grey);
        }

        .item {
          font-size: 14px;
          color: var(--text-primary);

          .highlight {
            color: var(--text-primary);
            background-color: var(--primary-dark-bright);
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
      align-self: center;
      margin: 0 auto;
      font-family: $secondary-font-stack;
      font-size: 1em;
      font-weight: 400;
    }
  }
}
</style>
