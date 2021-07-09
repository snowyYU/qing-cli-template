<template>
  <BaseDialog
    :visible="visible"
    @cancel="cancelDialog"
    title="升级"
    @close="cancelDialog"
    @confirm="confirmDialog"
    @open="openDialog"
    :config="{ confirmLoading: confirmBtnLoading, width: '40%' }"
    append-to-body
  >
    <template #body>
      <SchemaForm
        :schema="formSchema"
        :model.sync="dialogFormData"
        ref="formBody"
      >
      </SchemaForm>
    </template>
  </BaseDialog>
</template>

<script>
import SchemaForm from '@/components/ConfigForm'
import BaseDialog from '@/components/BaseDialog'

// api

import { upgrade } from '../../../api/class-manage'

import { mapState } from 'vuex'
const formSchema = {
  formStyle: {
    size: 'small',
    labelWidth: '150px',
    justify: 'center',
    btns: []
  },
  properties: [
    {
      type: 'select',
      label: '年级',
      key: 'grade',
      props: { label: 'gradeValue', value: 'id' },
      options: []
    }
  ],
  propertiesOrder: []
}

const dialogFormData = {
  grade: '-1'
}
export default {
  name: 'UpGrade',
  components: {
    SchemaForm,
    BaseDialog
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState('user', ['schoolGradeList'])
  },
  data() {
    return {
      // 表格部分
      formSchema,
      dialogFormData: { ...dialogFormData },
      confirmBtnLoading: false
    }
  },
  mounted() {
    this.initDicOptions()
  },
  methods: {
    // 初始化各字典表的下拉选项
    async initDicOptions() {
      // 给各项赋值
      this.formSchema.properties.forEach(item => {
        if (item.key === 'grade') {
          item.options = [
            { gradeValue: '全部', id: '-1' },
            ...this.schoolGradeList
          ]
        }
      })
    },
    openDialog() {},
    cancelDialog() {
      this.$emit('update:visible', false)
      // 关闭
      this.confirmBtnLoading = false
      this.dialogFormData = { ...dialogFormData }
    },
    confirmDialog() {
      const formInstance = this.$refs.formBody
      const result = formInstance.validateForm()
      if (result) {
        const data = { id: this.dialogFormData.grade }
        upgrade(data).then(res => {
          this.$message.success(res.msg)
          this.$emit('refreshData')
          this.$emit('update:visible', false)
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
