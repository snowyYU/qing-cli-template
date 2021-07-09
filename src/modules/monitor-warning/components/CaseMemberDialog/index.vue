<template>
  <BaseDialog
    :visible="visible"
    :title="title"
    :config="config"
    @open="handleDialogOpen"
    @confirm="handleDialogConfirm"
    @cancel="handleDialogClose"
    @close="handleDialogClose"
    @closed="handleDialogClosed"
  >
    <template #body>
      <div :style="{ marginBottom: '16px' }">
        <el-input
          size="small"
          v-model="keyword"
          placeholder="输入姓名检索"
        ></el-input>
      </div>
      <div>
        <PaginationTable
          row-key="id"
          :loading="dataSourceLoading"
          :data="formatDataSourceByPage"
          :columns="columns"
          :max-height="tableMaxHeight"
          :page-sizes="[10]"
          :current-page="pagination.currentPage"
          :page-size="pagination.pageSize"
          :total="caseTotal"
          show-operation
          show-page-msg
          is-multi-select
          @page-change="handlePageChange"
          @size-change="handleSizeChange"
          @selection-change="handleSelectionChange"
        >
          <template #age="{ scope }">
            {{ scope.row.age }} {{ scope.row.ageDimensionName }}
          </template>

          <template #operation="{ scope }">
            <el-button type="text" @click="handleTableClick('view', scope.row)"
              >查看</el-button
            >
          </template>
        </PaginationTable>
      </div>
    </template>
  </BaseDialog>
</template>

<script>
import BaseDialog from '@/components/BaseDialog'
import PaginationTable from '@/components/PaginationTable'
import { columns } from './tableConfig'

export default {
  name: 'CaseMemberDialog',
  components: {
    BaseDialog,
    PaginationTable
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    config: {
      type: Object,
      default: () => {}
    },
    dataSourceLoading: {
      type: Boolean,
      default: false
    },
    dataSource: {
      type: Array,
      default: () => []
    },
    caseMemberSelection: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      keyword: '',
      columns,
      pagination: {
        currentPage: 1,
        pageSize: 10
      },
      multipleSelection: [],
      tableMaxHeight: '100%'
    }
  },
  computed: {
    selectionIds() {
      return this.caseMemberSelection.map(item => item.id)
    },
    formatDataSource() {
      if (this.dataSource && Array.isArray(this.dataSource)) {
        /**
         * 1.过滤被选中的成员
         * 2.根据筛选条件过滤
         */
        return this.dataSource
          .filter(item => !this.selectionIds.includes(item.id))
          .filter(item => item.name.indexOf(this.keyword) > -1)
      } else {
        return []
      }
    },
    formatDataSourceByPage() {
      /**
       * 根据分页过滤
       */
      return this.formatDataSource.filter(
        (_, index) =>
          index >=
            (this.pagination.currentPage - 1) * this.pagination.pageSize &&
          index < this.pagination.currentPage * this.pagination.pageSize
      )
    },
    caseTotal() {
      return this.formatDataSource.length
    }
  },
  methods: {
    /**
     * 修改当前页
     */
    handlePageChange(page) {
      this.pagination.currentPage = page
    },

    /**
     * 修改每页条数
     */
    handleSizeChange(size) {
      this.pagination = {
        currentPage: 1,
        pageSize: size
      }
    },

    /**
     * 当选择项发生变化时会触发该事件
     */
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    /**
     * 表格功能键
     */
    handleTableClick(type, row) {
      switch (type) {
        case 'view':
          // 查看
          this.$emit('open-new-dialog', 'case-view', { id: row.id })
          break
      }
    },

    /**
     * 弹窗打开
     */
    handleDialogOpen() {
      this.tableMaxHeight =
        window.document.documentElement.clientHeight * 0.6 - 120
      this.$emit('open')
    },

    /**
     * 弹窗确认
     */
    handleDialogConfirm() {
      this.$emit('confirm', this.multipleSelection)
    },

    /**
     * 弹窗关闭
     */
    handleDialogClose() {
      this.$emit('update:visible', false)
    },

    /**
     * 弹窗关闭后
     */
    handleDialogClosed() {
      this.keyword = ''
      this.pagination = {
        currentPage: 1,
        pageSize: 10
      }
      this.multipleSelection = []
    }
  }
}
</script>

<style lang="scss" scoped></style>
