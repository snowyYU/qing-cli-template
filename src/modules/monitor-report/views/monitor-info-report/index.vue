<template>
  <div class="monitor-info-report">
    <SearchForm
      ref="searchForm"
      :form-data="searchFormData"
      :form-item-config="searchFormConfig"
      :first-line-max-item="5"
      @onSubmit="handleSearch"
      @onReset="handleReset"
      @hideOverFlow="hideOverFlow"
      @selectChange="handleSelectChange"
    ></SearchForm>
    <div class="monitor-info-report__line"></div>
    <div
      class="monitor-info-report__btnArea"
      v-if="userAuth === 0 || userAuth === 1"
    >
      <el-button type="primary" size="small" @click="handleAdd"
        >新建病例</el-button
      >
    </div>
    <div class="monitor-info-report__table">
      <PaginationTable
        class="pagination-table"
        :style="{ width: '100%', marginTop: '16px' }"
        row-key="id"
        :loading="tableDataLoading"
        :data="tableData"
        :columns="columns"
        :max-height="tableMaxHeight"
        :page-sizes="[10, 20, 30]"
        :current-page="pageFrom.pageNo"
        :page-size="pageFrom.pageSize"
        :total="pageFrom.totalNum"
        :operationWidth="userAuth === 0 || userAuth === 1 ? '230' : '80'"
        show-operation
        show-page-msg
        @page-change="handlePageChange"
        @size-change="handleSizeChange"
      >
        <template #abDate="{ scope }">
          {{ scope.row.abStartDate }}&nbsp;{{
            scope.row.abStartMomentName
          }}
          &nbsp;<span v-show="scope.row.abStartMoment">~</span>&nbsp;
          {{ scope.row.abEndDate }}&nbsp;{{ scope.row.abEndMomentName }}
        </template>
        <template #symptomsName="{ scope }">
          {{ scope.row.symptomsName ? scope.row.symptomsName.join('，') : '' }}
        </template>
        <template #symptomStartDate="{ scope }">
          {{ scope.row.symptomStartDate }}&nbsp;{{
            scope.row.symptomStartMomentName
          }}
        </template>
        <template #operation="{ scope }">
          <el-button
            v-show="userAuth === 0 || userAuth === 1"
            type="text"
            :disabled="
              scope.row.schoolYear !== schoolYearNow ||
                scope.row.progressStatus !== '01'
            "
            @click="handleContinue(scope.row)"
            >续报</el-button
          >
          <el-button
            v-show="userAuth === 0 || userAuth === 1"
            type="text"
            :disabled="
              scope.row.schoolYear !== schoolYearNow ||
                scope.row.progressStatus !== '01'
            "
            @click="handleEnd(scope.row)"
            >结束</el-button
          >
          <el-button type="text" @click="handleCheck(scope.row)"
            >查看</el-button
          >
          <el-button
            v-show="userAuth === 0 || userAuth === 1"
            type="text"
            :disabled="
              scope.row.schoolYear !== schoolYearNow ||
                scope.row.progressStatus !== '01'
            "
            @click="handleEdit(scope.row)"
            >编辑</el-button
          >
          <el-button
            v-show="userAuth === 0 || userAuth === 1"
            type="text"
            :disabled="
              userAuth === 0
                ? !(
                    scope.row.schoolYear === schoolYearNow &&
                    scope.row.progressStatus === '01' &&
                    scope.row.examineStatus !== '01'
                  )
                : !(
                    scope.row.schoolYear === schoolYearNow &&
                    scope.row.progressStatus === '01' &&
                    (scope.row.examineStatus !== '01' ||
                      (scope.row.examineStatus === '01' &&
                        checkIfDeletable(scope.row)))
                  )
            "
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </PaginationTable>
    </div>
    <student-dialog
      :visible.sync="studentDialogVisible"
      :title="studentDialogTitle"
      :config="studentDialogConfig"
      :userAuth="userAuth"
      @select="selectStudent"
    />
    <report-dialog
      :auth="userAuth"
      :studentId="studentId"
      :reportId="reportId"
      :type="reportType"
      :visible.sync="reportDialogVisible"
      :title="reportDialogTitle"
      :config="reportDialogConfig"
    >
    </report-dialog>
  </div>
