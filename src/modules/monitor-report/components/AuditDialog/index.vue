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
        :schema="dynamicFormSchema"
        :model.sync="formData"
        ref="configForm"
        @warningStatus-change="handleFormChange('warningStatus', $event)"
      >
        <template #feedback>
          <div>
            <div v-for="item in feedback" :key="item.id">
              <div>{{ item.taskName }}</div>
              <div>{{ item.feedbackContent }}</div>
            </div>
          </div>
        </template>
      </SchemaForm>
    </template>
  </BaseDialog>
</template>

<script>
import BaseDialog from '@/components/BaseDialog'
import SchemaForm from '@/components/ConfigForm'
import { formSchema, formData as initFormData } from './formConfig'
import isEmpty from 'lodash/isEmpty'
import { queryHomePageEvent } from '../../api'

export default {
  name: 'AuditDialog',
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
    warningStatusList: {
      type: Array,
      default: () => []
    },
    auditDetail: {
      type: Object,
      default: () => {}
    },
    feedback: {
      type: Array,
      default: () => []
    },
    auditResultList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      formSchema,
      formData: {
        ...initFormData
      }
    }
  },
  computed: {
    filterWarningStatusList() {
      return this.warningStatusList.filter(item =>
        ['03', '04'].includes(item.dictCode)
      )
    },

    dynamicFormSchema() {
      // const properties = [
      //   {
      //     type: 'select',
      //     label: '审核结果',
      //     key: 'warningStatus',
      //     required: true,
      //     clearable: true,
      //     options: this.filterWarningStatusList,
      //     props: {
      //       label: 'dictValue',
      //       value: 'dictCode'
      //     },
      //     span: 24,
      //     labelWidth: '100px'
      //   }
      // ]

      // if (this.formData.warningStatus === '04') {
      //   // 调查中
      //   properties.push({
      //     type: 'textarea',
      //     label: '原因',
      //     key: 'notPassExplain',
      //     required: true,
      //     span: 24,
      //     labelWidth: '100px'
      //   })
      // }

      // if (this.auditDetail.warningStatus === '02') {
      //   // 审核未通过
      //   properties.unshift({
      //     type: 'custom',
      //     label: '任务反馈',
      //     key: 'feedback',
      //     span: 24,
      //     labelWidth: '100px'
      //   })
      // }

      // const dynamicFormSchema = {
      //   formStyle: {
      //     size: 'small',
      //     labelWidth: '150px',
      //     justify: 'center',
      //     btns: []
      //   },
      //   properties,
      //   propertiesOrder: []
      // }

      // 01: 待核实, 02: 调查中, 03: 审核通过, 04: 审核未通过
      let properties = []
      let filterKeys = []

      switch (this.formData.warningStatus) {
        case '01':
          // 关联事件
          filterKeys.push('notPassExplain')
          break
        case '02':
          // 生成事件
          filterKeys = filterKeys.concat(['notPassExplain', 'eventId'])
          break
        case '03':
          // 审核未通过
          filterKeys.push('eventId')
          break
        default:
          filterKeys = filterKeys.concat(['notPassExplain', 'eventId'])
          break
      }

      if (this.auditDetail.warningStatus === '01') {
        filterKeys.push('feedback')
      }

      properties = this.formSchema.properties.filter(
        item => !filterKeys.includes(item.key)
      )

      const dynamicFormSchema = {
        ...this.formSchema,
        properties
      }

      return dynamicFormSchema
    },

    formSchemaPropertiesMap() {
      const obj = {}
      this.formSchema.properties.forEach((item, index) => {
        obj[item.key] = index
      })
      return obj
    }
  },
  watch: {
    auditDetail(val) {
      if (!isEmpty(val)) {
        this.formatData(val)
      }
    },
    auditResultList(val) {
      this.formSchema.properties[
        this.formSchemaPropertiesMap.warningStatus
      ].options = val
    }
  },
  methods: {
    /**
     * 数据格式化
     */
    formatData(data) {
      const fields = {}
      Object.keys(this.formData).forEach(key => {
        if (
          key !== 'warningStatus' &&
          typeof data[key] !== 'undefined' &&
          data[key] !== null
        ) {
          fields[key] = data[key]
        } else {
          fields[key] = initFormData[key]
        }
      })
      this.formData = fields
    },

    queryHomePageEvent(callback) {
      queryHomePageEvent({
        areaCode: '',
        areaLevel: '',
        eventId: '',
        keyWord: '',
        pageNo: 1,
        pageSize: 9999
      }).then(res => {
        callback && callback(res.data.records)
      })
    },

    handleFormChange(key) {
      switch (key) {
        case 'warningStatus':
          this.queryHomePageEvent(res => {
            this.formSchema.properties[
              this.formSchemaPropertiesMap.eventId
            ].options = res
          })
          break
      }
    },

    handleOpen() {
      this.$emit('open')
    },

    handleConfirm() {
      const result = this.$refs.configForm.validateForm()
      if (result) {
        const fields = {
          ...this.formData,
          id: this.auditDetail.id
        }
        this.$emit('confirm', fields)
      }
    },

    handleClose() {
      this.$emit('update:visible', false)
    },

    handleClosed() {
      this.formData = {
        ...initFormData
      }
      this.$emit('closed')
    }
  }
}
</script>

<style lang="scss" scoped></style>
