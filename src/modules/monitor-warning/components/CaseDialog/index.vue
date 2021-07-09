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
      <el-collapse v-model="activeNames">
        <el-collapse-item title="基本信息" name="1">
          <div class="custom-panel">
            <BasicInfoForm
              ref="basic-info-form"
              :mode="mode"
              :caseDialogAllInfo="caseDialogAllInfo"
              @complete="handleComplete('basic-info-form')"
            />
          </div>
        </el-collapse-item>
        <el-collapse-item title="诊疗情况" name="2">
          <div class="custom-panel">
            <MedicalRecordForm
              ref="medical-record-form"
              :mode="mode"
              :caseDialogAllInfo="caseDialogAllInfo"
              @complete="handleComplete('medical-record-form')"
            />
          </div>
        </el-collapse-item>
        <el-collapse-item title="行动轨迹" name="3">
          <div class="custom-panel">
            <el-button
              type="primary"
              size="small"
              @click="handleClick('add')"
              v-if="trackControl"
              >新增</el-button
            >

            <BaseTable
              row-key="id"
              :style="{ width: '100%', marginTop: '10px' }"
              :loading="caseDialogAllInfoLoading"
              :columns="columns"
              :data="dataSource"
              show-operation
            >
              <template #operation="{ scope }">
                <el-button type="text" @click="handleClick('view', scope)"
                  >查看</el-button
                >
                <template v-if="trackControl">
                  <el-button type="text" @click="handleClick('edit', scope)"
                    >编辑</el-button
                  >
                  <el-button type="text" @click="handleClick('delete', scope)"
                    >删除</el-button
                  >
                </template>
              </template>
            </BaseTable>
          </div>
        </el-collapse-item>
      </el-collapse>

      <TrackDialog
        :visible.sync="trackDialogVisible"
        :title="trackDialogTitle"
        :config="trackDialogConfig"
        :mode="trackDialogMode"
        :trackDetail="trackDetail"
        @confirm="handleTrackDialogConfirm"
        @closed="handleTrackDialogClosed"
      />
    </template>
  </BaseDialog>
</template>

<script>
import BaseDialog from '@/components/BaseDialog'
import BaseTable from '@/components/BaseTable'
import BasicInfoForm from './BasicInfoForm'
import MedicalRecordForm from './MedicalRecordForm'
import TrackDialog from './TrackDialog'

import { trackColumns as columns } from './formConfig'

export default {
  name: 'CaseDialog',
  components: {
    BaseDialog,
    BaseTable,
    BasicInfoForm,
    MedicalRecordForm,
    TrackDialog
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
    mode: {
      type: String,
      default: ''
    },
    caseDialogAllInfoLoading: {
      type: Boolean,
      default: false
    },
    caseDialogAllInfo: {
      type: Object,
      default: () => {}
    },
    trackControl: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeNames: ['1', '2', '3'],
      columns,
      dataSource: [],
      trackDialogVisible: false,
      trackDialogTitle: '',
      trackDialogConfig: {
        isShowConfirm: true,
        confirmLoading: false
      },
      trackDialogMode: '',
      trackDetail: {},
      currentIndex: -1
    }
  },
  watch: {
    caseDialogAllInfo(val) {
      if (val && val.travelInfo) {
        this.dataSource = val.travelInfo.map(item => ({ ...item }))
      }
    }
  },
  methods: {
    /**
     * 组件挂载事件
     */
    handleComplete(target) {
      this.$refs[target].createForm()
    },

    /**
     * 行动轨迹事件
     */
    handleClick(type, scope) {
      if (type === 'add') {
        this.trackDialogTitle = '新增行动轨迹'
        this.trackDialogMode = 'add'
        this.trackDialogVisible = true
      } else if (type === 'view') {
        this.trackDialogTitle = '查看行动轨迹'
        this.trackDialogMode = 'view'
        this.trackDetail = scope.row
        this.currentIndex = scope.$index
        this.trackDialogConfig.isShowConfirm = false
        this.trackDialogVisible = true
      } else if (type === 'edit') {
        this.trackDialogTitle = '编辑行动轨迹'
        this.trackDialogMode = 'edit'
        this.trackDetail = scope.row
        this.currentIndex = scope.$index
        this.trackDialogVisible = true
      } else if (type === 'delete') {
        this.$confirm(`是否删除行动轨迹?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.dataSource.splice(scope.$index, 1)
          })
          .catch(() => {})
      }
    },

    /**
     * 弹窗确认事件
     */
    handleConfirm() {
      const pms = [
        this.$refs['basic-info-form'].submitForm(),
        this.$refs['medical-record-form'].submitForm()
      ]
      Promise.all(pms).then(res => {
        const data = {
          caseInfo: res[0],
          diagnosisInfo: res[1],
          travelInfo: this.dataSource.map(item => ({ ...item })) || []
        }
        this.$emit('confirm', data)
      })
    },

    /**
     * 弹窗取消事件
     */
    handleCancel() {
      this.$emit('update:visible', false)
    },

    /**
     * 弹窗打开事件
     */
    handleOpen() {
      if (this.$refs['basic-info-form']) {
        this.$refs['basic-info-form'].createForm()
      }
      if (this.$refs['medical-record-form']) {
        this.$refs['medical-record-form'].createForm()
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
      this.$refs['basic-info-form'].resetForm()
      this.$refs['medical-record-form'].resetForm()
      this.dataSource = []
      this.$emit('closed')
    },

    /**
     * 行动轨迹弹窗提交事件
     */
    handleTrackDialogConfirm(fields) {
      this.trackDialogConfig.confirmLoading = true

      if (this.trackDialogMode === 'add') {
        // 添加
        const res = Object.keys(fields).some(key => !!fields[key])
        if (res) {
          this.dataSource.push(fields)
        } else {
          this.$message.info('表单内容为空，已取消新增')
        }
      } else if (this.trackDialogMode === 'edit') {
        // 编辑
        const res = Object.keys(fields)
          .filter(key => key !== 'id')
          .some(key => !!fields[key])
        if (res) {
          if (this.currentIndex > -1) {
            this.$set(this.dataSource, this.currentIndex, fields)
          }
        } else {
          this.$message.info('表单内容为空，已取消编辑')
        }
      }

      this.trackDialogConfig.confirmLoading = false
      this.trackDialogVisible = false
    },

    /**
     * 行动轨迹弹窗关闭后事件
     */
    handleTrackDialogClosed() {
      this.trackDialogConfig.isShowConfirm = true
      this.trackDialogTitle = ''
      this.trackDialogMode = ''
      this.trackDetail = {}
      this.currentIndex = -1
    }
  }
}
</script>

<style lang="scss" scoped>
.el-collapse {
  border: 0;

  &::v-deep {
    .el-collapse-item__header {
      padding-left: 16px;
      border: 0;
      height: 32px;
      font-size: 16px;
      font-weight: 500;
      line-height: 32px;
      color: #3a3a3d;
      background-color: #f4f5f7;

      .el-collapse-item__arrow {
        display: none;
      }
    }
  }
}
.custom-panel {
  padding-top: 16px;
}
</style>
