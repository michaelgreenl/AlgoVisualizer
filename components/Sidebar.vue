<template>
  <div ref="sidebar" class="sidebar">
    <nav class="sidebar-nav">
      <LogoIcon />
      <NavItem
        ref="algoNavItem"
        class="nav-item"
        tooltip="Algorithms"
        :sidebarOpened="opened"
        :itemToggled="openSidebars.algorithms"
        @click="toggleSidebar('algorithms')"
      >
        <template #icon>
          <AlgorithmsIcon class="icon" />
        </template>
      </NavItem>
      <NavItem
        ref="dataNavItem"
        class="nav-item"
        tooltip="Data Structures"
        :sidebarOpened="opened"
        :itemToggled="openSidebars.dataStructures"
        @click="toggleSidebar('dataStructures')"
      >
        <template #icon>
          <DataStructuresIcon class="icon" />
        </template>
      </NavItem>
      <NavItem class="nav-item" tooltip="Contact" :sidebarOpened="opened">
        <template #icon>
          <ContactIcon class="icon" />
        </template>
      </NavItem>
    </nav>
    <VisualizerSidebar
      ref="algoSidebar"
      class="sidebar-open"
      :dropdownContent="algorithms"
      :open="openSidebars.algorithms"
      title="Algorithms"
    />
    <VisualizerSidebar
      ref="dataSidebar"
      class="sidebar-open"
      :dropdownContent="dataStructures"
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

const selectedVisualizer = useSelectedVisualizer();

const emit = defineEmits(['sidebarToggled']);

const sidebar = ref(null);
const algoSidebar = ref(null);
const dataSidebar = ref(null);

let opened = ref(false);

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
  pathfinding: [
    'A* Tree Search',
    'Bellman-Ford',
    "Dial's",
    "Dijkstra's",
    'Floyd-Warshall',
    'Johnson',
    "Prim's",
  ],
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
let openSidebars = reactive({
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
  emit('sidebarToggled', { sidebar });
};

defineExpose({ sidebar, opened, toggleSidebar });
</script>

<style lang="scss" scoped>
.sidebar {
  font-size: 12px;
  left: 0;
  height: 100%;

  .sidebar-nav {
    position: relative;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2.5em;
    height: 100%;
    width: 5.33em;
    padding: 1.75em 0;
    box-shadow: 1px 0 1px rgba(153, 153, 153, 0.2);
    background: $secondary-white;

    .nav-item:last-child {
      margin-top: auto;
    }
  }

  .sidebar-open {
    position: absolute;
    z-index: 999;
    height: 100%;
    background-color: $primary-white;
    box-shadow: 1px 0 1px rgba(153, 153, 153, 0.2);
  }
}
</style>
