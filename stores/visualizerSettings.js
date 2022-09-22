import { defineStore } from 'pinia';
import { computed, reactive } from 'vue';
import { timelineStore } from '../stores/timeline';
import isEqual from 'lodash.isequal';

export const visualizerSettingsStore = defineStore(
  'visualizerSettings',
  () => {
    const timeline = timelineStore();
    const settings = reactive({});
    const initial = reactive({});
    const selected = reactive({});
    const localState = reactive({});

    function onInput(key, requiresRestart, inputValue) {
      // only setting visualizerSettings.localState value if (requiresRestart === true) and currStep > 0
      if (timeline.currStep === 0) {
        this.settings[`${key}`].state = inputValue;
        this.localState[`${key}`].state = inputValue;
      } else if (!requiresRestart) {
        this.settings[`${key}`].state = inputValue;
      } else {
        this.localState[`${key}`].state = inputValue;
      }
    }

    function reset() {
      if (timeline.currStep > 0) {
        Object.keys(this.settings).forEach((key) => {
          if (this.settings[`${key}`].requiresRestart) {
            this.localState[`${key}`].state = this.initial[`${key}`].state;
          } else {
            this.settings[`${key}`].state = this.initial[`${key}`].state;
          }
        });
      } else {
        Object.keys(this.settings).forEach((key) => {
          this.settings[`${key}`].state = this.initial[`${key}`].state;
          this.localState[`${key}`].state = this.initial[`${key}`].state;
        });
      }
    }

    function restart() {
      Object.keys(this.settings).forEach((key) => {
        if (this.settings[`${key}`].requiresRestart) {
          this.settings[`${key}`] = { ...JSON.parse(JSON.stringify(this.localState[`${key}`])) };
        } else {
          this.localState[`${key}`] = { ...JSON.parse(JSON.stringify(this.settings[`${key}`])) };
        }
      });
      this.selected = { ...JSON.parse(JSON.stringify(this.settings)) };
      timeline.currStep = 0;
    }

    return { settings, initial, selected, localState, onInput, reset, restart, enableReset, enableRestart };
  },
  { persist: true },
);
