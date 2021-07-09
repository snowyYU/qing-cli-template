<template>
  <BaseDialog
    :visible="visible"
    :title="title"
    :config="config"
    @open="handleOpen"
    @confirm="handleConfirm"
    @cancel="handleClose"
    @close="handleClose"
    @closed="handleClosed"
  >
    <template #body>
      <SchemaForm
        class="case-info-form"
        :schema="formSchema"
        :model.sync="formData"
        ref="configForm"
        @input="handleInput"
        @registerProvinceCode-change="
          handleChange('registerProvinceCode', $event)
        "
        @registerCityCode-change="handleChange('registerCityCode', $event)"
        @registerCountyCode-change="handleChange('registerCountyCode', $event)"
        @registerStreetCode-change="handleChange('registerStreetCode', $event)"
        @caseProvinceCode-change="handleChange('caseProvinceCode', $event)"
        @caseCityCode-change="handleChange('caseCityCode', $event)"
        @caseCountyCode-change="handleChange('caseCountyCode', $event)"
        @caseStreetCode-change="handleChange('caseStreetCode', $event)"
        @sexCode-change="handleChange('sexCode', $event)"
        @occupation-change="handleChange('occupation', $event)"
        @c-change="handleChange('c', $event)"
        @visible-change="handleVisibleChange"
      />
    </template>
  </BaseDialog>
</template>

<script>
import BaseDialog from '@/components/BaseDialog'
import SchemaForm from '@/components/ConfigForm'

import {
  caseInfoFormSchema as formSchema,
  caseInfoFormData as initFormData
} from './formConfig'

import {
  queryDictInfoByCategory,
  getRegion,
  idNumberInfo,
  getInfectiousTypeInfo
} from '@/api/common'

import { updateDict } from '@/utils'

import isEmpty from 'lodash/isEmpty'
import debounce from 'lodash/debounce'

const dynamicKeys = [
  'registerCityCode',
  'registerCountyCode',
  'registerStreetCode',
  'caseCityCode',
  'caseCountyCode',
  'caseStreetCode'
]

