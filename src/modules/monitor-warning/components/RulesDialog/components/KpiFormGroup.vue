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
    <el-card class="kpi-form-group__card" shadow="never">
      <template #header> 组{{ kpiGroupNames[path] }} </template>
      <template v-for="(formSubItem, formSubIndex) in formItem.kpis">
        <KpiFormGroup
          :mode="mode"
          :formItem="formSubItem"
          :formIndex="formSubIndex"
          :showCondition="formSubIndex > 0"
          :showDeleteButton="true"
          :showAddButton="false"
          :formRules="formRules"
          :conditionList="conditionList"
          :kpiDictList="kpiDictList"
          :operaTypeList="operaTypeList"
          :path="`${path}-${formSubIndex.toString()}`"
          :kpiGroupNames="kpiGroupNames"
          :key="formSubIndex"
          @change="handleChange"
          @click="handleChildrenClick(...arguments, formIndex)"
          v-if="
            formSubItem.kpis &&
              Array.isArray(formSubItem.kpis) &&
              formSubItem.kpis.length > 0
          "
        />

        <KpiFormControl
          :mode="mode"
          :formItem="formSubItem"
          :formIndex="formSubIndex"
          :showCondition="formSubIndex > 0"
          :showDeleteButton="formSubIndex > 0"
          :showAddButton="formSubIndex === 0"
          :formRules="formRules"
          :conditionList="conditionList"
          :kpiDictList="kpiDictList"
          :operaTypeList="operaTypeList"
          :path="`${path}-${formSubIndex.toString()}`"
          :key="formSubIndex"
          @change="handleChange"
          @click="handleChildrenClick(...arguments, formIndex)"
          v-else
        />
      </template>
    </el-card>
  </KpiFormWrapper>
</template>

<script>
import KpiFormWrapper from './KpiFormWrapper'
import KpiFormControl from './KpiFormControl'

export default {
  name: 'KpiFormGroup',
  components: {
    KpiFormWrapper,
    KpiFormControl
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
    },
    kpiGroupNames: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
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

    handleChange(type, value, path) {
      this.$emit('change', type, value, path)
    },

    handleWrapperClick(type, target) {
      this.$emit(
        'click',
        type,
        typeof target !== 'undefined' ? target : 'group',
        this.path
      )
    },

    handleChildrenClick(type, target, path) {
      this.$emit('click', type, target, path)
    }
  }
}
</script>

<style lang="scss" scoped>
.kpi-form-group__card {
  margin-bottom: 18px;
}
</style>
