<template>
  <BaseDialog
    :visible="visible"
    :title="title"
    :config="config"
    @close="handleClose"
    @closed="handleClosed"
  >
    <template #body>
      <SearchForm
        ref="searchForm"
        :form-data="searchFormData"
        :form-item-config="formItemConfig"
        :isNeedHide="false"
        @onSubmit="handleSearch"
        @onReset="handleReset"
        @selectChange="getClassOptions"
      ></SearchForm>
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
        show-operation
        show-page-msg
        @page-change="handlePageChange"
        @size-change="handleSizeChange"
      >
        <template #sexCode="{ scope }">
          {{ scope.row.sexCode === '0' ? '男' : '女' }}
        </template>
        <template #operation="{ scope }">
          <el-button type="text" @click="selectStudent(scope.row)"
            >选择</el-button
          >
        </template>
      </PaginationTable>
    </template>
  </BaseDialog>
</template>

<script>
import BaseDialog from '@/components/BaseDialog'
import SearchForm from '@/components/SearchForm'
import PaginationTable from '@/components/PaginationTable'
import { formItemConfig, columns } from './formConfig'
import { mapState } from 'vuex'
import { schoolStudentPageList } from '../../api/monitor-info-report'
import { queryAllClassByCondition } from '../../api/common'
import { replaceAllSpace } from '../../utils'

export default {
  name: 'EventDialog',
  components: {
    BaseDialog,
    SearchForm,
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
      default() {
        return {}
      }
    },
    userAuth: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      formItemConfig,
      searchFormData: {
        gradeId: '',
        classId: '',
        studentName: '',
        certNo: ''
      },
      tableDataLoading: false,
      tableData: [],
      columns,
      pageFrom: {
        pageNo: 1,
        pageSize: 10,
        totalNum: 0
      }
    }
  },
  computed: {
    ...mapState('user', ['schoolGradeList', 'curSchoolYear', 'username'])
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.getTableData()
        this.formItemConfig[0].options = this.schoolGradeList
      }
    }
  },
  methods: {
    // 获取学生列表数据
    getTableData() {
      this.searchFormData = replaceAllSpace(this.searchFormData)
      let data = {
        ...this.searchFormData,
        pageNo: this.pageFrom.pageNo,
        pageSize: this.pageFrom.pageSize
      }
      if (this.userAuth === 0) {
        data.teacherId = this.username
      } else {
        data.schoolYear = this.curSchoolYear
      }
      schoolStudentPageList(data).then(res => {
        this.tableData = res.data.data
        this.pageFrom.totalNum = res.data.totalNumber
      })
    },
    // 动态获取班级选项
    getClassOptions(val, key) {
      if (key === 'gradeId' && val !== '') {
        queryAllClassByCondition({ gradeId: val }).then(res => {
          this.formItemConfig[1].options = res.data
        })
      } else if (key === 'gradeId' && val === '') {
        this.formItemConfig[1].options = []
        this.searchFormData.classId = ''
      }
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
    // 选择学生
    selectStudent(data) {
      this.$emit('select', data)
    },
    // 关闭弹窗
    handleClose() {
      this.$emit('update:visible', false)
    },
    // 关闭后清空查询表单
    handleClosed() {
      this.searchFormData = {
        gradeId: '',
        classId: '',
        studentName: '',
        certNo: ''
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
