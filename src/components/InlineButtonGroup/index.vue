<template>
  <div class="button-group">
    <el-button
      v-for="(item, index) in newButtonList"
      :key="index"
      size="medium"
      :type="item.buttonType"
      @click="item.fun"
    >
      <!-- <img v-if="item.iconPath" class="icon" :src="item.iconPath"> -->
      <!-- <svg-icon icon-class="del" /> -->
      <!-- <svg-icon v-if="item.iconName" :icon-class="item.iconName" class-name="btn-icon" /> -->
      <span class="content-area">
        <i class="btn-icon" :class="item.iconName" />
        <span class="text">{{ item.text }}</span>
      </span>
    </el-button>
  </div>
</template>

<script>
export default {
  props: {
    // 必须匹配methodName来控制显示
    showButton: {
      type: Array,
      default: () => ['add', 'del']
    },
    // 自定义按钮列表
    customBtList: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    buttonList: [
      {
        text: '新增',
        methodName: 'add',
        buttonType: 'primary',
        iconName: 'icon-bigData-xinjian-xinzeng'
      },
      {
        text: '删除',
        methodName: 'del',
        buttonType: '',
        iconName: 'icon-bigData-shanchu'
      },
      {
        text: '下载模版',
        methodName: 'download',
        buttonType: '',
        iconName: ''
      },
      {
        text: '提交审核',
        methodName: 'submitAduit',
        buttonType: ''
      },
      {
        text: '导入',
        methodName: 'import',
        buttonType: '',
        iconName: ''
      }
    ]
  }),
  computed: {
    // 遍历将方法名用emit返回给父组件
    newButtonList() {
      const newArr = this.buttonList.map(item => {
        item.fun = () => {
          this.$emit(item.methodName)
        }
        // if (item.iconName) {
        //   item.iconPath = require(`../../icons/common/${item.iconName}`)
        // } else {
        //   item.iconPath = ''
        // }
        return item
      })
      // 根据自定义按钮列表对自身的ButtonList进行替代或者合并
      this.customBtList.forEach(item => {
        const index = this.buttonList.findIndex(
          el => el.methodName === item.methodName
        )

        if (index > -1) {
          newArr[index] = Object.assign(
            {
              text: '',
              methodName: '',
              buttonType: '',
              iconName: '',
              fun: () => {}
            },
            item
          )
        } else {
          item.fun = () => {
            this.$emit(item.methodName)
          }
          newArr.push(item)
        }
      })

      return newArr.filter(item => this.showButton.includes(item.methodName))
    }
  }
}
</script>

<style lang="scss" scoped>
.button-group {
  display: flex;
  padding-bottom: 16px;
}
::v-deep .el-button {
  &.el-button--medium {
    padding: 7px 10px;
  }
  &.el-button--primary {
    background-color: #4a81fe;
    &:active {
      color: #4a81fe;
      // background: rgba(74, 129, 254, 1);
      border: 1px solid !important;
      border-color: #4a81fe;
    }
    &:hover {
      background: #66b1ff;
      border-color: #66b1ff;
      color: #fff;
    }
  }
  .text {
    vertical-align: middle;
  }
  .icon {
    // display:inline-block;
    // background: url('../../icons/common/add.png');
    // width: 20px;
    // height: 20px;
  }
}

.content-area {
  font-size: 0;
  display: inline-block;
  .btn-icon {
    font-size: 20px;
    width: 20px;
    height: 20px;
    vertical-align: middle;
  }
  .text {
    font-size: 14px;
  }
}
</style>
