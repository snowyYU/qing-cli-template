<template>
  <div class="base-list-item">
    <div class="base-list-item-main">
      <slot></slot>
    </div>
    <div class="base-list-item-extra">
      <slot name="extra">{{ extra }}</slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseListItem',
  props: {
    extra: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.base-list-item {
  display: flex;
  align-items: center;

  &-main {
    flex: 1;
  }

  &-extra {
    // flex: 0 0 auto;
  }
}
</style>
