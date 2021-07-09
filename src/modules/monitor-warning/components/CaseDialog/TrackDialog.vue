<template>
  <BaseDialog
    :visible="visible"
    :title="title"
    :config="config"
    append-to-body
    @confirm="handleConfirm"
    @cancel="handleClose"
    @open="handleOpen"
    @close="handleClose"
    @closed="handleClosed"
  >
    <template #body>
      <SchemaForm
        :schema="formSchema"
        :model.sync="formData"
        ref="configForm"
      />
    </template>
  </BaseDialog>
</template>

<script>
import BaseDialog from '@/components/BaseDialog'
import SchemaForm from '@/components/ConfigForm'
import isEmpty from 'lodash/isEmpty'

import {
  trackFormSchema as formSchema,
  initTrackFormData as initFormData
} from './formConfig'

export default {
  name: 'TrackDialog',
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
      default() {
        return {}
      }
    },
    mode: {
      type: String,
      default: ''
    },
    trackDetail: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      formSchema,
      formData: {
        ...initFormData
      }
    }
  },
  watch: {
    trackDetail(val) {
      if (!isEmpty(val)) {
        this.formatData(val)
      }
    }
  },
  methods: {
    /**
     * 格式化数据
     * @param {*} data
     */
    formatData(data) {
      const fields = {}
      Object.keys(this.formData).forEach(key => {
        if (typeof data[key] !== 'undefined' && data[key] !== null) {
          fields[key] = data[key]
        } else {
          fields[key] = this.formData[key]
        }
      })
      this.formData = fields
    },

    /**
     * 弹窗确认
     */
    handleConfirm() {
      const result = this.$refs.configForm.validateForm()
      if (result) {
        const fields = { ...this.formData }
        if (this.trackDetail && this.trackDetail.id) {
          fields.id = this.trackDetail.id
        }
        this.$emit('confirm', fields)
      }
    },

    /**
     * 弹窗开启事件
     */
    handleOpen() {
      if (this.mode === 'view') {
        this.formSchema.formStyle.disabled = true
      }
    },

    /**
     * 弹窗关闭事件
     */
    handleClose() {
      this.$emit('update:visible', false)
    },

    /**
     * 弹窗关闭后事件
     */
    handleClosed() {
      this.formSchema.formStyle.disabled = false
      this.formData = {
        ...initFormData
      }
      this.$emit('closed')
    }
  }
}
</script>

<style lang="scss" scoped></style>
