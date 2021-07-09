<template>
  <el-form
    ref="ruleForm"
    :model="formData"
    :inline="false"
    v-bind="schema.formStyle"
  >
    <!-- <el-row> -->
    <el-col v-for="item in renderItems" :key="item.key" :span="item.span">
      <template v-if="item.type === 'moduleCustom'">
        <slot :name="item.key" :config="item" />
      </template>
      <template v-else>
        <el-col v-if="item.type === 'formAreaTitle'">
          <FormOtherMaterial
            :type="item.formAreaTitleType"
            :title="item.title"
            :height="item.height"
          />
        </el-col>
        <el-form-item
          v-if="item.visible !== false"
          :label-width="item.labelWidth"
          :label="item.label"
          :prop="item.key"
          :rules="transRules('ruleForm', item)"
          label-position="top"
          :size="
            item.style && item.style.size
              ? item.style.size
              : schema.formStyle.size
          "
        >
          <template #label v-if="item.customLabel">
            <slot :name="item.key + '-label'"></slot>
          </template>

          <!-- 输入框 -->
          <template v-if="item.type == 'input'">
            <el-input
              :value="formData[item.key]"
              :disabled="item.disabled"
              :maxlength="item.maxlength"
              :placeholder="
                item.placeholder ? item.placeholder : '请输入' + item.label
              "
              @input="handleInput(item.key, $event)"
              @blur="$emit(`${item.key}-blur`, $event)"
            />
          </template>
          <!-- 数字输入框 -->
          <template v-if="item.type == 'inputNumber'">
            <el-input-number
              :value="
                typeof formData[item.key] !== 'undefined' &&
                formData[item.key] !== null &&
                formData[item.key] !== ''
                  ? formData[item.key]
                  : undefined
              "
              :disabled="item.disabled"
              :maxlength="item.maxlength"
              :style="{
                width:
                  item.style && item.style.width ? item.style.width : '100%'
              }"
              :placeholder="
                item.placeholder ? item.placeholder : '请输入' + item.label
              "
              :controls-position="
                item.controlsPosition ? item.controlsPosition : 'right'
              "
              :min="item.min ? item.min : 0"
              :max="item.max"
              @input="handleInput(item.key, $event)"
              @blur="$emit(`${item.key}-blur`, $event)"
              v-bind="{ ...item }"
            />
          </template>
          <!-- 富文本 -->
          <template v-if="item.type == 'textarea'">
            <el-input
              type="textarea"
              :value="formData[item.key]"
              :disabled="item.disabled"
              :maxlength="item.maxlength"
              :placeholder="
                item.placeholder ? item.placeholder : '请输入' + item.label
              "
              @input="handleInput(item.key, $event)"
              @blur="$emit(`${item.key}-blur`, $event)"
            />
          </template>
          <!-- 下拉框 -->
          <template v-if="item.type == 'select'">
            <el-select
              v-model="formData[item.key]"
              :multiple="item.multiple"
              :collapse-tags="item.collapseTags"
              :clearable="item.clearable"
              :disabled="item.disabled"
              :value-key="item.valueKey"
              :placeholder="
                item.placeholder ? item.placeholder : '请选择' + item.label
              "
              @change="handleChange(item.key, $event)"
              @visible-change="handleVisibleChange(item.key, $event)"
              :style="{
                width:
                  item.style && item.style.width ? item.style.width : '100%'
              }"
              :loading="item.loading"
              v-bind="{ ...item }"
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
          <template v-if="item.type === 'datePicker'">
            <el-date-picker
              v-model="formData[item.key]"
              :type="item.dateType ? item.dateType : 'date'"
              :value-format="item.valueFormat ? item.valueFormat : 'yyyy-MM-dd'"
              :placeholder="
                item.placeholder ? item.placeholder : '请选择' + item.label
              "
              v-bind="{ ...item }"
              :style="{
                width:
                  item.style && item.style.width ? item.style.width : '100%'
              }"
              @change="handleChange(item.key, $event)"
            >
            </el-date-picker>
          </template>
          <template v-if="item.type === 'dateTimePicker'">
            <el-date-picker
              v-model="formData[item.key]"
              :type="item.dateType ? item.dateType : 'datetime'"
              :value-format="
                item.valueFormat ? item.valueFormat : 'yyyy-MM-dd HH:mm:ss'
              "
              :placeholder="
                item.placeholder ? item.placeholder : '请选择' + item.label
              "
              v-bind="{ ...item }"
              :style="{
                width:
                  item.style && item.style.width ? item.style.width : '100%'
              }"
            >
            </el-date-picker>
          </template>
          <!-- 时间选择器 -->
          <template v-if="item.type === 'timePicker'">
            <el-time-picker
              v-model="formData[item.key]"
              :value-format="item.valueFormat ? item.valueFormat : 'HH:mm:ss'"
              :picker-options="item.pickerOptions"
              :placeholder="
                item.placeholder ? item.placeholder : '请选择' + item.label
              "
              v-bind="{ ...item }"
              :style="{
                width:
                  item.style && item.style.width ? item.style.width : '100%'
              }"
            >
            </el-time-picker>
          </template>
          <template v-if="item.type === 'cascader'">
            <el-cascader
              v-model="formData[item.key]"
              :options="item.options"
              :multiple="item.multiple"
              :collapse-tags="item.collapseTags"
              :clearable="item.clearable"
              :disabled="item.disabled"
              :placeholder="
                item.placeholder ? item.placeholder : '请选择' + item.label
              "
              v-bind="{ ...item }"
              @change="handleChange(item.key, $event)"
              @visible-change="handleVisibleChange(item.key, $event)"
              :ref="item.ref"
              :style="{
                width:
                  item.style && item.style.width ? item.style.width : '100%'
              }"
            />
          </template>
          <template v-if="item.type == 'radio'">
            <el-radio-group
              v-model="formData[item.key]"
              @change="handleChange(item.key, $event)"
              v-bind="{ ...item }"
            >
              <el-radio
                v-for="(option, index) in item.options"
                :key="index"
                :disabled="
                  typeof option.disabled !== 'undefined'
                    ? option.disabled
                    : false
                "
                :label="
                  item.props && item.props.value
                    ? option[item.props.value]
                    : option.value
                "
                >{{
                  item.props && item.props.label
                    ? option[item.props.label]
                    : option.label
                }}</el-radio
              >
            </el-radio-group>
          </template>
          <!-- 多选 -->
          <template v-if="item.type === 'checkbox'">
            <el-checkbox-group
              v-model="formData[item.key]"
              :disabled="item.disabled"
            >
              <el-checkbox
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
                }}</el-checkbox
              >
            </el-checkbox-group>
          </template>
          <!-- 开关 -->
          <template v-if="item.type === 'switch'">
            <el-switch
              v-bind="{ ...item }"
              :value="formData[item.key]"
              @change="handleChange(item.key, $event)"
            />
          </template>
          <!-- 文件上传 -->
          <template v-if="item.type === 'upload'">
            <BaseUpload
              :file-list="formData[item.key]"
              :bizType="item.bizType"
              :disabled="item.disabled"
              :accept="item.accept"
              @updateFileList="updateFileList($event, item.key)"
              @uploadFileSucess="uploadSuccess($event, item.key)"
              @removeFile="removeFile($event, item.key)"
              :ref="item.ref"
            ></BaseUpload>
          </template>
          <!-- 文件上传 -->
          <template v-if="item.type === 'text'">
            {{ formData[item.key] }}
          </template>
          <!-- 自定义 -->
          <template v-if="item.type === 'custom'">
            <slot :name="item.key" v-bind:config="item" />
          </template>
        </el-form-item>
      </template>
    </el-col>
    <!-- </el-row> -->
    <el-row
      type="flex"
      :justify="schema.formStyle.justify"
      :style="{
        width: '100%'
      }"
    >
      <el-button
        v-if="schema.formStyle.btns.indexOf('submit') >= 0"
        type="primary"
        @click="submitForm('ruleForm')"
        >提交</el-button
      >
      <el-button
        v-if="schema.formStyle.btns.indexOf('reset') >= 0"
        @click="resetForm('ruleForm')"
        >重置</el-button
      >
      <el-button
        v-if="schema.formStyle.btns.indexOf('cancel') >= 0"
        type="danger"
        >取消</el-button
      >
    </el-row>
  </el-form>
