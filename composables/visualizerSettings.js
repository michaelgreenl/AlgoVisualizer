export const useVisualizerSettings = () =>
  useState('visualizerSettings', (timeline) => {
    return timeline;
  });
