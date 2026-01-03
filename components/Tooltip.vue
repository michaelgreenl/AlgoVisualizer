<template>
    <transition name="fade" appear>
        <div
            v-show="mouseEntered && !props.itemToggled"
            ref="tooltipDiv"
            class="tooltip"
            @mouseenter="mouseEntered = false"
        >
            <PolygonTT class="polygon" />
            <span class="tooltip-text">
                {{ tooltip }}
            </span>
        </div>
    </transition>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import PolygonTT from '../assets/svgs/polygon.svg';

const props = defineProps({
    tooltip: {
        type: String,
        default: '',
    },
    itemToggled: {
        type: Boolean,
        default: false,
    },
});

const tooltipDiv = ref();
const mouseEntered = ref(false);

onMounted(() => {
    tooltipDiv.value.parentNode.addEventListener('mouseenter', () => {
        mouseEntered.value = true;
    });
    tooltipDiv.value.parentNode.addEventListener('mouseleave', () => {
        mouseEntered.value = false;
    });
});

defineExpose({ mouseEntered });
</script>

<style lang="scss" scoped>
.nav-item {
    position: relative;
    display: flex;
    justify-content: center;
    width: 100%;
    padding: 0;
    font-size: inherit;
    background: transparent;
    border: 0;

    .fade-enter-active {
        transition: all 100ms ease;
    }

    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }

    .tooltip {
        position: absolute;
        top: 2px;
        left: 64px;
        display: flex;
        align-items: center;
        height: 24px;
        padding: 12px;
        background: var(--text-primary);
        border-radius: 7px;

        .polygon {
            position: absolute;
            top: 6px;
            left: -4px;
            width: 6px;
            height: 12px;
            fill: var(--text-primary);
        }

        .tooltip-text {
            font-family: $secondary-font-stack;
            font-size: 14px;
            font-weight: 400;
            color: var(--bg-primary);
            white-space: nowrap;
        }
    }
}
</style>
