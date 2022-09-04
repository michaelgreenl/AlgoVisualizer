import { defineStore } from 'pinia';
import { ref, markRaw } from 'vue';
import gsap from 'gsap';

export const timelineStore = defineStore('timeline', () => {
  const tl = markRaw(gsap.timeline());
  const currStep = ref(0);

  function seek(change) {
    this.currStep += change;
    this.tl.seek(`${this.currStep}`);
  }

  return { tl, currStep, seek };
});