</template>

<script>
import SearchForm from '@/components/SearchForm'
import PaginationTable from '@/components/PaginationTable'
import StudentDialog from '../../components/StudentDialog'
import ReportDialog from '../../components/ReportDialog'
import { formItemConfig, schoolColumns, cdcColumns } from './formConfig'
import {
  deleteRepo,
  monitorRepoPage,
  queryCurSchoolYear,
  getRepoDetailByStuId
} from '../../api/monitor-info-report'
import {
  queryAllClassByCondition,
  queryAreaList,
  querySchoolList
} from '../../api/common'
import { queryGradeDictByGroup } from '@/api/common'
import { mapState } from 'vuex'
import { replaceAllSpace } from '../../utils/index'

export default {
  name: 'monitor-info-report',
  components: {
    SearchForm,
    PaginationTable,
    StudentDialog,
    ReportDialog
  },
  data() {
    return {
      userAuth: 0,
      schoolYearNow: '',
      /****************************** 搜索栏参数 start ******************************/
      // 搜索栏表单配置
      searchFormConfig: formItemConfig,
      // 搜索栏表单数据
      searchFormData: {
        schoolYear: '',
        gradeId: '',
        classId: '',
        name: '',
        abDate: [],
        symptomDate: [],
        symptomCode: [],
        examineStatus: '',
        progressStatus: ''
      },
      /****************************** 搜索栏参数 end ******************************/
      /****************************** 表格参数 start ******************************/
      columns: [], // 表格项配置
      tableDataLoading: false, // 表格数据加载状态
      tableMaxHeight: '100%', // 表格最大高度
      pageFrom: {
        pageNo: 1,
        pageSize: 10,
        totalNum: 0
      }, // 表格分页参数
      tableData: [], // 表格数据
      /****************************** 表格参数 end ******************************/
      /****************************** StudentDialog参数 start ******************************/
      studentDialogVisible: false,
      studentDialogTitle: '选择学生',
      studentDialogConfig: {
        width: '70%',
        isShowFooter: false
      },
      /****************************** StudentDialog参数 end ******************************/
      /****************************** ReportDialog参数 start ******************************/
      studentId: '',
      reportId: '',
      reportType: '',
      reportDialogVisible: false,
      reportDialogTitle: '新建',
      reportDialogConfig: {},
      defaultConfig: {
        width: '90%',
        isShowConfirm: true
      }
      /****************************** ReportDialog参数 end ******************************/
    }
  },
  computed: {
    ...mapState('user', [
      'schoolYearList',
      'schoolGradeList',
      'dict',
      'curUserRole'
    ])
  },
  watch: {
    schoolYearList: {
      handler(newVal) {
        if (this.userAuth === 0 || this.userAuth === 1) {
          this.searchFormConfig[0].options = newVal
        }
      },
      immediate: true,
      deep: true
    },
    schoolGradeList: {
      handler(newVal) {
        if (this.userAuth === 0 || this.userAuth === 1) {
          this.searchFormConfig[1].options = newVal
        }
      },
      immediate: true,
      deep: true
    },
    curUserRole(newVal) {
      this.userAuth = Number(newVal) - 1
      this.getSearchFormConfig()
    }
  },
  created() {
    this.getUserAuth()
    this.getSearchFormConfig()
  },
  mounted() {
    this.tableMaxHeight = window.document.documentElement.clientHeight - 349
    this.getTableData()
    this.queryCurSchoolYear()
    this.getSchoolYearOptions()
    this.getSchoolGradeOptions()
    this.getSymptomOptions()
    this.getAreaOptions()
  },
  methods: {
    // 获取当前登录用户类型（0：班主任，1：校医，2：区疾控，3：市疾控）
    getUserAuth() {
      this.userAuth = Number(this.curUserRole) - 1
    },
    // 获取学年选项
    getSchoolYearOptions() {
      if (this.userAuth === 0 || this.userAuth === 1) {
        this.searchFormConfig[0].options = this.schoolYearList
      } else {
        this.searchFormConfig[2].options = this.schoolYearList
      }
    },
    // 获取班级选项
    getSchoolGradeOptions() {
      if (this.userAuth === 0 || this.userAuth === 1) {
        this.searchFormConfig[1].options = this.schoolGradeList
      }
    },
    // 获取当前学年
    queryCurSchoolYear() {
      queryCurSchoolYear().then(res => {
        this.schoolYearNow = res.data
      })
    },
    // 获取症状查询项选项
    getSymptomOptions() {
      if (this.userAuth === 0 || this.userAuth === 1) {
        this.searchFormConfig[6].options = this.dict['symptom']
      } else {
        this.searchFormConfig[8].options = this.dict['symptom']
      }
    },
    // 获取区县查询项选项
    getAreaOptions() {
      if (this.userAuth !== 0 && this.userAuth !== 1) {
        queryAreaList().then(res => {
          const areaOptions = res.data.areaCodes.map((item, index) => {
            return {
              value: item,
              label: res.data.areaCodesName[index]
            }
          })
          this.searchFormConfig[0].options = areaOptions
        })
      }
    },
    // 获取表格数据
    getTableData() {
      let data = {
        ...this.searchFormData,
        pageNo: this.pageFrom.pageNo,
        pageSize: this.pageFrom.pageSize
      }
      if (data.abDate.length !== 0) {
        data.abStartDate = data.abDate[0]
        data.abEndDate = data.abDate[1]
      }
      if (data.symptomDate.length !== 0) {
        data.symptomStartDate = data.symptomDate[0]
        data.symptomEndDate = data.symptomDate[1]
      }
      data.examineStatus = []
      if (this.searchFormData.examineStatus !== '') {
        data.examineStatus.push(this.searchFormData.examineStatus)
      }
      monitorRepoPage(data).then(res => {
        if (res.code === '200') {
          this.tableData = res.data.data
          this.pageFrom.totalNum = res.data.totalNumber
        }
      })
    },
    // 根据学年和年级选项获取班级查询项的选项
    handleSelectChange(val, key) {
      if (this.userAuth === 0 || this.userAuth === 1) {
        if (key === 'gradeId') {
          if (val !== '' && this.searchFormData.schoolYear !== '') {
            queryAllClassByCondition({
              gradeId: val,
              schoolYear: this.searchFormData.schoolYear
            }).then(res => {
              this.searchFormConfig[2].options = res.data
              this.searchFormData.classId = ''
            })
          } else {
            this.searchFormConfig[2].options = []
            this.searchFormData.classId = ''
          }
        } else if (key === 'schoolYear') {
          if (val !== '' && this.searchFormData.gradeId !== '') {
            queryAllClassByCondition({
              gradeId: this.searchFormData.gradeId,
              schoolYear: val
            }).then(res => {
              this.searchFormConfig[2].options = res.data
              this.searchFormData.classId = ''
            })
          } else {
            this.searchFormConfig[2].options = []
            this.searchFormData.classId = ''
          }
        }
      } else {
        let orgType = ''
        switch (key) {
          case 'countyCode':
            querySchoolList({ countyCode: val }).then(res => {
              this.searchFormConfig[1].options = res.data
            })
            this.searchFormConfig[1].options = []
            this.searchFormConfig[3].options = []
            this.searchFormConfig[4].options = []
            this.searchFormData.schoolId = ''
            this.searchFormData.gradeId = ''
            this.searchFormData.classId = ''
            break
          case 'schoolId':
            for (const item of this.searchFormConfig[1].options) {
              if (item.orgCode === val) {
                orgType = item.orgType
                break
              }
            }
            queryGradeDictByGroup({ gradeGroup: orgType }).then(res => {
              this.searchFormConfig[3].options = res.data
            })
            this.searchFormConfig[3].options = []
            this.searchFormConfig[4].options = []
            this.searchFormData.gradeId = ''
            this.searchFormData.classId = ''
            break
          case 'gradeId':
            queryAllClassByCondition({
              schoolId: this.searchFormData.schoolId,
              gradeId: val
            }).then(res => {
              this.searchFormConfig[4].options = res.data
            })
            this.searchFormConfig[4].options = []
            this.searchFormData.classId = ''
            break
        }
      }
    },
    // 查询
    handleSearch(data) {
      this.searchFormData = replaceAllSpace(data)
      this.pageFrom.pageNo = 1
      this.getTableData()
    },
    // 重置
    handleReset(data) {
      this.searchFormData = data
      this.getTableData()
    },
    // 收起/展开查询项
    hideOverFlow(toggle) {
      if (toggle) {
        this.tableMaxHeight = window.document.documentElement.clientHeight - 349
      } else {
        this.tableMaxHeight = window.document.documentElement.clientHeight - 308
      }
    },
    // 更新页数
    handlePageChange(val) {
      this.pageFrom.pageNo = val
      this.getTableData()
    },
    // 更新每页显示数
    handleSizeChange(val) {
      this.pageFrom.pageSize = val
      this.pageFrom.pageNo = 1
      this.getTableData()
    },
    // 点击新建病例
    handleAdd() {
      this.studentDialogVisible = true
    },
    // 点击续报
    handleContinue(data) {
      this.studentId = ''
      this.reportId = data.id
      this.reportType = 'continue'
      this.reportDialogVisible = true
      this.reportDialogTitle = '续报病程'
      const config = {
        confirmText: '续报病程'
      }
      this.reportDialogConfig = {
        ...this.defaultConfig,
        ...config
      }
    },
    // 点击结束
    handleEnd(data) {
      this.studentId = ''
      this.reportId = data.id
      this.reportType = 'end'
      this.reportDialogVisible = true
      this.reportDialogTitle = '结束病程'
      const config = {
        confirmText: '结束病程'
      }
      this.reportDialogConfig = {
        ...this.defaultConfig,
        ...config
      }
    },
    // 点击查看
    handleCheck(data) {
      this.studentId = ''
      this.reportId = data.id
      this.reportType = 'check'
      this.reportDialogVisible = true
      this.reportDialogTitle = '查看病例'
      const config = {
        isShowConfirm: false
      }
      this.reportDialogConfig = {
        ...this.defaultConfig,
        ...config
      }
    },
    // 点击编辑
    handleEdit(data) {
      this.studentId = ''
      this.reportId = data.id
      this.reportType = 'edit'
      this.reportDialogVisible = true
      this.reportDialogTitle = '编辑病例'
      const config = {
        confirmText: '确定'
      }
      this.reportDialogConfig = {
        ...this.defaultConfig,
        ...config
      }
    },
    // 点击删除
    handleDelete(data) {
      this.$confirm('此操作将删除该监测上报信息，是否继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteRepo({ id: data.id }).then(res => {
            if (res.code === '200') {
              this.getTableData()
              this.$message({
                type: 'success',
                message: '删除成功'
              })
            } else {
              this.$message.error('删除失败，请稍后重试')
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 动态根据当前登录用户的类型配置查询项
    getSearchFormConfig() {
      const config = [...formItemConfig]
      if (this.userAuth === 0 || this.userAuth === 1) {
        config.splice(0, 2)
        this.columns = schoolColumns
      } else {
        this.columns = cdcColumns
      }
      this.searchFormConfig = config
    },
    // 点击学生选择弹窗中的选择
    selectStudent(data) {
      getRepoDetailByStuId({ id: data.id })
        .then(res => {
          if (res.code === '200') {
            this.studentId = data.id
            this.reportId = ''
            this.reportType = 'add'
            this.reportDialogVisible = true
            this.reportDialogTitle = '新建病例'
            const config = {
              confirmText: '确定'
            }
            this.reportDialogConfig = {
              ...this.defaultConfig,
              ...config
            }
          }
        })
        .catch(() => {})
    },
    // 判断该条记录是否允许删除
    checkIfDeletable(data) {
      if (data.examineTime !== null) {
        return (
          Math.floor(
            (Date.now() - new Date(data.examineTime.substr(0, 10)).getTime()) /
              (3600 * 24 * 1000)
          ) <= 7
        )
      } else return false
    }
  }
}
</script>

<style lang="scss" scoped>
.monitor-info-report {
  margin: 16px;
  height: calc(100vh - 84px);
  display: flex;
  flex-direction: column;

  &__line {
    flex-shrink: 0;
    width: 100%;
    height: 1px;
    background-color: #e1e3e6;
  }

  &__btnArea {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-top: 12px;
  }

  &__table {
    flex-grow: 1;
  }
}
</style>
