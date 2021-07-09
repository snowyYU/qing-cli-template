<template>
  <BaseDialog
    :visible="visible"
    @cancel="cancelDialog"
    title="新建档案"
    @close="cancelDialog"
    @closed="resetDialog"
    @confirm="confirmDialog"
    @open="openDialog"
  >
    <template #body>
      <SchemaForm
        :schema="formSchema"
        :model.sync="dialogFormData"
        ref="formBody"
        @gradeId-change="gradeSelectChange"
      ></SchemaForm>
      <div class="btns-group">
        <el-button type="primary" size="small" @click="addStudent('many')"
          >批量新增</el-button
        >
        <el-button type="primary" size="small" @click="addStudent('one')"
          >新增</el-button
        >
      </div>
      <LineEditTable
        :tableHeader="tableHeader"
        :tableData="tableData"
        :isShowAdd="false"
        :deleteConfirmShow="false"
        @handleBlur="handleInputChange"
        @handleAutoComplete="handleAutoComplete"
        @handleAutocompleteSelect="handleAutocompleteSelect"
        operationWidth="60"
        ref="editTable"
      ></LineEditTable>
      <AddMuchStudentFile
        @muchStudents="addManyStudents"
        :visible.sync="addMuchDialogVisible"
      ></AddMuchStudentFile>
    </template>
  </BaseDialog>
</template>

<script>
import isEqual from 'lodash/isEqual'
import BaseDialog from '@/components/BaseDialog'
import SchemaForm from '@/components/ConfigForm'
import LineEditTable from '@/components/LineEditTable'
import { mapState } from 'vuex'
import AddMuchStudentFile from './AddMuchStudentFile.vue'
import {
  queryStudentPage,
  addStudent,
  queryAllClassByGradeId
} from '../../../../api/student-file-manage'
import { parseIdCardInfo } from '@/api/common.js'
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
      label: '学年',
      key: 'schoolYear',
      span: 7,
      disabled: true
    },
    {
      type: 'select',
      label: '年级',
      span: 7,
      options: [],
      props: { label: 'gradeValue', value: 'id' },
      key: 'gradeId',
      required: true
    },
    {
      type: 'select',
      label: '班级',
      span: 7,
      props: { label: 'className', value: 'id' },
      key: 'classId',
      required: true,
      options: []
    }
  ],
  propertiesOrder: []
}

