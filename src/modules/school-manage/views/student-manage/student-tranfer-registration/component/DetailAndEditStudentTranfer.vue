<template>
  <InfoBaseDialogTemplate
    :visible.sync="infoBaseVisible"
    :title="subDialogTitle"
    :baseInfo="targetData"
    @submitData="submitData"
    @open="infoBaseDialogOpen"
    :config="{
      cancelText: this.dialogType === 'detail' ? '关闭' : '取消',
      isShowConfirm: this.dialogType === 'detail' ? false : true
    }"
  >
    <SchemaForm
      :schema="formSchema"
      :model.sync="dialogFormData"
      @tranType-change="tranTypeChange"
      ref="formBody"
    ></SchemaForm>
  </InfoBaseDialogTemplate>
</template>

<script>
import InfoBaseDialogTemplate from '../../../../components/ChooseStudent/InfoBaseDialogTemplate.vue'
import SchemaForm from '@/components/ConfigForm'
import { updateStudentTran } from '../../../../api/student-tranfer-registration'
export default {
  name: 'DetailAndEditStudentTranfer',
  components: {
    InfoBaseDialogTemplate,
    SchemaForm
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    formSchema: {
      type: Object,
      default() {
        return {}
      }
    },
    targetData: {
      type: Object,
      default() {
        return {}
      }
    },
    dialogType: {
      type: String,
      default: ''
    },
    subDialogTitle: {
      type: String,
      default: ''
    }
  },
  computed: {
    infoBaseVisible: {
      get() {
        return this.visible
      },
      set() {
        this.$emit('update:visible')
      }
    }
    // computeFormSchema() {
    //   let formSchema = { ...this.formSchema }
    //   formSchema.properties.find(item => item.tranSchoolId).visible =
    //     this.dialogFormData.tranType === '1' ? true : false
    //   return formSchema
    // }
  },
  data() {
    return {
      dialogFormData: {}
    }
  },
  mounted() {
    console.log(this.targetData)
  },
  methods: {
    submitData(data) {
      console.log(data)
      if (this.dialogType === 'detail') return
      if (this.$refs.formBody.validateForm()) {
        updateStudentTran(this.dialogFormData).then(res => {
          this.$message.success(res.msg)
          this.$emit('update:visible')
          this.$emit('refreshData')
          this.dialogFormData = {}
        })
      }
    },
    infoBaseDialogOpen() {
      this.dialogFormData = { ...this.targetData }
    },
    tranTypeChange(value) {
      this.dialogFormData.tranSchoolId = ''
      this.dialogFormData.tranSchoolName = ''
      this.$emit('tranTypeChange', value)
    }
  }
}
</script>

<style lang="scss" scoped></style>
