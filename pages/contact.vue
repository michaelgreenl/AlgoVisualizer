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
  font-size: 12px;
  position: relative;
  z-index: 1;
  display: flex;
  height: 100vh;
  width: 100vw;
  background: $primary-white;

  .header {
    display: flex;
    width: 100%;

    .text {
      font-family: $primary-font-stack;
      font-weight: 400;
      letter-spacing: 0.09ch;
      margin: 1.25rem 2.25rem;
      color: $primary-dark;
      font-size: 4em;
    }
  }
}
</style>