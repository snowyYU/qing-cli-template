<template>
  <div class="report-info-confirm">
    <SearchForm
      ref="searchForm"
      :form-data="searchFormData"
      :form-item-config="formItemConfig"
      :isNeedHide="false"
      @onSubmit="handleSearch"
      @onReset="handleReset"
      @selectChange="getClassOptions"
    ></SearchForm>
    <div class="report-info-confirm__line"></div>
    <div class="report-info-confirm__hint">
      <el-alert
        v-show="tableSelection.length === 0"
        title="当日填报的上报信息请当日审核！逾期将影响上报及时率！"
        type="warning"
        :closable="false"
        show-icon
      >
      </el-alert>
      <el-alert
        v-show="tableSelection.length > 0"
        type="info"
        :closable="false"
        show-icon
      >
        <template slot="title">
          已选择&nbsp;<span class="selectNum">{{ tableSelection.length }}</span
          >&nbsp;项
        </template>
      </el-alert>
    </div>
    <div class="report-info-confirm__btn" v-show="tableSelection.length !== 0">
      <el-button type="text" @click="toggleSelection" style="margin-right: 10px"
        >取消选择</el-button
      >
      <el-button type="primary" size="mini" @click="handleGroupAudit"
        >批量审核</el-button
      >
    </div>
    <div class="report-info-confirm__table">
      <PaginationTable
        ref="selectionTable"
        class="pagination-table"
        :style="{ width: '100%', marginTop: '16px' }"
        row-key="id"
        :loading="tableDataLoading"
        :data="tableData"
        :columns="columns"
        :page-sizes="[10, 20, 30]"
        :current-page="pageFrom.pageNo"
        :page-size="pageFrom.pageSize"
        :total="pageFrom.totalNum"
        :max-height="tableMaxHeight"
        isMultiSelect
        show-operation
        show-page-msg
        @page-change="handlePageChange"
        @size-change="handleSizeChange"
        @selection-change="handleSelectChange"
      >
        <template #examineStatus="{ scope }">
          <span :style="`color:${getStatusColor(scope.row.examineStatus)}`">{{
            scope.row.examineStatusName
          }}</span>
        </template>
        <template #abDate="scope">
          {{ scope.row.abStartDate }}&nbsp;{{
            scope.row.abStartMomentName
          }}&nbsp;
          <span v-show="scope.row.abStartDate">~</span>
          &nbsp;{{ scope.row.abEndDate }}&nbsp;{{ scope.row.abEndMomentName }}
        </template>
        <template #symptomStartDate="{ scope }">
          {{ scope.row.symptomStartDate }}&nbsp;{{
            scope.row.symptomStartMomentName
          }}
        </template>
        <template #symptomsName="{ scope }">
          {{ scope.row.symptomsName ? scope.row.symptomsName.join('，') : '' }}
        </template>
        <template #operation="{ scope }">
          <el-button
            v-if="scope.row.examineStatus !== '01'"
            type="text"
            @click="handleAudit(scope.row.id)"
            >审核</el-button
          >
          <el-button
            v-else
            type="text"
            @click="handleCheck(scope.row.id)"
            >查看</el-button
          >
        </template>
      </PaginationTable>
      <report-dialog
        :auth="userAuth"
        :reportId="reportId"
        :type="reportType"
        :visible.sync="reportDialogVisible"
        :title="reportDialogTitle"
        :config="reportDialogConfig"
      >
      </report-dialog>
    </div>
  </div>
</template>

<script>
import SearchForm from '@/components/SearchForm'
import PaginationTable from '@/components/PaginationTable'
import ReportDialog from '../../components/ReportDialog'
import { formItemConfig, columns } from './formConfig'
import { examineRepoPage, auditAllRepo } from '../../api/report-info-audit'
import { queryAllClassByCondition } from '../../api/common'
import { mapState } from 'vuex'

