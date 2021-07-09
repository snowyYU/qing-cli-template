<template>
  <div class="integrated-page">
    <div v-if="showTree" class="tree">
      <base-tree
        :data="treeData"
        v-bind="$attrs"
        highlight-current
        @node-click="handleNodeClick"
      >
        <template slot-scope="{ node, data }" class="custom-tree-node">
          <slot name="tree-node" :node="node" :data="data" />
        </template>
      </base-tree>
    </div>
    <div class="main-content">
      <search-form
        ref="searchForm"
        class="search-form"
        v-bind="$attrs"
        @onSubmit="search"
        @onReset="reset"
      >
        <template slot="defineItem">
          <slot name="defineItem" />
        </template>
      </search-form>
      <div ref="tableBox" class="table-box">
        <slot name="btnList">
          <inline-button-group
            :show-button="showButton"
            @add="add"
            @del="del"
          />
        </slot>
        <div ref="tableContent" class="table-content">
          <pagination-table
            class="pagination-table"
            v-bind="$attrs"
            :data="tableData"
            :current-page="current"
            :page-sizes="[10, 30, 50, 100]"
            :page-size="pageSize"
            :total="total"
            :height="tableHeight"
            :show-pagination="showPagination"
            @handleDetail="handleDetail"
            @handleEdit="handleEdit"
            @handleDelete="handleDelete"
            @size-change="handleSizeChange"
            @page-change="pageChange"
            @selection-change="handleSelectionChange"
          >
            <template slot="header" slot-scope="{ scope }">
              <slot
                :name="scope.item.prop + '_header'"
                :scope="scope"
                :item="scope.item"
                :column="scope.column"
                :index="scope.index"
              >
                <span>{{ scope.item.label }}</span>
              </slot>
            </template>
            <template slot-scope="{ scope }">
              <slot
                :name="scope.item.prop"
                :scope="scope"
                :item="scope.item"
                :column="scope.column"
                :index="scope.index"
                :row="scope.row"
              >
                <span>{{ scope.row[scope.item.prop] }}</span>
              </slot>
            </template>
            <template slot="operation" slot-scope="{ scope }">
              <slot name="table-operation" :scope="scope" />
            </template>
          </pagination-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BaseTree from '@/components/BaseTree'
