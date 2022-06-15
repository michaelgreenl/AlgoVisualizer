<template>
  <ul class="settings">
    <li class="input" v-for="input in settings" :key="input">
      <label class="label" :for="input.label">{{ input.label }}:</label>
      <input
        v-if="input.type !== 'radio'"
        :class="input.type"
        :type="input.type"
        :name="input.label"
        v-model="input.value"
        :min="input.min"
        :max="input.max"
      />
      <div class="radio" v-else>
        <div class="radio-input" v-for="option in input.options" :key="option">
          <input :class="input.type" :type="input.type" :name="option" :value="option" v-model="input.value" />
          <label class="label" :for="option">{{ option }}</label>
        </div>
      </div>
    </li>
  </ul>
</template>

<script setup>
const props = defineProps({
  settings: {
    type: Object,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
.settings {
  display: flex;
  flex-direction: column;
  gap: 1em;
  list-style: none;
  text-decoration: none;
  padding: 0;
  margin: 0;

  .input {
    display: flex;
    align-items: center;
    gap: 1em;

    .label {
      font-family: $secondary-font-stack;
      font-weight: 400;
      font-size: 15px;
      color: $primary-black;
    }

    .number {
      background: transparent;
      border: 0;
      border-bottom: solid $primary-dark 2px; 
      text-align: center;
      font-family: $secondary-font-stack;
      font-weight: 400;
      font-size: 15px;
      color: $primary-black;

      &::-webkit-inner-spin-button,
      &::-webkit-outer-spin-button {
        opacity: 1;
      }
      
      &:focus {
        outline: none;
      }
    }

    .radio {
      display: flex;
      align-items: center;

      .radio-input {
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
