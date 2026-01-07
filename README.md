# AlgoVisualizer ⚛️
> An interactive educational platform that visualizes complex algorithms and data structures with high-performance, synchronized, step-by-step animations.

[![Vue](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D)](https://vuejs.org/) [![Nuxt](https://img.shields.io/badge/Nuxt-00DC82?style=for-the-badge&logo=nuxt&logoColor=white)](https://nuxt.com/) [![Pinia](https://img.shields.io/badge/Pinia-F1C40F?style=for-the-badge&logo=pinia&logoColor=black)](https://pinia.vuejs.org/) [![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white)](https://greensock.com/) [![Sass](https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=sass&logoColor=white)](https://sass-lang.com/)
## 🔗 Links
- **🎥 [Demo Video](https://michaelgreenl.net/#projects?slug=algo-visu&autoplay=true)** 
- **💼 [Portfolio Link](https://michaelgreenl.net/#projects?slug=algo-visu&autoplay=false)** 

## 📖 Overview
> A high-performance algorithm visualizer built with Nuxt 3 that demystifies complex data structures and algorithms through synchronized, controllable GSAP animations.

This application is a monolithic Nuxt 3 (Vue 3 + Vite) web application that uses Pinia for centralized state management and SCSS for a custom design system. The core architectural pattern involves a Dynamic Component Injection strategy where a generic page layout hydrates specific algorithm modules on-demand, all driven by a global GSAP timeline for frame-perfect playback control.

## ⚡ Technical Highlights
**Universal Timeline Control:** Implemented a centralized `timelineStore` that wraps a single `gsap.timeline()` instance, enabling VCR-like controls (seek, reverse, time-scale) across all diverse algorithm visualizations.

**Optimization with `markRaw`:** Heavy GSAP timeline objects caused performance issues when wrapped in Vue's reactivity proxies. I utilized `markRaw` to exclude animation instances from the reactivity system, eliminating overhead and memory leaks.

**Dynamic Algorithm Loading:** Utilizes Nuxt's dynamic routing (`[category]-[visualizer].vue`) combined with `defineAsyncComponent` and `shallowRef` to lazily load heavy algorithm components only when needed, keeping the initial bundle size minimal.

**Explanation Synchronization:** Constructed a reactive system that binds text explanations to specific GSAP timeline labels, ensuring that the educational commentary updates in perfect sync with the visual steps, even when scrubbing backward or forward.

## 🏗️ Architecture & Design Decisions 
**Component Injection Strategy:** Instead of creating 50+ separate page files for each algorithm, I implemented a single dynamic route `[category]-[visualizer]`. This significantly reduces codebase redundancy and makes adding new algorithms as simple as creating one component file, which the router automatically picks up.

**Pinia for Animation State:** I used Pinia not just for user settings (theme, speed), but as the "single source of truth" for the animation's current step. This decouples the playback controls (in the wrapper) from the actual animation logic (in the inner component), preventing prop-drilling hell.

## 🛠️ Tech Stack
- **Framework:** Vue 3 (Composition API), Nuxt
- **Animation:** GSAP (GreenSock)
- **State:** Pinia

