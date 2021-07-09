<template>
  <InfoBaseDialogTemplate
    :visible.sync="infoBaseVisible"
    :title="subDialogTitle"
    :baseInfo="targetData"
    @submitData="submitData"
    @open="infoBaseDialogOpen"
    @closed="resetData"
    :config="{
      cancelText: this.dialogType === 'detail' ? '关闭' : '取消',
      isShowConfirm: this.dialogType === 'detail' ? false : true
    }"
  >
    <SchemaForm
      :schema="formSchema"
      :model.sync="dialogFormData"
      ref="formBody"
      @deadReason-change="deadReasonChange"
    ></SchemaForm>
  </InfoBaseDialogTemplate>
</template>

<script>
import InfoBaseDialogTemplate from '../../../../components/ChooseStudent/InfoBaseDialogTemplate.vue'
import SchemaForm from '@/components/ConfigForm'
import { updateStudentDead } from '../../../../api/student-death-registration'
export default {
  name: 'DetailAndEditStudentDeath',
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
  mounted() {},
  methods: {
    submitData(data) {
      console.log(data)
      if (this.dialogType === 'detail') return
      if (this.$refs.formBody.validateForm()) {
        updateStudentDead(this.dialogFormData).then(res => {
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
    deadReasonChange(value) {
      this.$emit('deadReasonChange', value)
    },
    resetData() {
      // 重置
      this.dialogFormData = {}
      this.$emit('dialogClosed')
    }
  }
}
</script>

<style lang="scss" scoped></style>
