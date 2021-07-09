<template>
  <div class="student-quit-registration">
    <search-form
      ref="searchForm"
      :form-data="formData"
      :form-item-config="searchFormConfig"
      @hideOverFlow="hideOverFlow"
      @selectChange="handleSearchChange"
      @onSubmit="
        pagination.currentPage = 1
        queryStudentQuitPage()
      "
      @onReset="reset"
      class="student-quit-registration__search"
    >
    </search-form>
    <div class="student-quit-registration__line"></div>
    <div class="student-quit-registration__btn-group">
      <el-button type="primary" size="small" @click="openDialog('new')"
        >新增</el-button
      >
    </div>
    <div class="student-quit-registration__table">
      <pagination-table
        class="pagination-table"
        row-key="id"
        style="width: 100%;"
        :max-height="tableMaxHeight"
        :columns="columns"
        :data="tableData"
        :current-page="pagination.currentPage"
        :page-sizes="[30, 50, 100]"
        :page-size="pagination.size"
        :total="pagination.totalNumber"
        :loading="tableLoading"
        showPageMsg
        show-operation
        operationWidth="160"
        default-expand-all
        @size-change="handleSizeChange"
        @page-change="handleCurrentChange"
      >
        <template #operation="{ scope }">
          <el-button type="text" @click="openDialog('detail', scope)">
            查看
          </el-button>
          <el-button type="text" @click="openDialog('edit', scope)">
            编辑
          </el-button>

          <el-button
            type="text"
            @click="handleDelete(scope)"
            :style="{ color: '#FF4D4D' }"
          >
            删除
          </el-button>
        </template>
        <template #quitDate="{row}">
          {{ row.startDate }} - {{ row.endDate }}
        </template>
      </pagination-table>
    </div>

    <ChooseStudent
      ref="chooseStudent"
      :visible.sync="chooseStudentDialogVisible"
      title="新增休退学信息"
      subDialogTitle="休退学信息录入"
      @refreshData="queryStudentQuitPage"
      @submitData="submitData"
      @subDialogClosed="resetSlotData"
    >
      <SchemaForm
        :schema="formSchema"
        :model.sync="dialogFormData"
        @quitReason-change="quitReasonChange"
        ref="formBody"
      ></SchemaForm>
    </ChooseStudent>
    <DetailAndEditStudentQuit
      :visible.sync="editStudentQuitDialogVisible"
      @refreshData="queryStudentQuitPage"
      :formSchema="formSchema"
      :targetData="targetData"
      :dialogType="dialogType"
      :subDialogTitle="detailOrEditTitle"
      @quitReasonChange="quitReasonChange"
    >
    </DetailAndEditStudentQuit>
  </div>
</template>

<script>
// utils
// import dayjs from 'dayjs'
// component
import searchForm from '@/components/SearchForm'
import PaginationTable from '@/components/PaginationTable'
import SchemaForm from '@/components/ConfigForm'

import ChooseStudent from '../../../components/ChooseStudent'
import DetailAndEditStudentQuit from './component/DetailAndEditStudentQuit.vue'
import { mapState } from 'vuex'
// config
import { searchFormConfig, columns } from './pageConfig'
// api
import {
  queryStudentQuitPage,
  deleteStudentQuit,
  addStudentQuit
} from '../../../api/student-quit-registration'
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
      type: 'formAreaTitle',
      formAreaTitleType: 'newBlue',
      title: '休退学信息'
    },
    {
      type: 'datePicker',
      key: 'rangeDate',
      label: '休退学时间',
      dateType: 'daterange',
      span: 12,
      required: true,
      'range-separator': '至',
      'start-placeholder': '开始日期',
      'end-placeholder': '结束日期'
    },
    {
      type: 'radio',
      key: 'quitType',
      label: '休退学类型',
      span: 12,
      options: [],
      props: { label: 'dictValue', value: 'dictCode' },
      required: true
    },
    {
      type: 'select',
      key: 'quitReason',
      label: '休退学原因',
      span: 12,
      options: [],
      props: { label: 'dictValue', value: 'dictCode' },
      required: true
    },
    {
      type: 'select',
      key: 'diseaseCode',
      label: '确诊疾病',
      span: 12,
      props: { label: 'dictValue', value: 'dictCode' },
      required: true,
      options: []
    }
  ],
  propertiesOrder: []
}

