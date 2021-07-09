<template>
  <div class="student-suspend-regist">
    <search-form
      ref="searchForm"
      :form-data="searchFormDataRender"
      :form-item-config="searchFormConfigRender"
      :isNeedHide="false"
      @onSubmit="
        pagination.currentPage = 1
        queryLessionStopPage()
      "
      @onReset="reset"
      class="student-suspend-regist__search"
    >
    </search-form>
    <div class="student-suspend-regist__line"></div>
    <div class="student-suspend-regist__btn-group" v-if="curUserRole === '02'">
      <el-button type="primary" size="small" @click="openDialog('add')"
        >新增</el-button
      >
    </div>
    <div class="student-suspend-regist__table">
      <pagination-table
        class="pagination-table"
        row-key="id"
        style="width: 100%;"
        :max-height="tableMaxHeight"
        :loading="tableLoading"
        :columns="columnsRender"
        :data="tableData"
        :current-page="pagination.currentPage"
        :page-sizes="[30, 50, 100]"
        :page-size="pagination.size"
        :total="pagination.totalNumber"
        showPageMsg
        show-operation
        operationWidth="260"
        default-expand-all
        @size-change="handleSizeChange"
        @page-change="handleCurrentChange"
      >
        <template #stopTimeRange="{row}">
          {{ row.stopStartTime }} - {{ row.stopEndTime }}
        </template>
        <template slot="operation" slot-scope="{ scope }">
          <el-button type="text" @click="openDialog('detail', scope)">
            查看
          </el-button>
          <el-button
            type="text"
            @click="openDialog('edit', scope)"
            v-if="curUserRole === '02'"
          >
            编辑
          </el-button>

          <el-button
            type="text"
            @click="handleDelete(scope)"
            :style="{ color: '#FF4D4D' }"
            v-if="curUserRole === '02'"
          >
            删除
          </el-button>
        </template>
      </pagination-table>
    </div>
    <SuspendInfoDialog
      :type="targetType"
      :visible.sync="suspendInfoDialogVisible"
      :targetData="targetData"
      @refreshData="queryLessionStopPage"
    ></SuspendInfoDialog>
  </div>
</template>

<script>
// utils
// import dayjs from 'dayjs'
// component
import searchForm from '@/components/SearchForm'
import PaginationTable from '@/components/PaginationTable'
import SuspendInfoDialog from './component/SuspendInfoDialog.vue'

import { mapState } from 'vuex'
// config
import {
  searchFormConfig,
  searchFormConfigForLeader,
  columns,
  columnsForLeader,
  searchFormData,
  searchFormDataForLeader
} from './pageConfig'
// api
import {
  queryLessionStopPage,
  deleteLessionStop
} from '../../api/suspend-manage'

export default {
  name: 'student-suspend-regist',
  components: {
    searchForm,
    PaginationTable,
    SuspendInfoDialog
  },
  data() {
    return {
      searchFormDataRender: {
        rangeDate: []
      },
      searchFormConfigRender: [],
      tableData: [],
      columnsRender: [],
      tableLoading: false,
      pagination: {
        currentPage: 1,
        totalNumber: 0,
        size: 30
      },
      tableMaxHeight: '100%',
      // 弹框相关
      suspendInfoDialogVisible: false,
      targetType: '',
      targetData: {}
    }
  },
  computed: {
    ...mapState('user', [
      'schoolYearList',
      'schoolGradeList',
      'dict',
      'curUserSchoolList',
      'curSchoolYear',
      'curUserRole',
      'curAreaList'
    ])
    // computeSearchFormConfig(){

    // }
  },
  created() {
    if (this.$store.state.user.curUserRole === '02') {
      // 表头
      this.columnsRender = columns
      this.searchFormConfigRender = searchFormConfig
      this.searchFormDataRender = searchFormData
    }
    if (
      this.$store.state.user.curUserRole === '03' ||
      this.$store.state.user.curUserRole === '04'
    ) {
      // 表头
      this.columnsRender = columnsForLeader
      this.searchFormConfigRender = searchFormConfigForLeader
      this.searchFormDataRender = searchFormDataForLeader
    }
  },
  mounted() {
    this.queryLessionStopPage()
    this.initDicOptions()
  },
  methods: {
    // 字典请求接口
    // ******************** start ***********************

    // 初始化各字典表的下拉选项
    async initDicOptions() {
      if (this.curUserRole === '02') {
        this.tableMaxHeight = window.document.documentElement.clientHeight - 240
      } else {
        this.tableMaxHeight = window.document.documentElement.clientHeight - 192
      }
      if (!(this.curUserRole === '03' || this.curUserRole === '04')) return
      // 给各项赋值
      this.searchFormConfigRender.forEach(item => {
        if (item.key === 'countyCode') {
          item.options = [{ label: '全部', value: '' }, ...this.curAreaList]
        }
        if (item.key === 'schoolId') {
          item.options = [
            { orgName: '全部', orgCode: '' },
            ...this.curUserSchoolList
          ]
        }
      })
    },
    // ******************** end ***********************

    reset() {
      // 自定义项需要自行初始化
      this.searchFormDataRender.rangeDate = []
    },

    //表格数据相关
    // ************************* start **************************
    // 每页个数选择变化

    // 分页部分
    // 每页数量变化
    handleSizeChange(data) {
      this.pagination.size = data
      this.pagination.currentPage = 1
      this.queryLessionStopPage()
    },
    // 改变当前页
    handleCurrentChange(data) {
      console.log(data)
      this.pagination.currentPage = data
      this.queryLessionStopPage()
    },
    // 获取表格数据
    queryLessionStopPage() {
      this.tableLoading = true
      const data = {
        stopEndTime: this.searchFormDataRender.rangeDate[0]
          ? this.searchFormDataRender.rangeDate[0]
          : '',
        stopStartTime: this.searchFormDataRender.rangeDate[1]
          ? this.searchFormDataRender.rangeDate[1]
          : '',
        pageNo: this.pagination.currentPage,
        pageSize: this.pagination.size
      }
      if (
        this.$store.state.user.curUserRole === '03' ||
        this.$store.state.user.curUserRole === '04'
      ) {
        data.countyCode = this.searchFormDataRender.countyCode
        data.schoolId = this.searchFormDataRender.schoolId
      }
      queryLessionStopPage(data)
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

    // 打开弹框
    openDialog(type, { row } = { row: {} }) {
      this.targetType = type

      this.targetData = row

      this.suspendInfoDialogVisible = true
    },

    handleDelete({ row }) {
      this.$confirm('此操作将删除停课记录，确认删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteLessionStop({ id: row.id }).then(() => {
            this.$message.success('删除成功')
            if (
              this.tableData.length === 1 &&
              this.pagination.currentPage !== 1
            ) {
              this.pagination.currentPage = this.pagination.currentPage - 1
            }
            this.queryLessionStopPage()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.student-suspend-regist {
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
