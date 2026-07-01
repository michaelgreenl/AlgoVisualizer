# AlgoVisualizer 
> A Nuxt 3/Vue 3 algorithm visualization prototype centered on a polished insertion-sort visualizer.

[![Vue](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D)](https://vuejs.org/) [![Nuxt](https://img.shields.io/badge/Nuxt-00DC82?style=for-the-badge&logo=nuxt&logoColor=white)](https://nuxt.com/) [![Pinia](https://img.shields.io/badge/Pinia-F1C40F?style=for-the-badge&logo=pinia&logoColor=black)](https://pinia.vuejs.org/) [![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greenstock&logoColor=white)](https://greenstock.com/) [![Sass](https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=sass&logoColor=white)](https://sass-lang.com/)
### 🔗 Quick Links
- **🎥 [Demo Video](https://michaelgreenl.net/#projects?slug=algo-visualizer&autoplay=true)** 
- **💼 [Portfolio Link](https://michaelgreenl.net/#projects?slug=algo-visualizer&autoplay=false)** 

## Overview
AlgoVisualizer pairs a searchable algorithm/data-structure navigation shell with a working insertion-sort visualizer. The implemented visualizer uses Pinia stores and GSAP timelines to coordinate playback controls, timeline seeking, animation settings, array/pointer motion, and interactive explanatory text that tracks the current step.

The navigation lists additional algorithms and data structures as route targets. In the current codebase, `components/Algorithms/InsertionSort.vue` is the implemented visualizer; the other listed algorithm and data-structure component files are placeholders.

## Technical Highlights
**Insertion Sort Visualizer:** Animates an array through insertion sort with pointer movement, comparison indicators, swaps, index labels, and a description panel covering properties, complexity, and usage notes.

**Timeline Playback:** `stores/timeline.js` owns a `markRaw(gsap.timeline())` instance with current-step and current-explanation state, exposing `seek`, `goto`, and `restart` methods used by the playback controls.

**Synchronized Explanation Text:** `components/VisualizerDSA.vue` binds explanation entries to GSAP labels so the visible text and explanation sidebar follow play, pause, previous/next, and direct timeline jumps.

**Configurable Animation Settings:** `components/VisualizerSettings.vue` renders toggle, range, number, and radio controls from Pinia state; settings that require restart are staged before replay.

**Navigation/Search Shell:** `components/Sidebar.vue` and `components/VisualizerSidebar.vue` provide category dropdowns for algorithms/data structures, a theme toggle, and search results with highlighted matches.

**Route-Driven Component Loading:** `pages/[category]-[visualizer].vue` uses Nuxt dynamic routing with `defineAsyncComponent` and `shallowRef` to load the route-matched component.

## Architecture & Design Decisions 
**Client-Side Nuxt App:** `nuxt.config.js` sets `ssr: false` because the visualizer route imports components from route params.

**Pinia for Shared UI State:** Pinia separates timeline state, visualizer settings, and persisted theme state across `stores/timeline.js`, `stores/visualizerSettings.js`, and `stores/theme.js`.

## Tech Stack
- **Framework:** Vue 3 (Composition API), Nuxt 3
- **Animation:** GSAP and TextPlugin
- **State:** Pinia, `@pinia/nuxt`, `pinia-plugin-persistedstate`
- **Styling:** SCSS/Sass, local fonts, SVG imports through `vite-svg-loader`
- **Tooling:** ESLint, Stylelint, Prettier

## Run Locally
```bash
npm install
npm run dev
```

Additional scripts: `npm run build`, `npm run generate`, `npm run preview`, `npm run lint`, `npm run lint:style`, `npm run format`.
