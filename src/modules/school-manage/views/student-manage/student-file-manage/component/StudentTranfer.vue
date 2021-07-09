<template>
  <BaseDialog
    :visible="visible"
    @cancel="cancelDialog"
    title="转班"
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
        @gradeId-change="gradeIdChange"
      >
      </SchemaForm>
    </template>
  </BaseDialog>
</template>

<script>
import SchemaForm from '@/components/ConfigForm'
import BaseDialog from '@/components/BaseDialog'
import { mapState } from 'vuex'
import {
  queryAllClassByGradeId,
  transferClass
} from '../../../../api/student-file-manage'
const formSchema = {
  formStyle: {
    size: 'small',
    labelWidth: '150px',
    justify: 'center',
    btns: []
  },
  properties: [
    {
      type: 'input',
      key: 'studentName',
      label: '姓名',
      disabled: true
    },
    {
      type: 'select',
      key: 'gradeId',
      label: '年级',
      required: true,
      options: [],
      props: { label: 'gradeValue', value: 'id' }
    },
    {
      type: 'select',
      label: '班级',
      required: true,
      options: [],
      props: { label: 'className', value: 'id' },
      key: 'classId'
    }
  ],
  propertiesOrder: []
}

const dialogFormData = {
  id: '',
  studentName: '',
  classId: '',
  gradeId: ''
}

export default {
  name: 'StudentTranfer',
  components: {
    SchemaForm,
    BaseDialog
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    targetData: {
      type: Object,
      default() {
        return {}
      }
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
        if (item.key === 'gradeId') {
          item.options = this.schoolGradeList
        }
      })
    },
    openDialog() {
      this.dialogFormData.studentName = this.targetData.studentName
      this.dialogFormData.id = this.targetData.id
    },
    cancelDialog() {
      this.$emit('update:visible', false)
      // 关闭
      this.confirmBtnLoading = false
      this.dialogFormData = { ...dialogFormData }
    },
    gradeIdChange(val) {
      if (!val) return
      this.dialogFormData.classId = ''
      queryAllClassByGradeId({ gradeId: val }).then(res => {
        this.formSchema.properties.forEach(item => {
          if (item.key === 'classId') {
            item.options = res.data
          }
        })
      })
    },
    confirmDialog() {
      const formInstance = this.$refs.formBody
      const result = formInstance.validateForm()
      if (result) {
        // 判断年级和初始班级是否有值

        this.confirmBtnLoading = true
        transferClass(this.dialogFormData).then(res => {
          this.confirmBtnLoading = false
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
