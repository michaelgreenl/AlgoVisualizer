<template>
    <div class="explanation-container">
        <div v-if="!Object.keys(props.explanations).length" class="no-explanations-msg">
            <p>Explanations will appear here once you click play.</p>
        </div>
        <ul
            v-for="(step, i) in explanations"
            v-else
            :key="i"
            class="explanation-list"
            :class="{ active: timeline.currStep === parseInt(i, 10) }"
            @mouseenter="hoveredStep = i"
            @mouseleave="hoveredStep = null"
        >
            <button class="list-header" @click="toggleStep(i)">
                Step {{ i }}
                <ArrowDownIcon v-if="hoveredStep === i || isOpen(i)" class="arrow-icon" :class="{ open: isOpen(i) }" />
            </button>
            <Transition
                name="dropdown"
                @before-enter="beforeEnter"
                @enter="enter"
                @after-enter="afterEnter"
                @before-leave="beforeLeave"
                @leave="leave"
                @after-leave="afterLeave"
            >
                <ul v-if="isOpen(i)" class="dropdown">
                    <li
                        v-for="(text, j) in step"
                        :key="j"
                        class="explanation-item"
                        :class="{ active: timeline.currExplanation === `${i}.${j + 1}` }"
                    >
                        <button @click="timeline.goto(`${i}.${j + 1}`)">{{ text }}</button>
                    </li>
                </ul>
            </Transition>
        </ul>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { timelineStore } from '../stores/timeline.js';
import ArrowDownIcon from '../assets/svgs/arrowDown.svg';

const props = defineProps({
    explanations: {
        type: Object,
        required: true,
    },
});

const timeline = timelineStore();

// Track open steps by index (as string, since keys are string)
const openSteps = ref(new Set());
const hoveredStep = ref(null);

function isOpen(i) {
    // Open if in openSteps or if active step
    return openSteps.value.has(i) || timeline.currStep === parseInt(i, 10);
}

function toggleStep(i) {
    if (openSteps.value.has(i)) {
        openSteps.value.delete(i);
    } else {
        openSteps.value.add(i);
    }

    // Force reactivity
    openSteps.value = new Set(openSteps.value);
}

// Watch for currStep changes and open the corresponding step
watch(
    () => timeline.currStep,
    (newStep) => {
        const stepKey = String(newStep);
        if (!openSteps.value.has(stepKey)) {
            openSteps.value.add(stepKey);
            openSteps.value = new Set(openSteps.value);
        }
    },
);

// Dropdown transition hooks for variable height
function beforeEnter(el) {
    el.style.height = '0';
    el.style.opacity = '0';
}

function enter(el) {
    el.style.transition = 'height 0.2s cubic-bezier(0.4,0,0.2,1), opacity 0.2s';
    el.style.height = el.scrollHeight + 'px';
    el.style.opacity = '1';
}

function afterEnter(el) {
    el.style.height = 'auto';
    el.style.transition = '';
}

function beforeLeave(el) {
    el.style.height = el.scrollHeight + 'px';
    el.style.opacity = '1';
}

function leave(el) {
    void el.offsetHeight; // force reflow
    el.style.transition = 'height 0.2s cubic-bezier(0.4,0,0.2,1), opacity 0.2s';
    el.style.height = '0';
    el.style.opacity = '0';
}

function afterLeave(el) {
    el.style.transition = '';
}
</script>

<style lang="scss" scoped>
.explanation-container {
    font-family: $secondary-font-stack;
    color: var(--text-explanation);
    background: var(--bg-secondary);
    max-height: 85vh;
    overflow-y: auto;
    padding: 0.5em;
    border-radius: 10px;
    box-shadow: 0 2px 8px var(--shadow-color);
}

.no-explanations-msg {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 8em;
    color: var(--text-muted);
    font-size: 1.1em;
    font-weight: 400;
    letter-spacing: 0.02em;
}

.explanation-list {
    display: flex;
    flex-direction: column;
    gap: 0.25em;
    padding: 0.75em;
    margin: 0 0 0.5em 0;
    background: transparent;
    border-radius: 7px;
    box-shadow: none;
    text-decoration: none;
    list-style: none;
    transition: background 0.15s;

    &.active {
        background: var(--primary-light-grey);
        box-shadow: 0 1px 4px var(--shadow-color);
    }

    &:hover {
        background: var(--primary-light-grey);
    }

    .list-header {
        font-family: $secondary-font-stack;
        font-weight: 600;
        width: 100%;
        margin: 0;
        padding: 0;
        font-size: 1.15em;
        font-weight: 500;
        color: var(--text-primary);
        letter-spacing: 0.01em;
        padding-left: 0.5em;
        background: transparent;
        border: 0;
        text-align: left;
        border-left: 3px solid $primary-dark;
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;

        .arrow-icon {
            fill: var(--primary-dark);
            width: 1em;
            height: 1em;
            margin-left: 0.5em;
            transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1);
            transform: rotate(90deg);
        }

        .arrow-icon.open {
            transform: rotate(0deg);
        }
    }
}

.dropdown {
    overflow: hidden;
    padding: 0;
    margin: 0;
    list-style: none;
    transition: none;
}

.explanation-item {
    margin-bottom: 0.15em;
    border-radius: 6px;
    transition: background 0.12s, color 0.12s;

    &:first-child {
        margin-top: 0.5em;
    }

    &.active {
        background: $primary-dark;
        button {
            color: #f8f8f8;
            font-weight: 600;
        }
    }

    button {
        width: 100%;
        text-align: left;
        padding: 0.5em 0.75em;
        font-family: $secondary-font-stack;
        font-size: 1em;
        font-weight: 400;
        color: var(--text-explanation);
        background: transparent;
        border: none;
        border-radius: 6px;
        outline: none;
        transition: background 0.12s, color 0.12s;
        cursor: pointer;

        &:hover {
            background: var(--primary-dark);
            color: #f8f8f8;
            font-weight: 600;
        }

        &:focus-visible {
            outline: 2px solid $primary-dark;
            outline-offset: 1px;
        }

        &:active {
            background: $primary-dark;
        }
    }
}

@media (max-width: 768px) {
    .explanation-container {
        padding: 0.5em 0.2em;
        font-size: 0.98em;
    }

    .explanation-list {
        padding: 0.5em 0.2em 0.5em 0.7em;
    }
}
</style>
