import { defineStore } from 'pinia';
import { ref, markRaw } from 'vue';
import gsap from 'gsap';

export const timelineStore = defineStore('timeline', () => {
  const tl = markRaw(gsap.timeline());
  const currStep = ref(0);

  function seek(value) {
    if (typeof value === 'number') {
      this.currStep += value;
    } else if (typeof value === 'string') {
      this.currStep = parseInt(value, 10);
    }
    this.tl.seek(`${this.currStep}`);
  }

  return { tl, currStep, seek };
});
