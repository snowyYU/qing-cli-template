<template>
  <iframe class="iframe" :src="iframeSrc"></iframe>
</template>

<script>
export default {
  name: 'IframeLayout',
  data() {
    return {
      iframeSrc: ''
    }
  },
  mounted() {
    if (this.$route.meta && this.$route.meta.iframeLink) {
      this.iframeSrc = this.$route.meta.iframeLink
    }
  }
}
</script>

<style lang="scss" scoped>
.iframe {
  border: 0;
  width: 100%;
  height: calc(100vh - 52px);
}
</style>
