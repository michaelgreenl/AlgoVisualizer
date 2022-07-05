import { shallowRef } from 'vue';
import gsap from 'gsap';

export const useTimeline = () =>
  useState('timeline', () => {
    const timeline = shallowRef(gsap.timeline());
    return timeline;
  });
