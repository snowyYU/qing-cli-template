<template>
  <div class="warning-report">
    <div class="custom-panel">
      <CustomHeader title="预警信息" />

      <div class="custom-panel__content">
        <el-table
          :data="tableData"
          :loading="tableDataLoading"
          border
          :show-header="false"
          :span-method="arraySpanMethod"
          :cell-style="arrayCellStyle"
        >
          <el-table-column prop="label1"></el-table-column>
          <el-table-column prop="value1"></el-table-column>
          <el-table-column prop="label2"></el-table-column>
          <el-table-column prop="value2"></el-table-column>
          <el-table-column prop="label3"></el-table-column>
          <el-table-column prop="value3"></el-table-column>
        </el-table>
      </div>
    </div>

    <div class="custom-panel">
      <CustomHeader title="涉及学生" />

      <div class="custom-panel__content">
        <PaginationTable
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
          <template #diagnoseFlag="{ scope }">
            {{ { 0: '否', 1: '是' }[scope.row.diagnoseFlag] }}
          </template>

          <template #custom="{ scope }">{{
            getCustomText(scope.row)
          }}</template>

          <template #natFlag="{ scope }">
            {{ { 0: '否', 1: '是' }[scope.row.natFlag] }}
          </template>

          <template #virusTestFlag="{ scope }">
            {{ { 0: '否', 1: '是' }[scope.row.virusTestFlag] }}
          </template>

          <template #operation="{ scope }">
            <el-button
              type="text"
              @click="handleTableClick('input', scope)"
              v-show="detailData.examineStatus === '01'"
              >录入</el-button
            >
          </template>
        </PaginationTable>

        <!-- <BaseTable
        row-key="id"
        :loading="dataSourceLoading"
        :data="dataSource"
        :columns="columns"
        :max-height="tableMaxHeight"
        :page-sizes="[30, 50, 100]"
        show-operation
      >
        <template #custom="{ scope }"
          >{{ scope.abStartDate }} {{ scope.abStartMoment }} ~
          {{ scope.abEndDate }} {{ scope.abEndMoment }}
          {{ scope.abDays }}</template
        >

        <template #operation="{ scope }">
          <el-button type="text" @click="handleTableClick('input', scope)"
            >录入</el-button
          >
        </template>
      </BaseTable> -->
      </div>
    </div>

    <div class="custom-panel">
      <CustomHeader title="流程进度" />

      <div class="custom-panel__content">
        <el-form
          ref="form"
          :model="formData"
          size="small"
          :disabled="detailData.examineStatus === '02'"
        >
          <el-steps direction="vertical">
            <el-step class="custom-step" title="学校核实" status="finish">
              <template #description>
                <el-form-item
                  label-width="150px"
                  prop="signalRealFlag"
                  label="预警信号是否属实"
                  :rules="
                    curUserRole === '01' || curUserRole === '02'
                      ? formRules.signalRealFlag
                      : []
                  "
                >
                  <el-radio-group
                    v-model="formData.signalRealFlag"
                    :disabled="curUserRole !== '01' && curUserRole !== '02'"
                  >
                    <el-radio label="1">是</el-radio>
                    <el-radio label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>

                <el-form-item
                  label-width="150px"
                  prop="examineItem"
                  label="已采取措施"
                  :rules="
                    curUserRole === '01' || curUserRole === '02'
                      ? formRules.examineItem
                      : []
                  "
                >
                  <el-checkbox-group
                    v-model="formData.examineItem"
                    :disabled="curUserRole !== '01' && curUserRole !== '02'"
                  >
                    <div class="custom-checkbox">
                      <el-checkbox label="1"
                        >病例离校就诊，病愈后持复课证明复课</el-checkbox
                      >
                    </div>
                    <div class="custom-checkbox">
                      <el-checkbox label="2"
                        >学校加强教室内环境消毒和通风换气</el-checkbox
                      >
                    </div>
                    <div class="custom-checkbox">
                      <el-checkbox label="3"
                        >学校进一步加强晨、午(晚)
                        检,做好学生家长的健康教育</el-checkbox
                      >
                    </div>
                    <div class="custom-checkbox">
                      <el-checkbox label="4">学生加强手卫生</el-checkbox>
                    </div>
                    <div class="custom-checkbox">
                      <el-checkbox label="5"
                        >落实病因追踪和复课查验</el-checkbox
                      >
                    </div>
                    <div class="custom-checkbox">
                      <el-checkbox label="6">应急接种或预防性服药</el-checkbox>
                    </div>
                    <div class="custom-checkbox">
                      <el-checkbox label="7">停课</el-checkbox>
                    </div>
                    <div class="custom-checkbox">
                      <el-checkbox label="8">
                        <el-form-item
                          :style="{ marginBottom: '0' }"
                          prop="examineOther"
                        >
                          <template #label>
                            <span
                              :style="{
                                color:
                                  detailData.examineStatus === '02' ||
                                  (curUserRole !== '01' && curUserRole !== '02')
                                    ? '#C0C4CC'
                                    : undefined
                              }"
                              >其他措施</span
                            >
                          </template>

                          <el-input
                            v-model="formData.examineOther"
                            placeholder="请输入其他措施"
                            @blur="handleFormBlur('examineOther')"
                          ></el-input>
                        </el-form-item>
                      </el-checkbox>
                    </div>
                  </el-checkbox-group>
                </el-form-item>
              </template>
            </el-step>

            <el-step class="custom-step" title="区疾控审核" status="finish">
              <template #description>
                <el-form-item
                  label-width="150px"
                  prop="countyCdcDeal"
                  label="处理结果"
                  :rules="curUserRole === '03' ? formRules.countyCdcDeal : []"
                >
                  <el-radio-group
                    v-model="formData.countyCdcDeal"
                    :disabled="curUserRole !== '03'"
                  >
                    <el-radio label="1">本级处理</el-radio>
                    <el-radio label="2">上报</el-radio>
                  </el-radio-group>
                </el-form-item>

                <el-form-item
                  label-width="150px"
                  prop="countyCdcExamineContent"
                  label="审核内容"
                  :rules="
                    curUserRole === '03'
                      ? formRules.countyCdcExamineContent
                      : []
                  "
                >
                  <el-input
                    type="textarea"
                    v-model="formData.countyCdcExamineContent"
                    placeholder="请输入审核内容"
                    maxlength="100"
                    :disabled="curUserRole !== '03'"
                  ></el-input>
                </el-form-item>
              </template>
            </el-step>

            <el-step class="custom-step" title="市疾控审核" status="finish">
              <template #description>
                <el-form-item
                  label-width="150px"
                  prop="cityCdcExamineContent"
                  label="审核内容"
                  :rules="
                    curUserRole === '04' ? formRules.cityCdcExamineContent : []
                  "
                >
                  <el-input
                    type="textarea"
                    v-model="formData.cityCdcExamineContent"
                    placeholder="请输入审核内容"
                    maxlength="100"
                    :disabled="curUserRole !== '04'"
                  ></el-input>
                </el-form-item>
              </template>
            </el-step>
          </el-steps>
        </el-form>
      </div>
    </div>

    <BaseDialog
      class="custom-dialog"
      :visible="dialogVisible"
      :title="dialogTitle"
      :config="dialogConfig"
      append-to-body
      @opened="handleDialogOpened"
      @confirm="handleDialogConfirm"
      @cancel="handleDialogClose"
      @close="handleDialogClose"
      @closed="handleDialogClosed"
    >
      <template #body>
        <CaseInfo
          ref="case-info"
          :detailData="caseDetailData"
          @submit="handleCaseInfoSubmit"
        />
      </template>
    </BaseDialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import CustomHeader from './CustomHeader'
