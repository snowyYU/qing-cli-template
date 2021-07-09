<template>
  <el-form
    class="rules-config-form"
    ref="form"
    :model="formData"
    size="small"
    label-width="120px"
    :disabled="mode === 'view'"
  >
    <div class="custom-panel">
      <CustomHeader title="监测指标">
        <template #right-header>
          <el-button
            type="text"
            v-show="mode !== 'view'"
            @click="handleFormClick('add', 'kpi')"
          >
            <div class="custom-flex">
              <i class="custom-icon custom-icon__create"></i>
              <span>新增</span>
            </div>
          </el-button>
        </template>
      </CustomHeader>

      <div class="custom-panel__content">
        <el-row>
          <el-col
            class="custom-col"
            :span="11"
            :offset="(index + 1) % 2 === 0 ? 2 : 0"
            v-for="(item, index) in formData.kpiJson"
            :key="index"
          >
            <el-row>
              <el-col :span="20">
                <el-form-item
                  :prop="`kpiJson.${index}.kpi`"
                  label="症状"
                  :rules="formRules.kpiJson"
                >
                  <el-select
                    :style="{ width: '100%' }"
                    v-model="item.kpi"
                    placeholder="请选择症状"
                  >
                    <el-option
                      v-for="el in symptomList"
                      :key="el.dictCode"
                      :label="el.dictValue"
                      :value="el.dictCode"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="4">
                <div :style="{ paddingLeft: '8px' }">
                  <el-button
                    :style="{ color: '#E5302F', padding: '7px 0' }"
                    type="text"
                    v-show="formData.kpiJson.length > 1 && mode !== 'view'"
                    @click="handleFormClick('delete', 'kpi', index)"
                  >
                    <div class="custom-flex">
                      <i class="custom-icon custom-icon__remove"></i>
                      <span>删除</span>
                    </div>
                  </el-button>
                </div>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </div>

    <div class="custom-panel">
      <CustomHeader title="阈值设置">
        <template #right-header>
          <el-button
            type="text"
            v-show="mode !== 'view'"
            @click="handleFormClick('add', 'threshold')"
          >
            <div class="custom-flex">
              <i class="custom-icon custom-icon__create"></i>
              <span>新增</span>
            </div>
          </el-button>
        </template>
      </CustomHeader>

      <div class="custom-panel__content">
        <div
          class="custom-module"
          v-for="(item, index) in formData.thresholdSaveList"
          :key="index"
        >
          <el-row>
            <el-col :span="22">
              <el-row>
                <el-col :span="12">
                  <el-form-item
                    :prop="`thresholdSaveList.${index}.monitorScope`"
                    label="监测范围"
                    :rules="formRules.monitorScope"
                  >
                    <el-select
                      :style="{ width: '100%' }"
                      v-model="item.monitorScope"
                      placeholder="请选择监测范围"
                      clearable
                    >
                      <el-option
                        v-for="el in monitorScopeList"
                        :key="el.dictCode"
                        :label="el.dictValue"
                        :value="el.dictCode"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item
                    :prop="`thresholdSaveList.${index}.operaCondition`"
                    label="学校人数"
                    :rules="formRules.operaCondition"
                  >
                    <el-row>
                      <el-col :span="8">
                        <el-select
                          :style="{ width: '100%' }"
                          v-model="item.operaCondition"
                          placeholder="请选择符号"
                          clearable
                        >
                          <el-option label="<=" value="<="></el-option>
                          <el-option label=">" value=">"></el-option>
                        </el-select>
                      </el-col>

                      <el-col :span="15" :offset="1">
                        <el-input-number
                          class="custom-input-number"
                          :style="{ width: '100%' }"
                          v-model="item.personNum"
                          placeholder="请输入人数"
                          :controls="false"
                        ></el-input-number>
                      </el-col>
                    </el-row>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item
                    :prop="`thresholdSaveList.${index}.monitorDays`"
                    label="监测天数"
                    :rules="formRules.monitorDays"
                  >
                    <el-input-number
                      class="custom-input-number"
                      :style="{ width: '100%' }"
                      v-model="item.monitorDays"
                      placeholder="请输入监测天数"
                      :controls="false"
                    ></el-input-number>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item
                    :prop="`thresholdSaveList.${index}.alertCaseNum`"
                    label="预警个案数"
                    :rules="formRules.alertCaseNum"
                  >
                    <el-input-number
                      class="custom-input-number"
                      :style="{ width: '100%' }"
                      v-model="item.alertCaseNum"
                      placeholder="请输入预警个案数"
                      :controls="false"
                    ></el-input-number>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>

            <el-col :span="2">
              <div
                :style="{ paddingTop: '25px', textAlign: 'right' }"
                v-show="
                  formData.thresholdSaveList.length > 1 && mode !== 'view'
                "
              >
                <el-button
                  :style="{ color: '#E5302F', padding: '7px 0' }"
                  type="text"
                  @click="handleFormClick('delete', 'threshold', index)"
                >
                  <div class="custom-flex">
                    <i class="custom-icon custom-icon__remove"></i>
                    <span>删除</span>
                  </div>
                </el-button>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </el-form>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import CustomHeader from './CustomHeader.vue'