</template>

<script>
// import SchemaFormItem from './SchemaFormItem'
import FormOtherMaterial from './FormOtherMaterial'
import BaseUpload from '../BaseUpload/index'
export default {
  name: 'SchemaForm',
  components: {
    FormOtherMaterial,
    BaseUpload
  },
  props: {
    schema: {
      type: Object,
      default() {
        return {}
      }
    },
    initData: {
      type: Object,
      default: () => {}
    },
    model: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  computed: {
    renderItems() {
      return this.schema.properties
    },
    formData: {
      get() {
        // let finallFormData = {}
        // this.schema.properties.forEach(item => {
        //   finallFormData[item.key] = ''
        // })
        // const fields = {
        //   ...finallFormData,
        //   ...this.model
        // }
        // console.log('fields', fields)
        return this.model
      }
    }
  },
  watch: {
    // schema: {
    //   handler(newVal) {
    //     console.log('new', newVal)
    //     // 在此用于实时更新右侧预览表单
    //     this.formSchema.properties = newVal
    //   },
    //   deep: true,
    //   immediate: true
    // }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit('submit')
        } else {
          return false
        }
      })
    },
    validateForm() {
      let result
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          result = true
        } else {
          result = false
        }
      })
      return result
    },
    resetForm(formName) {
      if (!formName) {
        this.$refs['ruleForm'].resetFields()
      } else {
        this.$refs[formName].resetFields()
      }
    },
    clearValidate() {
      this.$refs['ruleForm'].clearValidate()
    },
    // 处理成可供给elment识别的规则格式
    transRules(formName, item) {
      setTimeout(() => {
        this.$refs[formName].clearValidate([item.key])
      }, 0)
      const finallRules = []
      const trigger = item.type === 'input' ? 'blur' : 'change'
      if (item.required) {
        const rule = { required: true, trigger }
        item.errorMessage && item.errorMessage.required
          ? (rule.message = item.errorMessage.required)
          : (rule.message = `请输入${item.label}`)
        finallRules.push(rule)
      }
      if (item.otherRules && item.otherRules.length > 0) {
        const validator = (rule, value, callback) => {
          if (!value || value === '') {
            callback()
          } else {
            let i = 0
            const len = item.otherRules.length
            for (; i < len; i++) {
              if (item.otherRules[i].type) {
                try {
                  const regExp = window.eval(item.otherRules[i].regExp)
                  if (!regExp.test(value)) {
                    break
                  }
                } catch (e) {
                  continue
                }
              }
            }
            if (i === len) {
              callback()
            } else {
              callback(new Error(item.otherRules[i].message))
            }
          }
        }
        const rule = { validator, trigger }
        finallRules.push(rule)
      }
      return finallRules
    },
    handleInput(key, value) {
      const fields = {
        ...this.formData,
        [key]: value
      }
      this.$emit('update:model', fields)
      this.$emit('input', key, value)
    },
    handleChange(key, value) {
      const fields = {
        ...this.formData,
        [key]: value
      }
      this.$emit('update:model', fields)
      this.$emit(`${key}-change`, value)
    },
    /**
     * 下拉框出现/隐藏时触发
     * @param {string} key
     * @param {boolean} value
     */
    handleVisibleChange(key, value) {
      this.$emit('visible-change', key, value)
    },
    //********************* 附件上传 START **************************/
    updateFileList(fileList, key) {
      const fields = {
        ...this.formData,
        [key]: fileList
      }
      this.$emit('update:model', fields)

      this.$emit(`${key}-upload-update`, fileList)
    },
    uploadSuccess(file, key) {
      this.$emit(`${key}-file-success`, file)
    },
    removeFile(fileList, key) {
      const fields = {
        ...this.formData,
        [key]: fileList
      }
      this.$emit('update:model', fields)

      this.$emit(`${key}-remove-success`, fileList)
    }
    //********************* 附件上传 END **************************/
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-form-item--small {
    min-height: 33px;
  }
  // .el-input.el-input--small.el-input--suffix {
  //   height: 33px;
  // }
}

