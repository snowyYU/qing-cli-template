<template>
  <BaseDialog
    :visible="visible"
    :title="title"
    :config="config"
    @open="handleOpen"
    @opened="handleOpened"
    @cancel="handleClose"
    @close="handleClose"
    @closed="handleClosed"
  >
    <template #body>
      <SchemaForm :schema="formSchema" :model.sync="formData">
        <template #warningArea>
          <BaseMap
            class="detail-dialog__map"
            ref="map"
            readonly
            @complete="handleMapComplete"
          />
        </template>
      </SchemaForm>

      <BaseBlock class="detail-dialog-base-block">
        <template #header>
          <div class="detail-dialog-base-block__header">
            <div class="detail-dialog-base-block__title">病例个案信息</div>
          </div>
        </template>

        <template>
          <PaginationTable
            row-key="id"
            :loading="caseDataSourceLoading"
            :data="formatCaseDataSource"
            :columns="caseColumns"
            :page-sizes="[10]"
            :current-page="pagination.currentPage"
            :page-size="pagination.pageSize"
            :total="caseTotal"
            show-operation
            show-page-msg
            @page-change="handlePageChange"
            @size-change="handleSizeChange"
          >
            <template #age="{ scope }">
              {{ scope.row.age }} {{ scope.row.ageDimensionName }}
            </template>

            <template #operation="{ scope }">
              <el-button type="text" @click="handleCaseView(scope.row)"
                >查看</el-button
              >
              <el-button type="text" @click="handleCaseInvestigate(scope.row)"
                >个案流调</el-button
              >
            </template>
          </PaginationTable>
        </template>
      </BaseBlock>

      <BaseBlock class="detail-dialog-base-block">
        <template #header>
          <div class="detail-dialog-base-block__header">
            <div class="detail-dialog-base-block__title">任务信息</div>
          </div>
        </template>

        <template>
          <BaseTable
            :loading="taskDataSourceLoading"
            :data="taskDataSource"
            :columns="taskColumns"
            show-operation
          >
            <template #operation="{ scope }">
              <el-button type="text" @click="handleTaskView(scope.row)"
                >查看</el-button
              >
            </template>
          </BaseTable>
        </template>
      </BaseBlock>

      <BaseBlock class="detail-dialog-base-block">
        <template #header>
          <div class="detail-dialog-base-block__header">
            <div class="detail-dialog-base-block__title">历史记录</div>
          </div>
        </template>

        <template>
          <div>
            <TimeLine :logsData="formatLogsDataSoutce" />
          </div>
        </template>
      </BaseBlock>
    </template>
  </BaseDialog>
</template>

<script>
import BaseDialog from '@/components/BaseDialog'
import SchemaForm from '@/components/ConfigForm'
import BaseBlock from '@/components/BaseBlock'
import PaginationTable from '@/components/PaginationTable'
import BaseTable from '@/components/BaseTable'
import BaseMap from '@/components/BaseMap'
import TimeLine from '@/components/TimeLine'

import {
  infectiousDetailFormSchema,
  infectiousDetailFormData,
  syndromeDetailFormSchema,
  syndromeDetailFormData,
  caseColumns,
  taskColumns
} from './formConfig'

// import { getKpiDictTree } from '../../api'

import { getChildrenDict } from '@/utils'

import isEmpty from 'lodash/isEmpty'