import PaginationTable from '@/components/PaginationTable'
// import BaseTable from '@/components/BaseTable'
import BaseDialog from '@/components/BaseDialog'
import CaseInfo from './CaseInfo'
import {
  warningReportColumns as columns,
  stepFormData as initFormData
} from './formConfig'
import {
  queryTraceById,
  queryTraceCasesByTraceId,
  queryMonitorDetail,
  queryMonitorUpdate
} from '../../../api'

export default {
  name: 'WarningReport',
  components: {
    CustomHeader,
    PaginationTable,
    // BaseTable
    BaseDialog,
    CaseInfo
  },
  props: {
    detailData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    const validateExamineItem = (rule, value, callback) => {
      if (value.includes('8') && this.formData.examineOther === '') {
        callback(new Error('请输入其他措施'))
      } else {
        callback()
      }
    }

    return {
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

      tableDataLoading: false,
      tableData: [],

      caseDetailData: {},

      /****************************** 弹窗参数 start ******************************/

      dialogVisible: false,
      dialogTitle: '',
      dialogMode: '',
      dialogConfig: {
        loading: false,
        confirmLoading: false
      },

      /****************************** 弹窗参数 end ******************************/

      formData: {
        ...initFormData
      },

      formRules: {
        signalRealFlag: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        examineItem: [{ validator: validateExamineItem, trigger: 'change' }],
        countyCdcDeal: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        countyCdcExamineContent: [
          { required: true, message: '请输入区疾控审核内容', trigger: 'blur' }
        ],
        cityCdcExamineContent: [
          { required: true, message: '请输入市疾控审核内容', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState('user', ['curUserRole'])
  },
  methods: {
    formatData(val) {
      const fields = {}
      Object.keys(this.formData).forEach(key => {
        if (typeof val[key] !== 'undefined' && val[key] !== null) {
          fields[key] = val[key]
        } else {
          fields[key] = initFormData[key]
        }
      })

      if (val.examineItem) {
        fields.examineItem = val.examineItem.split(',')
      }

      this.formData = fields
    },

    arraySpanMethod({ rowIndex, columnIndex }) {
      if (rowIndex !== 0 && columnIndex === 3) {
        return [1, 3]
      } else {
        return [1, 1]
      }
    },

    arrayCellStyle({ columnIndex }) {
      if (columnIndex % 2 === 0) {
        return {
          textAlign: 'center',
          color: '#3A3A3D',
          backgroundColor: '#FAFAFA'
        }
      }
    },

    getCustomText(row) {
      if (
        row.abStartDate &&
        row.abStartMoment &&
        row.abEndDate &&
        row.abEndMoment &&
        row.abDays
      ) {
        return (
          row.abStartDate +
          { 1: '上午', 2: '下午' }[row.abStartMoment] +
          ' ~ ' +
          row.abEndDate +
          { 1: '上午', 2: '下午' }[row.abEndMoment] +
          '；' +
          row.abDays +
          '天'
        )
      } else {
        return '~'
      }
    },

    /**
     * 根据 id 查询追踪信息
     */
    queryTraceById(data) {
      this.tableDataLoading = true
      queryTraceById(data)
        .then(res => {
          const traceData = res.data
          this.tableData = [
            {
              label1: '学校',
              value1: traceData.schoolName,
              label2: '预警范围',
              value2: traceData.monitorScopePosition,
              label3: '预警症状',
              value3: traceData.alertSymptomsName
            },
            {
              label1: '病例数',
              value1: traceData.caseNum,
              label2: '预警时间',
              value2: traceData.alertTime
            },
            {
              label1: '学校联系人',
              value1: traceData.contactPerson,
              label2: '联系电话',
              value2: traceData.contactPhone
            }
          ]

          if (traceData.alertTraceProgressVO) {
            this.formatData(traceData.alertTraceProgressVO)
          }
        })
        .finally(() => {
          this.tableDataLoading = false
        })
    },

    /**
     * 根据 id 查询相关个案
     */
    queryTraceCasesByTraceId(data) {
      this.dataSourceLoading = true
      queryTraceCasesByTraceId(data)
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
     * 监测信息上报==详情
     */
    queryMonitorDetail(params) {
      this.dialogConfig.loading = true
      queryMonitorDetail(params)
        .then(res => {
          this.caseDetailData = res.data
        })
        .finally(() => {
          this.dialogConfig.loading = false
        })
    },

    /**
     * 监测信息上报==编辑
     */
    queryMonitorUpdate(data, callback) {
      this.dialogConfig.confirmLoading = true
      queryMonitorUpdate(data)
        .then(() => {
          callback && callback()
        })
        .finally(() => {
          this.dialogConfig.confirmLoading = false
        })
    },

    /**
     * 表格操作事件
     */
    handleTableClick(type, scope) {
      switch (type) {
        case 'input':
          this.queryMonitorDetail({ id: scope.row.repoId })
          this.dialogTitle = '录入病例信息'
          this.dialogMode = 'add'
          this.dialogVisible = true
          break
      }
    },

    /**
     * 输入框失焦事件
     */
    handleFormBlur(type) {
      switch (type) {
        case 'examineOther':
          this.$refs['form'].validateField('examineItem')
          break
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

    updateDataSource() {
      const data = {
        id: this.detailData.id,
        pageNo: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      }
      this.queryTraceCasesByTraceId(data)
    },

    /**
     * 弹窗打开后事件
     */
    handleDialogOpened() {
      this.$refs['case-info'].init()
    },

    /**
     * 弹窗确认事件
     */
    handleDialogConfirm() {
      this.$refs['case-info'].submit()
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
      this.caseDetailData = {}
      this.$refs['case-info'].reset()
    },

    handleCaseInfoSubmit(fields) {
      const data = {
        ...this.caseDetailData,
        ...fields
      }
      this.queryMonitorUpdate(data, () => {
        this.$message.success('操作成功')
        this.dialogVisible = false
        this.updateDataSource()
      })
    },

    init() {
      this.queryTraceById({ id: this.detailData.id })
      this.updateDataSource()
    },

    submit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          const fields = {
            ...this.formData,
            examineItem: this.formData.examineItem.join(','),
            examineOther: this.formData.examineItem.includes('8')
              ? this.formData.examineItem.examineOther
              : '',
            traceId: this.detailData.id
          }
          this.$emit('submit', fields)
        }
      })
    },

    reset() {
      this.pagination = {
        currentPage: 1,
        pageSize: 30,
        total: 0
      }
      this.dataSource = []
      this.tableData = []
      this.formData = {
        ...initFormData
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.warning-report {
  .el-card {
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .custom-col {
    margin-bottom: 16px;
  }

  .custom-checkbox {
    display: block;
  }

  .custom-step {
    &::v-deep {
      .el-step__title {
        font-size: 14px;
        font-weight: 500;
        color: #3a3a3d;
      }
    }
  }

  .custom-panel {
    &__content {
      padding: 0 16px;
    }
  }
}
</style>
