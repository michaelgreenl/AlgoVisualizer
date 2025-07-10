<template>
  <div ref="sidebar" class="sidebar">
    <nav class="sidebar-nav">
      <button class="nav-item" @click="router.push('/')">
        <Tooltip tooltip="Home" />
        <LogoIcon class="icon logo" />
      </button>
      <button
        class="nav-item"
        :class="{ greyscale: opened && !openSidebars.algorithms }"
        @click="toggleSidebar('algorithms')"
      >
        <AlgorithmsIcon class="icon algorithms" />
        <Tooltip
          class="tooltip"
          :add-mouse-listener="true"
          :class="{ hidden: openSidebars.algorithms }"
          :item-toggled="openSidebars.algorithms"
          tooltip="Algorithms"
        />
      </button>
      <button
        class="nav-item"
        :class="{ greyscale: opened && !openSidebars.dataStructures }"
        @click="toggleSidebar('dataStructures')"
      >
        <DataStructuresIcon class="icon data-structures" />
        <Tooltip
          class="tooltip"
          :add-mouse-listener="true"
          :class="{ hidden: openSidebars.dataStructures }"
          :item-toggled="openSidebars.dataStructures"
          tooltip="Data Structures"
        />
      </button>
      <button class="nav-item" :class="{ greyscale: opened }" @click="router.push('/contact')">
        <Tooltip tooltip="Contact" />
        <ContactIcon class="icon contact" />
      </button>
    </nav>
    <VisualizerSidebar
      ref="algoSidebar"
      class="sidebar-open"
      :dropdown-content="algorithms"
      :open="openSidebars.algorithms"
      title="Algorithms"
    />
    <VisualizerSidebar
      ref="dataSidebar"
      class="sidebar-open"
      :dropdown-content="dataStructures"
      :open="openSidebars.dataStructures"
      title="Data Structures"
    />
  </div>
</template>

<script setup>
import LogoIcon from '../assets/svgs/logo.svg';
import AlgorithmsIcon from '../assets/svgs/algorithms.svg';
import DataStructuresIcon from '../assets/svgs/dataStructures.svg';
import ContactIcon from '../assets/svgs/contact.svg';

import { ref, reactive } from 'vue';

const router = useRouter();

const emit = defineEmits(['sidebartoggled']);

const sidebar = ref();
const algoSidebar = ref();
const dataSidebar = ref();
const opened = ref(false);

const algorithms = reactive({
  backtracking: ['Hamiltonian', 'Knights Tour', 'N Queen', 'Sudoku'],
  patternSearching: [
    'Aho-Corasick',
    'Boyer-Moore',
    'Horspool',
    'KMP',
    'Levenshtein Distance',
    'Metaphone',
    'NYSIIS',
    'Rabin-Karp',
    'Soundex',
  ],
  pathfinding: ['A* Tree Search', 'Bellman-Ford', "Dial's", "Dijkstra's", 'Floyd-Warshall', 'Johnson', "Prim's"],
  searching: ['Binary Search', 'Breadth-First Search', 'Best-First Search', 'Depth-First Search'],
  sorting: [
    'Bubble Sort',
    'Counting Sort',
    'Heap Sort',
    'Insertion Sort',
    'Merge Sort',
    'Quick Sort',
    'Radix Sort',
    'Selection Sort',
  ],
});

const dataStructures = reactive({
  abstract: ['Map', 'Set', 'Stack', 'Tuple', 'Queue'],
  graphs: ['Adjacency List', 'Adjacency Matrix', 'Graph', 'Graph-Structured Stack'],
  hashBased: ['Dynamic Perfect Hash Table', 'Hash List', 'Hash Map', 'Hash Table', 'Hash Tree'],
  lists: ['Array List', 'Doubly Linked List', 'Linked List', 'Self Organizing List', 'Skip List'],
  trees: [
    '2-3 Heap',
    '2-3 Tree',
    '2-3-4 Tree',
    'And-Or Tree',
    'AVL Tree',
    'B-Heap',
    'B-Tree',
    'Binary Heap',
    'Binary Search Tree',
    'Binary Tree',
    'Fibonacci Heap',
    'Heap',
    'K-Ary Tree',
    'Red-Black Tree',
    'Ternary Tree',
  ],
});

/*
  Object with booleans to know if an sidebar component is open. These values are used as props to open and close 
  the sidebars and also to disable the tooltip for their relative NavItem.
*/
const openSidebars = reactive({
  algorithms: false,
  dataStructures: false,
});

/*
  Toggles activated sidebar, sets the opened value (Bool) for this Sidebar component to what the activated sidebar
  value is in the openSidebars object. Emits sidebarToggled in index.vue. Also clears their open dropdowns in both sidebars. 
*/
const toggleSidebar = (sidebar) => {
  Object.keys(openSidebars).forEach((key) => {
    if (key !== sidebar) {
      openSidebars[key] = false;
    }
  });
  openSidebars[sidebar] = !openSidebars[sidebar];
  opened.value = openSidebars[sidebar];

  // closing the open dropdowns if the sidebar is closed
  if (!opened.value) {
    algoSidebar.value.openDropdowns.clear();
    dataSidebar.value.openDropdowns.clear();
    algoSidebar.value.userInput = '';
    dataSidebar.value.userInput = '';
  }
  emit('sidebartoggled', { sidebar });
};

defineExpose({ sidebar, opened, toggleSidebar });
</script>

<style lang="scss" scoped>
.sidebar {
  left: 0;
  height: 100%;
  font-size: 12px;

  .sidebar-nav {
    position: relative;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: 2.5em;
    align-items: center;
    width: 5.33em;
    height: 100%;
    padding: 1.75em 0;
    background: $secondary-white;
    box-shadow: 1px 0 1px $primary-light-grey;

    .nav-item {
      position: relative;
      display: flex;
      justify-content: center;
      width: 100%;
      padding: 0;
      font-size: inherit;
      background: transparent;
      border: 0;

      &.greyscale {
        filter: grayscale(0.8);
      }

      .icon {
        &.logo {
          width: 41px;
          height: 33px;
        }

        &.algorithms {
          width: 34px;
          height: 34px;
        }

        &.data-structures {
          width: 29px;
          height: 28px;
        }

        &.contact {
          width: 27px;
          height: 30px;
        }
      }

      .tooltip {
        &.hidden {
          visibility: hidden;
        }
      }
    }

    .nav-item:last-child {
      margin-top: auto;
    }
  }

  .sidebar-open {
    position: absolute;
    z-index: 999;
    height: 100%;
    background-color: $primary-white;
    box-shadow: 1px 0 1px $primary-light-grey;
  }
}
</style>
