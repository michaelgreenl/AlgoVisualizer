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

    compatibilityDate: '2024-07-03',

    modules: ['@pinia/nuxt', 'lodash'],

    // FIXME: Temporary while dynamic imports don't work with vite
    /* 
      Issue in this project - importing component route params in the visualizer page works only on initial load.
      Refreshing it causes 'Cannot read properties of undefined (reading 'stubModule')' 500 server error. 
    */
    ssr: false,

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
