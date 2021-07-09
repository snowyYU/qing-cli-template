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
        title="当日填报的上报信息请当日审核！逾期将影响上报及时率！"
        type="warning"
        :closable="false"
        show-icon
      >
      </el-alert>
    </div>
    <div class="report-info-confirm__table">
      <PaginationTable
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
        show-operation
        show-page-msg
        @page-change="handlePageChange"
        @size-change="handleSizeChange"
      >
        <template #confirmStatus="{ scope }">
          <span :style="`color:${getStatusColor(scope.row.confirmStatus)}`">{{
            scope.row.confirmStatusName
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
            v-if="scope.row.confirmStatus !== '01'"
            type="text"
            @click="handleConfirm(scope.row.id)"
            >确认</el-button
          >
          <el-button v-else type="text" @click="handleCheck(scope.row.id)"
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
import { confirmRepoPage } from '../../api/report-info-confirm'
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
        confirmStatus: ['02', '03']
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
      /****************************** 表格参数 end ******************************/
      /****************************** 弹窗参数 start ******************************/
      userAuth: 0,
      reportId: '',
      reportType: '',
      reportDialogVisible: false,
      reportDialogTitle: '确认病例',
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
    // 获取当前用户的身份类型
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
    // 获取确认列表数据
    getTableData() {
      const searchData = {
        ...this.searchFormData,
        pageNo: this.pageFrom.pageNo,
        pageSize: this.pageFrom.pageSize
      }
      if (searchData.repoDate.length > 0) {
        searchData.repoStartDate = `${this.searchFormData.repoDate[0]} 00:00:00`
        searchData.repoEndDate = `${this.searchFormData.repoDate[1]} 23:59:59`
      }
      confirmRepoPage(searchData).then(res => {
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
    // 切换页码
    handlePageChange(val) {
      this.pageFrom.pageNo = val
      this.getTableData()
    },
    // 切换每页显示条数
    handleSizeChange(val) {
      this.pageFrom.pageSize = val
      this.pageFrom.pageNo = 1
      this.getTableData()
    },
    // 确认
    handleConfirm(id) {
      this.studentId = ''
      this.reportId = id
      this.reportType = 'confirm'
      this.reportDialogVisible = true
      this.reportDialogTitle = '确认病例'
      const config = {
        confirmText: '确认通过'
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
    // 动态根据学年和年级选项获取班级选项
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
    // 根据确认状态改变字体颜色
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
  }

  &__table {
    flex-grow: 1;
  }
}
</style>
