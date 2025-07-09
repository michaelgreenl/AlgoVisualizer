import { defineStore } from 'pinia';
import { ref, markRaw } from 'vue';
import gsap from 'gsap';

export const timelineStore = defineStore('timeline', () => {
  const tl = markRaw(gsap.timeline());
  const currStep = ref(0);
  const restarting = ref(false);

  function seek(value) {
    if (typeof value === 'number') {
      currStep.value += value;
    } else if (typeof value === 'string') {
      currStep.value = parseInt(value, 10);
    }
    tl.seek(`${this.currStep}`);
  }

  function restart() {
    tl.clear(true);
    currStep.value = 0;
  }

  return { tl, currStep, restarting, seek, restart };
});
