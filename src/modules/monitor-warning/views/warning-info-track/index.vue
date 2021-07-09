<template>
  <div class="warning-info-track">
    <SearchForm
      ref="searchForm"
      :form-data="searchFormData"
      :form-item-config="searchFormConfig"
      :first-line-max-item="2"
      @onSubmit="handleSubmit"
      @onReset="handleReset"
      @hideOverFlow="hideOverFlow"
    ></SearchForm>

    <div class="warning-info-track__line"></div>

    <div class="warning-info-track__table">
      <PaginationTable
        class="pagination-table"
        :style="{ width: '100%', marginTop: '16px' }"
        row-key="id"
        :loading="dataSourceLoading"
        :data="dataSource"
        :columns="columns"
        :max-height="tableMaxHeight"
        :page-sizes="[30, 50, 100]"
        :current-page="pagination.currentPage"
        :page-size="pagination.pageSize"
        :total="pagination.total"
        show-operation
        show-page-msg
        :operation-btns="[]"
        @page-change="handlePageChange"
        @size-change="handleSizeChange"
      >
        <template #examineStatusName="{ scope }">
          <span
            :style="{
              color: scope.row.examineStatus === '01' ? '#E5302F' : '#19BE6B'
            }"
            >{{ scope.row.examineStatusName }}</span
          >
        </template>

        <template #infectiousFlag="{ scope }">
          {{ { 0: '否', 1: '是' }[scope.row.infectiousFlag] }}
        </template>

        <template #operation="{ scope }">
          <el-button type="text" @click="handleTableClick('audit', scope)"
            >审核</el-button
          >
        </template>
      </PaginationTable>
    </div>

    <BaseDialog
      class="custom-dialog"
      :visible="dialogVisible"
      :title="dialogTitle"
      :config="dialogConfig"
      @opened="handleDialogOpened"
      @confirm="handleDialogConfirm"
      @cancel="handleDialogClose"
      @close="handleDialogClose"
      @closed="handleDialogClosed"
    >
      <template #body>
        <WarningReport
          ref="warning-report"
          :detailData="detailData"
          @submit="handleWarningReportSubmit"
        />
      </template>
    </BaseDialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SearchForm from '@/components/SearchForm'
import PaginationTable from '@/components/PaginationTable'
import BaseDialog from '@/components/BaseDialog'
import WarningReport from './components/WarningReport'
import { searchFormConfig, searchFormData, columns } from './pageConfig'
import { queryDictInfoByCategory, getRegion } from '@/api/common'
import { queryTracePage, examineTrace } from '../../api/index'

