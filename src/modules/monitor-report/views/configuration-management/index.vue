<template>
  <div class="configuration-management">
    <div class="configuration-management__layout">
      <div class="configuration-management__layout--left">
        <el-card class="configuration-management__card" shadow="never">
          <el-tree
            ref="treeRef"
            node-key="index"
            highlight-current
            :data="treeData"
            @node-click="handleNodeClick"
          ></el-tree>
        </el-card>
      </div>
      <div class="configuration-management__layout--right">
        <SearchForm
          ref="searchForm"
          :form-item-config="searchFormConfig"
          :form-data="searchFormData"
          :isNeedHide="false"
          @onSubmit="handleSubmit"
          @onReset="handleReset"
        ></SearchForm>

        <div class="configuration-management__line"></div>

        <div class="configuration-management__btn-group">
          <el-button type="primary" size="small" @click="handleCreate"
            >新增</el-button
          >
        </div>

        <div class="configuration-management__table">
          <PaginationTable
            class="pagination-table"
            :style="{ width: '100%', marginTop: '16px' }"
            row-key="id"
            :loading="dataSourceLoading"
            :data="dataSource"
            :columns="columns"
            :max-height="tableMaxHeight"
            :operationBtns="['edit', 'delete']"
            :page-sizes="[30, 50, 100]"
            :current-page="pagination.currentPage"
            :page-size="pagination.pageSize"
            :total="pagination.total"
            show-operation
            show-page-msg
            @page-change="handlePageChange"
            @size-change="handleSizeChange"
            @handleEdit="handleEdit"
            @handleDelete="handleDelete"
          ></PaginationTable>
        </div>
      </div>
    </div>

    <FormControlDialog
      :visible.sync="formControlDialogVisible"
      :title="formControlDialogTitle"
      :config="formControlDialogConfig"
      :mode="formControlDialogMode"
      :activeIndex="activeIndex"
      @confirm="handleFormControlDialogConfirm"
    />
  </div>
</template>

<script>
import SearchForm from '@/components/SearchForm'
import PaginationTable from '@/components/PaginationTable'
import FormControlDialog from './components/FormControlDialog'
import { configItems, treeData } from './pageConfig'

export default {
  name: 'configuration-management',
  components: {
    SearchForm,
    PaginationTable,
    FormControlDialog
  },
  data() {
    return {
      dataSource: [],
      dataSourceLoading: false,
      tableMaxHeight: '100%',
      pagination: {
        currentPage: 1,
        pageSize: 30,
        total: 0
      },
      treeData,
      activeIndex: 0,
      searchFormData: {},
      formControlDialogVisible: false,
      formControlDialogTitle: '',
      formControlDialogConfig: {},
      formControlDialogMode: ''
    }
  },
  computed: {
    title() {
      return treeData[this.activeIndex].label
    },
    searchFormConfig() {
      return configItems[this.activeIndex].searchFormConfig
    },
    columns() {
      return configItems[this.activeIndex].columns
    }
  },
  methods: {
    /**
     * 搜索按钮事件
     */
    handleSubmit() {
      // console.log('submit', fields)
      this.updateDataSource()
    },

    /**
     * 重置按钮事件
     */
    handleReset() {
      this.pagination = {
        ...this.pagination,
        currentPage: 1,
        pageSize: 30
      }
      this.updateDataSource()
    },

    /**
     * 新增按钮事件
     */
    handleCreate() {
      this.formControlDialogTitle = `${this.title}新增`
      this.formControlDialogMode = 'add'
      this.formControlDialogVisible = true
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
      this.pagination = {
        ...this.pagination,
        currentPage: 1,
        pageSize: size
      }
      this.updateDataSource()
    },

    /**
     * 编辑事件
     */
    handleEdit(_, row) {
      this.resourcesDetail = row
      this.dialogTitle = '编辑物资'
      this.dialogMode = 'edit'
      this.dialogVisible = true
    },

    /**
     * 删除事件
     */
    handleDelete(_, row) {
      const data = { id: row.id }
      this.$confirm(`是否删除物资【${row.materialName}】?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deleteMaterial(data, () => {
            // this.pagination.currentPage = 1
            this.updateDataSource()
          })
        })
        .catch(() => {})
    },

    /**
     * 更新数据源
     */
    updateDataSource() {
      const { currentPage, pageSize } = this.pagination
      const data = {
        ...this.searchFormData,
        pageNo: currentPage,
        pageSize
      }
      this.getMaterialList(data)
    },

    /**
     * 节点被点击时的回调
     */
    handleNodeClick(data) {
      if (this.activeIndex !== data.index) {
        this.activeIndex = data.index
        this.dataSource = new Array(30).fill({
          a: Math.ceil(Math.random() * 10),
          b: Math.ceil(Math.random() * 10),
          c: Math.ceil(Math.random() * 10),
          d: Math.ceil(Math.random() * 10)
        })
      }
    },

    /**
     * 表单弹窗确认事件
     */
    handleFormControlDialogConfirm() {}
  },
  created() {
    this.searchFormData = {
      ...configItems[this.activeIndex].searchFormData
    }
  },
  mounted() {
    this.tableMaxHeight = window.document.documentElement.clientHeight - 238
    this.$refs.treeRef.setCurrentKey(0)
    // this.updateDataSource()
    this.dataSource = new Array(30).fill({ a: 1, b: 2, c: 3, d: 4 })
  }
}
</script>

<style lang="scss" scoped>
.configuration-management {
  height: 100%;

  &__layout {
    display: flex;
    height: 100%;

    &--left {
      width: 264px;
    }

    &--right {
      flex: 1;
      margin: 16px;
    }
  }

  &__card {
    height: 100%;
  }

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
</style>
