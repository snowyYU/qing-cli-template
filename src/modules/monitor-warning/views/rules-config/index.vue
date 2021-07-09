<template>
  <div class="rules-config">
    <SearchForm
      ref="searchForm"
      :form-data="searchFormData"
      :form-item-config="searchFormConfig"
      :first-line-max-item="2"
      @onSubmit="handleSubmit"
      @onReset="handleReset"
      @hideOverFlow="hideOverFlow"
    ></SearchForm>

    <div class="rules-config__line"></div>

    <div class="rules-config__btn-group">
      <el-button
        type="primary"
        size="small"
        icon="el-icon-plus"
        @click="handleCreate"
        >新增规则</el-button
      >
    </div>

    <div class="rules-config__table">
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
        is-index
        show-operation
        show-page-msg
        @page-change="handlePageChange"
        @size-change="handleSizeChange"
      >
        <template #operation="{ scope }">
          <el-button type="text" @click="handleDetail(scope.row)"
            >查看</el-button
          >
          <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button
            type="text"
            :style="{ color: '#FF4D4D' }"
            @click="handleDelete(scope.row)"
            >删除</el-button
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
        <RulesConfigForm
          ref="rules-config-form"
          :mode="dialogMode"
          :ruleDetail="ruleDetail"
          :symptomList="symptomList"
          :monitorScopeList="monitorScopeList"
          @submit="handleRulesConfigFormSubmit"
        />
      </template>
    </BaseDialog>

    <!-- <RulesDialog
      :visible.sync="dialogVisible"
      :title="dialogTitle"
      :mode="dialogMode"
      :config="dialogConfig"
      :ruleDetail="ruleDetail"
      :warnTypeList="warnTypeList"
      :conditionList="conditionList"
      :operaTypeList="operaTypeList"
      :kpiDictList="kpiDictList"
      :monitorRangeList="monitorRangeList"
      :infectiousDiseasesList="infectiousDiseasesList"
      :syndromeList="syndromeList"
      @open="handleDialogOpen"
      @confirm="handleDialogConfirm"
      @closed="handleDialogClosed"
    /> -->
  </div>
</template>

<script>
import SearchForm from '@/components/SearchForm'
import PaginationTable from '@/components/PaginationTable'
import BaseDialog from '@/components/BaseDialog'
// import RulesDialog from '../../components/RulesDialog'
import RulesConfigForm from './components/RulesConfigForm'
import { searchFormConfig, searchFormData, columns } from './pageConfig'

import { queryDictInfoByCategory } from '@/api/common'
import {
  getRuleList,
  getRuleDetail,
  saveOrUpdateRule,
  deleteRule
} from '../../api/index'

