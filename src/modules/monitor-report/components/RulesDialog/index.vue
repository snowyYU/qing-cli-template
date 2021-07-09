<template>
  <BaseDialog
    :visible="visible"
    :title="title"
    :config="mixinConfig"
    @open="handleOpen"
    @confirm="handleConfirm"
    @cancel="handleCancel"
    @close="handleCancel"
    @closed="handleClosed"
  >
    <template #body>
      <el-form
        :model="formData"
        ref="form"
        size="small"
        label-width="100px"
        :disabled="mode === 'view'"
      >
        <el-row>
          <el-col :span="24">
            <el-row>
              <el-col :offset="2" :span="10">
                <el-form-item
                  prop="ruleName"
                  label="规则名称"
                  :rules="formRules.ruleName"
                >
                  <el-input
                    v-model="formData.ruleName"
                    placeholder="请输入规则名称"
                  ></el-input>
                </el-form-item>
              </el-col>

              <!-- 预警类型 -->

              <el-col :span="10">
                <el-form-item
                  prop="warnType"
                  label="预警类型"
                  :rules="formRules.warnType"
                >
                  <el-select
                    :style="{ width: '100%' }"
                    v-model="formData.warnType"
                    placeholder="请选择预警类型"
                    @change="handleChange('warnType', $event)"
                  >
                    <el-option
                      :label="item.dictValue"
                      :value="item.dictCode"
                      v-for="item in warnTypeList"
                      :key="item.dictCode"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>

          <el-col :span="24">
            <el-row>
              <el-col
                :offset="2"
                :span="10"
                v-show="formData.warnType === '01'"
              >
                <el-form-item
                  prop="diseaseType"
                  label="症候群类型"
                  :rules="
                    formData.warnType === '01'
                      ? [
                          {
                            required: true,
                            message: '请选择症候群类型',
                            trigger: 'change'
                          }
                        ]
                      : []
                  "
                >
                  <el-select
                    :style="{ width: '100%' }"
                    v-model="formData.diseaseType"
                    placeholder="请选择传染病类型"
                  >
                    <el-option
                      :label="item.name"
                      :value="item.id"
                      v-for="item in syndromeList"
                      :key="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="24" v-show="formData.warnType === '02'">
                <el-row>
                  <el-col :offset="2" :span="10">
                    <el-form-item
                      prop="diseaseType"
                      label="传染病类型"
                      :rules="
                        formData.warnType === '02'
                          ? [
                              {
                                required: true,
                                message: '请选择传染病类型',
                                trigger: 'change'
                              }
                            ]
                          : []
                      "
                    >
                      <el-select
                        :style="{ width: '100%' }"
                        v-model="formData.diseaseType"
                        placeholder="请选择传染病类型"
                        @change="handleChange('diseaseType', $event)"
                      >
                        <el-option
                          :label="item.name"
                          :value="item.id"
                          v-for="item in infectiousDiseasesList"
                          :key="item.id"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>

                  <el-col :span="10">
                    <el-form-item
                      prop="diseaseTypeLeaf"
                      label-width="16px"
                      :rules="
                        formData.warnType === '02'
                          ? formRules.diseaseTypeLeaf
                          : []
                      "
                    >
                      <el-select
                        :style="{ width: '100%' }"
                        v-model="formData.diseaseTypeLeaf"
                        placeholder="请选择传染病细分类型"
                      >
                        <el-option
                          :label="item.name"
                          :value="item.id"
                          v-for="item in getChildren(
                            'infectiousDiseasesList',
                            'id',
                            formData.diseaseType
                          )"
                          :key="item.id"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-col>

          <!-- 监测指标 -->

          <el-col :span="24">
            <!-- <el-form-item prop="condition" :rules="formRules.condition">
              <template #label>
                <div class="form-block__title">监测指标</div>
              </template>

              <div class="custom-flex" :style="{ height: '32px' }">
                <el-radio-group v-model="formData.condition">
                  <el-radio
                    :label="item.dictCode"
                    v-for="item in conditionList"
                    :key="item.dictCode"
                    >{{ item.dictValue }}</el-radio
                  >
                </el-radio-group>

                <i
                  class="custom-icon custom-icon__add"
                  @click="handleClick('add', 'kpi')"
                  v-show="mode !== 'view'"
                ></i>
              </div>
            </el-form-item> -->

            <div class="form-block__header custom-flex">
              <div class="form-block__title">监测指标</div>

              <div
                :style="{ flex: 1, textAlign: 'right' }"
                v-show="mode !== 'view'"
              >
                <el-dropdown trigger="click" @command="handleConditionClick">
                  <el-button type="primary" size="small">新增</el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="kpi">指标</el-dropdown-item>
                    <el-dropdown-item command="group">组</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </div>
          </el-col>

          <el-col :span="24">
            <template v-for="(formItem, formIndex) in formData.kpis">
              <KpiFormGroup
                :mode="mode"
                :formItem="formItem"
                :formIndex="formIndex"
                :showCondition="formIndex > 0"
                :showDeleteButton="true"
                :showAddButton="false"
                :formRules="formRules"
                :conditionList="conditionList"
                :kpiDictList="kpiDictList"
                :operaTypeList="operaTypeList"
                :path="formIndex.toString()"
                :kpiGroupNames="kpiGroupNames"
                :key="formIndex"
                @change="handleChange"
                @click="handleClick"
                v-if="
                  formItem.kpis &&
                    Array.isArray(formItem.kpis) &&
                    formItem.kpis.length > 0
                "
              />

              <KpiFormControl
                :mode="mode"
                :formItem="formItem"
                :formIndex="formIndex"
                :showCondition="formIndex > 0"
                :showDeleteButton="formIndex > 0"
                :showAddButton="false"
                :formRules="formRules"
                :conditionList="conditionList"
                :kpiDictList="kpiDictList"
                :operaTypeList="operaTypeList"
                :path="formIndex.toString()"
                :key="formIndex"
                @change="handleChange"
                @click="handleClick"
                v-else
              />
            </template>
          </el-col>

          <!-- 阈值设置 -->

          <el-col :span="24">
            <div class="form-block__header custom-flex">
              <div class="form-block__title">阈值设置</div>

              <i
                class="custom-icon custom-icon__add"
                @click="handleClick('add', 'threshold')"
                v-show="mode !== 'view'"
              ></i>
            </div>
          </el-col>

          <el-col :span="24">
            <el-row
              class="custom-border"
              v-for="(formItem, formIndex) in formData.thresholds"
              :key="formIndex"
            >
              <el-col
                :offset="2"
                :span="formItem.monitorScope === '05' ? 5 : 10"
              >
                <el-form-item
                  :prop="`thresholds.${formIndex}.monitorScope`"
                  label="监测范围"
                  :rules="formRules.monitorScope"
                >
                  <el-select
                    :style="{ width: '100%' }"
                    v-model="formItem.monitorScope"
                    placeholder="请选择监测范围"
                    @change="handleChange('monitorScope', $event, formIndex)"
                  >
                    <el-option
                      :label="item.name"
                      :value="item.id"
                      v-for="item in monitorRangeList"
                      :key="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="5" v-show="formItem.monitorScope === '05'">
                <el-form-item
                  :prop="`thresholds.${formIndex}.monitorScopeLeaf`"
                  label=""
                  label-width="16px"
                  :rules="
                    formItem.monitorScope === '05'
                      ? formRules.monitorScopeLeaf
                      : []
                  "
                >
                  <el-select
                    :style="{ width: '100%' }"
                    v-model="formItem.monitorScopeLeaf"
                    placeholder="请选择机构"
                  >
                    <el-option
                      :label="item.name"
                      :value="item.id"
                      v-for="item in getChildren(
                        'monitorRangeList',
                        'id',
                        formItem.monitorScope
                      )"
                      :key="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="10">
                <el-form-item
                  :prop="`thresholds.${formIndex}.warningLevel`"
                  label="预警级别"
                  :rules="formRules.warningLevel"
                >
                  <el-select
                    :style="{ width: '100%' }"
                    v-model="formItem.warningLevel"
                    placeholder="请选择预警级别"
                  >
                    <el-option
                      :label="item.dictValue"
                      :value="item.dictCode"
                      v-for="item in warningLevelList"
                      :key="item.dictCode"
                    />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col
                :span="1"
                v-show="formData.thresholds.length > 1 && mode !== 'view'"
              >
                <div class="custom-flex" :style="{ height: '32px' }">
                  <i
                    class="custom-icon custom-icon__delete"
                    @click="handleClick('delete', 'threshold', formIndex)"
                  />
                </div>
              </el-col>

              <el-col :offset="2" :span="10">
                <el-form-item
                  :prop="`thresholds.${formIndex}.monitorDays`"
                  label="监测天数"
                  :rules="formRules.monitorDays"
                >
                  <el-input-number
                    :style="{ width: '100%' }"
                    v-model="formItem.monitorDays"
                    controls-position="right"
                  ></el-input-number>
                </el-form-item>
              </el-col>

              <el-col :span="10">
                <el-form-item
                  :prop="`thresholds.${formIndex}.warningThreshold`"
                  label="预警个案数"
                  :rules="formRules.warningThreshold"
                >
                  <el-input-number
                    :style="{ width: '100%' }"
                    v-model="formItem.warningThreshold"
                    controls-position="right"
                  ></el-input-number>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-form>
    </template>
  </BaseDialog>