import { queryDictInfoByCategory } from '@/api/common'

const initFormData = {
  kpiJson: [
    {
      kpi: ''
    }
  ], // 症状
  thresholdSaveList: [
    {
      monitorScope: '', // 监测范围
      operaCondition: '', // 条件(小于等于, 大于)
      personNum: '', // 人数
      monitorDays: '', // 监测天数
      alertCaseNum: '' // 预警个案数
    }
  ]
}

export default {
  name: 'RulesConfigForm',
  components: {
    CustomHeader
  },
  props: {
    mode: {
      type: String,
      default: ''
    },
    ruleDetail: {
      type: Object,
      default: () => {}
    },
    symptomList: {
      type: Array,
      default: () => []
    },
    monitorScopeList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      formData: cloneDeep(initFormData),
      formRules: {
        kpiJson: [{ required: true, message: '请选择症状', trigger: 'change' }],
        monitorScope: [
          { required: true, message: '请选择监测范围', trigger: 'change' }
        ],
        operaCondition: [
          { required: true, message: '请选择条件', trigger: 'change' }
        ],
        personNum: [{ required: true, message: '请输入人数', trigger: 'blur' }],
        monitorDays: [
          { required: true, message: '请输入监测天数', trigger: 'blur' }
        ],
        alertCaseNum: [
          { required: true, message: '请输入预警个案数', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    ruleDetail(val) {
      this.formatData(val)
    }
  },
  methods: {
    /**
     * 格式化数据
     * @param {*} val
     */
    formatData(val) {
      const fields = {}
      Object.keys(this.formData).forEach(key => {
        if (key === 'kpiJson' && val[key]) {
          fields[key] = val[key].map(item => ({ kpi: item }))
        } else if (key === 'thresholdSaveList' && val[key]) {
          fields[key] = val[key]
        } else {
          fields[key] = cloneDeep(initFormData[key])
        }
      })
      this.formData = fields
    },

    /**
     * 根据分类查询所有字典信息
     * @param {*} data
     * @param {function} callback
     */
    queryDictInfoByCategory(type, callback) {
      const data = { dictKey: type }
      queryDictInfoByCategory(data).then(res => {
        callback && callback(res.data)
      })
    },

    /**
     * 表单点击事件
     */
    handleFormClick(type, target, index) {
      switch (type) {
        case 'add':
          switch (target) {
            case 'kpi':
              this.formData.kpiJson.push({
                kpi: ''
              })
              break
            case 'threshold':
              this.formData.thresholdSaveList.push({
                monitorScope: '',
                operaCondition: '',
                personNum: '',
                monitorDays: '',
                alertCaseNum: ''
              })
              break
          }
          break
        case 'delete':
          switch (target) {
            case 'kpi':
              this.formData.kpiJson.splice(index, 1)
              break
            case 'threshold':
              this.formData.thresholdSaveList.splice(index, 1)
              break
          }
          break
      }
    },

    init() {},

    submit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          const fields = {
            ...this.formData,
            kpiJson: this.formData.kpiJson.map(item => item.kpi)
          }

          if (this.mode === 'edit') {
            fields.id = this.ruleDetail.id
          }

          this.$emit('submit', fields)
        }
      })
    },

    reset() {
      this.formData = cloneDeep(initFormData)
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.rules-config-form {
  .custom-panel {
    margin-bottom: 16px;
    border-radius: 8px;
    background: #fafafa;

    &:last-child {
      margin-bottom: 0;
    }

    &__content {
      padding: 0 16px;

      .custom-module {
        margin-bottom: 16px;
        border-bottom: 1px solid #e1e3e6;

        &:last-child {
          margin-bottom: 0;
          border-bottom: 0;
        }
      }
    }

    .custom-col {
      position: relative;

      &::before {
        display: block;
        content: 'OR';
        position: absolute;
        top: 8px;
        left: 0;
        z-index: 1;
        font-size: 14px;
        font-weight: 500;
        color: #232324;
      }

      &:first-child::before {
        display: none;
      }
    }
  }

  .custom-flex {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .custom-icon {
    display: block;
    width: 16px;
    height: 16px;
    margin-right: 4px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 16px 16px;
  }

  .custom-icon__create {
    background-image: url('~@/assets/svgs/icon-create.svg');
  }

  .custom-icon__remove {
    background-image: url('~@/assets/svgs/icon-remove.svg');
  }

  .custom-input-number {
    &::v-deep {
      .el-input__inner {
        text-align: left;
      }
    }
  }
}
</style>
