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
      ref="formBody"
      @quitReason-change="quitReasonChange"
    ></SchemaForm>
  </InfoBaseDialogTemplate>
</template>

<script>
import InfoBaseDialogTemplate from '../../../../components/ChooseStudent/InfoBaseDialogTemplate.vue'
import SchemaForm from '@/components/ConfigForm'
import { updateStudentQuit } from '../../../../api/student-quit-registration'
export default {
  name: 'DetailAndEditStudentQuit',
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
      console.log(this.dialogFormData)
      if (this.dialogType === 'detail') return
      if (this.$refs.formBody.validateForm()) {
        updateStudentQuit({
          ...this.dialogFormData,
          startDate: this.dialogFormData.rangeDate[0],
          endDate: this.dialogFormData.rangeDate[1]
        }).then(res => {
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
    quitReasonChange(value) {
      this.$emit('quitReasonChange', value)
    }
  }
}
</script>

<style lang="scss" scoped></style>
