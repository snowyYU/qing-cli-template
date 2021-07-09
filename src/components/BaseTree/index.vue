<template>
  <div
    class="base-tree"
    :style="{ width: `${width}px` }"
    :class="{ 'dynimal-width': !isOpened }"
  >
    <div
      v-if="title"
      class="tree-title"
      :class="{ 'title-box-hide': !isOpened }"
    >
      <span class="title-name" :class="{ 'title-hide': !isOpened }">{{
        title
      }}</span>
      <hamburger
        v-if="showHamberger"
        class="hamburgerBtn"
        style="padding: 0;"
        :is-active="isOpened"
        @toggleClick="toggleSideBar"
      />
    </div>
    <slot style="flex-shrink: 0" name="header" />
    <div v-if="showTreeSearch" class="search-input" :class="{ mt22: title }">
      <el-input
        v-model="filterText"
        :class="{ hide: !isOpened }"
        suffix-icon="el-icon-search"
        placeholder="输入关键字进行过滤"
      />
    </div>
    <div
      class="content"
      :style="
        maxHeight
          ? `height: ${
              typeof maxHeight === 'number' ? maxHeight + 'px' : maxHeight
            };`
          : ''
      "
    >
      <el-scrollbar class="base-tree__scrollbar">
        <el-tree
          ref="tree"
          :class="{ hide: !isOpened }"
          class="tree pt22"
          v-bind="$attrs"
          :filter-node-method="filterTreeNodes"
          v-on="$listeners"
        >
          <template slot-scope="{ node, data }" class="custom-tree-node">
            <slot :node="node" :data="data">
              <span>{{ node.label }}</span>
            </slot>
          </template>
        </el-tree>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import Hamburger from '@/components/Hamburger'
export default {
  name: 'BaseTree',
  components: {
    Hamburger
  },
  props: {
    title: {
      type: String,
      default: ''
    },

    showHamberger: {
      type: Boolean,
      default: true
    },

    width: {
      type: [String, Number],
      default: '256'
    },

    filterNodeMethod: {
      type: [Function, String],
      default: ''
    },

    showTreeSearch: {
      type: Boolean,
      default: true
    },

    maxHeight: {
      type: [String, Number]
    }
  },
  data() {
    return {
      isOpened: true,
      filterText: ''
    }
  },
  computed: {
    filterTreeNodes() {
      return Object.prototype.toString.call(this.filterNodeMethod) ===
        '[object Function]'
        ? this.filterNodeMethod
        : this.filterNode
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    toggleSideBar() {
      this.isOpened = !this.isOpened
      this.$emit('toggleSideBar', this.isOpened)
    },
    setCurrentNode(currNode) {
      this.$refs.tree.setCurrentKey(currNode)
    },
    getCurrentNode() {
      return this.$refs.tree.getCurrentNode()
    },
    filterNode(value, data) {
      if (!value) return true
      return data[this.$attrs['props'].label].indexOf(value) !== -1
    },
    // 获取所有已选择的节点
    getCheckedNodes(leafOnly = false, includeHalfChecked = false) {
      return this.$refs.tree.getCheckedNodes(leafOnly, includeHalfChecked)
    },
    // 设置所有已选择的节点
    setCheckedNodes(nodes) {
      return this.$refs.tree.setCheckedNodes(nodes)
    },
    // 获取所有已选择的节点
    getCheckedKeys(leafOnly = false) {
      return this.$refs.tree.getCheckedKeys(leafOnly)
    },
    // 通过 keys 设置目前勾选的节点，使用此方法必须设置 node-key 属性
    setCheckedKeys(keys, leafOnly = false) {
      return this.$refs.tree.setCheckedKeys(keys, leafOnly)
    }
  }
}
</script>

<style lang="scss" scoped>
.base-tree {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  transition: all 0.4s;
  background: #fff;

  .tree-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #3a3a3d;
    font-size: 16px;
    font-weight: 600;
    padding: 13px 23px 12px 23px;
    border-bottom: 1px solid #e1e3e6;
    flex-shrink: 0;
  }

  .content {
    display: flex;
    width: 100%;
    height: 100%;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 8px;
    }
    &::-webkit-scrollbar-thumb {
      background: rgba(228, 228, 228, 1);
      border-radius: 4px;
    }
    &::-webkit-scrollbar-track-piece {
      background: transparent;
    }
  }

  .title-name {
    word-break: keep-all;
    overflow: hidden;
  }

  .hide {
    opacity: 0;
  }

  ::v-deep {
    .el-tree {
      flex: 1;
      height: 100%;
      color: #3a3a3d;
      font-size: 14px;
      padding: 0 12px 24px 12px;
      overflow: auto;
    }

    .el-tree-node > .el-tree-node__children {
      overflow: unset;
    }

    .custom-tree-node {
      padding-right: 12px;
    }
  }

  &__scrollbar {
    width: 100%;
    height: 100%;

    &::v-deep {
      .el-scrollbar__wrap {
        overflow-x: hidden;
      }
    }
  }
}

.pt22 {
  padding-top: 22px !important;
}

.mt22 {
  margin-top: 22px;
}

.hamburgerBtn {
  cursor: pointer;
}

.title-hide {
  width: 0;
  height: 0;
  overflow: hidden;
}

.title-box-hide {
  border-bottom: 0 !important;
}

.dynimal-width {
  width: 64px !important;
  overflow: hidden;
}

.search-input {
  padding: 0 12px;
}
</style>
