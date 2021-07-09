<template>
  <div class="table">
    <el-table
      ref="table"
      v-bind="$attrs"
      highlight-current-row
      style="width: 100%"
      stripe
      border
      v-on="$listeners"
      v-loading="loading"
    >
      <el-table-column v-if="multiSelect" type="selection"> </el-table-column>

      <el-table-column
        v-if="isMultiSelect"
        fixed="left"
        type="selection"
        :selectable="selectable"
        width="55"
        align="center"
      />
      <el-table-column
        v-if="isIndex"
        type="index"
        width="50"
        :label="indexTitle"
        align="center"
      />
      <el-table-column
        v-for="item in columns"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        :fixed="item.fixed"
        :show-overflow-tooltip="item.showTooltip"
        :min-width="item.minWidth"
        :sortable="item.sortable"
        :align="item.align"
        :header-align="item.headerAlign"
      >
        <template #header="{ column, $index }">
          <slot
            v-if="hasParentTable"
            name="header"
            :scope="{ item, column, $index }"
            :item="item"
            :column="column"
            :index="$index"
          />
          <slot
            v-else
            :name="item.prop + '_header'"
            :scope="{ item, column, $index }"
            :item="item"
            :column="column"
            :index="$index"
          >
            <span>{{ item.label }}</span>
          </slot>
        </template>
        <template #default="{ row, column, $index }">
          <slot
            v-if="hasParentTable"
            :scope="{ row, column, $index, item }"
            :item="item"
            :column="column"
            :index="$index"
            :row="row"
          />
          <slot
            v-else
            :name="item.prop"
            :scope="{ row, column, $index, item }"
            :item="item"
            :column="column"
            :index="$index"
            :row="row"
          >
            <el-tooltip
              v-if="item.useTooltip"
              effect="dark"
              :content="row[item.tooltipProp] || row[item.prop]"
            >
              <div class="text-multi-ellipsis--l3">{{ row[item.prop] }}</div>
            </el-tooltip>
            <el-tooltip
              v-else-if="item.isEle"
              effect="dark"
              :content="row[item.tooltipProp] || row[item.prop]"
            >
              <div
                class="text-multi-ellipsis--l3"
                v-html="row[item.prop]"
              ></div>
            </el-tooltip>
            <span v-else>{{ row[item.prop] }}</span>
          </slot>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showOperation"
        :width="operationWidth"
        label="操作"
        :fixed="operationFixed"
      >
        <template #default="scope">
          <slot name="operation" :scope="scope">
            <el-button
              v-if="operationBtns.includes('detail')"
              type="text"
              @click="handleDetail(scope)"
              >详情</el-button
            >
            <el-button
              type="text"
              v-if="operationBtns.includes('edit')"
              @click="handleEdit(scope)"
              >编辑</el-button
            >
            <el-button
              type="text"
              v-if="operationBtns.includes('delete')"
              @click="handleDelete(scope)"
              :style="{ color: '#FF4D4D' }"
              >删除</el-button
            >
          </slot>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'Table',
  props: {
    columns: {
      type: Array,
      default() {
        return []
      }
    },

    indexTitle: {
      type: String,
      default: '序号'
    },

    isMultiSelect: {
      type: Boolean,
      default: false
    },

    isIndex: {
      type: Boolean,
      default: false
    },

    selectable: {
      type: Function,
      default() {
        return () => {}
      }
    },

    showOperation: {
      type: Boolean,
      default: false
    },

    operationWidth: {
      type: String,
      default: '150'
    },
    multiSelect: {
      type: Boolean,
      default: false
    },
    operationBtns: {
      type: Array,
      default() {
        return ['detail', 'edit', 'delete']
      }
    },
    operationFixed: {
      type: [String, Boolean],
      default: 'right'
    },
    deleteConfirm: {
      type: [Array, Boolean],
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {}
  },
  computed: {
    hasParentTable() {
      return this.$parent.$options.name === 'PaginationTable'
    }
  },
  mounted() {},
  methods: {
    toggleRowSelection(row, selected) {
      this.$refs.table.toggleRowSelection(row, selected)
    },

    handleDetail(scope) {
      this.$emit('handleDetail', scope.$index, scope.row, scope.column, scope)
    },

    handleEdit(scope) {
      this.$emit('handleEdit', scope.$index, scope.row, scope.column, scope)
    },

    handleDelete(scope) {
      if (this.deleteConfirm) {
        // 删除确认框
        this.$confirm(
          this.deleteConfirm[0] ? this.deleteConfirm[0] : '确认删除吗',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
          .then(() => {
            this.$emit(
              'handleDelete',
              scope.$index,
              scope.row,
              scope.column,
              scope
            )
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: this.deleteConfirm[1]
                ? this.deleteConfirm[1]
                : '已取消删除'
            })
          })
      } else {
        this.$emit('handleDelete', scope.$index, scope.row, scope.column, scope)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.table {
  ::v-deep {
    .el-table th {
      height: 40px;
      font-size: 14px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #242833;
      background: #f4f5f7;
    }

    .el-table__row td {
      // 表格列
      height: 40px;
      padding: 10px 0;
    }

    .el-table--enable-row-hover .el-table__body tr:hover > td {
      //表格hover样式
      background: #f4f5f7;
    }

    .el-table__row .cell {
      //表格行字体
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #242833;
      line-height: 20px;
    }

    .el-table__body tr.current-row > td {
      background: #dee9ff !important;
    }

    .el-table-column--selection {
      text-overflow: unset !important;
    }

    .el-button--text {
      padding: 0 !important;
    }
  }
}
</style>
