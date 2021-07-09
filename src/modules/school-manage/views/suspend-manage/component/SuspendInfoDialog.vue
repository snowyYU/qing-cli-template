<template>
  <BaseDialog
    :visible="visible"
    @cancel="cancelDialog"
    :title="dialogTitle"
    @close="cancelDialog"
    @confirm="confirmDialog"
    @open="openDialog"
    :config="{
      confirmLoading: confirmBtnLoading,
      width: '80%',
      cancelText: this.type === 'detail' ? '关闭' : '取消',
      isShowConfirm: this.type === 'detail' ? false : true
    }"
    append-to-body
  >
    <template #body>
      <SchemaForm
        :schema="formSchema"
        :model.sync="dialogFormData"
        ref="formBody"
        @stopReason-change="stopReasonChange"
        @rangeDate-change="rangeDateChange"
        @stopScope-change="stopScopeChange"
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
import dayjs from 'dayjs'
import {
  queryLessionStopDetail,
  addLessionStop,
  updateLessionStop
} from '../../../api/suspend-manage'
import { queryAllClassByGradeId } from '../../../api/student-file-manage'
const formSchema = {
  formStyle: {
    size: 'small',
    labelWidth: '150px',
    justify: 'center',
    btns: []
  },
  properties: [
    {
      type: 'datePicker',
      key: 'rangeDate',
      dateType: 'daterange',
      'range-separator': '至',
      'start-placeholder': '开始日期',
      'end-placeholder': '结束日期',
      span: 20,
      'picker-options': {
        disabledDate(day) {
          if (dayjs().subtract(7, 'day') < dayjs(day) && dayjs(day) < dayjs()) {
            return false
          } else {
            return true
          }
        }
      },

      label: '停课时间',
      required: true
    },
    {
      type: 'input',
      key: 'computeDay',
      span: 4,
      customLabel: true,
      label: '',
      labelWidth: '10px',
      disabled: true
    },
    {
      type: 'radio',
      key: 'stopReason',
      span: 12,
      label: '停课原因',
      options: [],

      props: { label: 'dictValue', value: 'dictCode' },
      required: true
    },
    {
      type: 'select',
      key: 'diseaseReason',
      span: 12,
      label: '病因',
      required: true,
      options: [],
      props: { label: 'dictValue', value: 'dictCode' }
    },
    {
      type: 'input',
      key: 'otherReason',
      label: '其他停课原因',
      span: 12,
      required: true
    },
    {
      type: 'radio',
      key: 'stopScope',
      span: 12,
      label: '停课范围',
      options: [],
      props: { label: 'dictValue', value: 'dictCode' },
      required: true
    },

    {
      type: 'select',
      label: '年级',
      key: 'gradeId',
      required: true,
      options: [],
      props: { label: 'gradeValue', value: 'id' },
      span: 12
    },
    {
      type: 'select',
      label: '班级',
      key: 'classId',
      required: true,
      options: [],
      props: { label: 'className', value: 'id' },
      span: 12
    }
  ],
  propertiesOrder: []
}

const dialogFormData = {
  rangeDate: [dayjs().format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
  computeDay: '',
  stopReason: '01',
  diseaseReason: '',
  otherReason: '',
  stopScope: '01',

  gradeId: '',
  classId: ''
}

export default {
  name: 'SuspendInfoDialog',
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
    },
    type: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapState('user', ['schoolGradeList', 'dict']),
    dialogTitle() {
      let title = ''
      switch (this.type) {
        case 'add':
          title = '新增'
          break
        case 'detail':
          title = '详情'

          break
        case 'edit':
          title = '编辑'
          break

        default:
          break
      }
      return title
    }
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
        if (item.key === 'diseaseReason') {
          item.options = this.dict['diagnoseSource']
        }
        if (item.key === 'stopReason') {
          item.options = this.dict['stopReason']
        }
        if (item.key === 'stopScope') {
          item.options = this.dict['stopScope']
        }
        if (item.key === 'gradeId') {
          item.options = this.schoolGradeList
        }
      })
    },
    openDialog() {
      if (this.type === 'detail') {
        this.dialogFormData = {
          ...this.targetData,
          rangeDate: [
            this.targetData.stopStartTime,
            this.targetData.stopEndTime
          ]
        }

        this.formSchema.properties.forEach(item => {
          item.disabled = true
        })
      } else if (this.type === 'edit') {
        this.dialogFormData = this.dialogFormData = {
          ...this.targetData,
          rangeDate: [
            this.targetData.stopStartTime,
            this.targetData.stopEndTime
          ]
        }
        this.formSchema.properties.forEach(item => {
          if (item.key === 'computeDay') {
            item.disabled = true
          } else {
            item.disabled = false
          }
        })
      } else if (this.type === 'add') {
        this.dialogFormData = { ...dialogFormData }
        this.formSchema.properties.forEach(item => {
          if (item.key === 'computeDay') {
            item.disabled = true
          } else {
            item.disabled = false
          }
        })
      }
      this.stopScopeChange(this.dialogFormData.stopScope)
      this.stopReasonChange(this.dialogFormData.stopReason)
      this.rangeDateChange(this.dialogFormData.rangeDate)
    },
    queryLessionStopDetail() {
      if (!this.id) return
      queryLessionStopDetail({ id: this.id }).then(res => {
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
        this.confirmBtnLoading = true
        const data = {
          ...this.dialogFormData,
          stopStartTime: this.dialogFormData.rangeDate[0],
          stopEndTime: this.dialogFormData.rangeDate[1]
        }
        if (this.type === 'add') {
          addLessionStop(data)
            .then(res => {
              this.handleRes(res)
            })
            .finally(() => {
              this.confirmBtnLoading = false
            })
        } else if (this.type === 'edit') {
          updateLessionStop(data)
            .then(res => {
              this.handleRes(res)
            })
            .finally(() => {
              this.confirmBtnLoading = false
            })
        }
      }
    },
    handleRes(res) {
      this.confirmBtnLoading = false
      this.$message.success(res.msg)
      this.$emit('refreshData')
      this.$emit('update:visible', false)
    },
    rangeDateChange(val) {
      console.log(val)
      if (!val[0]) return
      let durationDays = dayjs(val[1]).diff(dayjs(val[0]), 'day')
      this.dialogFormData.computeDay = durationDays + 1 + '天'
    },
    stopReasonChange(val) {
      if (!val) return
      if (val === '01') {
        this.formSchema.properties.forEach(item => {
          if (item.key === 'diseaseReason') {
            item.visible = true
          }
          if (item.key === 'otherReason') {
            item.visible = false
          }
        })
      } else {
        this.formSchema.properties.forEach(item => {
          if (item.key === 'diseaseReason') {
            item.visible = false
          }
          if (item.key === 'otherReason') {
            item.visible = true
          }
        })
      }
    },
    stopScopeChange(val) {
      if (!val) return
      switch (val) {
        case '01':
          // 全校
          this.formSchema.properties.forEach(item => {
            if (item.key === 'gradeId') {
              item.visible = false
            }
            if (item.key === 'classId') {
              item.visible = false
            }
          })
          break
        case '02':
          //年级
          this.formSchema.properties.forEach(item => {
            if (item.key === 'gradeId') {
              item.visible = true
            }
            if (item.key === 'classId') {
              item.visible = false
            }
          })
          break
        case '03':
          //班级
          this.formSchema.properties.forEach(item => {
            if (item.key === 'gradeId') {
              item.visible = true
            }
            if (item.key === 'classId') {
              item.visible = true
            }
          })
          break

        default:
          break
      }
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
    }
  }
}
</script>

<style lang="scss" scoped></style>