// .custom-file-list {
//   ul {
//     padding: 0;
//     margin: 0;
//     list-style-type: none;
//     .file-item {
//       margin-top: 8px;
//       position: relative;
//       line-height: normal;
//       width: 300px;
//       background: #f4f7fb;
//       border-radius: 4px;
//       padding: 8px 0 8px 8px;
//       // line-height: 36px;
//       font-size: 14px;
//     }
//     .file-item-error {
//       background: rgba(229, 48, 47, 0.08);
//     }
//     .error-msg {
//       margin-top: 2px;
//       color: #e5302f;
//     }
//     .icon-success {
//       color: #19be6b;
//       position: absolute;
//       right: 5px;
//       top: 50%;
//       transform: translateY(-50%);
//       &.is-hide {
//         display: none;
//       }
//       &.is-show {
//         display: block;
//       }
//     }
//     .icon-delete {
//       display: none;
//       position: absolute;
//       cursor: pointer;
//       right: 5px;
//       top: 50%;
//       transform: translateY(-50%);
//       &.is-blur {
//         display: none;
//       }
//       &.is-focus {
//         display: block;
//       }
//     }
//   }
//   .progress {
//     position: absolute;
//     left: 0;
//     bottom: 0;
//     width: 100%;
//   }
// }
</style>