const dialogFormData = {
  schoolYear: '',
  gradeId: '',
  classId: ''
}
export default {
  name: 'AddStudentFile',
  components: {
    BaseDialog,
    LineEditTable,
    AddMuchStudentFile,
    SchemaForm
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState('user', ['schoolGradeList', 'dict', 'curSchoolYear']),
    tableHeader() {
      return [
        {
          label: '姓名',
          value: 'studentName',
          type: 'autocomplete',
          defaultData: '',
          minWidth: '120',
          required: true,
          config: {
            clearable: true
          }
        },
        {
          label: '证件类型',
          value: 'certType',
          type: 'select',
          required: true,
          defaultData: '',
          minWidth: '120',
          props: { label: 'dictValue', value: 'dictCode' },
          options: this.dict['certType'],
          config: {
            filterable: true,
            allowCreate: false
          }
        },
        {
          label: '证件号码',
          value: 'certNo',
          type: 'input',
          required: true,
          defaultData: '',
          minWidth: '220',
          config: {
            clearable: true
          }
        },
        {
          label: '性别',
          value: 'sexCode',
          type: 'select',
          required: true,
          defaultData: '',
          minWidth: '120',
          props: {
            label: 'dictValue',
            value: 'dictCode'
          },
          options: this.dict['sexCode'],
          config: {
            filterable: true,
            allowCreate: false
          }
        },
        {
          label: '出生日期',
          value: 'birthday',
          type: 'datePicker',
          required: true,
          defaultData: '',
          minWidth: '180',
          config: {
            filterable: true,
            allowCreate: false
          }
        },
        {
          label: '国籍',
          value: 'countryCode',
          type: 'select',
          required: true,
          defaultData: '',
          minWidth: '180',
          props: {
            label: 'dictValue',
            value: 'dictCode'
          },
          options: this.dict['countryCode'],
          config: {
            filterable: true,
            allowCreate: false
          }
        },
        {
          label: '民族',
          value: 'nationCode',
          type: 'select',
          required: true,
          defaultData: '',
          minWidth: '120',
          props: {
            label: 'dictValue',
            value: 'dictCode'
          },
          options: this.dict['ethnic'],

          config: {
            filterable: true,
            allowCreate: false
          }
        },
        {
          label: '学籍号',
          value: 'studentNumber',
          defaultData: '',
          minWidth: '180',
          type: 'input',
          config: {
            clearable: true
          }
        },
        {
          label: '学号',
          value: 'studentNo',
          defaultData: '',
          minWidth: '120',
          type: 'input',
          config: {
            clearable: true
          }
        },
        {
          label: '宿舍号',
          value: 'bedroomNo',
          defaultData: '',
          minWidth: '120',
          type: 'input',
          config: {
            clearable: true
          }
        }
      ]
    }
  },
  data() {
    return {
      // 头部表单信息
      formSchema,
      dialogFormData: { ...dialogFormData },

      // 可编辑表格数据
      tableData: [],
      // 批量弹框显示
      addMuchDialogVisible: false
    }
  },
  mounted() {
    this.initDicOptions()
  },
  methods: {
    initDicOptions() {
      // 给各项赋值
      this.dialogFormData.schoolYear = this.curSchoolYear
      this.formSchema.properties.forEach(item => {
        if (item.key === 'gradeId') {
          item.options = [...this.schoolGradeList]
        }
      })
    },
    // 年级选项选择
    gradeSelectChange(value) {
      this.dialogFormData.classId = ''
      queryAllClassByGradeId({ gradeId: value }).then(res => {
        this.formSchema.properties.forEach(item => {
          if (item.key === 'classId') {
            item.options = res.data
          }
        })
      })
    },
    openDialog() {},
    handleInputChange({ event, item, scope }) {
      console.log({ event, item, scope })
      if (!scope.row[item.value]) return
      if (item.value === 'certNo' && scope.row.certType === '01') {
        parseIdCardInfo({ idcardNo: scope.row[item.value] })
          .then(res => {
            this.tableData[scope.$index].birthday = res.data.birth
            this.tableData[scope.$index].sexCode = String(res.data.gender)
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    handleAutoComplete({ queryString, cb, param }) {
      if (!queryString) return
      if (param.item.value === 'studentName') {
        queryStudentPage({
          studentName: queryString,
          pageNo: 1,
          pageSize: 9999
        }).then(res => {
          cb(res.data.data)
        })
      }
    },
    handleAutocompleteSelect({ event, item, scope }) {
      console.log({ event, item, scope })
    },
    cancelDialog() {
      this.$emit('update:visible', false)
    },
    confirmDialog() {
      if (this.$refs.formBody.validateForm()) {
        const result = this.$refs.editTable.validate()
        if (result) {
          // 在此校验数据的重复性
          // 先过滤数据
          let array1 = this.tableData.map(item => {
            return { certType: item.certType, certNo: item.certNo }
          })

          let errorHappend = false
          for (let index1 = 0; index1 < array1.length; index1++) {
            const item1 = array1[index1]
            array1.forEach((item2, index2) => {
              if (index1 !== index2 && isEqual(item1, item2)) {
                errorHappend = true
                this.$set(this.tableData[index1], `certNo-error`, true)
                this.$set(this.tableData[index2], `certNo-error`, true)
              }
            })
            if (errorHappend) break
          }
          if (errorHappend) {
            this.$message.error('证件号重复')
            return
          }

          const data = this.tableData.map(item => {
            return { ...item, ...this.dialogFormData }
          })
          addStudent(data).then(res => {
            this.$message.success(res.msg)
            this.$emit('refreshData')
            this.$emit('update:visible', false)
          })
        }
      }
    },
    // 添加班级
    addStudent(type) {
      this.$refs.editTable.resetErrors()
      switch (type) {
        case 'one':
          this.tableData.unshift({
            studentName: '',
            certType: '01',
            certNo: '',
            sexCode: '',
            birthday: '',
            countryCode: '01',
            nationCode: '01',
            studentNumber: '',
            studentNo: '',
            bedroomNo: ''
          })
          break
        case 'many':
          this.addMuchDialogVisible = true
          break
        default:
          break
      }
    },
    addManyStudents(students) {
      this.tableData = this.tableData.concat(students)
      this.addMuchDialogVisible = false
    },
    resetDialog() {
      this.tableData = []
      this.dialogFormData = {
        ...dialogFormData,
        schoolYear: this.curSchoolYear
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.btns-group {
  padding-bottom: 16px;
}
</style>
