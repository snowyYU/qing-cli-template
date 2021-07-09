<template>
  <BaseDialog
    :visible="visible"
    :title="title"
    :config="config"
    @open="handleOpen"
    @confirm="handleConfirm"
    @cancel="handleClose"
    @close="handleClose"
    @closed="handleClosed"
  >
    <template #body>
      <SchemaForm :schema="formSchema" :model.sync="formData" ref="configForm">
        <template #taskExecRangeTime>
          <el-date-picker
            :style="{ width: '100%' }"
            v-model="formData.taskExecRangeTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </template>

        <template #taskExecPlace>
          <div class="base-area-input">
            <el-input
              v-model="formData.taskExecPlace"
              placeholder="请输入任务地点"
            ></el-input>
            <i
              class="custom-icon__location"
              @click="handleOpenMap"
              v-show="mode !== 'view'"
            />
          </div>
        </template>
      </SchemaForm>

      <BaseBlock
        class="task-dialog-base-block"
        v-show="mode !== 'view' && !!formData.flowTaskFlag"
      >
        <template #header>
          <div class="task-dialog-base-block__header">
            <div class="task-dialog-base-block__title">病例个案信息</div>
            <div
              class="task-dialog-base-block__btn-group"
              :style="{ textAlign: 'right' }"
            >
              <el-button
                type="primary"
                size="small"
                @click="handleAddCaseMember"
                v-if="mode !== 'view' && !!formData.flowTaskFlag"
                >新增</el-button
              >
            </div>
          </div>
        </template>

        <template>
          <!-- <PaginationTable
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
              <el-button type="text" @click="handleTableClick('view', scope.row)"
                >查看</el-button
              >
              <el-button type="text" @click="handleTableClick('delete', scope.row)"
                >删除</el-button
              >
            </template>
          </PaginationTable> -->
          <PaginationTable
            row-key="id"
            :data="formatCaseMemberSelection"
            :columns="caseColumns"
            :page-sizes="[10]"
            :current-page="pagination.currentPage"
            :page-size="pagination.pageSize"
            :total="caseMemberTotal"
            show-operation
            show-page-msg
            @page-change="handlePageChange"
            @size-change="handleSizeChange"
          >
            <template #age="{ scope }">
              {{ scope.row.age }} {{ scope.row.ageDimensionName }}
            </template>

            <template #operation="{ scope }">
              <el-button
                type="text"
                @click="handleTableClick('view', scope.row)"
                >查看</el-button
              >
              <el-button
                type="text"
                @click="handleTableClick('delete', scope.row)"
                >删除</el-button
              >
            </template>
          </PaginationTable>
        </template>
      </BaseBlock>

      <BaseBlock class="task-dialog-base-block">
        <template #header>
          <div class="task-dialog-base-block__header">
            <div class="task-dialog-base-block__title">任务参与人员</div>
            <div class="task-dialog-base-block__btn-group">
              <el-button
                type="primary"
                size="small"
                @click="handleAddMember"
                v-if="mode !== 'view'"
                >选择</el-button
              >
            </div>
          </div>
        </template>

        <template>
          <BaseTable
            :loading="memberDataSourceLoading"
            :data="formatMemberDataSource"
            :columns="memberColumns"
          />
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

import {
  formSchema,
  formData as initFormData,
  caseColumns,
  memberColumns
} from './formConfig'