import PaginationTable from '@/components/PaginationTable'
import searchForm from '@/components/SearchForm'
import InlineButtonGroup from '@/components/InlineButtonGroup'
export default {
  name: 'IntegratedPage',
  components: {
    BaseTree,
    searchForm,
    InlineButtonGroup,
    PaginationTable
  },
  props: {
    treeApi: {
      type: [Function, String],
      default: ''
    },

    treeApiParmas: {
      type: Object,
      default() {
        return {}
      }
    },

    treeTableParam: {
      type: Array,
      default() {
        return []
      }
    },

    tableApi: {
      type: [Function, String],
      default: ''
    },

    tableApiParams: {
      type: Object,
      default() {
        return {}
      }
    },

    showPagination: {
      type: Boolean,
      default: true
    },

    showTree: {
      type: Boolean,
      default: true
    },

    deleteKey: {
      type: String,
      default: 'id'
    },

    deleteApi: {
      type: [Function, String],
      default: ''
    }
  },
  data() {
    return {
      treeData: [
        {
          id: 1,
          label: 'Level one 1',
          children: [
            {
              id: 4,
              label: 'Level two 1-1',
              children: [
                {
                  id: 9,
                  label: 'Level three 1-1-1'
                },
                {
                  id: 10,
                  label: 'Level three 1-1-2'
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: 'Level one 2',
          children: [
            {
              id: 5,
              label: 'Level two 2-1'
            },
            {
              id: 6,
              label: 'Level two 2-2'
            }
          ]
        },
        {
          id: 3,
          label: 'Level one 3',
          children: [
            {
              id: 7,
              label: 'Level two 3-1'
            },
            {
              id: 8,
              label: 'Level two 3-2'
            }
          ]
        }
      ],
      showButton: ['add'],
      tableData: [],
      current: 1,
      pageSize: 10,
      total: 0,
      treeSearchData: {}, // 请求参数
      searchFormData: {}, // 搜索框对象
      tableHeight: '',
      multipleSelection: []
    }
  },
  computed: {},
  watch: {},
  mounted() {
    this.current = 1
    this.calcHeight()
    this.tableData = []
    this.showTree ? this.getSideTree() : this.getTableData()
    if (this.deleteApi) {
      this.showButton.push('del')
    }
  },
  methods: {
    getSideTree() {
      if (typeof this.treeApi === 'function') {
        this.treeApi(this.treeApiParmas).then(res => {
          // 要删掉----------------------
          res.data.nodeTrees.forEach(node => {
            if (node.datasourceTrees && node.datasourceTrees.length) {
              node.datasourceTrees.forEach(base => {
                base.nodeId = node.id
                base.datasourceId = base.id
              })
            }
          })
          // ----------------------
          this.treeData = res.data.nodeTrees
        })
      }
    },
    getTableData() {
      this.calcHeight()
      const queryData = {
        ...this.treeSearchData,
        ...this.searchFormData,
        ...this.tableApiParams,
        current: this.current,
        size: this.pageSize
      }
      this.tableApi(queryData).then(res => {
        this.tableData = res.data.data
        this.tableData.forEach(item => {
          item.baseInfo = `${item.nodeName}-${item.datasourceName}`
        })
        this.total = res.data.total
      })
    },
    handleNodeClick(data) {
      let flag = true
      this.current = 1
      if (this.treeTableParam.length) {
        this.treeTableParam.forEach(item => {
          if (data[item]) {
            this.treeSearchData[item] = data[item]
          } else {
            flag = false
            return
          }
        })
      }
      if (flag) {
        this.getTableData()
      }
    },
    // 计算表格高度
    calcHeight() {
      const otherHeight = this.showPagination ? 106 : 50
      this.tableHeight = this.$refs.tableContent.offsetHeight - otherHeight
    },
    search(searchData) {
      this.searchFormData = searchData
      this.current = 1
      this.getTableData()
    },
    reset(searchData) {
      this.searchFormData = searchData
      this.current = 1
      this.getTableData()
    },
    add() {
      this.$emit('add')
    },
    del() {
      this.$confirm('是否删除选中项?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const delArr = []
          this.multipleSelection.forEach(item => {
            delArr.push(item[this.deleteKey])
          })
          if (delArr.length) {
            this.deleteApi(delArr).then(() => {
              this.$message.success('删除成功')
              this.getTableData()
            })
          }
        })
        .catch()
    },
    handleDetail(index, row, column, scope) {
      this.$emit('handleDetail', index, row, column, scope)
    },
    handleEdit(index, row, column, scope) {
      this.$emit('handleEdit', index, row, column, scope)
    },
    handleDelete(index, row, column, scope) {
      this.$emit('handleDelete', index, row, column, scope)
    },
    handleSizeChange(val) {
      this.current = 1
      this.pageSize = val
      this.getTableData()
    },
    pageChange(val) {
      this.current = val
      this.getTableData()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>

<style lang="scss" scoped>
.integrated-page {
  display: flex;
  height: 100%;

  .tree {
    height: 100%;
    border-right: 1px solid #e1e3e6;
    background: #fff;
  }

  .main-content {
    display: flex;
    flex-direction: column;
    flex: 1;

    .search-form {
      padding: 24px 24px 0 24px;
      background: #fff;
    }

    .table-box {
      flex: 1;
      padding: 0 24px 24px 24px;
      // margin-top: 24px;
      background: #fff;

      .table-content {
        height: 100%;
        position: relative;

        .pagination-table {
          position: absolute;
          width: 100%;
        }
      }
    }
  }

  ::v-deep {
    .search-form {
      margin-left: 0 !important;
      margin-right: 0 !important;
    }
  }
}
</style>
