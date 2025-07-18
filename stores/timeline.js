import { defineStore } from 'pinia';
import { ref, markRaw } from 'vue';
import gsap from 'gsap';

export const timelineStore = defineStore('timeline', () => {
  const tl = markRaw(gsap.timeline());
  const currStep = ref(0);
  const restarting = ref(false);
  const numSteps = ref(0);

  function seek(value) {
    const intValue = typeof value === 'string' ? parseInt(value, 10) : value;
    currStep.value += intValue;
    tl.seek(`${this.currStep}`);
  }

  function goto(value) {
    currStep.value = Math.floor(parseFloat(value));
    tl.seek(`${value}`);
  }

  function restart() {
    tl.clear(true);
    currStep.value = 0;
  }

  return { tl, currStep, numSteps, restarting, seek, restart, goto };
});
