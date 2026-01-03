<template>
    <div class="contact">
        <header class="header">
            <h1 class="text">Contact</h1>
        </header>
    </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.contact {
    position: relative;
    z-index: 1;
    display: flex;
    width: 100vw;
    height: 100vh;
    font-size: 12px;
    background: var(--bg-primary);

    .header {
        display: flex;
        width: 100%;

        .text {
            margin: 1.25rem 2.25rem;
            font-family: $primary-font-stack;
            font-size: 4em;
            font-weight: 400;
            color: var(--text-primary);
            letter-spacing: 0.09ch;
        }
    }
}
</style>
