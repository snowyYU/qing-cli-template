<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.path
    }
  }
}
</script>

<style scoped>
.app-main {
  /*60 = navbar  */
  padding-top: 52px;
  box-sizing: content-box;
  height: calc(100vh - 52px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
/* .fixed-header + .app-main {
  padding-top: 52px;
} */
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  // .fixed-header {
  //   padding-right: 15px;
  // }
}
</style>
