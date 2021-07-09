<template>
  <div
    class="form-title"
    :class="activeClass"
    :style="{ height: height + 'px', lineHeight: height + 'px' }"
  >
    {{ title }}
  </div>
</template>

<script>
export default {
  name: 'FormOtherMaterial',
  props: {
    type: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: '40'
    }
  },
  computed: {
    activeClass() {
      let activeClassObj = {}
      switch (this.type) {
        case 'newBlue':
          activeClassObj = { newBlue: true }
          break

        default:
          break
      }
      return activeClassObj
    }
  },
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.form-title {
  position: relative;
  box-sizing: border-box;
  background-color: #f2f2f2;
  width: 100%;
  height: 40px;
  text-align: left;
  // margin-bottom: 22px;
  padding-left: 20px;
  color: #3a3a3d;
  font-size: 16px;
  font-weight: 500;
}
.newBlue {
  background-color: #fff;
  padding-left: 12px;
  &::before {
    content: '';
    left: 0;
    line-height: inherit;
    position: absolute;
    top: 50%;
    margin-top: -8px;
    width: 4px;
    height: 16px;
    background-color: #409eff;
  }
}
</style>