const dialogFormData = {
  rangeDate: '',
  quitType: '',
  quitReason: '',
  diseaseCode: ''
}
export default {
  name: 'student-quit-registration',
  components: {
    searchForm,
    PaginationTable,
    SchemaForm,
    ChooseStudent,
    DetailAndEditStudentQuit
  },
  data() {
    return {
      // 插槽表单
      formSchema,
      dialogFormData: { ...dialogFormData },
      // 搜索
      formData: {
        schoolYear: '',
        gradeId: '',

        classId: '',
        studentName: '',
        rangeDate: []
      },
      searchFormConfig,
      tableData: [],
      columns,
      tableLoading: false,
      pagination: {
        currentPage: 1,
        totalNumber: 0,
        size: 30
      },
      tableMaxHeight: '100%',
      // 弹框相关
      chooseStudentDialogVisible: false,
      editStudentQuitDialogVisible: false,
      // 查看和编辑弹框
      dialogType: '',
      targetData: {}
    }
  },
  computed: {
    ...mapState('user', ['schoolYearList', 'schoolGradeList', 'dict']),
    detailOrEditTitle() {
      return !this.dialogType || this.dialogType === 'detail'
        ? '休退学信息查看'
        : '休退学信息编辑'
    }
  },
  mounted() {
    this.tableMaxHeight = window.document.documentElement.clientHeight - 294
    this.queryStudentQuitPage()
    this.initDicOptions()
  },
  methods: {
    // 字典请求接口
    // ******************** start ***********************

    // 初始化各字典表的下拉选项
    async initDicOptions() {
      // 给各项赋值
      this.searchFormConfig.forEach(item => {
        if (item.key === 'schoolYear') {
          item.options = [
            { schoolYearName: '全部', schoolYear: '' },
            ...this.schoolYearList
          ]
        }
        if (item.key === 'gradeId') {
          item.options = [
            { gradeValue: '全部', id: '' },
            ...this.schoolGradeList
          ]
        }
      })
      this.formSchema.properties.forEach(item => {
        if (item.key === 'quitReason') {
          item.options = this.dict['quitReason']
        }
        if (item.key === 'quitType') {
          item.options = this.dict['quitType']
        }
        if (item.key === 'diseaseCode') {
          item.options = this.dict['diseaseCode']
        }
      })
    },
    // ******************** end ***********************

    reset() {
      // 自定义项需要自行初始化
      this.formData.createTime = []
    },
    handleSearchChange(val, key) {
      if (!val) return
      if (key === 'gradeId') {
        this.formData.classId = ''
        queryAllClassByGradeId({ gradeId: val }).then(res => {
          this.searchFormConfig.forEach(item => {
            if (item.key === 'classId') {
              item.options = res.data
            }
          })
        })
      }
    },
    //表格数据相关
    // ************************* start **************************
    // 每页个数选择变化

    // 分页部分
    // 每页数量变化
    handleSizeChange(data) {
      this.pagination.size = data
      this.pagination.currentPage = 1
      this.queryStudentQuitPage()
    },
    // 改变当前页
    handleCurrentChange(data) {
      console.log(data)
      this.pagination.currentPage = data
      this.queryStudentQuitPage()
    },
    // 获取表格数据
    queryStudentQuitPage() {
      this.tableLoading = true
      const data = {
        schoolYear: this.formData.schoolYear,
        gradeId: this.formData.gradeId,
        classId: this.formData.classId,
        studentName: this.formData.studentName,
        startDate: this.formData.rangeDate[0] ? this.formData.rangeDate[0] : '',
        endDate: this.formData.rangeDate[1] ? this.formData.rangeDate[1] : '',
        pageNo: this.pagination.currentPage,
        pageSize: this.pagination.size
      }
      queryStudentQuitPage(data)
        .then(res => {
          if (res.code === '200') {
            this.pagination.totalNumber = res.data.totalNumber
            this.pagination.currentPage = res.data.currentPage
            this.tableData = res.data.data
          }
        })
        .finally(() => {
          this.tableLoading = false
        })
    },
    // ************************* end **************************
    hideOverFlow(toggle) {
      if (toggle) {
        this.tableMaxHeight = window.document.documentElement.clientHeight - 294
      } else {
        this.tableMaxHeight = window.document.documentElement.clientHeight - 244
      }
    },
    // 打开弹框
    openDialog(type, { row } = {}) {
      this.formSchema.properties.forEach(item => {
        item.disabled = false
      })
      if (type === 'new') {
        this.quitReasonChange('')
        this.chooseStudentDialogVisible = true
      } else if (type === 'detail') {
        this.formSchema.properties.forEach(item => {
          item.disabled = true
        })
        this.targetData = { ...row, rangeDate: [row.startDate, row.endDate] }
        this.quitReasonChange(row.quitReason)
        this.dialogType = 'detail'
        this.editStudentQuitDialogVisible = true
      } else if (type === 'edit') {
        this.targetData = { ...row, rangeDate: [row.startDate, row.endDate] }
        this.quitReasonChange(row.quitReason)
        this.dialogType = 'edit'
        this.editStudentQuitDialogVisible = true
      }
    },

    handleDelete({ row }) {
      this.$confirm('此操作将删除此登记信息，确认删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteStudentQuit({ id: row.id }).then(() => {
            this.$message.success('删除成功')
            if (
              this.tableData.length === 1 &&
              this.pagination.currentPage !== 1
            ) {
              this.pagination.currentPage = this.pagination.currentPage - 1
            }
            this.queryStudentQuitPage()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    submitData(data) {
      if (this.$refs.formBody.validateForm()) {
        addStudentQuit({
          ...data,
          ...this.dialogFormData,
          studentId: data.id,

          startDate: this.dialogFormData.rangeDate[0],
          endDate: this.dialogFormData.rangeDate[1]
        }).then(res => {
          this.chooseStudentDialogVisible = false
          this.$refs.chooseStudent.baseInfoDialogVisible = false
          this.dialogFormData = { ...dialogFormData }
          this.$message.success(res.msg)
          this.queryStudentQuitPage()
        })
      }
    },
    resetSlotData() {
      this.dialogFormData = { ...dialogFormData }
      this.quitReasonChange(dialogFormData.quitReason)
    },
    quitReasonChange(value) {
      if (value === '01') {
        this.$set(
          this.formSchema.properties.find(item => item.key === 'diseaseCode'),
          'visible',
          true
        )
      } else {
        this.$set(
          this.formSchema.properties.find(item => item.key === 'diseaseCode'),
          'visible',
          false
        )
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.student-quit-registration {
  margin: 16px;
  margin-bottom: 0;
  height: calc(100vh - 68px);
  display: flex;
  flex-direction: column;
  &__line {
    flex-shrink: 0;
    width: 100%;
    height: 1px;
    background-color: #e1e3e6;
  }

  &__btn-group {
    margin-top: 16px;
  }
  &__table {
    flex-grow: 1;
    margin-top: 16px;
  }
}
</style>
