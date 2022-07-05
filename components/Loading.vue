<template>
  <div class="loading">
    <div class="content">
      <h1 class="text">Loading</h1>
      <Node class="node" />
      <Node class="node" />
      <Node class="node" />
    </div>
  </div>
</template>

<script setup>
import Node from '../assets/svgs/node.svg';
</script>

<style lang="scss" scoped>
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;

  .content {
    display: flex;
    align-items: flex-end;

    .text {
      font-family: $secondary-font-stack;
      font-weight: 400;
      color: $primary-dark;
      margin: 0;
      margin-right: 2px;
      font-size: 27px;
    }

    .node {
      margin: 12px 2px;
      height: 10px;
      width: 10px;
      fill: $primary-dark;

      $animation-speed: 1s;

      &:nth-child(2) {
        animation: bounce ease-in-out $animation-speed infinite;
      }

      &:nth-child(3) {
        animation: bounce ease-in-out $animation-speed 100ms infinite;
      }

      &:nth-child(4) {
        animation: bounce ease-in-out $animation-speed 200ms infinite;
      }
    }

    @keyframes bounce {
      0% {
        transform: translateY(0);
      }
      10% {
        transform: translateY(-50%);
      }
      25% {
        transform: translateY(0);
      }
    }
  }
}
</style>
