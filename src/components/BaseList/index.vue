<template>
  <div class="base-list">
    <el-scrollbar
      class="base-list-scrollbar"
      :style="{ height: listMaxHeight ? listMaxHeight : '100%' }"
    >
      <ul class="base-list-items">
        <li
          :class="['base-list-item-wrapper', { 'base-list-split': split }]"
          v-for="(item, index) in dataSource"
          :key="getKey(item, index)"
        >
          <slot
            name="renderItem"
            v-bind:item="item"
            v-bind:index="index"
          ></slot>
        </li>
      </ul>
    </el-scrollbar>

    <div class="base-list-pagination" v-if="pagination">
      <BasePagination v-bind="paginationProps" v-on="paginationEvents" />
    </div>
  </div>
</template>

<script>
import BasePagination from '@/components/BasePagination'

export default {
  name: 'BaseList',
  components: {
    BasePagination
  },
  props: {
    // 列表数据源
    dataSource: {
      type: Array,
      default: () => []
    },
    // 各项 key 的取值，可以是字符串或一个函数
    rowKey: {
      type: [String, Function]
    },
    // 是否展示分割线
    split: {
      type: Boolean,
      default: true
    },
    // List 的最大高度
    maxHeight: {
      type: [String, Number]
    },
    // 分页的配置项
    pagination: {
      type: [Boolean, Object],
      default: false
    }
  },
  computed: {
    listMaxHeight() {
      if (typeof this.maxHeight === 'number') {
        return `${this.maxHeight}px`
      } else if (typeof this.maxHeight === 'string') {
        return this.maxHeight
      } else {
        return ''
      }
    },

    // 分页属性
    paginationProps() {
      const props = {}
      if (typeof this.pagination === 'object') {
        Object.keys(this.pagination).forEach(key => {
          if (typeof this.pagination[key] !== 'function') {
            props[key] = this.pagination[key]
          }
        })
      }

      if (!props['page-sizes']) {
        props['page-sizes'] = [30, 50, 100]
      }

      return props
    },

    // 分页事件
    paginationEvents() {
      const events = {}
      if (typeof this.pagination === 'object') {
        Object.keys(this.pagination).forEach(key => {
          if (typeof this.pagination[key] === 'function') {
            events[key] = this.pagination[key]
          }
        })
      }
      return events
    }
  },
  methods: {
    getKey(item, index) {
      if (this.rowKey) {
        if (typeof this.rowKey === 'function') {
          return this.rowKey(item)
        } else {
          return item[this.rowKey]
        }
      } else {
        return `base-list-item-${index}`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.base-list {
  &-scrollbar {
    &::v-deep {
      .el-scrollbar__wrap {
        overflow-x: hidden;
      }
    }
  }

  &-items {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  &-item-wrapper {
    padding: 12px 0;

    &.base-list-split {
      border-bottom: 1px solid #e1e3e6;
    }

    &:last-child.base-list-split {
      border-bottom: none;
    }
  }

  &-pagination {
    padding: 16px 0;
  }
}
</style>
