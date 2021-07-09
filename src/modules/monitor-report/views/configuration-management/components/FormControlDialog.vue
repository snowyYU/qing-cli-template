<template>
  <BaseDialog
    :visible="visible"
    :title="title"
    :config="config"
    @confirm="handleDialogConfirm"
    @cancel="handleDialogClose"
    @close="handleDialogClose"
    @closed="handleDialogClosed"
  >
    <template #body>
      <SchemaForm
        ref="configForm"
        :schema="formSchema"
        :model.sync="formData"
      />
    </template>
  </BaseDialog>
</template>

<script>
import BaseDialog from '@/components/BaseDialog'
import SchemaForm from '@/components/ConfigForm'
import { configItems } from './formConfig'

export default {
  name: 'FormControlDialog',
  components: {
    BaseDialog,
    SchemaForm
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    config: {
      type: Object,
      default: () => {}
    },
    mode: {
      type: String,
      default: ''
    },
    activeIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      formData: {}
    }
  },
  computed: {
    formSchema() {
      return configItems[this.activeIndex].formSchema
    }
  },
  methods: {
    /**
     * 弹窗确认
     */
    handleDialogConfirm() {},

    /**
     * 弹窗关闭
     */
    handleDialogClose() {
      this.$emit('update:visible', false)
    },

    /**
     * 弹窗关闭后
     */
    handleDialogClosed() {}
  },
  created() {
    this.formData = {
      ...configItems[this.activeIndex].formData
    }
  }
}
</script>

<style lang="scss" scoped></style>
