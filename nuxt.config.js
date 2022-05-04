import { defineNuxtConfig } from 'nuxt';
import eslintPlugin from 'vite-plugin-eslint';
import svgLoader from 'vite-svg-loader';

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  build: {
    loaders: {
      scss: {
        implementation: require('sass'),
      },
    },
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "assets/scss/global.scss";',
        },
      },
    },
    // svgLoader allows for SVG's to be imported as components
    // import Icon from './icon.svg?component;
    plugins: [eslintPlugin(), svgLoader()],
  },
});
