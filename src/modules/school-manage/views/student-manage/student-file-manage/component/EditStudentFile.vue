<template>
  <BaseDialog
    :visible="visible"
    @cancel="cancelDialog"
    title="编辑档案"
    @close="cancelDialog"
    @confirm="confirmDialog"
    @open="openDialog"
    :config="{ confirmLoading: confirmBtnLoading, width: '80%' }"
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
import {
  queryStudentDetail,
  updateStudent
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
      span: 12,
      label: '姓名',
      required: true
    },
    {
      type: 'select',
      key: 'certType',
      span: 12,
      label: '证件类型',
      required: true,
      options: [],
      props: { label: 'dictValue', value: 'dictCode' }
    },
    {
      type: 'input',
      key: 'certNo',
      span: 12,
      label: '证件号码',
      required: true
    },
    {
      type: 'select',
      label: '性别',
      required: true,
      options: [],
      props: { label: 'dictValue', value: 'dictCode' },
      key: 'sexCode',
      span: 12
    },
    {
      type: 'datePicker',
      label: '出生日期',
      key: 'birthday',
      span: 12,
      required: true
    },
    {
      type: 'input',
      label: '学籍号',
      key: 'studentNumber',
      span: 12
    },
    {
      type: 'input',
      label: '学号',
      key: 'studentNo',
      span: 12
    },
    {
      type: 'input',
      label: '宿舍号',
      key: 'bedroomNo',
      span: 12
    },
    {
      type: 'select',
      key: 'countryCode',
      span: 12,
      label: '国籍',
      required: true,
      options: [],
      props: { label: 'dictValue', value: 'dictCode' }
    },
    {
      type: 'select',
      key: 'nationCode',
      span: 12,
      label: '民族',
      required: true,
      options: [],
      props: { label: 'dictValue', value: 'dictCode' }
    }
  ],
  propertiesOrder: []
}

const dialogFormData = {
  studentName: '',
  certType: '',
  certNo: '',
  sexCode: '',
  birthday: '',
  countryCode: '',
  nationCode: '',
  studentNumber: '',
  studentNo: '',
  bedroomNo: ''
}

export default {
  name: 'EditStudentFile',
  components: {
    SchemaForm,
    BaseDialog
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ''
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
        if (item.key === 'sexCode') {
          item.options = this.dict['sexCode']
        }
        if (item.key === 'nationCode') {
          item.options = this.dict['ethnic']
        }
      })
    },
    openDialog() {
      this.queryStudentDetail()
    },
    queryStudentDetail() {
      if (!this.id) return
      queryStudentDetail({ id: this.id }).then(res => {
        this.dialogFormData = { ...res.data }
      })
    },
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
        // 判断年级和初始班级是否有值
        this.confirmBtnLoading = true
        updateStudent(this.dialogFormData).then(res => {
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
