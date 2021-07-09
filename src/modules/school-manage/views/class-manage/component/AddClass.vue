<template>
  <BaseDialog
    :visible="visible"
    @cancel="cancelDialog"
    title="新建本学年班级"
    @close="cancelDialog"
    @closed="tableData = []"
    @confirm="confirmDialog"
    @open="openDialog"
  >
    <template #body>
      <div class="btns-group">
        <el-button type="primary" size="small" @click="addClass('many')"
          >批量新增</el-button
        >
        <el-button type="primary" size="small" @click="addClass('one')"
          >新增</el-button
        >
      </div>
      <LineEditTable
        :tableHeader="tableHeader"
        :tableData="tableData"
        :isShowAdd="false"
        :deleteConfirmShow="false"
        ref="editTable"
      ></LineEditTable>
      <AddMuchClasses
        @muchClasses="addMuchClasses"
        :visible.sync="addMuchDialogVisible"
      ></AddMuchClasses>
    </template>
  </BaseDialog>
</template>

<script>
import isEqual from 'lodash/isEqual'
import BaseDialog from '@/components/BaseDialog'
import LineEditTable from '@/components/LineEditTable'
import { mapState } from 'vuex'
import AddMuchClasses from './AddMuchClasses.vue'
import { addClass } from '../../../api/class-manage'
export default {
  name: 'AddClass',
  components: {
    BaseDialog,
    LineEditTable,
    AddMuchClasses
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState('user', ['schoolGradeList', 'schoolTeacherList']),
    tableHeader() {
      return [
        {
          label: '年级',
          value: 'gradeId',
          required: true,
          defaultData: '',
          minWidth: '120',
          type: 'select',
          props: {
            label: 'gradeValue',
            value: 'id'
          },
          options: this.schoolGradeList,
          config: {
            filterable: true,
            allowCreate: false
          }
        },
        {
          label: '班级',
          value: 'className',
          required: true,
          defaultData: '',
          minWidth: '120',
          type: 'input',
          config: {
            clearable: true
          }
        },
        {
          label: '班主任',
          value: 'teacherId',
          defaultData: '',
          minWidth: '120',
          type: 'select',
          options: this.schoolTeacherList,
          props: {
            label: 'fullName',
            value: 'teacherId'
          },
          config: {
            filterable: true,
            allowCreate: false
          }
        }
      ]
    }
  },
  data() {
    return {
      // 可编辑表格配置

      // 可编辑表格数据
      tableData: [],
      // 批量弹框显示
      addMuchDialogVisible: false
    }
  },
  methods: {
    openDialog() {
      console.log('first dialog open')
    },
    cancelDialog() {
      this.$emit('update:visible', false)
    },
    confirmDialog() {
      const result = this.$refs.editTable.validate()
      if (result) {
        // 在此校验数据的重复性
        // 先过滤数据
        let array1 = this.tableData.map(item => {
          return { gradeId: item.gradeId, className: item.className }
        })

        let errorHappend = false
        for (let index1 = 0; index1 < array1.length; index1++) {
          const item1 = array1[index1]
          array1.forEach((item2, index2) => {
            if (index1 !== index2 && isEqual(item1, item2)) {
              errorHappend = true
              this.$set(this.tableData[index1], `className-error`, true)
              this.$set(this.tableData[index2], `className-error`, true)
            }
          })
          if (errorHappend) break
        }
        if (errorHappend) {
          this.$message.error('班级名重复')
          return
        }

        addClass(this.tableData).then(res => {
          this.$message.success(res.msg)
          this.$emit('refreshData')
          this.$emit('update:visible', false)
        })
      }
    },
    // 添加班级
    addClass(type) {
      this.$refs.editTable.resetErrors()
      switch (type) {
        case 'one':
          this.tableData.unshift({ gradeId: '', className: '', teacherId: '' })
          break
        case 'many':
          this.addMuchDialogVisible = true
          break
        default:
          break
      }
    },
    addMuchClasses(classed) {
      //遍历，去除重复的
      const finallClassed = classed.filter(classItem => {
        const r1 = this.tableData.find(row => row.gradeId === classItem.gradeId)
        if (r1) {
          if (r1.className === classItem.className) return false
          return true
        } else {
          return true
        }
      })
      this.tableData = this.tableData.concat(finallClassed)
      this.addMuchDialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.btns-group {
  padding-bottom: 16px;
}
</style>
