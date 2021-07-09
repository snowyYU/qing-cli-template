<template>
  <div class="class-manage">
    <search-form
      ref="searchForm"
      :form-data="formData"
      :form-item-config="searchFormConfig"
      :isNeedHide="false"
      @onSubmit="
        pagination.currentPage = 1
        queryClassPage()
      "
      @onReset="reset"
      class="class-manage__search"
    >
    </search-form>
    <div class="class-manage__line"></div>
    <div class="class-manage__btn-group">
      <el-button type="primary" size="small" @click="openDialog('addClass')">
        新建班级
      </el-button>
      <el-button type="defualt" size="small" @click="openDialog('importMany')">
        批量导入
      </el-button>
      <el-button type="defualt" size="small" @click="openDialog('upgrade')">
        升级
      </el-button>
    </div>
    <div class="class-manage__table">
      <pagination-table
        class="pagination-table"
        row-key="id"
        style="width: 100%;"
        :max-height="tableMaxHeight"
        :columns="columns"
        :data="tableData"
        :current-page="pagination.currentPage"
        :page-sizes="[30, 50, 100]"
        :page-size="pagination.size"
        :total="pagination.totalNumber"
        :loading="tableLoading"
        showPageMsg
        show-operation
        default-expand-all
        @size-change="handleSizeChange"
        @page-change="handleCurrentChange"
        :operationBtns="['edit', 'delete']"
        @handleEdit="handleEdit"
        @handleDelete="handleDelete"
        deleteConfirm
      >
        <template #studentNum="{row}">
          {{ row.boyNum + row.girlNum }}
        </template>
      </pagination-table>
    </div>
    <AddClass
      :visible.sync="addClassDialogVisible"
      @refreshData="queryClassPage"
    ></AddClass>
    <EditClass
      :visible.sync="editClassDialogVisible"
      :dialogFormData="editRow"
      @refreshData="queryClassPage"
    ></EditClass>
    <UpGrade
      :visible.sync="upgradeDialogVisible"
      @refreshData="queryClassPage"
    ></UpGrade>
    <ImportMany :visible.sync="importManyDialogVisible"></ImportMany>
  </div>
</template>

<script>
// utils
// component
import searchForm from '@/components/SearchForm'
import PaginationTable from '@/components/PaginationTable'

import { mapState } from 'vuex'

import AddClass from './component/AddClass.vue'
import EditClass from './component/EditClass.vue'
import UpGrade from './component/UpGrade.vue'
import ImportMany from '../../components/ImportMany.vue'

// config
import { searchFormConfig, columns } from './pageConfig'
// api

import { deleteClass, queryClassPage } from '../../api/class-manage'

import { queryDictInfoByCategory } from '@/api/common'

export default {
  name: 'classManage',
  components: {
    searchForm,
    PaginationTable,
    AddClass,
    EditClass,
    UpGrade,
    ImportMany
  },
  data() {
    return {
      formData: {
        schoolYear: '', //学年
        gradeId: '' //年级
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
      // 弹框显示
      addClassDialogVisible: false,
      editClassDialogVisible: false,
      importManyDialogVisible: false,
      upgradeDialogVisible: false,
      // 正在编辑的数据
      editRow: {}
    }
  },
  computed: {
    ...mapState('user', ['schoolYearList', 'schoolGradeList'])
  },
  mounted() {
    this.tableMaxHeight = window.document.documentElement.clientHeight - 240
    this.queryClassPage()
    this.initDicOptions()
  },
  methods: {
    // 字典请求接口
    // ******************** start ***********************
    queryDictInfoByCategory(type) {
      let data = { dictKey: type }
      return queryDictInfoByCategory(data).then(res => {
        return res.data
      })
    },
    // 初始化各字典表的下拉选项
    async initDicOptions() {
      // 给各项赋值
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
      this.formData.createTime = []
    },

    //表格数据相关
    // ************************* start **************************
    // 每页个数选择变化

    // 分页部分
    // 每页数量变化
    handleSizeChange(data) {
      this.pagination.size = data
      this.pagination.currentPage = 1
      this.queryClassPage()
    },
    // 改变当前页
    handleCurrentChange(data) {
      console.log(data)
      this.pagination.currentPage = data
      this.queryClassPage()
    },
    // 获取表格数据
    queryClassPage() {
      this.tableLoading = true
      const data = {
        ...this.formData,
        pageNo: this.pagination.currentPage,
        pageSize: this.pagination.size
      }
      queryClassPage(data)
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

    // 打开新增/编辑弹框
    openDialog(type) {
      switch (type) {
        case 'addClass':
          this.addClassDialogVisible = true
          break
        case 'importMany':
          this.importManyDialogVisible = true
          break
        case 'upgrade':
          this.upgradeDialogVisible = true
          break

        default:
          break
      }
    },

    handleEdit(index, row) {
      this.editRow = row
      this.editClassDialogVisible = true
    },
    handleDelete(index, row) {
      deleteClass(row.id).then(() => {
        this.$message.success('删除成功')
        if (this.tableData.length === 1 && this.pagination.currentPage !== 1) {
          this.pagination.currentPage = this.pagination.currentPage - 1
        }
        this.queryClassPage()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.class-manage {
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