export default {
  name: 'rules-config',
  components: {
    SearchForm,
    PaginationTable,
    BaseDialog,
    // RulesDialog
    RulesConfigForm
  },
  data() {
    return {
      /** 搜索参数 start */
      searchFormConfig,
      searchFormData,
      /** 搜索参数 end */

      /** 表格参数 start */
      columns,
      dataSourceLoading: false,
      dataSource: [],
      tableMaxHeight: '100%',
      pagination: {
        currentPage: 1,
        pageSize: 30,
        total: 0
      },
      /** 表格参数 end */

      /** 弹窗参数 start */
      dialogVisible: false,
      dialogTitle: '',
      dialogMode: '',
      dialogConfig: {
        loading: false,
        confirmLoading: false
      },
      /** 弹窗参数 end */

      ruleDetail: {},
      deleteLoading: false,

      symptomList: [],
      monitorScopeList: [],

      warnTypeList: [],
      conditionList: [],
      operaTypeList: [],
      kpiDictList: [],
      monitorRangeList: [],
      warningLevelList: [],
      infectiousDiseasesList: [],
      syndromeList: []
    }
  },
  computed: {
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
     * @param {*} data
     * @param {function} callback
     */
    queryDictInfoByCategory(type, callback) {
      const data = { dictKey: type }
      queryDictInfoByCategory(data).then(res => {
        callback && callback(res.data)
      })
    },

    /**
     * 分页检索预警规则信息
     * @param {*} data
     */
    getRuleList(data) {
      this.dataSourceLoading = true
      getRuleList(data)
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
     * 根据id查询规则信息
     * @param {*} data
     */
    getRuleDetail(data) {
      this.dialogConfig.loading = true
      getRuleDetail(data)
        .then(res => {
          this.ruleDetail = res.data || {}
        })
        .finally(() => {
          this.dialogConfig.loading = false
        })
    },

    /**
     * 新增或者编辑规则
     * @param {*} data
     * @param {function} callback
     */
    saveOrUpdateRule(data, callback) {
      this.dialogConfig.confirmLoading = true
      saveOrUpdateRule(data)
        .then(() => {
          this.$message.success('操作成功')
          callback && callback()
        })
        .finally(() => {
          this.dialogConfig.confirmLoading = false
        })
    },

    /**
     * 删除预警规则
     * @param {*} data
     * @param {function} callback
     */
    deleteRule(data, callback) {
      this.deleteLoading = true
      deleteRule(data)
        .then(() => {
          this.$message.success('删除成功')
          callback && callback()
        })
        .finally(() => {
          this.deleteLoading = false
        })
    },

    /**
     * 搜索按钮事件
     */
    handleSubmit() {
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
        this.tableMaxHeight = window.document.documentElement.clientHeight - 307
      } else {
        this.tableMaxHeight = window.document.documentElement.clientHeight - 256
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
     * 新增
     */
    handleCreate() {
      this.dialogMode = 'add'
      this.dialogTitle = '新增预警规则'
      this.dialogVisible = true
    },

    /**
     * 查看
     */
    handleDetail(row) {
      this.getRuleDetail({ id: row.ruleId })
      this.dialogMode = 'view'
      this.dialogTitle = '查看预警规则'
      this.dialogVisible = true
    },

    /**
     * 编辑
     */
    handleEdit(row) {
      this.getRuleDetail({ id: row.ruleId })
      this.dialogMode = 'edit'
      this.dialogTitle = '编辑预警规则'
      this.dialogVisible = true
    },

    /**
     * 删除
     */
    handleDelete(row) {
      const data = { idsList: [row.id] }
      // const data = { idsList: [row.ruleId] }
      this.$confirm(`是否删除选中的规则?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deleteRule(data, () => {
            // this.pagination.currentPage = 1
            this.updateDataSource()
          })
        })
        .catch(() => {})
    },

    /**
     * 弹窗打开事件
     */
    handleDialogOpen() {
      // 逻辑运算符（与、或）
      this.queryDictInfoByCategory('condition', res => {
        this.conditionList = res
      })

      // 逻辑运算符
      this.queryDictInfoByCategory('operaType', res => {
        this.operaTypeList = res
      })
    },

    /**
     * 更新数据源
     */
    updateDataSource() {
      const { currentPage, pageSize } = this.pagination
      const data = {
        createStartTime: '',
        createEndTime: '',
        pageNo: currentPage,
        pageSize
      }
      Object.keys(this.searchFormData).forEach(key => {
        if (key !== 'createRangeTime') {
          data[key] = this.searchFormData[key]
        }
      })
      if (this.searchFormData.createRangeTime) {
        const [
          createStartTime,
          createEndTime
        ] = this.searchFormData.createRangeTime
        data.createStartTime = createStartTime
        data.createEndTime = createEndTime
      }
      this.getRuleList(data)
    },

    /** 弹窗事件 start */

    /**
     * 弹窗打开后事件
     */
    handleDialogOpened() {
      this.$refs['rules-config-form'].init()
    },

    /**
     * 弹窗确认事件
     */
    handleDialogConfirm() {
      this.$refs['rules-config-form'].submit()
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
      this.ruleDetail = {}
      this.$refs['rules-config-form'].reset()
    },

    /** 弹窗事件 end */

    handleRulesConfigFormSubmit(fields) {
      this.saveOrUpdateRule(fields, () => {
        this.updateDataSource()
        this.dialogVisible = false
      })
    }
  },
  mounted() {
    this.tableMaxHeight = window.document.documentElement.clientHeight - 307

    // 监测指标
    this.queryDictInfoByCategory('symptom', res => {
      this.searchFormConfig[this.searchFormConfigMap['kpiCode']].options = res
      this.symptomList = res
    })

    // 监测范围
    this.queryDictInfoByCategory('monitorScope', res => {
      this.searchFormConfig[
        this.searchFormConfigMap['monitorScope']
      ].options = res

      this.monitorScopeList = res
    })

    this.updateDataSource()
  }
}
</script>

<style lang="scss" scoped>
.rules-config {
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
}

.custom-dialog {
  &::v-deep {
    .el-dialog__body {
      padding: 16px 24px 24px;
    }
  }
}
</style>
