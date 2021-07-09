<template>
  <div class="line-edit-table" style="width: 100%">
    <el-table :data="tableData" stripe size="medium" style="width: 100%">
      <el-table-column
        v-if="isIndex"
        type="index"
        width="50"
        :label="indexTitle"
        align="center"
      />
      <el-table-column
        v-for="(item, index) in tableHeader"
        :key="`tableHeader_${index}`"
        :label="item.label"
        :fixed="item.fixed"
        :min-width="item.minWidth"
        :width="item.width"
        :show-overflow-tooltip="item.showTooltip"
      >
        <template #default="scope">
          <!--文本-->
          <span v-if="item.type === 'text'" class="text">{{
            scope.row[item.value]
          }}</span>
          <!-- 带输入建议 -->
          <el-autocomplete
            class="inline-input"
            v-else-if="item.type === 'autocomplete'"
            v-model="scope.row[item.value]"
            :fetch-suggestions="
              querySearch({
                item: item,
                scope: scope
              })
            "
            :hide-loading="false"
            placeholder="请输入内容"
            size="small"
            :trigger-on-focus="false"
            @select="
              handleAutocompleteSelect({
                event: $event,
                item: item,
                scope: scope
              })
            "
          ></el-autocomplete>
          <!--选择框-->
          <el-select
            v-else-if="item.type === 'select'"
            v-model="scope.row[item.value]"
            :class="[!!scope.row[`${item.value}-error`] ? 'error' : '']"
            :filterable="getSelectConifg({ item, scope }).filterable || true"
            :clearable="getSelectConifg({ item, scope }).clearable || true"
            :disabled="tableStatus === 'detail'"
            :allow-create="
              getSelectConifg({ item, scope }).allowCreate || false
            "
            :multiple="getSelectConifg({ item, scope }).multiple || false"
            placeholder="请选择"
            size="small"
            @change="
              handleCellChange({ event: $event, item: item, scope: scope })
            "
          >
            <!--options在tableData中获取，适用每行下拉选项【不一致】的情况-->
            <template v-if="item.optionsType === 'byData'">
              <el-option
                v-for="i in scope.row[item.value + 'Options']"
                :key="
                  `${item.value}Options_${
                    item.props && item.props.value
                      ? i[item.props.value]
                      : i.value
                  }`
                "
                :label="
                  item.props && item.props.label ? i[item.props.label] : i.label
                "
                :value="
                  item.props && item.props.value ? i[item.props.value] : i.value
                "
              />
            </template>
            <!--options在tableHeader中获取，适用每行下拉选项【一致】的情况-->
            <template
              v-else-if="!item.optionsType || item.optionsType === 'byHeader'"
            >
              <el-option
                v-for="(i, indexx) in item.options"
                :key="`${item.value}Options_${indexx}`"
                :label="
                  item.props && item.props.label ? i[item.props.label] : i.label
                "
                :value="
                  item.props && item.props.value ? i[item.props.value] : i.value
                "
              />
            </template>
          </el-select>
          <!--输入框-->
          <el-input
            v-else-if="item.type === 'input'"
            v-model="scope.row[item.value]"
            :class="[!!scope.row[`${item.value}-error`] ? 'error' : '']"
            :disabled="tableStatus === 'detail'"
            placeholder="请输入"
            @blur="handleBlur({ event: $event, item: item, scope: scope })"
            @change="
              handleInputChange({ event: $event, item: item, scope: scope })
            "
            size="small"
            :maxlength="item.maxlength ? item.maxlength : 32"
            :clearable="item.config.clearable || true"
          />

          <!-- 数字输入框 -->
          <el-input-number
            v-else-if="item.type === 'inputNumber'"
            v-model="scope.row[item.value]"
            :class="[!!scope.row[`${item.value}-error`] ? 'error' : '']"
            @change="
              handleInputChange({ event: $event, item: item, scope: scope })
            "
            :disabled="tableStatus === 'detail' || item.config.disabled"
            :maxlength="item.maxlength"
            size="small"
            :placeholder="item.placeholder ? item.placeholder : '请输入'"
            :controls-position="
              item.controlsPosition ? item.controlsPosition : 'right'
            "
            :min="item.min ? item.min : 0"
            :max="item.max"
            :clearable="item.config.clearable || true"
            v-bind="{ ...item }"
          />
          <el-date-picker
            v-else-if="item.type === 'datePicker'"
            v-model="scope.row[item.value]"
            type="date"
            size="small"
            :value-format="item.valueFormat ? item.valueFormat : 'yyyy-MM-dd'"
            :placeholder="
              item.placeholder ? item.placeholder : '请选择' + item.label
            "
            v-bind="{ ...item }"
            :style="{
              width: item.style && item.style.width ? item.style.width : '100%'
            }"
          >
          </el-date-picker>
          <el-date-picker
            v-else-if="item.type === 'dateTimePicker'"
            v-model="scope.row[item.value]"
            size="small"
            :type="item.dateType ? item.dateType : 'datetime'"
            :value-format="
              item.valueFormat ? item.valueFormat : 'yyyy-MM-dd HH:mm:ss'
            "
            :placeholder="
              item.placeholder ? item.placeholder : '请选择' + item.label
            "
            v-bind="{ ...item }"
            :style="{
              width: item.style && item.style.width ? item.style.width : '100%'
            }"
          >
          </el-date-picker>
        </template>
      </el-table-column>
      <el-table-column
        v-if="tableStatus === 'edit' && isShowOperation"
        fixed="right"
        label="操作"
        :width="operationWidth"
      >
        <template #default="scope">
          <slot name="operation" :scope="scope">
            <el-popconfirm
              v-if="deleteConfirmShow"
              title="确定删除该行吗？"
              @confirm="handleDelete(scope.$index, scope.row)"
            >
              <el-button
                slot="reference"
                size="mini"
                type="text"
                style="color: red"
              >
                删除
              </el-button>
            </el-popconfirm>

            <el-button
              v-if="!deleteConfirmShow"
              size="mini"
              type="text"
              style="color: red"
              @click="handleDelete(scope.$index, scope.row)"
            >
              删除
            </el-button>
          </slot>
        </template>
      </el-table-column>
    </el-table>
    <slot name="button">
      <div v-if="isShowAdd" class="add-btn" @click="addTableLine">新增行</div>
    </slot>
  </div>
