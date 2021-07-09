<template>
  <el-dialog
    :title="title"
    :class="mixinConfig.fullscreen ? '' : 'limit_height'"
    :fullscreen="mixinConfig.fullscreen"
    :modal="mixinConfig.modal"
    :show-close="mixinConfig.modal"
    :width="mixinConfig.width"
    :center="mixinConfig.center"
    :close-on-click-modal="mixinConfig.closeOnClickModal"
    v-bind="$attrs"
    v-on="$listeners"
    v-loading="mixinConfig.loading"
  >
    <template slot="title">
      <slot name="title" />
    </template>
    <slot name="body" />

    <span v-if="mixinConfig.isShowFooter" slot="footer" class="dialog-footer">
      <template v-if="mixinConfig.showCustomBtns">
        <slot name="footerBtns"></slot>
      </template>
      <template v-else>
        <el-button
          v-if="mixinConfig.isShowCancel"
          @click="cancel"
          size="small"
          >{{ mixinConfig.cancelText }}</el-button
        >
        <el-button
          v-if="mixinConfig.isShowConfirm"
          type="primary"
          :loading="mixinConfig.confirmLoading"
          @click="confirm"
          size="small"
          >{{ mixinConfig.confirmText }}</el-button
        >
      </template>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'BaseDialog',
  props: {
    title: {
      type: String,
      default: '提示'
    },
    config: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    // 默认配置（可扩充）
    defaultConfig: {
      modal: true,
      fullscreen: false,
      width: '80%',
      cancelText: '取 消',
      confirmText: '确 定',
      isShowConfirm: true,
      isShowCancel: true,
      center: false,
      isShowFooter: true,
      confirmLoading: false,
      closeOnClickModal: false,
      loading: false
    }
  }),
  computed: {
    // 混合配置项
    mixinConfig() {
      const newObj = Object.assign(this.defaultConfig, this.config)
      return newObj
    }
  },
  methods: {
    cancel() {
      this.$emit('cancel')
    },
    confirm() {
      this.$emit('confirm')
    }
  }
}
</script>

<style lang="scss" scoped>
.limit_height {
  ::v-deep .el-dialog__header {
    padding: 9px 16px 9px;
    & > .el-dialog__title {
      font-weight: bold;
      line-height: 30px;
    }
  }
  ::v-deep .el-dialog__body {
    max-height: 60vh;
    padding: 16px 16px 0 16px;
    overflow: auto;
    padding-top: 16px;
  }
  ::v-deep .el-dialog__footer {
    border: 1px solid #e1e3e6;
    padding: 10px 20px;
  }
}
</style>
