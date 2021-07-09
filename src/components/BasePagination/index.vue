<template>
  <div class="pagination-container">
    <div class="pagination-tools">
      <slot name="left" />
    </div>
    <div class="pagination-content">
      <div v-if="showPageMsg" class="pagination-sizes">
        <span class="total"
          >共&nbsp;{{ pages }}&nbsp;页，{{ $attrs['total'] }}&nbsp;条</span
        >
        每页<el-select v-model="handleSize" size="small">
          <el-option
            v-for="item in $attrs['page-sizes']"
            :key="item"
            :label="item"
            :value="item"
          /> </el-select
        >条
      </div>
      <div class="jumper">
        <el-pagination
          :class="{ 'show-jumper': showJumper }"
          v-bind="$attrs"
          background
          :layout="layout"
          :pager-count="5"
          @current-change="handleCurrChange"
          @prev-click="prevClick"
          @next-click="nextClick"
          small
        />
        <template v-if="showJumper">
          跳至
          <el-input
            v-model="jumpPage"
            size="small"
            placeholder=" "
            @keyup.native="handleEnter"
            @blur="handleBlur"
          />
          <span style="margin: 5px">页</span>
        </template>
        <!--        <el-button size="medium" plain class="btn-jump" @click="handleJump">确定</el-button>-->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    showPageMsg: {
      type: Boolean,
      default: false
    },
    showJumper: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      jumpPage: '1'
    }
  },
  computed: {
    handleSize: {
      get() {
        return this.$attrs['page-size']
      },
      set(val) {
        if (this.$attrs['page-size'] === val) return
        this.$emit('size-change', val)
      }
    },

    pages() {
      return Math.ceil(this.$attrs.total / this.$attrs['page-size'])
    },

    layout() {
      return this.$attrs['layout'] ? this.$attrs['layout'] : 'prev, pager, next'
    }
  },
  methods: {
    handleJump() {
      if (+this.jumpPage === this.currPage) return
      const jumpIdx = this.pages < this.jumpPage ? this.pages : +this.jumpPage
      this.jumpPage = jumpIdx > 0 ? jumpIdx + '' : '1'
      this.handleCurrChange(jumpIdx)
    },

    handleCurrChange(val) {
      this.$emit('page-change', val)
    },

    handleEnter(e) {
      this.jumpPage = this.jumpPage.replace(/[^\d]/g, '')
      if (e.keyCode === 13) {
        this.handleJump()
      }
    },

    handleBlur() {
      if (!+this.jumpPage) {
        this.jumpPage = '1'
      }
    },

    prevClick(val) {
      this.$emit('prev-click', val)
    },

    nextClick(val) {
      this.$emit('next-click', val)
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination-container {
  display: flex;
  // justify-content: flex-end;
  align-items: center;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #3a3a3d;
  margin-right: 5px;

  .pagination-tools {
    flex: 1;
  }

  .pagination-content {
    display: flex;
    // justify-content: flex-end;
    // width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
  }

  ::v-deep .el-pagination .el-pager li {
    height: 32px;
    line-height: 32px;
  }

  ::v-deep {
    .el-pagination {
      .show-jumper {
        margin-right: 20px;
      }

      .btn-prev,
      .btn-next {
        width: 32px;
        height: 32px;
        line-height: 32px;
        border-radius: 4px;
        border: 1px solid #e1e3e6;
        background-color: #fff;
      }

      &.is-background {
        .btn-prev:disabled {
          background: #f4f5f7 !important;
        }

        .btn-next:disabled {
          background: #f4f5f7 !important;
        }
      }

      button {
        width: 32px;
        background-color: #fff;
        border: 1px solid #e1e4eb;
      }
      .el-pager {
        li {
          width: 32px;
          color: #242833;
          background-color: #fff;
          border: 1px solid rgba(225, 228, 235, 1);
          margin: 0 4px;
        }

        .number {
          width: 32px;
          height: 32px;
          line-height: 32px;
          border-radius: 4px;
          border: 1px solid #e1e3e6;
          background-color: #fff;
        }
      }
    }
    .pagination-sizes {
      padding: 2px 0;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(36, 40, 51, 1);
      line-height: 22px;
      margin-right: 20px;
      white-space: nowrap;
      .total {
        margin-right: 20px;
      }
      .el-select {
        margin: 0 5px;
        width: 78px;
        .el-input__inner {
          font-size: 14px;
        }
      }
    }
    .jumper {
      display: flex;
      align-items: center;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(36, 40, 51, 1);
      white-space: nowrap;
      .el-input {
        margin-left: 5px;
        width: 48px;
        .el-input__inner {
          &:focus {
            border-color: #4a81fe;
          }
        }
      }
      .btn-jump {
        margin-left: 11px;
        width: 76px;
        height: 32px;
        padding: 0;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(36, 40, 51, 1);
        &:hover {
          border-color: #4a81fe;
        }
      }
    }
  }
}
</style>
