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
      <el-row>
        <el-col :span="6">
          <BaseTree
            ref="orgTree"
            node-key="id"
            :data="treeData"
            show-checkbox
            :props="{
              label: 'name',
              value: 'id',
              children: 'children'
            }"
            highlight-current
            :max-height="treeMaxHeight"
            @check="treeCheck"
          ></BaseTree>
        </el-col>
        <el-col :span="18">
          <el-col :span="6" :style="{ marginBottom: '10px' }">
            <el-input
              v-model="keyword"
              prefix-icon="el-icon-search"
              placeholder="输入姓名/职务/职称检索"
            ></el-input>
          </el-col>

          <BaseTable
            ref="tableRef"
            row-key="id"
            :columns="columns"
            :data="filterDataSource"
            :max-height="tableMaxHeight"
            multiSelect
            @select="handleSelect"
            @select-all="handleSelectAll"
            @selection-change="handleSelectionChange"
          />
        </el-col>
      </el-row>
    </template>
  </BaseDialog>
</template>

<script>
import BaseDialog from '@/components/BaseDialog'
import BaseTree from '@/components/BaseTree'
import BaseTable from '@/components/BaseTable'
import { queryMemTree, queryMembersByIds } from '@/api/common'
import { memberChooseColumns as columns } from './formConfig'

export default {
  name: 'MemberChooseDialog',
  components: {
    BaseDialog,
    BaseTree,
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
      default: () => {}
    },
    mode: {
      type: String,
      default: ''
    },
    memberDataSource: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      columns,
      dataSource: [],
      keyword: '',
      tableMaxHeight: '100%',
      treeData: [],
      multipleSelection: [],
      treeMaxHeight: ''
    }
  },
  computed: {
    filterDataSource() {
      if (this.keyword) {
        return this.dataSource.filter(
          item =>
            (item.memberName && item.memberName.indexOf(this.keyword) > -1) ||
            (item.positionName &&
              item.positionName.indexOf(this.keyword) > -1) ||
            (item.professionalTitleName &&
              item.professionalTitleName.indexOf(this.keyword) > -1)
        )
      } else {
        return this.dataSource
      }
    }
  },
  methods: {
    /**
     * 根据不同业务类型获取成员树
     * @param {*} data
     */
    queryMemTree(keyword) {
      const data = {
        keyword,
        treeType: '3'
      }
      queryMemTree(data).then(res => {
        this.treeData = res.data
      })
    },

    /**
     * 获取会员信息
     * @param {*} data
     * @param {function} callback
     */
    queryMembersByIds(data, callback) {
      queryMembersByIds(data).then(res => {
        callback && callback(res.data)
      })
    },

    /**
     * 弹窗打开事件
     */
    handleOpen() {
      const maxHeight = window.document.documentElement.clientHeight * 0.6 - 80
      this.tableMaxHeight = maxHeight
      this.treeMaxHeight = maxHeight
      this.queryMemTree('')
    },

    /**
     * 弹窗确认事件
     */
    handleConfirm() {
      if (this.multipleSelection.length === 0) {
        this.$message.error('请先勾选要添加的成员')
        return
      }

      const newMemberList = this.multipleSelection

      if (this.memberDataSource.length === 0) {
        newMemberList[0].memberType = '1'
        newMemberList[0].memberTypeName = '负责人'
      }

      const memberDataSource = [...this.memberDataSource, ...newMemberList]
      this.$emit('confirm', memberDataSource)
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
      this.$refs.orgTree.filterText = ''
      this.keyword = ''
      this.treeData = []
      this.dataSource = []
      this.multipleSelection = []
      this.$emit('closed')
    },

    /**
     * 当复选框被点击的时候触发
     */
    treeCheck(_, { checkedNodes }) {
      if (checkedNodes.length > 0) {
        const parentMap = {}
        const ids = []
        checkedNodes.forEach(node => {
          if (node.isMember === '1') {
            // 将机构 id 保存起来
            parentMap[node.id] = node.parentId
            ids.push(node.id)
          }
        })

        if (ids.length > 0) {
          this.queryMembersByIds({ ids }, res => {
            this.dataSource = res.map(item => {
              return {
                ...item,
                memberId: item.id,
                teamId: parentMap[item.id],
                memberType: '0',
                memberTypeName: '普通成员'
              }
            })
          })
        } else {
          this.$message.info('该机构暂无成员')
        }
      } else {
        this.dataSource = []
      }
    },

    /**
     * 当用户手动勾选数据行的 Checkbox 时触发的事件
     */
    handleSelect(selection, row) {
      if (this.memberDataSource.some(item => item.memberId === row.memberId)) {
        this.$message.info('该成员已在任务队伍中，请选择其他成员')
        this.$nextTick(() => {
          this.$refs.tableRef.$refs.table.toggleRowSelection(row, false)
        })
      }
    },

    /**
     * 当用户手动勾选全选 Checkbox 时触发的事件
     */
    handleSelectAll() {
      let tempList = [] // 临时数组存放不能选中的成员
      this.multipleSelection.forEach(item => {
        if (
          this.memberDataSource.some(
            member => member.memberId === item.memberId
          )
        ) {
          tempList.push(item)
        }
      })
      if (tempList.length > 0) {
        this.$message.info('选中的成员中包含任务队伍中的成员，已自动过滤')
        this.$nextTick(() => {
          tempList.forEach(item => {
            this.$refs.tableRef.$refs.table.toggleRowSelection(item, false)
          })
        })
      }
    },

    /**
     * 当选择项发生变化时会触发该事件
     * @param {*} row
     */
    handleSelectionChange(row) {
      this.multipleSelection = row
    }
  }
}
</script>

<style lang="scss" scoped>
.member-choose-dialog {
  position: relative;

  &__left {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 264px;
  }

  &__right {
    width: 100%;
    height: 100%;
    padding-left: 264px;
  }

  &__table {
    margin-top: 16px;
  }
}
</style>
