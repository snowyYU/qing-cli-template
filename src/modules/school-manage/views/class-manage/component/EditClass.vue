<template>
  <BaseDialog
    :visible="visible"
    @cancel="cancelDialog"
    title="批量新增"
    @close="cancelDialog"
    @confirm="confirmDialog"
    @open="openDialog"
    @opened="openDialog"
    :config="{ confirmLoading: confirmBtnLoading, width: '40%' }"
    append-to-body
  >
    <template #body>
      <SchemaForm :schema="formSchema" :model.sync="formData" ref="formBody">
      </SchemaForm>
    </template>
  </BaseDialog>
</template>

<script>
import SchemaForm from '@/components/ConfigForm'
import BaseDialog from '@/components/BaseDialog'
import { mapState } from 'vuex'

import { updateClass } from '../../../api/class-manage'

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
      label: '年级',
      key: 'gradeName',
      disabled: true
    },
    {
      type: 'input',
      label: '班级',
      customLabel: true,
      key: 'className',
      required: true,
      maxlength: 10
    },
    {
      type: 'select',
      label: '班主任',
      key: 'teacherId',
      props: { label: 'fullName', value: 'teacherId' },
      options: []
    }
  ]
}
const dialogFormData = {
  gradeId: '',
  className: '',
  teacherId: ''
}
export default {
  name: 'EditClass',
  components: {
    SchemaForm,
    BaseDialog
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    dialogFormData: {
      type: Object,
      default() {
        return {
          gradeId: '',
          className: '',
          teacherId: ''
        }
      }
    }
  },
  computed: {
    ...mapState('user', ['schoolGradeList', 'schoolTeacherList'])
    // formData: {
    //   get() {
    //     return {
    //       gradeId: this.dialogFormData.gradeId,
    //       gradeName: this.dialogFormData.gradeName,
    //       className: this.dialogFormData.className,
    //       teacherId: this.dialogFormData.teacherId
    //     }
    //   },
    //   set(value) {
    //     return value
    //   }
    // }
  },
  data() {
    return {
      // 表格部分
      formSchema,
      formData: {
        gradeId: '',
        gradeName: '',
        className: '',
        teacherId: ''
      },
      confirmBtnLoading: false
    }
  },
  // watch: {
  //   dialogFormData(value) {
  //     if (value) {
  //       this.formData.gradeId = value.gradeId
  //       this.formData.gradeName = value.gradeName
  //       this.formData.className = value.className
  //       this.formData.teacherId = value.teacherId
  //     }
  //   }
  // },
  mounted() {
    this.initDicOptions()
  },
  methods: {
    // 初始化各字典表的下拉选项
    async initDicOptions() {
      // 给各项赋值
      this.formSchema.properties.forEach(item => {
        if (item.key === 'gradeId') {
          item.options = [...this.schoolGradeList]
        }
      })
      this.formSchema.properties.forEach(item => {
        if (item.key === 'teacherId') {
          item.options = [...this.schoolTeacherList]
        }
      })
    },
    openDialog() {
      this.formData.gradeId = this.dialogFormData.gradeId
      this.formData.gradeName = this.dialogFormData.gradeName
      this.formData.className = this.dialogFormData.className
      this.formData.teacherId = this.dialogFormData.teacherId
      this.formData.id = this.dialogFormData.id
    },
    cancelDialog() {
      this.$emit('update:visible', false)
      // 关闭
      this.confirmBtnLoading = false
      this.formData = { ...dialogFormData }
    },
    confirmDialog() {
      const formInstance = this.$refs.formBody
      const result = formInstance.validateForm()
      if (result) {
        // 判断年级和初始班级是否有值
        this.confirmBtnLoading = true
        updateClass(this.formData).then(res => {
          this.$message.success(res.msg)
          this.confirmBtnLoading = false
          this.$emit('refreshData')
          this.$emit('update:visible', false)
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
