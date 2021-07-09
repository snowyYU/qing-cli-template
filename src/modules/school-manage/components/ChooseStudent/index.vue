<template>
  <BaseDialog
    :visible="visible"
    @cancel="cancelDialog"
    :title="title"
    @close="cancelDialog"
    @closed="resetDialog"
    @confirm="confirmDialog"
    @open="openDialog"
    :config="{ isShowFooter: false }"
  >
    <template #body>
      <search-form
        ref="searchForm"
        :form-data="formData"
        :form-item-config="searchFormConfig"
        @hideOverFlow="hideOverFlow"
        @selectChange="handleSearchChange"
        @onSubmit="
          pagination.currentPage = 1
          queryStudentPage()
        "
        @onReset="reset"
        class="student-death-regist__search"
      >
      </search-form>
      <div class="student-death-regist__table">
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
          showPageMsg
          show-operation
          operationWidth="60"
          default-expand-all
          @size-change="handleSizeChange"
          @page-change="handleCurrentChange"
        >
          <template slot="operation" slot-scope="{ scope }">
            <el-button type="text" @click="openSubDialog(scope)">
              选择
            </el-button>
          </template>
        </pagination-table>
      </div>
      <InfoBaseDialogTemplate
        :visible.sync="baseInfoDialogVisible"
        :title="subDialogTitle"
        :baseInfo="targetBaseInfo"
        @submitData="submitData"
        @closed="resetFormData"
      >
        <template #default="{baseInfo}">
          <slot :baseInfo="baseInfo"></slot>
        </template>
      </InfoBaseDialogTemplate>
    </template>
  </BaseDialog>
</template>

<script>
import BaseDialog from '@/components/BaseDialog'
import searchForm from '@/components/SearchForm'
import InfoBaseDialogTemplate from './InfoBaseDialogTemplate.vue'
import { mapState } from 'vuex'
import PaginationTable from '@/components/PaginationTable'
import { searchFormConfig, columns } from './dialogConfig'

import {
  queryAllClassByGradeId,
  queryStudentPage
} from '../../api/student-file-manage'

const formData = {
  gradeId: '',
  classId: '',
  studentName: '',
  rangeTime: []
}
export default {
  name: 'ChooseStudent',
  components: {
    searchForm,
    PaginationTable,
    BaseDialog,
    InfoBaseDialogTemplate
  },
  data() {
    return {
      formData: {
        ...formData
      },
      searchFormConfig,
      tableData: [],
      columns,

      pagination: {
        currentPage: 1,
        totalNumber: 0,
        size: 30
      },
      tableMaxHeight: '100%',
      targetBaseInfo: {},
      baseInfoDialogVisible: false
      // 弹框相关
    }
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
    subDialogTitle: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapState('user', [
      // 'schoolYearList',
      'schoolGradeList',
      'dict',
      'curSchoolYear'
    ])
  },
  mounted() {
    this.tableMaxHeight =
      window.document.documentElement.clientHeight * 0.6 - 196
    this.queryStudentPage()
    this.initDicOptions()
  },
  methods: {
    // 字典请求接口
    // ******************** start ***********************

    // 初始化各字典表的下拉选项
    async initDicOptions() {
      // 给各项赋值
      this.searchFormConfig.forEach(item => {
        // if (item.key === 'schoolYear') {
        //   item.options = [
        //     { schoolYearName: '全部', schoolYear: '' },
        //     ...this.schoolYearList
        //   ]
        // }
        if (item.key === 'gradeId') {
          item.options = [
            // { gradeValue: '全部', id: '' },
            ...this.schoolGradeList
          ]
        }
      })
    },
    // ******************** end ***********************

    reset() {
      // 自定义项需要自行初始化
    },
    handleSearchChange(val, key) {
      if (!val) return
      if (key === 'gradeId') {
        this.formData.classId = ''
        queryAllClassByGradeId({ gradeId: val }).then(res => {
          this.searchFormConfig.forEach(item => {
            if (item.key === 'classId') {
              item.options = res.data
            }
          })
        })
      }
    },
    //表格数据相关
    // ************************* start **************************
    // 每页个数选择变化

    // 分页部分
    // 每页数量变化
    handleSizeChange(data) {
      this.pagination.size = data
      this.pagination.currentPage = 1
      this.queryStudentPage()
    },
    // 改变当前页
    handleCurrentChange(data) {
      console.log(data)
      this.pagination.currentPage = data
      this.queryStudentPage()
    },
    // 获取表格数据
    queryStudentPage() {
      const data = {
        ...this.formData,
        pageNo: this.pagination.currentPage,
        pageSize: this.pagination.size
      }
      queryStudentPage(data).then(res => {
        if (res.code === '200') {
          this.pagination.totalNumber = res.data.totalNumber
          this.pagination.currentPage = res.data.currentPage
          this.tableData = res.data.data
        }
      })
    },
    // ************************* end **************************
    hideOverFlow(toggle) {
      if (toggle) {
        this.tableMaxHeight =
          window.document.documentElement.clientHeight * 0.6 - 196
      } else {
        this.tableMaxHeight =
          window.document.documentElement.clientHeight * 0.6 - 148
      }
    },
    //**************************** 弹框相关 start *************
    openSubDialog({ row }) {
      console.log(row)
      this.targetBaseInfo = { ...row }
      this.baseInfoDialogVisible = true
    },
    openDialog() {
      this.queryStudentPage()
    },
    cancelDialog() {
      this.$emit('update:visible', false)
    },
    confirmDialog() {},
    resetDialog() {
      this.formData = { ...formData }
    },
    //**************************** 弹框相关 end *************
    submitData(data) {
      this.$emit('submitData', data)
    },
    resetFormData() {
      this.$emit('subDialogClosed')
    }
  }
}
</script>

<style lang="scss" scoped></style>
