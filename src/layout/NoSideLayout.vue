<template>
  <div class="no-side-layout">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'NoSideLayout'
}
</script>

<style lang="scss" scoped>
.no-side-layout {
  height: 100%;
  padding-top: 52px;
  box-sizing: border-box;
}
</style>
