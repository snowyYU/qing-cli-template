<template>
  <BaseDialog
    :visible="visible"
    @cancel="cancelDialog"
    title="批量新增"
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
import { mapState } from 'vuex'
import { formSchema, dialogFormData } from './formConfig'
export default {
  name: 'AddMuchStudentFile',
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
    ...mapState('user', ['schoolGradeList', 'dict'])
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
        if (item.key === 'certType') {
          item.options = this.dict['certType']
        }
        if (item.key === 'countryCode') {
          item.options = this.dict['countryCode']
        }
        if (item.key === 'nationCode') {
          item.options = this.dict['ethnic']
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
        this.confirmBtnLoading = true
        let { certType, countryCode, nationCode, columns } = this.dialogFormData

        let finallStudentsList = []

        for (let index = 0; index < columns; index++) {
          const item = {
            certType,
            countryCode,
            nationCode
          }
          finallStudentsList.push(item)
        }

        this.$emit('muchStudents', finallStudentsList)
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
