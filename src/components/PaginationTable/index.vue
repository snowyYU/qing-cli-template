<template>
  <div class="pagination-table">
    <base-table
      ref="baseTable"
      v-bind="$attrs"
      v-on="$listeners"
      class="pagination-table__base-table"
    >
      <template slot="header" slot-scope="{ scope }">
        <slot
          v-if="hasParentTable"
          name="header"
          :scope="scope"
          :item="scope.item"
          :column="scope.column"
          :index="scope.index"
        />
        <slot
          v-else
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
          v-if="hasParentTable"
          :scope="scope"
          :item="scope.item"
          :column="scope.column"
          :index="scope.index"
          :row="scope.row"
        />
        <slot
          v-else
          :name="scope.item.prop"
          :scope="scope"
          :item="scope.item"
          :column="scope.column"
          :index="scope.index"
          :row="scope.row"
        >
          <el-tooltip
            v-if="scope.item.useTooltip"
            effect="dark"
            :content="scope.row[scope.item.prop]"
          >
            <div class="text-multi-ellipsis--l3">
              {{ scope.row[scope.item.prop] }}
            </div>
          </el-tooltip>
          <span v-else>{{ scope.row[scope.item.prop] }}</span>
        </slot>
      </template>
      <template slot="operation" slot-scope="{ scope }">
        <slot name="operation" :scope="scope" />
      </template>
    </base-table>
    <base-pagination
      v-if="showPagination"
      class="pagination"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <template #left>
        <slot name="pagination-left" />
      </template>
    </base-pagination>
  </div>
</template>

<script>
import BasePagination from '@/components/BasePagination'
import BaseTable from '@/components/BaseTable'
export default {
  name: 'PaginationTable',
  components: {
    BasePagination,
    BaseTable
  },
  props: {
    showPagination: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {}
  },
  computed: {
    hasParentTable() {
      return this.$parent.$options.name === 'IntegratedPage'
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination-table {
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
  // &__base-table {
  // height: calc(100% - 30px);
  // }
  .pagination {
    margin-top: 10px;
    padding-bottom: 10px;
  }
}
</style>
