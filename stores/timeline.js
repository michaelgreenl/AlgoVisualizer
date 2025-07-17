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

  function goto(value) {
    currStep.value = parseInt(value.substring(0, 1), 10);
    tl.seek(`${value}`);
  }

  function restart() {
    tl.clear(true);
    currStep.value = 0;
  }

  return { tl, currStep, restarting, seek, restart, goto };
});
