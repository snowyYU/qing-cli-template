<template>
  <div class="custom-header">
    <div class="custom-header--left">
      <div class="custom-header__block"></div>
      <div class="custom-header__title">{{ title }}</div>
    </div>
    <div class="custom-header--right">
      <slot name="right-header"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomHeader',
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-header {
  padding: 0 16px;
  height: 45px;
  display: flex;
  align-items: center;

  &--left {
    display: flex;
    align-items: center;
    flex: 1 0 auto;
  }

  &--right {
    flex: 0 0 auto;
    text-align: right;
  }

  &__block {
    flex: 0 0 auto;
    width: 4px;
    height: 16px;
    background-color: #4a81fe;
    border-radius: 2px;
  }

  &__title {
    flex: 0 0 auto;
    padding-left: 8px;
    font-size: 14px;
    font-weight: 500;
    color: #1c242e;
  }
}
</style>
