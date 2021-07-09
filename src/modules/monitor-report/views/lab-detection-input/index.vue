<template>
  <div class="lab-detection-input">
    <SearchForm
      ref="searchForm"
      :form-data="searchFormData"
      :form-item-config="formItemConfig"
      :isNeedHide="false"
      @onSubmit="handleSearch"
      @onReset="handleReset"
      @selectChange="handleSelectChange"
    ></SearchForm>
    <div class="lab-detection-input__line"></div>
    <div class="lab-detection-input__table">
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
        <template #certNo="{ scope }">
          {{ getCryptedCertNo(scope.row.certNo) }}
        </template>
        <template #operation="{ scope }">
          <el-button type="text" @click="handleInput(scope.row.id)"
            >录入</el-button
          >
        </template>
      </PaginationTable>
      <input-dialog
        :reportId="reportId"
        :visible.sync="inputDialogVisible"
        :title="inputDialogTitle"
        :config="inputDialogConfig"
      >
      </input-dialog>
    </div>
  </div>
</template>

<script>
import SearchForm from '@/components/SearchForm'
import PaginationTable from '@/components/PaginationTable'
import InputDialog from '../../components/InputDialog'
import { formItemConfig, columns } from './formConfig'
import { labDetectionPage } from '../../api/lab-detection-input'
import {
  queryAllClassByCondition,
  queryAreaList,
  querySchoolList
} from '../../api/common'
import { queryGradeDictByGroup } from '@/api/common'
import { mapState } from 'vuex'

export default {
  name: 'lab-detection-input',
  components: {
    SearchForm,
    PaginationTable,
    InputDialog
  },
  data() {
    return {
      /****************************** 搜索栏参数 start ******************************/
      // 搜索栏表单配置
      formItemConfig,
      // 搜索栏表单数据
      searchFormData: {
        countyCode: '',
        schoolId: '',
        gradeId: '',
        classId: '',
        name: ''
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
      reportId: '',
      inputDialogVisible: false,
      inputDialogTitle: '实验室监测录入',
      inputDialogConfig: {
        width: '70%'
      }
      /****************************** 弹窗参数 end ******************************/
    }
  },
  computed: {
    ...mapState('user', ['schoolGradeList', 'dict'])
  },
  mounted() {
      this.tableMaxHeight = window.document.documentElement.clientHeight - 274
    this.getTableData()
    this.getAreaOptions()
  },
  methods: {
    // 获取区县选项
    getAreaOptions() {
      queryAreaList().then(res => {
        const areaOptions = res.data.areaCodes.map((item, index) => {
          return {
            value: item,
            label: res.data.areaCodesName[index]
          }
        })
        this.formItemConfig[0].options = areaOptions
      })
    },
    // 获取实验室检测录入列表数据
    getTableData() {
      const searchData = {
        ...this.searchFormData,
        pageNo: this.pageFrom.pageNo,
        pageSize: this.pageFrom.pageSize
      }
      labDetectionPage(searchData).then(res => {
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
    // 录入
    handleInput(id) {
      this.reportId = id
      this.inputDialogVisible = true
    },
    // 动态获取查询项选项
    handleSelectChange(val, key) {
      let orgType = ''
      switch (key) {
        case 'countyCode':
          querySchoolList({ countyCode: val }).then(res => {
            this.formItemConfig[1].options = res.data
          })
          this.formItemConfig[1].options = []
          this.formItemConfig[2].options = []
          this.formItemConfig[3].options = []
          this.searchFormData.schoolId = ''
          this.searchFormData.gradeId = ''
          this.searchFormData.classId = ''
          break
        case 'schoolId':
          for (const item of this.formItemConfig[1].options) {
            if (item.orgCode === val) {
              orgType = item.orgType
              break
            }
          }
          queryGradeDictByGroup({ gradeGroup: orgType }).then(res => {
            this.formItemConfig[2].options = res.data
          })
          this.formItemConfig[2].options = []
          this.formItemConfig[3].options = []
          this.searchFormData.gradeId = ''
          this.searchFormData.classId = ''
          break
        case 'gradeId':
          queryAllClassByCondition({
            gradeId: val,
            schoolId: this.searchFormData.schoolId
          }).then(res => {
            this.formItemConfig[3].options = res.data
          })
          this.formItemConfig[3].options = []
          this.searchFormData.classId = ''
          break
      }
    },
    // 证件号码脱敏处理
    getCryptedCertNo(certNo) {
      return certNo === null
        ? ''
        : `${certNo.substr(0, 4)}***${certNo.substr(-1, 3)}`
    }
  }
}
</script>

<style lang="scss" scoped>
.lab-detection-input {
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
