<template>
  <BaseDialog
    :visible="visible"
    :title="title"
    :config="config"
    @open="handleOpen"
    @confirm="handleConfirm"
    @cancel="handeCancel"
    @close="handleClose"
    @closed="handleClosed"
  >
    <template #body>
      <div class="member-dialog">
        <div class="member-dialog__searchbar">
          <el-row>
            <el-col :span="8">
              <el-input
                v-model="keyword"
                size="small"
                placeholder="输入姓名/职务/职称检索"
              ></el-input>
            </el-col>
            <el-col :span="8">
              <div class="member-dialog__button-group">
                <el-button
                  type="primary"
                  size="small"
                  @click="handleClick('add')"
                  >新增</el-button
                >
                <el-button size="small" @click="handleClick('delete')"
                  >批量移除</el-button
                >
              </div>
            </el-col>
            <el-col :span="8">
              <div class="member-dialog__right">
                任务负责人：{{
                  current > -1 ? memberDataSource[current].memberName : '未选择'
                }}
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="member-dialog__table">
          <BaseTable
            row-key="id"
            :columns="columns"
            :data="filterDataSource"
            :max-height="tableMaxHeight"
            multi-select
            show-operation
            @selection-change="handleSelectionChange"
          >
            <template #memberType="{ scope }">
              <el-switch
                :value="scope.row.memberType"
                active-value="1"
                inactive-value="0"
                @change="handleChange(scope, $event)"
              ></el-switch>
            </template>
            <template #operation="{ scope }">
              <el-button type="text" @click="handleDelete(scope)"
                >移除</el-button
              >
            </template>
          </BaseTable>
        </div>
      </div>
    </template>
  </BaseDialog>
</template>

<script>
import BaseDialog from '@/components/BaseDialog'
import BaseTable from '@/components/BaseTable'
import { memberColumns as columns } from './formConfig'

export default {
  name: 'MemberDialog',
  components: {
    BaseDialog,
    BaseTable
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
    memberDataSource: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      columns,
      keyword: '',
      multipleSelection: [],
      tableMaxHeight: '100%'
    }
  },
  computed: {
    filterDataSource() {
      if (this.keyword) {
        return this.memberDataSource.filter(
          item =>
            (item.memberName && item.memberName.indexOf(this.keyword) > -1) ||
            (item.positionName &&
              item.positionName.indexOf(this.keyword) > -1) ||
            (item.professionalTitleName &&
              item.professionalTitleName.indexOf(this.keyword) > -1)
        )
      } else {
        return this.memberDataSource
      }
    },
    current() {
      let current = -1
      this.memberDataSource.forEach((item, index) => {
        if (item.memberType === '1') {
          current = index
        }
      })
      return current
    }
  },
  methods: {
    /**
     * 弹窗打开事件
     */
    handleOpen() {
      this.tableMaxHeight =
        window.document.documentElement.clientHeight * 0.6 - 64
    },

    /**
     * 弹窗确认事件
     */
    handleConfirm() {
      if (this.memberDataSource.length === 0) {
        this.$message.error('请先添加任务成员')
        return
      }
      if (this.current === -1) {
        this.$message.error('请先选择负责人')
        return
      }
      const dataSource = this.memberDataSource.map(item => ({ ...item }))
      this.$emit('confirm', dataSource)
    },

    /**
     * 弹窗取消事件
     */
    handeCancel() {
      this.$emit('cancel')
    },

    /**
     * 弹窗关闭
     */
    handleClose() {
      this.$emit('update:visible', false)
    },

    /**
     * 弹窗关闭后事件
     */
    handleClosed() {
      this.keyword = ''
      this.multipleSelection = []
      this.$emit('closed')
    },

    /**
     * 表格多选框
     */
    handleSelectionChange(row) {
      this.multipleSelection = row
    },

    /**
     * 列表功能键
     */
    handleClick(type) {
      if (type === 'add') {
        // 添加成员
        this.$emit('open-new-dialog', 'member-add')
      } else if (type === 'delete') {
        // 批量删除成员
        if (this.multipleSelection.length === 0) {
          this.$message.error('请先选中需要移除的成员')
        } else {
          this.$confirm(`是否移除选中的任务成员?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              const dataSource = this.memberDataSource.filter(memberItem => {
                return this.multipleSelection.every(
                  item => memberItem.id !== item.id
                )
              })
              this.$emit('update:memberDataSource', dataSource)
              this.multipleSelection = []
            })
            .catch(() => {})
        }
      }
    },

    /**
     * 移除
     */
    handleDelete(scope) {
      this.$confirm(`是否移除任务成员【${scope.row.memberName}】?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.multipleSelection = this.multipleSelection.filter(
            item => item.id !== scope.row.id
          )
          const dataSource = this.memberDataSource.filter(
            item => item.id !== scope.row.id
          )
          this.$emit('update:memberDataSource', dataSource)
        })
        .catch(() => {})
    },

    /**
     * 切换负责人
     */
    handleChange(scope, value) {
      const dataSource = this.memberDataSource.map((item, index) => {
        const memberInfo = { ...item }
        if (index === scope.$index) {
          memberInfo.memberType = value
        } else {
          if (value === '1') {
            memberInfo.memberType = '0'
          }
        }

        return memberInfo
      })
      this.$emit('update:memberDataSource', dataSource)
    }
  }
}
</script>

<style lang="scss" scoped>
.member-dialog {
  &__table {
    margin-top: 16px;
  }

  &__right {
    text-align: right;
    font-size: 14px;
    font-weight: 400;
    color: #242833;
    line-height: 32px;
  }
}

.member-dialog__button-group {
  margin-left: 16px;
}
</style>