export default {
  name: 'CaseInfoDialog',
  components: {
    BaseDialog,
    SchemaForm
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
    config: {
      type: Object,
      default: () => {}
    },
    mode: {
      type: String,
      default: ''
    },
    caseInfoData: {
      type: Object,
      default: () => {}
    },
    caseDialogAllInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    this.lastRequestId = 0
    this.handleInput = debounce(this.handleInput, 800)

    return {
      formSchema,
      formData: {
        ...initFormData
      },
      infectiousTypeList: []
    }
  },
  computed: {
    formSchemaPropertiesMap() {
      const obj = {}
      this.formSchema.properties.forEach((item, index) => {
        obj[item.key] = index
      })
      return obj
    }
  },
  watch: {
    caseInfoData(val) {
      if (!isEmpty(val)) {
        this.formatData(val)
      }
    },
    caseDialogAllInfo(val) {
      if (!isEmpty(val)) {
        if (!isEmpty(val.caseInfo)) {
          this.formatData(val.caseInfo)
        }

        if (
          !isEmpty(val.diagnosisInfo) &&
          val.diagnosisInfo.visitInfos &&
          Array.isEmpty(val.diagnosisInfo.visitInfos) &&
          val.diagnosisInfo.visitInfos[0]
        ) {
          const {
            visitOrgName,
            visitDate,
            inhospFlag
          } = val.diagnosisInfo.visitInfos[0]
          this.formData.visitOrgName = visitOrgName
          this.formData.visitDate = visitDate
          this.formData.visitType = inhospFlag
        }
      }
    }
  },
  methods: {
    formatData(data) {
      const fields = {}
      Object.keys(this.formData).forEach(key => {
        if (typeof data[key] !== 'undefined' && data[key] !== null) {
          fields[key] = data[key]
        } else {
          fields[key] = initFormData[key]
        }
      })

      if (data.registerCityCode && data.registerCityName) {
        this.formSchema.properties[
          this.formSchemaPropertiesMap['registerCityCode']
        ].options = [
          {
            regionCode: data.registerCityCode,
            regionName: data.registerCityName
          }
        ]
      }
      if (data.registerCountyCode && data.registerCountyName) {
        this.formSchema.properties[
          this.formSchemaPropertiesMap['registerCountyCode']
        ].options = [
          {
            regionCode: data.registerCountyCode,
            regionName: data.registerCountyName
          }
        ]
      }
      if (data.registerStreetCode && data.registerStreetName) {
        this.formSchema.properties[
          this.formSchemaPropertiesMap['registerStreetCode']
        ].options = [
          {
            regionCode: data.registerStreetCode,
            regionName: data.registerStreetName
          }
        ]
      }
      if (data.caseCityCode && data.caseCityName) {
        this.formSchema.properties[
          this.formSchemaPropertiesMap['caseCityCode']
        ].options = [
          {
            regionCode: data.caseCityCode,
            regionName: data.caseCityName
          }
        ]
      }
      if (data.caseCountyCode && data.caseCountyName) {
        this.formSchema.properties[
          this.formSchemaPropertiesMap['caseCountyCode']
        ].options = [
          {
            regionCode: data.caseCountyCode,
            regionName: data.caseCountyName
          }
        ]
      }
      if (data.caseStreetCode && data.caseStreetName) {
        this.formSchema.properties[
          this.formSchemaPropertiesMap['caseStreetCode']
        ].options = [
          {
            regionCode: data.caseStreetCode,
            regionName: data.caseStreetName
          }
        ]
      }
      if (data.diseaseCode && this.infectiousTypeList.length > 0) {
        outside: for (let i = 0; i < this.infectiousTypeList.length; i++) {
          const target = this.infectiousTypeList[i]
          if (target.children && Array.isArray(target.children)) {
            for (let j = 0; j < target.children.length; j++) {
              const item = target.children[j]
              if (item.id === data.diseaseCode) {
                this.formData.c = target.id
                this.formSchema.properties[
                  this.formSchemaPropertiesMap['diseaseCode']
                ].options = target.children
                break outside
              }
            }
          }
        }
      }

      this.formData = fields
    },

    /**
     * 获取字典
     * @param {string} key
     * @param {function} callback
     */
    queryDictInfoByCategory(key, callback) {
      const params = { dictKey: key }
      queryDictInfoByCategory(params).then(res => {
        callback && callback(res.data)
      })
    },

    /**
     * 获取省市区
     * @param {number} code
     * @param {function} callback
     */
    getRegion(code, callback, fn) {
      const params = {}
      if (code) {
        params.parentCode = code
      }
      getRegion(params)
        .then(res => {
          callback && callback(res.data)
        })
        .finally(() => {
          fn && fn()
        })
    },

    /**
     * 查询传染病字典树
     * @param {function} callback
     */
    getInfectiousTypeInfo(callback) {
      getInfectiousTypeInfo().then(res => {
        callback && callback(res.data)
      })
    },

    /**
     * 初始化表单
     */
    initForm() {
      // 获取省份列表
      this.getRegion('', res => {
        this.formSchema.properties.forEach((item, index) => {
          if (
            item.key === 'registerProvinceCode' ||
            item.key === 'caseProvinceCode'
          ) {
            this.formSchema.properties[index].options = res || []
          }
        })
      })

      // 获取性别字典
      this.queryDictInfoByCategory('sex', res => {
        updateDict.call(this, this.formSchema.properties, 'sexCode', res || [])
      })

      // 获取职业字典
      this.queryDictInfoByCategory('staff', res => {
        updateDict.call(
          this,
          this.formSchema.properties,
          'occupation',
          res || []
        )
      })

      // 获取证件类型字典
      this.queryDictInfoByCategory('certType', res => {
        updateDict.call(this, this.formSchema.properties, 'certType', res || [])
      })

      // 获取户籍所在地字典
      this.queryDictInfoByCategory('locationType', res => {
        updateDict.call(
          this,
          this.formSchema.properties,
          'registerType',
          res || []
        )
      })

      // 获取年龄类型字典
      this.queryDictInfoByCategory('dimension', res => {
        updateDict.call(
          this,
          this.formSchema.properties,
          'ageDimension',
          res || []
        )
      })

      // 查询传染病字典树
      this.getInfectiousTypeInfo(res => {
        updateDict.call(this, this.formSchema.properties, 'c', res)
        this.infectiousTypeList = res

        if (this.formData.diseaseCode) {
          outside: for (let i = 0; i < this.infectiousTypeList.length; i++) {
            const target = this.infectiousTypeList[i]
            if (target.children && Array.isArray(target.children)) {
              for (let j = 0; j < target.children.length; j++) {
                const item = target.children[j]
                if (item.id === this.formData.diseaseCode) {
                  this.formData.c = target.id
                  this.formSchema.properties[
                    this.formSchemaPropertiesMap['diseaseCode']
                  ].options = target.children
                  break outside
                }
              }
            }
          }
        }
      })
    },

    /**
     * 输入事件
     * @param {*} value
     */
    handleInput(key, value) {
      if (key !== 'certNo' || !value || this.formData.certType !== '01') {
        return
      }

      this.lastRequestId += 1
      const requestId = this.lastRequestId
      const params = { idNumber: value }
      idNumberInfo(params).then(res => {
        if (requestId !== this.lastRequestId) {
          return
        }
        // console.log(res)
        const { birthDate, sexCode } = res.data
        this.formData.birthDate = birthDate
        this.formData.sexCode = sexCode

        const target = this.formSchema.properties[
          this.formSchemaPropertiesMap['sexCode']
        ].options.find(item => item.dictCode === sexCode)
        if (target) {
          this.formData.sexCodeName = target.dictValue
        }
      })
    },

    /**
     * 下拉框选中值发生变化时触发
     * @param {string} key
     * @param {*} value
     */
    handleChange(key, value) {
      let currentIndex = -1
      switch (key) {
        case 'registerProvinceCode':
          this.formSchema.properties.forEach((item, index) => {
            if (item.key === 'registerProvinceCode') {
              if (value) {
                const target = this.formSchema.properties[index].options.find(
                  item => item.regionCode === value
                )
                if (target) {
                  this.formData.registerProvinceName = target.regionName
                }
              } else {
                this.formData.registerProvinceName = ''
              }
            } else if (item.key === 'registerCityCode') {
              currentIndex = index
            } else if (
              item.key === 'registerCountyCode' ||
              item.key === 'registerStreetCode'
            ) {
              this.formSchema.properties[index].options = []
            }
          })

          if (currentIndex > -1) {
            if (value) {
              this.formSchema.properties[currentIndex].loading = true
              this.getRegion(
                value,
                res => {
                  this.formSchema.properties[currentIndex].options = res
                },
                () => {
                  this.formSchema.properties[currentIndex].loading = false
                }
              )
            } else {
              this.formSchema.properties[currentIndex].options = []
            }
          }

          this.formData.registerCityCode = ''
          this.formData.registerCountyCode = ''
          this.formData.registerStreetCode = ''
          break
        case 'registerCityCode':
          this.formSchema.properties.forEach((item, index) => {
            if (item.key === 'registerCityCode') {
              if (value) {
                const target = this.formSchema.properties[index].options.find(
                  item => item.regionCode === value
                )
                if (target) {
                  this.formData.registerCityName = target.regionName
                }
              } else {
                this.formData.registerCityName = ''
              }
            } else if (item.key === 'registerCountyCode') {
              currentIndex = index
            } else if (item.key === 'registerStreetCode') {
              this.formSchema.properties[index].options = []
            }
          })

          if (currentIndex > -1) {
            if (value) {
              this.formSchema.properties[currentIndex].loading = true
              this.getRegion(
                value,
                res => {
                  this.formSchema.properties[currentIndex].options = res
                },
                () => {
                  this.formSchema.properties[currentIndex].loading = false
                }
              )
            } else {
              this.formSchema.properties[currentIndex].options = []
            }
          }

          this.formData.registerCountyCode = ''
          this.formData.registerStreetCode = ''
          break
        case 'registerCountyCode':
          this.formSchema.properties.forEach((item, index) => {
            if (item.key === 'registerCountyCode') {
              if (value) {
                const target = this.formSchema.properties[index].options.find(
                  item => item.regionCode === value
                )
                if (target) {
                  this.formData.registerCountyName = target.regionName
                }
              } else {
                this.formData.registerCountyName = ''
              }
            } else if (item.key === 'registerStreetCode') {
              currentIndex = index
            }
          })

          if (currentIndex > -1) {
            if (value) {
              this.formSchema.properties[currentIndex].loading = true
              this.getRegion(
                value,
                res => {
                  this.formSchema.properties[currentIndex].options = res
                },
                () => {
                  this.formSchema.properties[currentIndex].loading = false
                }
              )
            } else {
              this.formSchema.properties[currentIndex].options = []
            }
          }

          this.formData.registerStreetCode = ''
          break
        case 'registerStreetCode':
          for (let i = 0; i < this.formSchema.properties.length; i++) {
            const item = this.formSchema.properties[i]
            if (item.key === 'registerStreetCode') {
              if (value) {
                const target = item.options.find(
                  item => item.regionCode === value
                )
                if (target) {
                  this.formData.registerStreetName = target.regionName
                }
              } else {
                this.formData.registerStreetName = ''
              }
              break
            }
          }
          break
        case 'caseProvinceCode':
          this.formSchema.properties.forEach((item, index) => {
            if (item.key === 'caseProvinceCode') {
              if (value) {
                const target = this.formSchema.properties[index].options.find(
                  item => item.regionCode === value
                )
                if (target) {
                  this.formData.caseProvinceName = target.regionName
                }
              } else {
                this.formData.caseProvinceName = ''
              }
            } else if (item.key === 'caseCityCode') {
              currentIndex = index
            } else if (
              item.key === 'caseCountyCode' ||
              item.key === 'caseStreetCode'
            ) {
              this.formSchema.properties[index].options = []
            }
          })

          if (currentIndex > -1) {
            if (value) {
              this.formSchema.properties[currentIndex].loading = true
              this.getRegion(
                value,
                res => {
                  this.formSchema.properties[currentIndex].options = res
                },
                () => {
                  this.formSchema.properties[currentIndex].loading = false
                }
              )
            } else {
              this.formSchema.properties[currentIndex].options = []
            }
          }

          this.formData.caseCityCode = ''
          this.formData.caseCountyCode = ''
          this.formData.caseStreetCode = ''
          break
        case 'caseCityCode':
          this.formSchema.properties.forEach((item, index) => {
            if (item.key === 'caseCityCode') {
              if (value) {
                const target = this.formSchema.properties[index].options.find(
                  item => item.regionCode === value
                )
                if (target) {
                  this.formData.caseCityName = target.regionName
                }
              } else {
                this.formData.caseCityName = ''
              }
            } else if (item.key === 'caseCountyCode') {
              currentIndex = index
            } else if (item.key === 'caseStreetCode') {
              this.formSchema.properties[index].options = []
            }
          })

          if (currentIndex > -1) {
            if (value) {
              this.formSchema.properties[currentIndex].loading = true
              this.getRegion(
                value,
                res => {
                  this.formSchema.properties[currentIndex].options = res
                },
                () => {
                  this.formSchema.properties[currentIndex].loading = false
                }
              )
            } else {
              this.formSchema.properties[currentIndex].options = []
            }
          }

          this.formData.caseCountyCode = ''
          this.formData.caseStreetCode = ''
          break
        case 'caseCountyCode':
          this.formSchema.properties.forEach((item, index) => {
            if (item.key === 'caseCountyCode') {
              if (value) {
                const target = this.formSchema.properties[index].options.find(
                  item => item.regionCode === value
                )
                if (target) {
                  this.formData.caseCountyName = target.regionName
                }
              } else {
                this.formData.caseCountyName = ''
              }
            } else if (item.key === 'caseStreetCode') {
              currentIndex = index
            }
          })

          if (currentIndex > -1) {
            if (value) {
              this.formSchema.properties[currentIndex].loading = true
              this.getRegion(
                value,
                res => {
                  this.formSchema.properties[currentIndex].options = res
                },
                () => {
                  this.formSchema.properties[currentIndex].loading = false
                }
              )
            } else {
              this.formSchema.properties[currentIndex].options = []
            }
          }

          this.formData.caseStreetCode = ''
          break
        case 'caseStreetCode':
          for (let i = 0; i < this.formSchema.properties.length; i++) {
            const item = this.formSchema.properties[i]
            if (item.key === 'caseStreetCode') {
              if (value) {
                const target = item.options.find(
                  item => item.regionCode === value
                )
                if (target) {
                  this.formData.caseStreetName = target.regionName
                }
              } else {
                this.formData.caseStreetCode = ''
              }
              break
            }
          }
          break
        case 'sexCode':
          if (value) {
            const target = this.formSchema.properties[
              this.formSchemaPropertiesMap['sexCode']
            ].options.find(item => item.dictCode === value)
            if (target) {
              this.formData.sexCodeName = target.dictValue
            }
          } else {
            this.formData.sexCodeName = ''
          }
          break
        case 'occupation':
          if (value) {
            const target = this.formSchema.properties[
              this.formSchemaPropertiesMap['occupation']
            ].options.find(item => item.dictCode === value)
            if (target) {
              this.formData.occupationName = target.dictValue
            }
          } else {
            this.formData.occupationName = ''
          }
          break
        case 'c':
          if (value) {
            const target = this.infectiousTypeList.find(
              item => item.id === value
            )
            if (target.children && Array.isArray(target.children)) {
              this.formSchema.properties[
                this.formSchemaPropertiesMap['diseaseCode']
              ].options = target.children
            }
          } else {
            this.formSchema.properties[
              this.formSchemaPropertiesMap['diseaseCode']
            ].options = []
            this.formData.diseaseCode = ''
          }
          break
      }
    },

    /**
     * 下拉框出现/隐藏时触发
     * 用于编辑模式动态获取下拉框字典数组，减少初始请求数
     * @param {string} key
     * @param {boolean} value
     */
    handleVisibleChange(key, value) {
      if (value && !isEmpty(this.caseInfoData)) {
        // 只关注下拉框出现的情况和编辑模式
        if (dynamicKeys.includes(key)) {
          // dynamicKeys 用于维护需要动态获取字典的下拉框，且只关注需要维护的字段
          const index = this.formSchema.properties.findIndex(
            item => item.key === key
          )
          if (index > -1) {
            const target = this.formSchema.properties[index]
            if (
              target.options &&
              Array.isArray(target.options) &&
              target.options.length < 2
            ) {
              // 找到下拉框选项数组，判断是否为空，只关注为空的情况
              switch (key) {
                // 户籍地址
                case 'registerCityCode':
                  // 市
                  if (this.formData.registerProvinceCode) {
                    // 判断上级 code 是否存在
                    this.formSchema.properties[index].loading = true
                    this.getRegion(
                      this.formData.registerProvinceCode,
                      res => {
                        this.formSchema.properties[index].options = res
                      },
                      () => {
                        this.formSchema.properties[index].loading = false
                      }
                    )
                  }
                  break
                case 'registerCountyCode':
                  // 区
                  if (this.formData.registerCityCode) {
                    this.formSchema.properties[index].loading = true
                    this.getRegion(
                      this.formData.registerCityCode,
                      res => {
                        this.formSchema.properties[index].options = res
                      },
                      () => {
                        this.formSchema.properties[index].loading = false
                      }
                    )
                  }
                  break
                case 'registerStreetCode':
                  // 街道
                  if (this.formData.registerCountyCode) {
                    this.formSchema.properties[index].loading = true
                    this.getRegion(
                      this.formData.registerCountyCode,
                      res => {
                        this.formSchema.properties[index].options = res
                      },
                      () => {
                        this.formSchema.properties[index].loading = false
                      }
                    )
                  }
                  break
                // 现住址省
                case 'caseCityCode':
                  // 市
                  if (this.formData.caseProvinceCode) {
                    // 判断上级 code 是否存在
                    this.formSchema.properties[index].loading = true
                    this.getRegion(
                      this.formData.caseProvinceCode,
                      res => {
                        this.formSchema.properties[index].options = res
                      },
                      () => {
                        this.formSchema.properties[index].loading = false
                      }
                    )
                  }
                  break
                case 'caseCountyCode':
                  // 区
                  if (this.formData.caseCityCode) {
                    this.formSchema.properties[index].loading = true
                    this.getRegion(
                      this.formData.caseCityCode,
                      res => {
                        this.formSchema.properties[index].options = res
                      },
                      () => {
                        this.formSchema.properties[index].loading = false
                      }
                    )
                  }
                  break
                case 'caseStreetCode':
                  // 街道
                  if (this.formData.caseCountyCode) {
                    this.formSchema.properties[index].loading = true
                    this.getRegion(
                      this.formData.caseCountyCode,
                      res => {
                        this.formSchema.properties[index].options = res
                      },
                      () => {
                        this.formSchema.properties[index].loading = false
                      }
                    )
                  }
                  break
                default:
                  break
              }
            }
          }
        }
      }
    },

    /**
     * 弹窗打开事件
     */
    handleOpen() {
      this.initForm()
      if (this.mode === 'view') {
        this.formSchema.formStyle.disabled = true
      }
    },

    /**
     * 弹窗确认事件
     */
    handleConfirm() {
      const result = this.$refs.configForm.validateForm()
      if (result) {
        const fields = { ...this.formData }
        this.$emit('confirm', fields)
      }
    },

    /**
     * 弹窗关闭事件
     */
    handleClose() {
      this.$emit('update:visible', false)
    },

    /**
     * 弹窗关闭后事件
     */
    handleClosed() {
      this.formSchema.properties.forEach((item, index) => {
        if (dynamicKeys.includes(item.key)) {
          this.formSchema.properties[index].options = []
        }
      })
      this.formSchema.properties[
        this.formSchemaPropertiesMap['diseaseCode']
      ].options = []
      this.formSchema.formStyle.disabled = false
      this.formData = { ...initFormData }
      this.$refs.configForm.clearValidate()
    }
  }
}
</script>

<style lang="scss" scoped>
.case-info-form {
  &::v-deep {
    .el-radio:not(:last-child) {
      margin-right: 16px;
    }
  }
}
</style>
