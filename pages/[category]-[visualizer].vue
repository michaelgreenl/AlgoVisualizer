<template>
    <suspense>
        <component :is="visualizerComp" />

        <template #fallback>
            <Loading />
        </template>
    </suspense>
</template>

<script setup>
import { shallowRef, defineAsyncComponent } from 'vue';

const route = useRoute();
const visualizerComp = shallowRef(
    defineAsyncComponent(() => import(`../components/${route.params.category}/${route.params.visualizer}.vue`)),
);
</script>

<style lang="scss">
.visualizer {
    position: relative;
    z-index: 1;
    display: flex;
    width: 100vw;
    height: 100vh;
    font-size: 12px;
    background: $primary-white;
}
</style>
