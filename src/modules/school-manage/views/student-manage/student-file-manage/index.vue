<template>
  <div class="student-file">
    <search-form
      ref="searchForm"
      :form-data="formData"
      :form-item-config="searchFormConfig"
      @hideOverFlow="hideOverFlow"
      @selectChange="handleSearchChange"
      @onSubmit="
        pagination.currentPage = 1
        queryStudentPage()
      "
      @onReset="reset"
      class="student-file__search"
    >
    </search-form>
    <div class="student-file__line"></div>
    <div class="student-file__btn-group">
      <el-button
        type="primary"
        size="small"
        @click="addStudentFileDialogVisible = true"
        >新增档案</el-button
      >
      <el-button
        type="default"
        size="small"
        @click="importManyDialogVisible = true"
      >
        批量导入
      </el-button>
      <!-- <el-button type="default" size="small">导入</el-button> -->
    </div>
    <div class="student-file__table">
      <pagination-table
        class="pagination-table"
        row-key="id"
        style="width: 100%;"
        :max-height="tableMaxHeight"
        :loading="tableLoading"
        :columns="columns"
        :data="tableData"
        :current-page="pagination.currentPage"
        :page-sizes="[30, 50, 100]"
        :page-size="pagination.size"
        :total="pagination.totalNumber"
        showPageMsg
        show-operation
        operationWidth="200"
        default-expand-all
        @size-change="handleSizeChange"
        @page-change="handleCurrentChange"
      >
        <template slot="operation" slot-scope="{ scope }">
          <el-button type="text" @click="openDialog('tranfer', scope)">
            转班
          </el-button>
          <el-button type="text" @click="openDialog('detail', scope)">
            查看
          </el-button>
          <el-button type="text" @click="openDialog('edit', scope)">
            编辑
          </el-button>

          <el-button
            type="text"
            :disabled="curSchoolYear !== scope.schoolYear"
            @click="handleDelete(scope)"
            :style="
              curSchoolYear !== scope.schoolYear ? {} : { color: '#FF4D4D' }
            "
          >
            删除
          </el-button>
        </template>
      </pagination-table>
    </div>

    <AddStudentFile
      :visible.sync="addStudentFileDialogVisible"
      @refreshData="queryStudentPage"
    ></AddStudentFile>
    <ImportMany
      importType="student"
      :visible.sync="importManyDialogVisible"
      @refreshData="queryStudentPage"
    ></ImportMany>
    <StudentTranfer
      :targetData="targetData"
      :visible.sync="studentTranferDialogVisible"
      @refreshData="queryStudentPage"
    ></StudentTranfer>
    <EditStudentFile
      :visible.sync="editStudentFileDialogVisible"
      @refreshData="queryStudentPage"
      :id="targetId"
    ></EditStudentFile>
    <DetailStudentFile
      :id="targetId"
      :visible.sync="detailStudentFileDialogVisible"
    ></DetailStudentFile>
  </div>
</template>

<script>
// utils
// import dayjs from 'dayjs'
// component
import searchForm from '@/components/SearchForm'
import PaginationTable from '@/components/PaginationTable'

import AddStudentFile from './component/AddStudentFile.vue'
import ImportMany from '../../../components/ImportMany.vue'
import EditStudentFile from './component/EditStudentFile.vue'
import DetailStudentFile from './component/DetailStudentFile.vue'
import StudentTranfer from './component/StudentTranfer.vue'
import { mapState } from 'vuex'
// config
import { searchFormConfig, columns } from './pageConfig'
// api
import {
  queryStudentPage,
  deleteStudent,
  queryAllClassByGradeId
} from '../../../api/student-file-manage'

export default {
  name: 'student-file',
  components: {
    searchForm,
    PaginationTable,
    AddStudentFile,
    ImportMany,
    EditStudentFile,
    DetailStudentFile,
    StudentTranfer
  },
  data() {
    return {
      formData: {
        schoolYear: '',
        gradeId: '',

        classId: '',
        studentName: '',
        certNo: ''
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
      addStudentFileDialogVisible: false,
      importManyDialogVisible: false,
      studentTranferDialogVisible: false,
      editStudentFileDialogVisible: false,
      detailStudentFileDialogVisible: false,
      targetId: '',
      targetData: {}
    }
  },
  computed: {
    ...mapState('user', [
      'schoolYearList',
      'schoolGradeList',
      'dict',
      'curSchoolYear'
    ])
  },
  mounted() {
    this.tableMaxHeight = window.document.documentElement.clientHeight - 294
    this.queryStudentPage()
    this.initDicOptions()
  },
  methods: {
    // 字典请求接口
    // ******************** start ***********************

    // 初始化各字典表的下拉选项
    async initDicOptions() {
      this.formData.schoolYear = this.curSchoolYear
      // 给各项下拉列表赋值
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
    },
    // ******************** end ***********************

    reset() {
      // 自定义项需要自行初始化
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
      this.queryStudentPage()
    },
    // 改变当前页
    handleCurrentChange(data) {
      console.log(data)
      this.pagination.currentPage = data
      this.queryStudentPage()
    },
    // 获取表格数据
    queryStudentPage() {
      this.tableLoading = true
      const data = {
        ...this.formData,
        pageNo: this.pagination.currentPage,
        pageSize: this.pagination.size
      }
      queryStudentPage(data)
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
    openDialog(type, { row }) {
      if (type === 'new') {
        this.addStudentFileDialogVisible = true
      } else if (type === 'detail') {
        this.targetId = row.id
        this.detailStudentFileDialogVisible = true
      } else if (type === 'edit') {
        this.targetId = row.id
        this.editStudentFileDialogVisible = true
      } else if (type === 'tranfer') {
        console.log(row)
        this.targetData = row
        this.studentTranferDialogVisible = true
      }
    },

    cancelDialog() {
      this.$refs.notificationForm.resetFormData()
      this.dialogVisible = false
    },

    handleDelete({ row }) {
      this.$confirm('此操作将删除学生档案，确认删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteStudent({ id: row.id }).then(() => {
            this.$message.success('删除成功')
            if (
              this.tableData.length === 1 &&
              this.pagination.currentPage !== 1
            ) {
              this.pagination.currentPage = this.pagination.currentPage - 1
            }
            this.queryStudentPage()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.student-file {
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
