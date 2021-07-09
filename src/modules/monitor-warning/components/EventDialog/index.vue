<template>
  <BaseDialog
    :visible="visible"
    :title="title"
    :config="config"
    @confirm="handleConfirm"
    @cancel="handleClose"
    @close="handleClose"
    @closed="handleClosed"
  >
    <template #body>
      <!-- <SchemaForm
        :schema="formSchema"
        :model.sync="formData"
        ref="configForm"
      /> -->
      <SchemaForm
        :schema="formSchema"
        :model.sync="formData"
        ref="configForm"
        @eventProvinceCode-change="changeLocationOption('province', $event)"
        @eventCityCode-change="changeLocationOption('city', $event)"
        @eventCountyCode-change="changeLocationOption('county', $event)"
        @eventStreetCode-change="changeLocationOption('street', $event)"
      >
        <template #chooseLngLatBtn>
          <el-button type="primary" @click="handleOpenMap"
            >选择经纬度</el-button
          >
        </template>
      </SchemaForm>
    </template>
  </BaseDialog>
</template>

<script>
import BaseDialog from '@/components/BaseDialog'
import SchemaForm from '@/components/ConfigForm'
import {
  eventFormSchema as formSchema,
  eventFormData as initFormData
} from './formConfig'
import { getRegion, queryDictInfoByCategory } from '@/api/common'
import { queryEventPlaceTree } from '../../api'
import { updateDict } from '@/utils'

// const initFormData = {
//   eventName: '',
//   eventCategory: ''
// }

function getNameByCode(arr, key, code) {
  const target = arr.find(item => item.key === key)
  if (target) {
    const region = target.find(region => region.regionCode === code)
    if (region) {
      return region.regionName
    }
  }
  return ''
}