export default {
  name: 'TaskDialog',
  components: {
    BaseDialog,
    SchemaForm,
    BaseBlock,
    PaginationTable,
    BaseTable
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '查看'
    },
    config: {
      type: Object,
      default: () => {}
    },
    mode: {
      type: String,
      default: ''
    },
    taskDetail: {
      type: Object,
      default: () => {}
    },
    // caseDataSourceLoading: {
    //   type: Boolean,
    //   default: false
    // },
    // caseDataSource: {
    //   type: Array,
    //   default: () => []
    // },
    memberDataSourceLoading: {
      type: Boolean,
      default: false
    },
    memberDataSource: {
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
      formSchema,
      formData: {
        ...initFormData
      },

      caseColumns,
      pagination: {
        currentPage: 1,
        pageSize: 10
      },

      memberColumns
    }
  },
  computed: {
    // formatCaseDataSource() {
    //   if (this.caseDataSource && Array.isArray(this.caseDataSource)) {
    //     return this.caseDataSource.filter(
    //       (_, index) =>
    //         index >=
    //           (this.pagination.currentPage - 1) * this.pagination.pageSize &&
    //         index < this.pagination.currentPage * this.pagination.pageSize
    //     )
    //   } else {
    //     return []
    //   }
    // },
    // caseTotal() {
    //   if (this.caseDataSource && Array.isArray(this.caseDataSource)) {
    //     return this.caseDataSource.length
    //   } else {
    //     return 0
    //   }
    // },
    formatMemberDataSource() {
      if (this.memberDataSource.length === 0) {
        return []
      } else {
        const obj = {
          leader: '',
          member: []
        }
        this.memberDataSource.forEach(item => {
          if (item.memberType === '1') {
            obj.leader = item.memberName
          } else {
            obj.member.push(item.memberName)
          }
        })
        obj.member = obj.member.join('、')
        return [obj]
      }
    },
    formatCaseMemberSelection() {
      if (this.caseMemberSelection && Array.isArray(this.caseMemberSelection)) {
        return this.caseMemberSelection.filter(
          (_, index) =>
            index >=
              (this.pagination.currentPage - 1) * this.pagination.pageSize &&
            index < this.pagination.currentPage * this.pagination.pageSize
        )
      } else {
        return []
      }
    },
    caseMemberTotal() {
      if (this.caseMemberSelection && Array.isArray(this.caseMemberSelection)) {
        return this.caseMemberSelection.length
      } else {
        return 0
      }
    }
  },
  watch: {
    taskDetail(val) {
      if (val && val.id) {
        this.formatData(val)
      }
    }
  },
  methods: {
    /**
     *  格式化数据
     */
    formatData(data) {
      const fields = {}
      Object.keys(this.formData).forEach(key => {
        if (data[key]) {
          fields[key] = data[key]
        }
      })
      if (data.taskExecStartTime && data.taskExecEndTime) {
        fields.taskExecRangeTime = [
          data.taskExecStartTime,
          data.taskExecEndTime
        ]
      }
      if (data.taskType && data.taskType === '1') {
        fields.flowTaskFlag = 1
      } else {
        fields.flowTaskFlag = 0
      }
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
     * 弹窗确认事件
     */
    handleConfirm() {
      const result = this.$refs.configForm.validateForm()
      if (result) {
        const fields = {}

        Object.keys(this.formData).forEach(key => {
          if (key === 'taskExecRangeTime') {
            const [taskExecStartTime, taskExecEndTime] = this.formData[key]
            fields.taskExecStartTime = taskExecStartTime
            fields.taskExecEndTime = taskExecEndTime
          } else if (key === 'flowTaskFlag') {
            if (this.formData[key]) {
              fields.flowTaskFlag = true
              fields.taskType = '1'
              fields.individualCaseIds = this.caseMemberSelection.map(
                item => item.id
              )
              fields.indiCaseList = []
            } else {
              fields.flowTaskFlag = false
              fields.taskType = '3'
            }
          } else {
            fields[key] = this.formData[key]
          }
        })

        if (this.memberDataSource.length === 0) {
          this.$message.error('请先选择任务参与人员')
          return
        }

        fields.memberDTOS = this.memberDataSource.map(item => {
          return {
            memberId: item.id,
            memberType: item.memberType,
            teamId: item.teamId
          }
        })

        this.$emit('confirm', fields)
      } else {
        this.$el.querySelector('.el-dialog__body').scrollTop = 0
      }
    },

    handleOpen() {
      if (this.mode === 'view') {
        this.formSchema.formStyle.disabled = true
      }
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
      this.formSchema.formStyle.disabled = false
      this.formData = {
        ...initFormData
      }
      this.$emit('closed')
    },

    /**
     * 打开地图
     */
    handleOpenMap() {
      if (this.mode === 'view') {
        return
      }
      const lnglat = {
        lng: this.formData.lng,
        lat: this.formData.lat
      }
      this.$emit('open-new-dialog', 'map-edit', { lnglat }, 'task')
    },

    /**
     * 查看个案信息
     */
    handleTableClick(type, row) {
      switch (type) {
        case 'view':
          this.$emit('open-new-dialog', 'case-view', { id: row.id })
          break
        case 'delete':
          this.$confirm(`是否删除【${row.name}】的个案信息?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              const newCaseMemberSelection = this.caseMemberSelection.filter(
                item => item.id !== row.id
              )
              this.$emit('update:caseMemberSelection', newCaseMemberSelection)
            })
            .catch()
          break
      }
    },

    /**
     * 添加个案成员
     */
    handleAddCaseMember() {
      this.$emit('open-new-dialog', 'case-add', { id: this.taskDetail.id })
    },

    /**
     * 添加成员
     */
    handleAddMember() {
      this.$emit('open-new-dialog', 'member-edit', { id: this.taskDetail.id })
    }
  }
}
</script>

<style lang="scss" scoped>
.base-area-input {
  display: flex;
  align-items: center;
}

.custom-icon__location {
  display: block;
  flex: 0 0 auto;
  width: 40px;
  height: 32px;
  background-image: url('~@/assets/svgs/icon-location.svg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 20px 20px;
  cursor: pointer;
}

.task-dialog-base-block {
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