</template>

<script>
import isEmpty from 'lodash/isEmpty'
import cloneDeep from 'lodash/cloneDeep'
import BaseDialog from '@/components/BaseDialog'
import KpiFormControl from './components/KpiFormControl'
import KpiFormGroup from './components/KpiFormGroup'

const initFormData = {
  ruleName: '', // 规格名称
  warnType: '', // 预警类型
  diseaseType: '', // 传染病类型/症候群类型
  diseaseTypeLeaf: '', // 传染病类型子节点
  kpis: [
    {
      condition: '',
      firstKpi: '',
      kpiValue: [],
      operator: '',
      secondKpi: '',
      keyword: ''
    }
  ],
  thresholds: [
    {
      monitorScope: '',
      monitorScopeLeaf: '',
      warningLevel: '',
      monitorDays: 0,
      warningThreshold: 0
    }
  ]
}

function getGroupName(names, kpis, key, level) {
  let current = 1
  if (kpis && Array.isArray(kpis) && kpis.length > 0) {
    kpis.forEach((item, index) => {
      if (item.kpis) {
        const currentKey = key ? `${key}-${index}` : index.toString()
        const currentLevel = level ? `${level}-${current}` : current.toString()
        current += 1
        names[currentKey] = currentLevel
        getGroupName(names, item.kpis, currentKey, currentLevel)
      }
    })
  }
}

