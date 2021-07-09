<template>
  <el-row :gutter="10" type="flex">
    <el-col
      :sm="finalLayoutConfig.sm"
      :md="finalLayoutConfig.md"
      :lg="finalLayoutConfig.lg"
      :xl="finalLayoutConfig.xl"
    >
      <el-form
        ref="searchForm"
        :inline="inline"
        :model="formData"
        :rules="rules"
        size="small"
        @keyup.enter.native="enterEventHandle"
      >
        <el-row ref="elRow">
          <el-col
            v-for="(item, index) in mixinFormItemConfig"
            :key="item.key + index"
            :span="item.colSpan"
            :offset="item.offset"
          >
            <template v-if="item.visible !== false">
              <el-form-item
                :label-width="item.labelWidth"
                :label="item.label"
                :prop="item.key"
              >
                <!-- 输入框 -->
                <template v-if="item.type === 'input'">
                  <el-input
                    v-model="formData[item.key]"
                    :disabled="item.disabled"
                    :maxlength="item.maxlength"
                    :placeholder="
                      item.placeholder
                        ? item.placeholder
                        : '请输入' + item.label
                    "
                  />
                </template>
                <!-- 数字输入框 -->
                <template v-if="item.type === 'input-number'">
                  <el-input-number
                    v-model="formData[item.key]"
                    :placeholder="
                      item.placeholder
                        ? item.placeholder
                        : '请输入' + item.label
                    "
                    v-bind="{
                      ...item,
                      controlsPosition: item['controlsPosition']
                        ? item['controlsPosition']
                        : 'right'
                    }"
                  />
                </template>
                <!-- 下拉框 -->
                <template v-if="item.type === 'select'">
                  <el-select
                    v-model="formData[item.key]"
                    :multiple="item.multiple"
                    :collapse-tags="item.collapseTags"
                    :clearable="item.clearable"
                    :disabled="item.disabled"
                    :placeholder="
                      item.placeholder
                        ? item.placeholder
                        : '请选择' + item.label
                    "
                    :style="item.style"
                    @change="selectChange(arguments[0], item.key)"
                  >
                    <el-option
                      v-for="(el, i) in item.options"
                      :key="i"
                      :label="
                        item.props && item.props.label
                          ? el[item.props.label]
                          : el.label
                      "
                      :value="
                        item.props && item.props.value
                          ? el[item.props.value]
                          : el.value
                      "
                    />
                  </el-select>
                </template>
                <!-- 下拉框 -->
                <template v-if="item.type === 'cascader'">
                  <el-cascader
                    v-model="formData[item.key]"
                    :options="item.options"
                    :multiple="item.multiple"
                    :collapse-tags="item.collapseTags"
                    :clearable="item.clearable"
                    :disabled="item.disabled"
                    :placeholder="
                      item.placeholder
                        ? item.placeholder
                        : '请选择' + item.label
                    "
                    v-bind="{ ...item }"
                    @change="selectChange(arguments[0], item.key)"
                  />
                </template>
                <!-- 日期选择器 -->
                <template v-if="item.type === 'date'">
                  <el-date-picker
                    v-if="item.dateType.match(/range/gi)"
                    v-model="formData[item.key]"
                    :type="item.dateType"
                    :align="item.align"
                    :unlink-panels="item.unlink"
                    :range-separator="item.sep"
                    :disabled="item.disabled"
                    :start-placeholder="item.startPlaceholder"
                    :end-placeholder="item.endPlaceholder"
                    :picker-options="item.pickerOptions"
                    :value-format="item.valueFormat"
                    :editable="item.editable"
                  />
                  <el-date-picker
                    v-else
                    v-model="formData[item.key]"
                    :type="item.dateType"
                    :disabled="item.disabled"
                    :picker-options="item.pickerOptions"
                    :value-format="item.valueFormat"
                  />
                </template>
                <template v-if="item.type === 'checkbox'">
                  <el-checkbox-group v-model="formData[item.key]">
                    <el-checkbox
                      v-for="(el, i) in item.options"
                      :label="el.value"
                      :key="i"
                      >{{ el.label }}</el-checkbox
                    >
                  </el-checkbox-group>
                </template>
                <template v-if="item.type === 'radio'">
                  <el-radio-group v-model="formData[item.key]">
                    <el-radio
                      v-for="(el, i) in item.options"
                      :label="
                        item.props && item.props.value
                          ? el[item.props.value]
                          : el.value
                      "
                      :key="i"
                      >{{
                        item.props && item.props.label
                          ? el[item.props.label]
                          : el.label
                      }}</el-radio
                    >
                  </el-radio-group>
                </template>
                <template v-if="item.type === 'autocomplete'">
                  <el-autocomplete
                    v-model="formData[item.key]"
                    :placeholder="
                      item.placeholder
                        ? item.placeholder
                        : '请输入' + item.label
                    "
                    v-bind="item"
                  />
                </template>
                <!-- 自定义 -->
                <template v-if="item.type === 'custom'">
                  <slot :name="item.key" v-bind:config="item"></slot>
                </template>
              </el-form-item>
            </template>
          </el-col>
          <!-- 自定义项 -->
          <slot name="defineItem" />
        </el-row>
      </el-form>
    </el-col>
    <!-- 按钮组 -->
    <el-col
      class="btn-group"
      :sm="finalLayoutConfig.btnGsm"
      :md="finalLayoutConfig.btnGmd"
      :lg="finalLayoutConfig.btnGlg"
      :xl="finalLayoutConfig.btnGxl"
    >
      <el-button
        v-if="showBtnArr.includes('search')"
        type="primary"
        @click="onSubmit"
        size="small"
        >查询</el-button
      >
      <el-button
        v-if="showBtnArr.includes('reset')"
        type="default"
        @click="onReset"
        size="small"
        >重置</el-button
      >
      <el-button
        v-if="isNeedHide"
        type="default"
        @click="hideOverFlow"
        size="small"
        >收起<i
          :class="[
            toggle
              ? 'el-icon-arrow-up el-icon--up'
              : 'el-icon-arrow-down el-icon--down'
          ]"
      /></el-button>
    </el-col>
  </el-row>
