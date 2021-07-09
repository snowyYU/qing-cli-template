<template>
  <BaseDialog
    :visible="visible"
    @cancel="cancelDialog"
    title="批量新增"
    @close="cancelDialog"
    @confirm="confirmDialog"
    @open="openDialog"
    :config="{ confirmLoading: confirmBtnLoading, width: '40%' }"
    append-to-body
  >
    <template #body>
      <SchemaForm
        :schema="formSchema"
        :model.sync="dialogFormData"
        ref="formBody"
      >
        <template #initClass-label>
          <span style="padding-right:4px">初始班级 </span>
          <el-tooltip
            class="item"
            effect="dark"
            content="若输入初始班级1班，则第二行班级名称为2班，第三行为3班。。。"
            placement="top"
          >
            <i class="el-icon-warning-outline"></i>
          </el-tooltip>
        </template>
        <!-- <template #initClass="{config}">
          <el-input-number
            v-model="dialogFormData.initClass"
            v-bind="config"
            style="width:100%"
          >
            <template slot="append">班</template>
          </el-input-number>
        </template> -->
        <template #initClass="{config}">
          <el-input
            v-model="dialogFormData.initClass"
            v-bind="config"
            style="width:100%"
          >
            <template slot="append">班</template>
          </el-input>
        </template>
      </SchemaForm>
    </template>
  </BaseDialog>
</template>

<script>
import SchemaForm from '@/components/ConfigForm'
import BaseDialog from '@/components/BaseDialog'
import { mapState } from 'vuex'
import { formSchema, dialogFormData } from './AddMuchClassesFormConfig'
export default {
  name: 'AddMuchClasses',
  components: {
    SchemaForm,
    BaseDialog
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState('user', ['schoolGradeList'])
  },
  data() {
    return {
      // 表格部分
      formSchema,
      dialogFormData: { ...dialogFormData },
      confirmBtnLoading: false
    }
  },
  mounted() {
    this.initDicOptions()
  },
  methods: {
    // 初始化各字典表的下拉选项
    async initDicOptions() {
      // 给各项赋值
      this.formSchema.properties.forEach(item => {
        if (item.key === 'grade') {
          item.options = [
            { gradeValue: '全部', id: '' },
            ...this.schoolGradeList
          ]
        }
      })
    },
    openDialog() {},
    cancelDialog() {
      this.$emit('update:visible', false)
      // 关闭
      ;(this.confirmBtnLoading = false),
        (this.dialogFormData = { ...dialogFormData })
    },
    confirmDialog() {
      const formInstance = this.$refs.formBody
      const result = formInstance.validateForm()
      if (result) {
        // 判断年级和初始班级是否有值
        let { grade, initClass, columns } = this.dialogFormData
        if (!grade) {
          grade = this.schoolGradeList.map(item => item.id)
        } else {
          grade = [grade]
        }
        if (!initClass) initClass = 1

        let finallClassList = []

        grade.forEach(gradeId => {
          for (let index = 0; index < columns; index++) {
            const item = {
              gradeId,
              className: Number(initClass) + index + '班'
            }
            finallClassList.push(item)
          }
        })
        this.confirmBtnLoading = true
        this.$emit('muchClasses', finallClassList)
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