export default {
  name: 'RulesDialog',
  components: {
    BaseDialog,
    KpiFormControl,
    KpiFormGroup
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    mode: {
      type: String,
      default: ''
    },
    config: {
      type: Object,
      default() {
        return {}
      }
    },
    ruleDetail: {
      type: Object,
      default() {
        return {}
      }
    },
    // 预警类型
    warnTypeList: {
      type: Array,
      default() {
        return []
      }
    },
    // 逻辑符号
    conditionList: {
      type: Array,
      default() {
        return []
      }
    },
    // 运算符
    operaTypeList: {
      type: Array,
      default() {
        return []
      }
    },
    // 指标
    kpiDictList: {
      type: Array,
      default() {
        return []
      }
    },
    // 监控范围
    monitorRangeList: {
      type: Array,
      default() {
        return []
      }
    },
    // 预警级别
    warningLevelList: {
      type: Array,
      default() {
        return []
      }
    },
    // 传染病类型
    infectiousDiseasesList: {
      type: Array,
      default() {
        return []
      }
    },
    // 候诊群类型
    syndromeList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      formData: cloneDeep(initFormData),
      formRules: {
        ruleName: [
          { required: true, message: '请输入规则名称', trigger: 'blur' }
        ],
        warnType: [
          { required: true, message: '请选择预警类型', trigger: 'change' }
        ],
        // diseaseType: [{ required: true, message: '请选择', trigger: 'change' }],
        diseaseTypeLeaf: [
          { required: true, message: '请选择传染病细分类型', trigger: 'change' }
        ],
        condition: [
          { required: true, message: '请选择逻辑关系', trigger: 'change' }
        ],
        firstKpi: [
          { required: true, message: '请选择指标', trigger: 'change' }
        ],
        // keyword: [{ required: true, message: '请输入', trigger: 'blur' }],
        secondKpi: [{ required: true, message: '请选择', trigger: 'change' }],
        operator: [
          { required: true, message: '请选择逻辑类型', trigger: 'change' }
        ],
        kpiValue: [{ required: true, message: '请选择', trigger: 'change' }],
        monitorScope: [
          { required: true, message: '请选择监测范围', trigger: 'change' }
        ],
        monitorScopeLeaf: [
          { required: true, message: '请选择机构', trigger: 'change' }
        ],
        warningLevel: [
          { required: true, message: '请选择预警级别', trigger: 'change' }
        ],
        monitorDays: [
          { required: true, message: '请选择监测天数', trigger: 'change' }
        ],
        warningThreshold: [
          { required: true, message: '请选择预警个案数', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    mixinConfig() {
      return { ...this.config, isShowConfirm: this.mode !== 'view' }
    },

    kpiGroupNames() {
      const names = {}
      getGroupName(names, this.formData.kpis)
      return names
    }
  },
  watch: {
    ruleDetail(val) {
      if (!isEmpty(val)) {
        this.formData = this.parseData(val)
      }
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

    /**
     * 新增监测指标
     */
    handleConditionClick(target) {
      this.handleClick('add', target)
    },

    /**
     * 点击事件
     */
    handleClick(type, target, index) {
      let targetObject = []
      let deleteIndex = -1
      if (target === 'kpi' || target === 'group') {
        if (typeof index !== 'undefined' && index.indexOf('-') > -1) {
          const arr = index.split('-')
          deleteIndex = parseInt(arr.splice(arr.length - 1, 1)[0])
          arr.forEach((item, i) => {
            if (i === 0) {
              targetObject = this.formData.kpis[parseInt(item)].kpis
            } else {
              targetObject = targetObject[parseInt(item)].kpis
            }
          })
        } else {
          targetObject = this.formData.kpis
          deleteIndex = parseInt(index)
        }
      }
      switch (type) {
        case 'add':
          switch (target) {
            case 'kpi':
              targetObject.push({
                condition: '',
                firstKpi: '',
                kpiValue: [],
                operator: '',
                secondKpi: '',
                keyword: ''
              })
              break
            case 'group':
              targetObject.push({
                condition: '',
                kpis: [
                  {
                    condition: '',
                    firstKpi: '',
                    kpiValue: [],
                    operator: '',
                    secondKpi: '',
                    keyword: ''
                  }
                ]
              })
              break
            case 'threshold':
              this.formData.thresholds.push({
                monitorScope: '',
                monitorScopeLeaf: '',
                warningLevel: '',
                monitorDays: 0,
                warningThreshold: 0
              })
              break
          }
          break
        case 'delete':
          switch (target) {
            case 'kpi':
            case 'group':
              targetObject.splice(deleteIndex, 1)
              break
            case 'threshold':
              this.formData.thresholds.splice(index, 1)
              break
          }
          break
      }
    },

    /**
     * 组件修改事件
     */
    handleChange(type, value, index) {
      // console.log(type, value)
      if (type === 'warnType') {
        this.formData.diseaseType = ''
        this.formData.diseaseTypeLeaf = ''
        this.$refs.form.clearValidate(['diseaseType', 'diseaseTypeLeaf'])
      } else if (type === 'kpi') {
        let targetObject = []
        let currentIndex = -1
        if (index.indexOf('-') > -1) {
          const arr = index.split('-')
          currentIndex = parseInt(arr.splice(arr.length - 1, 1)[0])
          arr.forEach((item, i) => {
            if (i === 0) {
              targetObject = this.formData.kpis[parseInt(item)].kpis
            } else {
              targetObject = targetObject[parseInt(item)].kpis
            }
          })
        } else {
          targetObject = this.formData.kpis
          currentIndex = parseInt(index)
        }

        if (targetObject[currentIndex].firstKpi !== value) {
          // 切换指标时，清空后续数据
          const data = {
            condition: targetObject[currentIndex].condition,
            firstKpi: value,
            kpiValue: [],
            operator: '',
            secondKpi: '',
            keyword: ''
          }
          this.$set(targetObject, currentIndex, data)
          this.$refs.form.clearValidate([
            // 'condition',
            'kpiValue',
            'operator',
            'secondKpi',
            'keyword'
          ])
        }
      } else if (type === 'monitorScope') {
        if (
          value !== '05' &&
          this.formData.thresholds[index].monitorScopeLeaf
        ) {
          this.formData.thresholds[index].monitorScopeLeaf = ''
        }
      }
    },

    /**
     * 格式化 kpis
     */
    formatKpis(kpis) {
      return kpis.map(kpi => {
        let obj = {}

        if (kpi.kpis) {
          obj = {
            condition: {
              code: kpi.condition,
              name: ''
            },
            kpis: this.formatKpis(kpi.kpis)
          }

          const target = this.conditionList.find(
            item => item.dictCode === kpi.condition
          )
          if (target) {
            obj.condition.name = target.dictValue
          }
        } else {
          obj = {
            firstKpi: {
              code: kpi.firstKpi,
              name: ''
            },
            kpiValue: [
              {
                code: '',
                name: ''
              }
            ],
            operator: {
              code: '',
              name: ''
            },
            secondKpi: {
              code: '',
              name: ''
            },
            showType: ''
          }

          if (kpi.condition) {
            obj.condition = {
              code: kpi.condition,
              name: ''
            }

            const target = this.conditionList.find(
              item => item.dictCode === kpi.condition
            )
            if (target) {
              obj.condition.name = target.dictValue
            }
          }

          const index = this.kpiDictList.findIndex(
            item => item.id === kpi.firstKpi
          )
          if (index > -1) {
            obj.firstKpi.name = this.kpiDictList[index].name
          }

          if (kpi.firstKpi === '01' || kpi.firstKpi === '04') {
            obj.kpiValue = [
              {
                code: '',
                name: kpi.keyword
              }
            ]
          } else if (kpi.firstKpi === '02' || kpi.firstKpi === '05') {
            obj.secondKpi.code = kpi.secondKpi
            if (
              this.kpiDictList[index].children &&
              Array.isArray(this.kpiDictList[index].children)
            ) {
              const target = this.kpiDictList[index].children.find(
                item => item.id === kpi.secondKpi
              )
              if (target) {
                obj.secondKpi.name = target.name
              }
            }

            obj.operator.code = kpi.operator
            const target = this.operaTypeList.find(
              item => item.dictCode === kpi.operator
            )
            if (target) {
              obj.operator.name = target.dictValue
            }

            obj.kpiValue = [
              {
                code: '',
                name: kpi.keyword
              }
            ]
          } else if (kpi.firstKpi === '03') {
            obj.kpiValue = kpi.kpiValue.map(item => {
              const object = {
                code: item,
                name: ''
              }
              if (
                this.kpiDictList[index].children &&
                Array.isArray(this.kpiDictList[index].children)
              ) {
                const target = this.kpiDictList[index].children.find(
                  child => child.id === item
                )
                if (target) {
                  object.name = target.name
                }
              }
              return object
            })
          }
        }

        return obj
      })
    },

    /**
     * 格式化数据
     */
    formatData(data) {
      const kpiSettings = {
        kpis: this.formatKpis(data.kpis)
      }

      const ruleBaseInfo = {
        infectiouTypeA: {
          code: '',
          name: ''
        },
        infectiouTypeB: {
          code: '',
          name: ''
        },
        ruleName: data.ruleName,
        syndromeType: {
          code: '',
          name: ''
        },
        warnType: {
          code: data.warnType,
          name: ''
        }
      }

      const target = this.warnTypeList.find(
        item => item.dictCode === data.warnType
      )
      if (target) {
        ruleBaseInfo.warnType.name = target.dictValue
      }

      if (data.warnType === '01') {
        // 症候群
        ruleBaseInfo.syndromeType.code = data.diseaseType
        const target = this.syndromeList.find(
          item => item.id === data.diseaseType
        )
        if (target) {
          ruleBaseInfo.syndromeType.name = target.name
        }
      } else if (data.warnType === '02') {
        // 传染病
        ruleBaseInfo.infectiouTypeA.code = data.diseaseType
        ruleBaseInfo.infectiouTypeB.code = data.diseaseTypeLeaf
        const index = this.infectiousDiseasesList.findIndex(
          item => item.id === data.diseaseType
        )
        if (index > -1) {
          ruleBaseInfo.infectiouTypeA.name = this.infectiousDiseasesList[
            index
          ].name
          if (
            this.infectiousDiseasesList[index].children &&
            Array.isArray(this.infectiousDiseasesList[index].children)
          ) {
            const target = this.infectiousDiseasesList[index].children.find(
              item => item.id === data.diseaseTypeLeaf
            )
            if (target) {
              ruleBaseInfo.infectiouTypeB.name = target.name
            }
          }
        }
      }

      const thresholdSettings = data.thresholds.map(item => {
        return {
          monitorScope: item.monitorScopeLeaf
            ? item.monitorScopeLeaf
            : item.monitorScope,
          monitorDays: item.monitorDays,
          warningLevel: item.warningLevel,
          warningThreshold: item.warningThreshold
        }
      })

      const field = {
        kpiSettings,
        ruleBaseInfo,
        thresholdSettings
      }
      return field
    },

    /**
     * 解析 kpis
     */
    parseKpis(kpis) {
      return kpis.map(kpi => {
        let obj = {}

        if (kpi.kpis) {
          obj = {
            condition: kpi.condition.code,
            kpis: this.parseKpis(kpi.kpis)
          }
        } else {
          obj = {
            condition: '',
            firstKpi: kpi.firstKpi.code,
            kpiValue: [],
            operator: '',
            secondKpi: '',
            keyword: ''
          }

          if (kpi.condition) {
            obj.condition = kpi.condition.code
          }

          if (kpi.firstKpi.code === '01' || kpi.firstKpi.code === '04') {
            obj.keyword = kpi.kpiValue[0].name
          } else if (kpi.firstKpi.code === '02' || kpi.firstKpi.code === '05') {
            obj.operator = kpi.operator.code
            obj.secondKpi = kpi.secondKpi.code
            obj.keyword = kpi.kpiValue[0].name
          } else if (kpi.firstKpi.code === '03') {
            obj.kpiValue = kpi.kpiValue.map(item => item.code)
          }
        }

        return obj
      })
    },

    /**
     * 解析数据
     */
    parseData(ruleDetail) {
      let data = {}
      if (ruleDetail.ruleJson) {
        data = ruleDetail.ruleJson
      } else if (ruleDetail.kpiJson) {
        data = ruleDetail.kpiJson
      }

      const formData = {
        ruleName: data.ruleBaseInfo.ruleName,
        warnType: data.ruleBaseInfo.warnType.code,
        diseaseType: '',
        diseaseTypeLeaf: ''
      }

      if (data.ruleBaseInfo.syndromeType.code) {
        formData.diseaseType = data.ruleBaseInfo.syndromeType.code
      } else {
        formData.diseaseType = data.ruleBaseInfo.infectiouTypeA.code
        formData.diseaseTypeLeaf = data.ruleBaseInfo.infectiouTypeB.code
      }

      formData.kpis = this.parseKpis(data.kpiSettings.kpis)

      formData.thresholds = data.thresholdSettings.map(item => {
        const obj = {
          monitorScope: item.monitorScope,
          monitorScopeLeaf: '',
          warningLevel: item.warningLevel,
          monitorDays: item.monitorDays,
          warningThreshold: item.warningThreshold
        }

        if (item.monitorScope.indexOf('.') > -1) {
          const [monitorScope, monitorScopeLeaf] = item.monitorScope.split('.')
          obj.monitorScope = monitorScope
          obj.monitorScopeLeaf = monitorScopeLeaf
        }

        return obj
      })

      return formData
    },

    /**
     * 弹窗打开
     */
    handleOpen() {
      this.$emit('open')
    },

    /**
     * 弹窗确认
     */
    handleConfirm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const field = this.formatData(this.formData)
          if (this.mode === 'edit') {
            field.id = this.ruleDetail.id
          }
          // console.log('field', field)
          this.$emit('confirm', field)
        }
      })
    },

    /**
     * 弹窗关闭
     */
    handleCancel() {
      this.$emit('update:visible', false)
    },

    /**
     * 弹窗关闭后
     */
    handleClosed() {
      this.formData = cloneDeep(initFormData)
      this.$refs.form.resetFields()
      this.$emit('closed')
    }
  }
}
</script>

<style lang="scss" scoped>
.form-block__header {
  margin-bottom: 18px;
}

.form-block__title {
  float: left;
  text-align: left;
  font-size: 16px;
  font-weight: 600;
  color: #3a3a3d;
}

.custom-flex {
  display: flex;
  align-items: center;
}

.custom-border:not(:first-child) {
  margin-top: 18px;
}

.custom-border:not(:last-child) {
  border-bottom: 1px dashed #e3e5e8;
}
</style>
