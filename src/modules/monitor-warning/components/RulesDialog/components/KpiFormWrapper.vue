<template>
  <el-row>
    <el-col :span="2" v-show="showCondition">
      <el-form-item
        :prop="`kpis.${formIndex}.condition`"
        label-width="0px"
        :rules="showCondition ? formRules.condition : []"
      >
        <el-select :style="{ width: '90%' }" v-model="formItem.condition">
          <el-option
            :label="item.dictValue"
            :value="item.dictCode"
            v-for="item in conditionList"
            :key="item.dictCode"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-col>

    <el-col :offset="showCondition ? 0 : 2" :span="20">
      <slot></slot>
    </el-col>

    <el-col :span="2" v-show="mode !== 'view'">
      <div class="custom-flex" v-show="showDeleteButton">
        <i
          class="custom-icon custom-icon__delete"
          @click="handleClick('delete')"
        />
      </div>

      <div class="custom-flex flex-end" v-show="showAddButton">
        <el-dropdown trigger="click" @command="handleClick('add', $event)">
          <el-button type="primary" size="small">新增</el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="kpi">指标</el-dropdown-item>
            <el-dropdown-item command="group">组</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'KpiFormWrapper',
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
    path: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleClick(type, target) {
      this.$emit('click', type, target)
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-flex {
  display: flex;
  align-items: center;
  height: 32px;

  &.flex-end {
    justify-content: flex-end;
  }

  .custom-icon {
    display: block;
    width: 20px;
    height: 20px;
    margin-left: 15px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 20px 20px;
    cursor: pointer;
  }

  .custom-icon__delete {
    background-image: url('~@/assets/svgs/icon-delete.svg');
  }
}
</style>
