<template>
  <KpiFormWrapper
    :mode="mode"
    :formItem="formItem"
    :formIndex="formIndex"
    :showCondition="showCondition"
    :showDeleteButton="showDeleteButton"
    :showAddButton="showAddButton"
    :formRules="formRules"
    :conditionList="conditionList"
    :path="path"
    @click="handleWrapperClick"
  >
    <el-row>
      <!-- 指标 start -->
      <el-col :span="10">
        <el-form-item
          :prop="getProp('firstKpi')"
          label="指标"
          :rules="formRules.firstKpi"
        >
          <el-select
            :style="{ width: '100%' }"
            :value="formItem.firstKpi"
            placeholder="请选择指标"
            @input="handleChange('kpi', $event)"
          >
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="item in kpiDictList"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <!-- 指标 end -->

      <!-- 诊断 start -->
      <el-col
        :span="10"
        v-show="formItem.firstKpi === '01' || formItem.firstKpi === '04'"
      >
        <el-form-item
          :prop="getProp('keyword')"
          label-width="16px"
          :rules="
            formItem.firstKpi === '01' || formItem.firstKpi === '04'
              ? [
                  {
                    required: true,
                    message: '请输入',
                    trigger: 'blur'
                  }
                ]
              : []
          "
        >
          <el-input v-model="formItem.keyword" placeholder=""></el-input>
        </el-form-item>
      </el-col>
      <!-- 诊断 end -->

      <!-- 体征 start -->
      <el-col
        :span="10"
        v-show="formItem.firstKpi === '02' || formItem.firstKpi === '05'"
      >
        <el-row>
          <el-col :span="7">
            <el-form-item
              :prop="getProp('secondKpi')"
              label-width="16px"
              :rules="
                formItem.firstKpi === '02' || formItem.firstKpi === '05'
                  ? formRules.secondKpi
                  : []
              "
            >
              <el-select
                :style="{ width: '100%' }"
                v-model="formItem.secondKpi"
                placeholder=""
              >
                <el-option
                  :label="item.name"
                  :value="item.id"
                  v-for="item in getChildren(
                    'kpiDictList',
                    'id',
                    formItem.firstKpi
                  )"
                  :key="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="10">
            <el-form-item
              :prop="getProp('operator')"
              label-width="16px"
              :rules="
                formItem.firstKpi === '02' || formItem.firstKpi === '05'
                  ? formRules.operator
                  : []
              "
            >
              <el-select
                :style="{ width: '100%' }"
                v-model="formItem.operator"
                placeholder=""
              >
                <el-option
                  :label="item.dictValue"
                  :value="item.dictCode"
                  v-for="item in operaTypeList"
                  :key="item.dictCode"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="7">
            <el-form-item
              :prop="getProp('keyword')"
              label-width="16px"
              :rules="
                formItem.firstKpi === '02' || formItem.firstKpi === '05'
                  ? [
                      {
                        required: true,
                        message: '请输入',
                        trigger: 'blur'
                      }
                    ]
                  : []
              "
            >
              <el-input v-model="formItem.keyword" placeholder=""></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-col>
      <!-- 体征 end -->

      <!-- 症状 start -->
      <el-col :span="10" v-show="formItem.firstKpi === '03'">
        <el-form-item
          :prop="getProp('kpiValue')"
          label-width="16px"
          :rules="formItem.firstKpi === '03' ? formRules.kpiValue : []"
        >
          <el-select
            :style="{ width: '100%' }"
            v-model="formItem.kpiValue"
            placeholder=""
            multiple
          >
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="item in getChildren(
                'kpiDictList',
                'id',
                formItem.firstKpi
              )"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <!-- 症状 end -->
    </el-row>
  </KpiFormWrapper>
</template>

<script>
import KpiFormWrapper from './KpiFormWrapper'

export default {
  name: 'KpiFormControl',
  components: {
    KpiFormWrapper
  },
  props: {
    mode: {
      type: String,
      default: ''
    },
    formItem: {
      type: Object,
      default: () => {}
    },
    formIndex: {
      type: Number,
      default: 0
    },
    showCondition: {
      type: Boolean,
      default: false
    },
    showDeleteButton: {
      type: Boolean,
      default: false
    },
    showAddButton: {
      type: Boolean,
      default: false
    },
    formRules: {
      type: Object,
      default: () => {}
    },
    conditionList: {
      type: Array,
      default: () => []
    },
    kpiDictList: {
      type: Array,
      default: () => []
    },
    operaTypeList: {
      type: Array,
      default: () => []
    },
    path: {
      type: String,
      default: ''
    }
  },
  methods: {
    getProp(propName) {
      //   let result = ['kpis']
      let result = 'kpis'
      this.path.split('-').forEach((item, i, arr) => {
        if (i !== arr.length - 1) {
          //   result.push(item)
          //   result.push('kpis')
          result += `.${item}.kpis`
        } else {
          //   result.push(item)
          //   result.push(propName)
          result += `.${item}.${propName}`
        }
      })
      // console.log(result)
      //   return result.join('.')
      return result
    },

    /**
     * 获取子类数组
     */
    getChildren(arrayName, propName, value) {
      const target = this[arrayName].find(item => item[propName] === value)
      if (target && target.children) {
        return target.children
      }
      return []
    },

    handleChange(type, value) {
      this.$emit('change', type, value, this.path)
    },

    handleWrapperClick(type, target) {
      this.$emit(
        'click',
        type,
        typeof target !== 'undefined' ? target : 'kpi',
        this.path
      )
    }
  }
}
</script>

<style lang="scss" scoped></style>