export default {
  name: 'warning-info-track',
  components: {
    SearchForm,
    PaginationTable,
    BaseDialog,
    WarningReport
  },
  data() {
    return {
      /****************************** 搜索栏参数 start ******************************/

      // 搜索栏表单配置
      searchFormConfig,
      // 搜索栏表单数据
      searchFormData,

      /****************************** 搜索栏参数 end ******************************/

      /****************************** 表格参数 start ******************************/

      // 表格项配置
      columns,
      // 表格数据加载状态
      dataSourceLoading: false,
      // 表格最大高度
      tableMaxHeight: '100%',
      // 表格分页参数
      pagination: {
        currentPage: 1,
        pageSize: 30,
        total: 0
      },
      // 表格数据
      dataSource: [],

      /****************************** 表格参数 end ******************************/

      /****************************** 弹窗参数 start ******************************/

      dialogVisible: false,
      dialogTitle: '',
      dialogMode: '',
      dialogConfig: {
        isShowConfirm: true,
        confirmText: '提交',
        confirmLoading: false
      },

      /****************************** 弹窗参数 end ******************************/

      detailData: {}
    }
  },
  computed: {
    ...mapState('user', ['curAreaList', 'curUserSchoolList']),

    // formatSearchFormConfig() {
    //   const searchFormConfig = [...this.searchFormConfig]

    //   const item = {
    //     ...this.searchFormConfig[this.searchFormConfigMap['county']],
    //     props: {
    //       ...this.searchFormConfig[this.searchFormConfigMap['county']].props,
    //       lazy: true,
    //       lazyLoad: (node, resolve) => {
    //         if (node.level < 4) {
    //           this.getRegion(node.value, res => {
    //             resolve(res)
    //           })
    //         } else {
    //           resolve([])
    //         }
    //       }
    //     }
    //   }

    //   searchFormConfig.splice(this.searchFormConfigMap['county'], 1, item)

    //   return searchFormConfig
    // },
    searchFormConfigMap() {
      const map = {}
      this.searchFormConfig.forEach((item, index) => {
        map[item.key] = index
      })
      return map
    }
  },
  methods: {
    /**
     * 根据分类查询所有字典信息
     */
    queryDictInfoByCategory(type, callback) {
      const params = { dictKey: type }
      queryDictInfoByCategory(params).then(res => {
        callback && callback(res.data)
      })
    },

    /**
     * 获取省市区
     */
    getRegion(code, callback) {
      const params = {}
      if (code) {
        params.parentCode = code
      }
      getRegion(params).then(res => {
        callback && callback(res.data)
      })
    },

    /**
     * 分页检索预警信息
     */
    queryTracePage(data) {
      this.dataSourceLoading = true
      queryTracePage(data)
        .then(res => {
          this.dataSource = res.data.records
          this.pagination.currentPage = res.data.current
          this.pagination.pageSize = res.data.size
          this.pagination.total = res.data.total
        })
        .finally(() => {
          this.dataSourceLoading = false
        })
    },

    /**
     * 审核预警信息
     */
    examineTrace(data, callback) {
      this.dialogConfig.confirmLoading = true
      examineTrace(data)
        .then(() => {
          callback && callback()
        })
        .finally(() => {
          this.dialogConfig.confirmLoading = false
        })
    },

    /**
     * 搜索按钮事件
     */
    handleSubmit() {
      this.pagination.currentPage = 1
      this.updateDataSource()
    },

    /**
     * 重置按钮事件
     */
    handleReset() {
      this.pagination.currentPage = 1
      this.pagination.pageSize = 30
      this.updateDataSource()
    },

    /**
     * 收起按钮
     */
    hideOverFlow(toggle) {
      if (toggle) {
        this.tableMaxHeight = window.document.documentElement.clientHeight - 258
      } else {
        this.tableMaxHeight = window.document.documentElement.clientHeight - 207
      }
    },

    /**
     * 修改当前页
     */
    handlePageChange(page) {
      this.pagination.currentPage = page
      this.updateDataSource()
    },

    /**
     * 修改每页条数
     */
    handleSizeChange(size) {
      this.pagination.currentPage = 1
      this.pagination.pageSize = size
      this.updateDataSource()
    },

    /**
     * 预警规则
     */
    handleTableClick(type, scope) {
      switch (type) {
        case 'audit':
          this.detailData = scope.row
          this.dialogTitle = '预警报告'
          this.dialogMode = 'edit'
          if (scope.row.examineStatus === '02') {
            this.dialogConfig.isShowConfirm = false
          }
          this.dialogVisible = true
          break
      }
    },

    /**
     * 更新数据源
     */
    updateDataSource() {
      const { currentPage, pageSize } = this.pagination
      const data = {
        pageNo: currentPage,
        pageSize
      }
      Object.keys(this.searchFormData).forEach(key => {
        if (key !== 'alertRangeTime') {
          data[key] = this.searchFormData[key]
        }
      })
      if (this.searchFormData.alertRangeTime) {
        const [
          alertStartTime,
          alertEndTime
        ] = this.searchFormData.alertRangeTime
        data.alertStartTime = alertStartTime
        data.alertEndTime = alertEndTime
      }
      this.queryTracePage(data)
    },

    /**
     * 弹窗打开后事件
     */
    handleDialogOpened() {
      this.$refs['warning-report'].init()
    },

    /**
     * 弹窗确认事件
     */
    handleDialogConfirm() {
      this.$refs['warning-report'].submit()
    },

    /**
     * 弹窗关闭事件
     */
    handleDialogClose() {
      this.dialogVisible = false
    },

    /**
     * 弹窗关闭后事件
     */
    handleDialogClosed() {
      this.dialogTitle = ''
      this.dialogMode = ''
      this.dialogConfig.isShowConfirm = true
      this.detailData = ''
      this.$refs['warning-report'].reset()
    },

    /**
     * 预警报告提交
     */
    handleWarningReportSubmit(fields) {
      this.examineTrace(fields, () => {
        this.$message.success('操作成功')
        this.dialogVisible = false
        this.updateDataSource()
      })
    }
  },
  mounted() {
    this.tableMaxHeight = window.document.documentElement.clientHeight - 258

    this.queryDictInfoByCategory('traceExamineStatus', res => {
      this.searchFormConfig[
        this.searchFormConfigMap['examineStatus']
      ].options = res
    })

    this.searchFormConfig[
      this.searchFormConfigMap['county']
    ].options = this.curAreaList

    this.searchFormConfig[
      this.searchFormConfigMap['schoolId']
    ].options = this.curUserSchoolList

    this.updateDataSource()
  }
}
</script>

<style lang="scss" scoped>
.warning-info-track {
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

  &__btn-group {
    margin-top: 16px;
  }

  &__table {
    flex-grow: 1;
  }

  .custom-dialog {
    &::v-deep {
      .el-dialog__body {
        padding: 0 16px;
      }
    }
  }
}
</style>