export default {
  name: 'EventDialog',
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
      default() {
        return {}
      }
    },
    warningLevelList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      // formSchema: {
      //   formStyle: {
      //     size: 'small',
      //     labelWidth: '150px',
      //     justify: 'center',
      //     btns: []
      //   },
      //   properties: [
      //     {
      //       type: 'input',
      //       label: '事件名称',
      //       key: 'eventName',
      //       required: true,
      //       span: 8,
      //       labelWidth: '140px'
      //     },
      //     {
      //       type: 'select',
      //       label: '事件类别',
      //       key: 'eventCategory',
      //       required: true,
      //       clearable: true,
      //       options: [],
      //       props: {
      //         label: '',
      //         value: ''
      //       },
      //       span: 5,
      //       labelWidth: '140px'
      //     },
      //     {
      //       type: 'select',
      //       label: '',
      //       key: 'c',
      //       required: true,
      //       clearable: true,
      //       options: [],
      //       props: {
      //         label: '',
      //         value: ''
      //       },
      //       span: 3,
      //       labelWidth: '10px'
      //     },
      //     {
      //       type: 'select',
      //       label: '事件级别',
      //       key: 'd',
      //       required: true,
      //       clearable: true,
      //       options: [],
      //       props: {
      //         label: '',
      //         value: ''
      //       },
      //       span: 8,
      //       labelWidth: '140px'
      //     },
      //     {
      //       type: 'select',
      //       label: '事件来源',
      //       key: 'e',
      //       required: true,
      //       clearable: true,
      //       options: [],
      //       props: {
      //         label: '',
      //         value: ''
      //       },
      //       span: 8,
      //       labelWidth: '140px'
      //     },
      //     {
      //       type: 'input',
      //       label: '报告人',
      //       key: 'f',
      //       span: 8,
      //       labelWidth: '140px'
      //     },
      //     {
      //       type: 'input',
      //       label: '联系电话',
      //       key: 'g',
      //       span: 8,
      //       labelWidth: '140px'
      //     },
      //     {
      //       type: 'input',
      //       label: '报告单位',
      //       key: 'h',
      //       span: 8,
      //       labelWidth: '140px'
      //     },
      //     {
      //       type: 'datePicker',
      //       label: '接到报告时间',
      //       key: 'i',
      //       span: 8,
      //       labelWidth: '140px'
      //     },
      //     {
      //       type: 'select',
      //       label: '事发场所',
      //       key: 'j',
      //       required: true,
      //       clearable: true,
      //       options: [],
      //       props: {
      //         label: '',
      //         value: ''
      //       },
      //       span: 8,
      //       labelWidth: '140px'
      //     },
      //     {
      //       type: 'select',
      //       label: '事发地区',
      //       key: 'k',
      //       required: true,
      //       clearable: true,
      //       options: [],
      //       props: {
      //         label: '',
      //         value: ''
      //       },
      //       span: 7,
      //       labelWidth: '140px'
      //     },
      //     {
      //       type: 'select',
      //       label: '',
      //       key: 'l',
      //       required: true,
      //       clearable: true,
      //       options: [],
      //       props: {
      //         label: '',
      //         value: ''
      //       },
      //       span: 3,
      //       labelWidth: '10px'
      //     },
      //     {
      //       type: 'select',
      //       label: '',
      //       key: 'm',
      //       required: true,
      //       clearable: true,
      //       options: [],
      //       props: {
      //         label: '',
      //         value: ''
      //       },
      //       span: 3,
      //       labelWidth: '10px'
      //     },
      //     {
      //       type: 'select',
      //       label: '',
      //       key: 'n',
      //       required: true,
      //       clearable: true,
      //       options: [],
      //       props: {
      //         label: '',
      //         value: ''
      //       },
      //       span: 3,
      //       labelWidth: '10px'
      //     },
      //     {
      //       type: 'input',
      //       label: '详细地址',
      //       key: 'o',
      //       span: 8,
      //       labelWidth: '140px'
      //     },
      //     {
      //       type: 'input',
      //       label: '经度',
      //       key: 'p',
      //       span: 8,
      //       labelWidth: '140px'
      //     },
      //     {
      //       type: 'input',
      //       label: '纬度',
      //       key: 'q',
      //       span: 8,
      //       labelWidth: '140px'
      //     },
      //     {
      //       type: 'custom',
      //       label: '',
      //       key: 'r',
      //       span: 8,
      //       labelWidth: '140px'
      //     },
      //     {
      //       type: 'input',
      //       label: '事件波及地区范围',
      //       key: 's',
      //       span: 24,
      //       labelWidth: '140px'
      //     },
      //     {
      //       type: 'input',
      //       label: '涉及或暴露人数',
      //       key: 't',
      //       span: 8,
      //       labelWidth: '140px'
      //     },
      //     {
      //       type: 'input',
      //       label: '发病人数',
      //       key: 'u',
      //       span: 8,
      //       labelWidth: '140px'
      //     },
      //     {
      //       type: 'input',
      //       label: '死亡人数',
      //       key: 'v',
      //       span: 8,
      //       labelWidth: '140px'
      //     },
      //     {
      //       type: 'datePicker',
      //       label: '事发时间',
      //       key: 'w',
      //       span: 8,
      //       labelWidth: '140px'
      //     },
      //     {
      //       type: 'datePicker',
      //       label: '初步核实时间',
      //       key: 'x',
      //       span: 8,
      //       labelWidth: '140px'
      //     },
      //     {
      //       type: 'datePicker',
      //       label: '首例病人发病时间',
      //       key: 'y',
      //       span: 8,
      //       labelWidth: '140px'
      //     }
      //   ],
      //   propertiesOrder: []
      // },
      // formData: {
      //   ...initFormData,
      // },
      formSchema,
      formData: {
        ...initFormData
      }
    }
  },
  watch: {
    warningLevelList(val) {
      if (val && Array.isArray(val)) {
        updateDict.call(this, this.formSchema.properties, 'eventLevel', val)
      }
    }
  },
  methods: {
    /**
     * 获取省市区
     */
    getRegion(code = '', callback) {
      const params = { parentCode: code }
      getRegion(params).then(res => {
        callback && callback(res.data)
      })
    },

    /**
     * 根据分类查询所有字典信息
     */
    queryDictInfoByCategory(type, callback) {
      const params = { dictKey: type }
      queryDictInfoByCategory(params).then(res => {
        callback && callback(res.data)
      })
    },

    /**
     * 获取事件场所字典树
     */
    queryEventPlaceTree() {
      queryEventPlaceTree().then(res => {
        updateDict.call(
          this,
          this.formSchema.properties,
          'eventPlace',
          res.data
        )
      })
    },

    /**
     * 弹窗确认事件
     */
    handleConfirm() {
      const result = this.$refs.configForm.validateForm()
      if (result) {
        const fields = {
          ...this.formData
        }
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
      this.formData = {
        ...initFormData
      }
      this.$emit('closed')
    },

    // 改变form表单的省市区下拉选项
    changeLocationOption(key, val) {
      switch (key) {
        case 'province':
          this.getRegion(val, res => {
            updateDict.call(
              this,
              this.formSchema.properties,
              'eventCityCode',
              res
            )
          })
          updateDict.call(
            this,
            this.formSchema.properties,
            'eventCountyCode',
            []
          )
          updateDict.call(
            this,
            this.formSchema.properties,
            'eventStreetCode',
            []
          )

          this.formData.eventCityCode = ''
          this.formData.eventCountyCode = ''
          this.formData.eventStreetCode = ''

          this.formData.eventProvinceName = getNameByCode(
            this.formSchema.properties,
            'eventProvinceCode',
            val
          )
          break
        case 'city':
          this.getRegion(val, res => {
            updateDict.call(
              this,
              this.formSchema.properties,
              'eventCountyCode',
              res
            )
          })
          updateDict.call(
            this,
            this.formSchema.properties,
            'eventStreetCode',
            []
          )

          this.formData.eventCountyCode = ''
          this.formData.eventStreetCode = ''

          this.formData.eventCityName = getNameByCode(
            this.formSchema.properties,
            'eventCityCode',
            val
          )
          break
        case 'county':
          this.getRegion(val, res => {
            updateDict.call(
              this,
              this.formSchema.properties,
              'eventStreetCode',
              res
            )
          })

          this.formData.eventStreetCode = ''

          this.formData.eventCountyName = getNameByCode(
            this.formSchema.properties,
            'eventCountyCode',
            val
          )
          break
        case 'street':
          this.formData.eventStreetName = getNameByCode(
            this.formSchema.properties,
            'eventStreetCode',
            val
          )
          break
      }
    },
    handleOpenMap() {
      const lnglat = {
        lng: this.formData.lng,
        lat: this.formData.lat
      }
      this.$emit('open-new-dialog', 'map-edit', { lnglat }, 'event')
    }
  },
  mounted() {
    this.queryDictInfoByCategory('eventCategory', res => {
      updateDict.call(this, this.formSchema.properties, 'eventCategory', res)
    })

    this.queryDictInfoByCategory('eventSource', res => {
      updateDict.call(this, this.formSchema.properties, 'eventSource', res)
    })

    this.queryEventPlaceTree()

    this.getRegion('', res => {
      updateDict.call(
        this,
        this.formSchema.properties,
        'eventProvinceCode',
        res
      )
    })
  }
}
</script>

<style lang="scss" scoped></style>