export default {
  name: 'DetailDialog',
  components: {
    BaseDialog,
    SchemaForm,
    BaseBlock,
    PaginationTable,
    BaseTable,
    BaseMap,
    TimeLine
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
    detailData: {
      type: Object,
      default: () => {}
    },
    infectiousDiseasesList: {
      type: Array,
      default: () => []
    },
    syndromeList: {
      type: Array,
      default: () => []
    },
    warningLevelList: {
      type: Array,
      default: () => []
    },
    warningStatusList: {
      type: Array,
      default: () => []
    },
    caseDataSourceLoading: {
      type: Boolean,
      default: false
    },
    caseDataSource: {
      type: Array,
      default: () => []
    },
    taskDataSourceLoading: {
      type: Boolean,
      default: false
    },
    taskDataSource: {
      type: Array,
      default: () => []
    },
    logsDataSoutceLoading: {
      type: Boolean,
      default: false
    },
    logsDataSoutce: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      formSchema: {
        formStyle: {
          size: 'small',
          labelWidth: '150px',
          justify: 'center',
          btns: [],
          disabled: true
        },
        properties: [],
        propertiesOrder: []
      },
      formData: {},

      caseColumns,
      pagination: {
        currentPage: 1,
        pageSize: 10
      },

      taskColumns,

      // kpiDictList: [],

      todoList: []
    }
  },
  computed: {
    formatCaseDataSource() {
      if (this.caseDataSource && Array.isArray(this.caseDataSource)) {
        return this.caseDataSource.filter(
          (_, index) =>
            index >=
              (this.pagination.currentPage - 1) * this.pagination.pageSize &&
            index < this.pagination.currentPage * this.pagination.pageSize
        )
      } else {
        return []
      }
    },
    caseTotal() {
      if (this.caseDataSource && Array.isArray(this.caseDataSource)) {
        return this.caseDataSource.length
      } else {
        return 0
      }
    },
    formSchemaPropertiesMap() {
      const map = {}
      this.formSchema.properties.forEach((item, index) => {
        map[item.key] = index
      })
      return map
    },
    formatLogsDataSoutce() {
      if (this.logsDataSoutce && Array.isArray(this.logsDataSoutce)) {
        return this.logsDataSoutce.map(item => {
          const logs = {
            size: 'normal',
            content: `${item.createTime}，${item.logContent}`
          }

          // if (item.opera === '6') {
          //   logs.size = 'large'
          //   logs.icon = 'icon-bigData-chenggong'
          // }

          return logs
        })
      }
      return []
    }
  },
  watch: {
    detailData(val) {
      if (!isEmpty(val)) {
        if (val.diseaseType === '02') {
          // 传染病类型
          this.formSchema = infectiousDetailFormSchema
          this.formData = {
            ...infectiousDetailFormData
          }

          if (this.infectiousDiseasesList.length > 0) {
            this.formSchema.properties[
              this.formSchemaPropertiesMap['infectiouTypeA']
            ].options = this.infectiousDiseasesList
          }

          getChildrenDict.call(
            this,
            this.formSchema.properties,
            'infectiouTypeB',
            val.infectiouTypeA,
            this.infectiousDiseasesList
          )
        } else if (val.diseaseType === '01') {
          // 症候群类型
          this.formSchema = syndromeDetailFormSchema
          this.formData = {
            ...syndromeDetailFormData
          }

          if (this.syndromeList.length > 0) {
            this.formSchema.properties[
              this.formSchemaPropertiesMap['syndromeType']
            ].options = this.syndromeList
          }
        }

        // if (this.kpiDictList.length > 0) {
        //   this.formSchema.properties[
        //     this.formSchemaPropertiesMap['kpi']
        //   ].options = this.kpiDictList

        //   getChildrenDict.call(
        //     this,
        //     this.formSchema.properties,
        //     'kpiContent',
        //     val.kpi,
        //     this.kpiDictList
        //   )
        // }

        if (this.warningLevelList.length > 0) {
          this.formSchema.properties[
            this.formSchemaPropertiesMap['warningLevel']
          ].options = this.warningLevelList
        }

        if (this.warningStatusList.length > 0) {
          this.formSchema.properties[
            this.formSchemaPropertiesMap['warningStatus']
          ].options = this.warningStatusList
        }

        this.formatData(val)

        if (this.todoList.length > 0) {
          const index = this.todoList.findIndex(
            item => item.eventType === 'draw-marker'
          )

          if (index > -1) {
            if (val.warningArea) {
              const { lng, lat } = JSON.parse(val.warningArea)

              this.todoList[index].callback.call(this, lng, lat)
            }
            this.todoList.splice(index, 1)
          }
        }
      }
    }
  },
  methods: {
    /**
     * 数据格式化
     */
    formatData(data) {
      const fields = {}
      Object.keys(this.formData).forEach(key => {
        if (typeof data[key] !== 'undefined' && data[key] !== null) {
          fields[key] = data[key]
        } else {
          if (data.diseaseType === '02') {
            // 传染病类型
            fields[key] = infectiousDetailFormData[key]
          } else if (data.diseaseType === '01') {
            // 症候群类型
            fields[key] = syndromeDetailFormData[key]
          }
        }
      })
      this.formData = fields
    },

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
     * 获取指标
     */
    // getKpiDictTree() {
    //   getKpiDictTree().then(res => {
    //     this.kpiDictList = res.data

    //     if (this.formSchema.properties.length > 0) {
    //       this.formSchema.properties[
    //         this.formSchemaPropertiesMap['kpi']
    //       ].options = this.kpiDictList

    //       getChildrenDict.call(
    //         this,
    //         this.formSchema.properties,
    //         'kpiContent',
    //         this.detailData.kpi,
    //         this.kpiDictList
    //       )
    //     }
    //   })
    // },

    /**
     * 弹窗打开事件
     */
    handleOpen() {
      // this.getKpiDictTree()
    },

    /**
     * 弹窗打开后事件
     */
    handleOpened() {
      this.$refs['map'].create()
    },

    /**
     * 弹窗关闭事件
     */
    handleClose() {
      this.$emit('update:visible', false)
    },

    /**
     * 弹窗关闭后事件
     */
    handleClosed() {
      if (this.detailData.diseaseType === '02') {
        // 传染病类型
        this.formData = {
          ...infectiousDetailFormData
        }
      } else if (this.detailData.diseaseType === '01') {
        // 症候群类型
        this.formData = {
          ...syndromeDetailFormData
        }
      }

      this.todoList = []

      this.$refs['map'].destroy()

      this.$emit('closed')
    },

    /**
     * 地图加载完毕
     */
    handleMapComplete() {
      if (this.detailData && this.detailData.warningArea) {
        const { lng, lat } = JSON.parse(this.detailData.warningArea)
        this.$refs['map'].setCenter(lng, lat)
        this.$refs['map'].drawMarker(lng, lat)
      } else {
        this.todoList.push({
          eventType: 'draw-marker',
          callback(lng, lat) {
            this.$refs['map'].setCenter(lng, lat)
            this.$refs['map'].drawMarker(lng, lat)
          }
        })
      }
    },

    /**
     * 查看个案信息
     */
    handleCaseView(row) {
      this.$emit('open-new-dialog', 'case-view', { id: row.id })
    },

    /**
     * 个案流调
     */
    handleCaseInvestigate(row) {
      this.$emit('open-new-dialog', 'case-investigation', { id: row.id })
    },

    /**
     * 查看任务
     */
    handleTaskView(row) {
      this.$emit('open-new-dialog', 'task-view', { id: row.id })
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-dialog__map {
  height: 243px;
}

.detail-dialog-base-block {
  &::v-deep {
    .block-title {
      padding: 0;
      background: #fff;
    }
  }

  &__header {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  &__title {
    flex: 0 0 auto;
  }

  &__btn-group {
    flex: 1 0 auto;
    padding-left: 16px;
  }
}
</style>
