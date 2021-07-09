<template>
  <div class="base-block">
    <div class="block-title">
      <slot name="header">{{ title }}</slot>
    </div>
    <div class="block-content">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseBlock',
  props: {
    title: {
      type: String,
      default: '标题'
    }
  }
}
</script>

<style lang="scss" scoped>
.base-block {
  width: 100%;
  min-height: 100px;

  .block-title {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 32px;
    line-height: 32px;
    background: #f2f2f2;
    box-sizing: border-box;
    padding: 0 20px;
    font-size: 16px;
    font-weight: 500;
    color: #3a3a3d;
  }

  .block-content {
    box-sizing: border-box;
    padding: 16px 0;
  }
}
</style>
