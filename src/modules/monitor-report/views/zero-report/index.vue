<template>
  <div class="zero-report">
    <SearchForm
      ref="searchForm"
      :form-data="searchFormData"
      :form-item-config="formItemConfig"
      :isNeedHide="false"
      @onSubmit="handleSearch"
      @onReset="handleReset"
    ></SearchForm>
    <div class="zero-report__line"></div>
    <div class="zero-report__btnArea">
      <el-button type="primary" @click="handleAdd" size="small">新建</el-button>
    </div>
    <div class="zero-report__table">
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
        is-index
        show-operation
        show-page-msg
        @page-change="handlePageChange"
        @size-change="handleSizeChange"
      >
        <!--        <template #operation="{ scope }">-->
        <!--          <el-button-->
        <!--            type="text"-->
        <!--            @click="handleDelete(scope.row)"-->
        <!--            :disabled="-->
        <!--              Math.floor(-->
        <!--                (Date.now() - -->
        <!--                  new Date(scope.row.repoDate.substr(0, 10)).getTime()) /-->
        <!--                  (3600 * 24 * 1000)-->
        <!--              ) > 7-->
        <!--            "-->
        <!--            >删除</el-button-->
        <!--          >-->
        <!--        </template>-->
        <template #operation="{ scope }">
          <el-button
            type="text"
            @click="handleDelete(scope.row.id)"
            :disabled="checkIfDeletable(scope.row.zerorepoDate)"
            >删除</el-button
          >
        </template>
      </PaginationTable>
    </div>
    <base-dialog
      :visible="dialogVisible"
      title="新增零上报记录"
      :config="dialogConfig"
      @confirm="handleConfirm"
      @cancel="handleClose"
      @close="handleClose"
    >
      <template #body>
        <schema-form
          :schema="formSchema"
          :model.sync="repoFormData"
          ref="repoForm"
        ></schema-form>
      </template>
    </base-dialog>
  </div>
</template>

<script>
import SearchForm from '@/components/SearchForm'
import PaginationTable from '@/components/PaginationTable'
import BaseDialog from '@/components/BaseDialog'
import SchemaForm from '@/components/ConfigForm'
import { formItemConfig, columns, formSchema } from './formConfig'
import {
  zeroRepoPage,
  saveZeroRepo,
  deleteZeroRepo
} from '../../api/zero-report'

export default {
  name: 'zero-report',
  components: {
    SearchForm,
    PaginationTable,
    BaseDialog,
    SchemaForm
  },
  data() {
    return {
      /****************************** 搜索栏参数 start ******************************/
      // 搜索栏表单配置
      formItemConfig,
      // 搜索栏表单数据
      searchFormData: {
        zerorepoDate: null
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
      dialogVisible: false,
      formSchema,
      dialogConfig: {
        width: '50%'
      },
      repoFormData: {
        zeroRepoDate: null
      }
      /****************************** 弹窗参数 end ******************************/
    }
  },
  mounted() {
    this.tableMaxHeight = window.document.documentElement.clientHeight - 269
    this.getTableData()
  },
  methods: {
    // 获取零上报列表数据
    getTableData() {
      const searchData = {
        pageNo: this.pageFrom.pageNo,
        pageSize: this.pageFrom.pageSize
      }
      if (this.searchFormData.zerorepoDate !== null) {
        searchData.zeroRepoStartDate = this.searchFormData.zerorepoDate[0]
        searchData.zeroRepoEndDate = this.searchFormData.zerorepoDate[1]
      }
      zeroRepoPage(searchData).then(res => {
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
    checkIfDeletable(date) {
      if (date !== null) {
        return (
          Math.floor(
            (Date.now() - new Date(date.substr(0, 10)).getTime()) /
              (3600 * 24 * 1000)
          ) > 7
        )
      } else return false
    },
    // 新建
    handleAdd() {
      this.dialogVisible = true
    },
    // 删除
    handleDelete(id) {
      this.$confirm('该操作将删除此零上报记录，是否继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteZeroRepo({ id })
          .then(res => {
            if (res.code === '200') {
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.getTableData()
            } else {
              this.$message.error('删除失败，请稍后重试')
            }
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      })
    },
    // 表单确定
    handleConfirm() {
      if (this.$refs['repoForm'].validateForm()) {
        // console.log(this.repoFormData)
        saveZeroRepo(this.repoFormData).then(res => {
          if (res.code === '200') {
            this.$message({
              type: 'success',
              message: '新增成功'
            })
            this.getTableData()
            this.$refs['repoForm'].resetForm()
            this.dialogVisible = false
          }
        })
      }
    },
    // 弹窗关闭，清空表单
    handleClose() {
      this.$refs['repoForm'].resetForm()
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.zero-report {
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
    margin-top: 15px;
    display: flex;
    justify-content: flex-end;
  }

  &__table {
    flex-grow: 1;
  }
}
</style>