export default {
  name: 'report-info-confirm',
  components: {
    SearchForm,
    PaginationTable,
    ReportDialog
  },
  data() {
    return {
      /****************************** 搜索栏参数 start ******************************/
      // 搜索栏表单配置
      formItemConfig,
      // 搜索栏表单数据
      searchFormData: {
        schoolYear: '',
        gradeId: '',
        classId: '',
        repoDate: [],
        examineStatus: ['02', '03']
      },
      /****************************** 表格参数 start ******************************/
      // 表格项配置
      columns,
      // 表格数据加载状态
      tableDataLoading: false,
      tableMaxHeight: '100%',
      // 表格分页参数
      pageFrom: {
        pageNo: 1,
        pageSize: 10,
        totalNum: 0
      },
      // 表格数据
      tableData: [],
      // 表格多选数据
      tableSelection: [],
      /****************************** 表格参数 end ******************************/
      /****************************** 弹窗参数 start ******************************/
      userAuth: 0,
      reportId: '',
      reportType: '',
      reportDialogVisible: false,
      reportDialogTitle: '审核病例',
      reportDialogConfig: {},
      defaultConfig: {
        width: '90%',
        isShowConfirm: true
      }
      /****************************** 弹窗参数 end ******************************/
    }
  },
  computed: {
    ...mapState('user', ['schoolYearList', 'schoolGradeList', 'curUserRole'])
  },
  watch: {
    schoolYearList: {
      handler(newVal) {
        this.formItemConfig[0].options = newVal
      },
      immediate: true,
      deep: true
    },
    schoolGradeList: {
      handler(newVal) {
        this.formItemConfig[1].options = newVal
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    this.getUserAuth()
  },
  mounted() {
    this.tableMaxHeight = window.document.documentElement.clientHeight - 318
    this.getTableData()
    this.getSchoolYearOptions()
    this.getSchoolGradeOptions()
  },
  methods: {
    // 获取当前用户角色类型
    getUserAuth() {
      this.userAuth = Number(this.curUserRole) - 1
    },
    // 获取学年选项
    getSchoolYearOptions() {
      this.formItemConfig[0].options = this.schoolYearList
    },
    // 获取年级选项
    getSchoolGradeOptions() {
      this.formItemConfig[1].options = this.schoolGradeList
    },
    // 获取审核列表数据
    getTableData() {
      const searchData = {
        ...this.searchFormData,
        pageNo: this.pageFrom.pageNo,
        pageSize: this.pageFrom.pageSize
      }
      if (searchData.repoDate.length > 0) {
        searchData.repoStartDate = this.searchFormData.repoDate[0]
        searchData.repoEndDate = this.searchFormData.repoDate[1]
      }
      examineRepoPage(searchData).then(res => {
        this.tableData = res.data.data
        this.pageFrom.totalNum = res.data.totalNumber
      })
    },
    // 查询
    handleSearch(data) {
      this.searchFormData = data
      this.pageFrom.pageNo = 1
      this.getTableData()
    },
    // 重置
    handleReset(data) {
      this.searchFormData = data
      this.getTableData()
    },
    // 页码切换
    handlePageChange(val) {
      this.pageFrom.pageNo = val
      this.getTableData()
    },
    // 每页显示数切换
    handleSizeChange(val) {
      this.pageFrom.pageSize = val
      this.pageFrom.pageNo = 1
      this.getTableData()
    },
    // 多选列表项
    handleSelectChange(val) {
      const ids = val.map(item => {
        return item.id
      })
      this.tableSelection = ids
    },
    // 取消列表项多选
    toggleSelection() {
      this.$refs['selectionTable'].$children[0].$children[0].clearSelection()
      this.tableSelection = []
    },
    // 审核
    handleAudit(id) {
      this.studentId = ''
      this.reportId = id
      this.reportType = 'audit'
      this.reportDialogVisible = true
      this.reportDialogTitle = '审核病例'
      const config = {
        confirmText: '审核通过'
      }
      this.reportDialogConfig = {
        ...this.defaultConfig,
        ...config
      }
    },
    // 查看
    handleCheck(id) {
      this.studentId = ''
      this.reportId = id
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
    // 批量审核
    handleGroupAudit() {
      auditAllRepo({ idsList: this.tableSelection }).then(res => {
        if (res.code === '200') {
          this.$message({
            type: 'success',
            message: '批量审核成功'
          })
          this.toggleSelection()
          this.getTableData()
        }
      })
    },
    // 根据学年和班级选择结果获取班级选项
    getClassOptions(val, key) {
      if (key === 'gradeId') {
        if (val !== '' && this.searchFormData.schoolYear !== '') {
          queryAllClassByCondition({
            gradeId: val,
            schoolYear: this.searchFormData.schoolYear
          }).then(res => {
            this.formItemConfig[2].options = res.data
            this.searchFormData.classId = ''
          })
        } else {
          this.formItemConfig[2].options = []
          this.searchFormData.classId = ''
        }
      } else if (key === 'schoolYear') {
        if (val !== '' && this.searchFormData.gradeId !== '') {
          queryAllClassByCondition({
            gradeId: this.searchFormData.gradeId,
            schoolYear: val
          }).then(res => {
            this.formItemConfig[2].options = res.data
            this.searchFormData.classId = ''
          })
        } else {
          this.formItemConfig[2].options = []
          this.searchFormData.classId = ''
        }
      }
    },
    // 切换不同审核状态下的文字颜色
    getStatusColor(type) {
      switch (type) {
        case '01':
          return '#1AC45E'
        case '02':
          return '#FBB937'
        case '03':
          return '#F7454E'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.report-info-confirm {
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

  &__hint {
    width: 100%;
    margin-top: 15px;
    .el-alert--info.is-light {
      background-color: #e6f7ff;
      color: #51575a;
      margin-bottom: 10px;
      ::v-deep .el-alert__icon {
        color: #078fea;
      }
      ::v-deep .selectNum {
        color: #1890ff;
      }
    }
  }

  &__btn {
    display: flex;
    justify-content: flex-end;
  }

  &__table {
    flex-grow: 1;
  }
}
</style>