</template>

<script>
import Schema from 'async-validator'
export default {
  name: 'LineEditTable',
  props: {
    tableStatus: {
      type: String,
      default: 'edit'
    },
    isIndex: {
      type: Boolean,
      default: false
    },
    indexTitle: {
      type: String,
      default: '序号'
    },
    isShowAdd: {
      type: Boolean,
      default: true
    },
    isShowOperation: {
      type: Boolean,
      default: true
    },
    deleteConfirmShow: {
      type: Boolean,
      default: true
    },
    operationWidth: {
      type: String,
      default: '100'
    },
    tableData: {
      type: Array,
      default: () => {
        return [
          {
            lineStatus: 'edit',
            text: '这是文本',
            select: 'select_1',
            input: '这是输入的内容'
          }
        ]
      }
    },
    // 列的类型type:
    tableHeader: {
      type: Array,
      default: () => {
        return [
          {
            label: '文本框',
            value: 'text',
            defaultData: '',
            minWidth: '120',
            type: 'text',
            config: {}
          },
          {
            label: '选择框',
            value: 'select',
            defaultData: '',
            minWidth: '120',
            type: 'select',
            options: [
              {
                label: '选项1',
                value: 'select_1'
              }
            ],
            config: {
              filterable: true,
              allowCreate: false
            }
          },
          {
            label: '输入框',
            value: 'input',
            defaultData: '',
            minWidth: '120',
            type: 'input',
            config: {
              clearable: true
            }
          }
        ]
      }
    }
  },
  data() {
    return {}
  },
  methods: {
    getSelectConifg({ item, scope }) {
      if (!item.configType || item.configType === 'byHeader') {
        return item.config || {}
      } else if (item.configType === 'byData') {
        return scope.row[item.value + 'Config'] || {}
      }
    },
    /**
     * 删除
     */
    handleDelete(index) {
      this.tableData.splice(index, 1)
    },
    /**
     * 新增行
     */
    addTableLine() {
      const newLine = {}
      this.tableHeader.forEach(item => {
        newLine[item.value] = item.defaultData
      })
      this.tableData.push(newLine)
    },
    /**
     * 单元格值发生变化
     */
    handleCellChange({ event, item, scope }) {
      this.$emit('handleCellChange', { event, item, scope })
    },
    /**
     * 单元格值发生变化
     */
    handleInputChange({ event, item, scope }) {
      this.$emit('handleInputChange', { event, item, scope })
    },
    /**
     * 单元格失焦
     */
    handleBlur({ event, item, scope }) {
      this.$emit('handleBlur', { event, item, scope })
    },
    validate() {
      // 重置errors
      this.resetErrors()
      // 根据tableHeader构建 descriptor
      let descriptor = {}
      let needValidateUniqueArray = []
      this.tableHeader.forEach(column => {
        // 先校验是否必填
        if (column.required) {
          descriptor[column.value] = [
            {
              required: true,
              message: `${column.label}必填`
            }
          ]
        } else {
          descriptor[column.value] = []
        }

        // 整理出需要校验唯一性的项
        if (column.unique) {
          needValidateUniqueArray.push(column)
        }
        // 再从 otherRules 中组装
        if (column.otherRules && column.otherRules[1]) {
          column.otherRules.forEach(item => {
            let rule = {}
            rule.type = item.type
            rule.pattern = item.regExp
            rule.message = item.message
            descriptor[column.value].push(rule)
          })
        }
      })
      const validator = new Schema(descriptor)

      // 遍历tabledata

      let getError = false
      for (let index = 0; index < this.tableData.length; index++) {
        const rowObj = this.tableData[index]
        validator.validate(rowObj, (errors, fields) => {
          if (errors) {
            // validation failed, errors is an array of all errors
            // fields is an object keyed by field name with an array of
            // errors per field
            getError = true
            return this.handleErrors(errors, fields, index)
          }
          // validation passed
        })
        // .catch(({ errors, fields }) => {
        //   return this.handleErrors(errors, fields)
        // })
        if (getError) break
      }

      // 做数据的唯一性校验
      for (let index1 = 0; index1 < needValidateUniqueArray.length; index1++) {
        const needValidateItem = needValidateUniqueArray[index1]
        for (let index2 = 0; index2 < this.tableData.length; index2++) {
          for (
            let index3 = index2 + 1;
            index3 < this.tableData.length;
            index3++
          ) {
            if (
              this.tableData[index2][needValidateItem.value] ===
              this.tableData[index3][needValidateItem.value]
            ) {
              getError = true
              this.$set(
                this.tableData[index2],
                `${needValidateItem.value}-error`,
                true
              )
              this.$set(
                this.tableData[index3],
                `${needValidateItem.value}-error`,
                true
              )
              this.$message.error(`${needValidateItem.label}重复`)
              break
            }
          }
          if (getError) break
        }
        if (getError) break
      }
      // for (const [i, rowObj] of this.tableData.entries()) {
      //   console.log(i, rowObj)
      //   // const result = validator.validate(rowObj).then(() => '')
      //   // if (result) {
      //   //   errors = result
      //   //   return result
      //   // }
      //   return validator.validate(rowObj).catch(({ errors, fields }) => {
      //     return this.handleErrors(errors, fields)
      //   })
      // }
      if (getError) return false
      return true
    },
    // 主要是设置输入框的状态
    handleErrors(errors, fields, index) {
      console.log(errors)
      console.log(fields)
      errors.forEach(error => {
        this.$set(this.tableData[index], `${error.field}-error`, true)
      })
      this.$message.error(errors[0].message)
    },
    resetErrors() {
      this.tableData.forEach(item => {
        for (const key in item) {
          if (!key.includes('-error')) this.$set(item, `${key}-error`, false)
        }
      })
    },
    // querySearch(queryString, cb, param) {
    //   console.log(queryString)
    //   console.log(cb)
    //   console.log(param)

    //   return this.a(queryString, cb)
    // },
    fn(param, queryString, cb) {
      console.log(queryString)
      console.log(cb)
      console.log(param)
      this.$emit('handleAutoComplete', { queryString, cb, param })
    },
    querySearch(param) {
      // console.log(param)
      return this.fn.bind(this, param)
    },

    handleAutocompleteSelect({ event, item, scope }) {
      this.$emit('handleAutocompleteSelect', { event, item, scope })
    }
  }
}
</script>

<style lang="scss">
.line-edit-table {
  .el-input.is-disabled .el-input__inner {
    color: #606266;
  }
}
</style>

<style lang="scss" scoped>
.line-edit-table {
  display: flex;
  flex-direction: column;
  ::v-deep .el-table {
    th {
      font-weight: 600;
      color: #242833;
      line-height: 22px;
      background: #f4f5f7;
    }
    .el-table__row {
      td {
        padding: 8px 0;
        line-height: 22px;
      }
    }
  }
  .add-btn {
    margin-top: 16px;
    width: 100%;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    font-weight: 400;
    color: #4a81fe;
    cursor: pointer;
    border: 1px dashed #4a81fe;
    background-color: #ffffff;
  }
}
::v-deep {
  .error {
    .el-input__inner {
      border-color: red;
    }
  }
}
</style>