</template>

<script>
import { componentNecessary, defaultLayoutConfig } from './config'

export default {
  props: {
    layoutConfig: {
      type: Object,
      default: () => ({})
    },
    formItemConfig: {
      type: Array,
      default: () => []
    },
    rules: {
      type: Object,
      default: () => ({})
    },
    // 第一行最多显示项数
    firstLineMaxItem: {
      type: Number,
      default: 3
    },
    isShowSearchBtn: {
      type: Boolean,
      default: true
    },

    enterKeyTriggerSearch: {
      type: Boolean,
      default: true
    },
    showBtnArr: {
      type: Array,
      default: () => ['search', 'reset']
    },
    isNeedHide: {
      type: Boolean,
      default: true
    },
    formData: {
      type: Object,
      default: () => ({})
    },
    inline: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    // formData: {
    //   // 自定义时间范围选择数据
    // },
    defaultLayoutConfig,
    cacheFormItemConfig: [],
    toggle: true
  }),
  computed: {
    mixinFormItemConfig() {
      // 如果使用时，自动为使用者添加没使用且组件内部用到的属性并赋予默认值
      return this.formItemConfig
        .map(item => {
          const necessary = Object.assign({}, componentNecessary[item.type])
          return Object.assign(necessary, item)
        })
        .filter((item, index) => {
          if (!this.toggle) {
            return index < this.firstLineMaxItem
          } else {
            return true
          }
        })
    },
    // finalFormItemConfig() {
    //   return this.cacheFormItemConfig
    // },
    finalLayoutConfig() {
      // 如果使用时，自动为使用者添加没使用且组件内部用到的属性并赋予默认值
      const defaultConfigCopy = Object.assign({}, this.defaultLayoutConfig)
      const newConfig = Object.assign(defaultConfigCopy, this.layoutConfig)
      return newConfig
    }
  },
  watch: {
    mixinFormItemConfig: {
      handler(newVal) {
        return newVal
        // if (this.isNeedHide && !this.toggle) {
        //   this.cacheFormItemConfig = newVal.slice(0, this.firstLineMaxItem)
        // } else {
        //   this.cacheFormItemConfig = newVal.slice(0)
        // }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    // 初始化表单每一项的值
    // this.initVal()
  },
  mounted() {
    // console.log('this', Array.from(this.$slots['defineItem']).length)
    // this.$slots['defineItem'][0]['elm'].style.display = 'none'
    // if (this.isNeedHide) {
    //   this.swtichFlod()
    // }
  },
  methods: {
    initVal() {
      this.mixinFormItemConfig.forEach(item => {
        if (item.defaultVal) {
          this.$set(this.formData, item.key, item.defaultVal)
        }
      })
    },
    onSubmit() {
      this.$emit('onSubmit', this.formData)
    },
    onReset() {
      this.$refs['searchForm'].resetFields()
      // this.initVal()
      this.$emit('onReset', this.formData)
    },
    // TODO收起的逻辑后续完善
    hideOverFlow() {
      this.toggle = !this.toggle
      this.$emit('hideOverFlow', this.toggle)
    },
    selectChange(val, key) {
      this.$emit('selectChange', val, key)
    },
    endDateChange(date) {
      this.$emit('endDateChange', date)
    },
    // 初始化FormData的方法
    resetFormData(key, value) {
      this.formData[key] = value
    },
    enterEventHandle() {
      if (this.enterKeyTriggerSearch) {
        this.$emit('onSubmit', this.formData)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.btn-group {
  display: flex;
  flex-wrap: nowrap;
  align-items: flex-start;
  justify-content: flex-end;
}

::v-deep {
  .el-form--inline {
    .el-form-item {
      display: flex;
      // margin-bottom: 20px;
      // margin-right: 29px;
      margin-bottom: 16px;
      height: 33px;
    }

    .el-form-item__label {
      font-weight: 400;
      line-height: 32px;
    }

    .el-form-item__content {
      flex: 1;
      line-height: 32px;
      .el-input,
      .el-input__inner {
        width: 100%;
        height: 32px;
        line-height: 32px;
      }

      .el-select,
      .el-cascader,
      .el-input-number {
        width: 100%;
      }
      .el-cascader {
        line-height: 32px;
      }
      .el-date-editor,
      .el-input,
      .el-input--prefix,
      .el-input--suffix,
      .el-date-editor--year {
        width: 100%;
        .el-input__prefix {
          .el-input__icon {
            line-height: 32px;
          }
        }
      }
    }
  }
}

.clearm {
  margin: 0 !important;
}
</style>
