<template>
  <div class="student-death-regist">
    <search-form
      ref="searchForm"
      :form-data="formData"
      :form-item-config="searchFormConfig"
      @hideOverFlow="hideOverFlow"
      @selectChange="handleSearchChange"
      @onSubmit="
        pagination.currentPage = 1
        queryStudentDeadPage()
      "
      @onReset="reset"
      class="student-death-regist__search"
    >
    </search-form>
    <div class="student-death-regist__line"></div>
    <div class="student-death-regist__btn-group">
      <el-button type="primary" size="small" @click="openDialog('new')"
        >新增</el-button
      >
    </div>
    <div class="student-death-regist__table">
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
        <template slot="operation" slot-scope="{ scope }">
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
      </pagination-table>
    </div>

    <ChooseStudent
      ref="chooseStudent"
      :visible.sync="chooseStudentDialogVisible"
      @refreshData="queryStudentDeadPage"
      title="新增死亡信息"
      subDialogTitle="死亡信息录入"
      @submitData="submitData"
      @subDialogClosed="resetSlotData"
    >
      <SchemaForm
        :schema="formSchema"
        @deadReason-change="deadReasonChange"
        :model.sync="dialogFormData"
        ref="formBody"
      ></SchemaForm>
    </ChooseStudent>
    <DetailAndEditStudentDeath
      :visible.sync="editStudentDeathDialogVisible"
      :formSchema="formSchema"
      :targetData="targetData"
      :dialogType="dialogType"
      :subDialogTitle="detailOrEditTitle"
      @refreshData="queryStudentDeadPage"
      @deadReasonChange="deadReasonChange"
    ></DetailAndEditStudentDeath>
  </div>
</template>

<script>
// utils
import dayjs from 'dayjs'
// component
import searchForm from '@/components/SearchForm'
import PaginationTable from '@/components/PaginationTable'
import SchemaForm from '@/components/ConfigForm'

import ChooseStudent from '../../../components/ChooseStudent'
import DetailAndEditStudentDeath from './component/DetailAndEditStudentDeath.vue'
import { mapState } from 'vuex'
// config
import { searchFormConfig, columns } from './pageConfig'
// api
import {
  queryStudentDeadPage,
  deleteStudentDead,
  addStudentDead
} from '../../../api/student-death-registration'
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
      title: '死亡信息'
    },
    {
      type: 'datePicker',
      key: 'deadDate',
      label: '死亡日期',
      'picker-options': {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      span: 12,
      required: true
    },
    {
      type: 'custom',

      span: 12
    },
    {
      type: 'select',
      key: 'deadReason',
      label: '死亡原因',
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
      visible: false,
      props: { label: 'dictValue', value: 'dictCode' },
      required: true,
      options: []
    },

    {
      type: 'textarea',
      key: 'remark',
      label: '备注',
      maxlength: 100,
      span: 24
    }
  ],
  propertiesOrder: []
}

const dialogFormData = {
  deadDate: dayjs().format('YYYY-MM-DD'),
  deadReason: '',
  diseaseCode: '',
  remark: ''
}
export default {
  name: 'student-death-regist',
  components: {
    searchForm,
    PaginationTable,
    SchemaForm,
    ChooseStudent,
    DetailAndEditStudentDeath
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
      editStudentDeathDialogVisible: false,
      // 查看和编辑弹框
      dialogType: '',
      targetData: {}
    }
  },
  computed: {
    ...mapState('user', ['schoolYearList', 'schoolGradeList', 'dict']),
    detailOrEditTitle() {
      return !this.dialogType || this.dialogType === 'detail'
        ? '死亡信息查看'
        : '死亡信息编辑'
    }
  },
  mounted() {
    this.tableMaxHeight = window.document.documentElement.clientHeight - 294
    this.queryStudentDeadPage()
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
        if (item.key === 'deadReason') {
          item.options = this.dict['deadReason']
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
      this.queryStudentDeadPage()
    },
    // 改变当前页
    handleCurrentChange(data) {
      console.log(data)
      this.pagination.currentPage = data
      this.queryStudentDeadPage()
    },
    // 获取表格数据
    queryStudentDeadPage() {
      this.tableLoading = true
      const data = {
        schoolYear: this.formData.schoolYear,
        gradeId: this.formData.gradeId,
        classId: this.formData.classId,
        studentName: this.formData.studentName,
        deadDateStart: this.formData.rangeDate[0]
          ? this.formData.rangeDate[0]
          : '',
        deadDateEnd: this.formData.rangeDate[1]
          ? this.formData.rangeDate[1]
          : '',
        pageNo: this.pagination.currentPage,
        pageSize: this.pagination.size
      }
      queryStudentDeadPage(data)
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
        this.chooseStudentDialogVisible = true
      } else if (type === 'detail') {
        this.formSchema.properties.forEach(item => {
          item.disabled = true
        })
        this.targetData = row
        this.deadReasonChange(row.deadReason)
        this.dialogType = 'detail'
        this.editStudentDeathDialogVisible = true
      } else if (type === 'edit') {
        this.targetData = row
        this.deadReasonChange(row.deadReason)
        this.dialogType = 'edit'
        this.editStudentDeathDialogVisible = true
      }
    },

    handleDelete({ row }) {
      this.$confirm('此操作将删除此登记信息，确认删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteStudentDead({ id: row.id }).then(() => {
            this.$message.success('删除成功')
            if (
              this.tableData.length === 1 &&
              this.pagination.currentPage !== 1
            ) {
              this.pagination.currentPage = this.pagination.currentPage - 1
            }
            this.queryStudentDeadPage()
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
        addStudentDead({
          ...data,
          ...this.dialogFormData,
          studentId: data.id
        }).then(res => {
          this.chooseStudentDialogVisible = false
          this.$refs.chooseStudent.baseInfoDialogVisible = false
          this.dialogFormData = { ...dialogFormData }
          this.$message.success(res.msg)
          this.queryStudentDeadPage()
        })
      }
    },
    resetSlotData() {
      this.dialogFormData = { ...dialogFormData }
      this.deadReasonChange(dialogFormData.deadReason)
    },
    deadReasonChange(value) {
      console.log(value)
      if (value === '24') {
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
    },
    dialogClosed() {}
  }
}
</script>

<style lang="scss" scoped>
.student-death-regist {
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
