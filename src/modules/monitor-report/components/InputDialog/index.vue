<template>
  <BaseDialog
    :visible="visible"
    :title="title"
    :config="config"
    @confirm="handleConfirm"
    @cancel="handleCancel"
    @close="handleCancel"
  >
    <template #body>
      <div class="lab-input-container">
        <div class="lab-input-container__title">病例信息</div>
        <div class="lab-input-container__section">
          <el-col
            v-for="(item, index) in infoFormConfig"
            class="section-content"
            :span="item.span"
            :key="index"
          >
            <span class="info-label">{{ item.label }}：</span>
            <span v-if="item.key === 'sex'" class="info-content">{{
              repoFormData.key === '0' ? '男' : '女'
            }}</span>
            <span v-else-if="item.key === 'symptoms'" class="info-content">
              {{ getSymptomsString(repoFormData.symptoms) }}
            </span>
            <span
              v-else-if="item.key === 'diagnoseSource'"
              class="info-content"
            >
              {{ getDiagnoseSourceString(repoFormData.diagnoseSource) }}
            </span>
            <span v-else class="info-content">{{
              repoFormData[item.key]
            }}</span>
          </el-col>
        </div>
        <div class="lab-input-container__divider"></div>
        <div class="lab-input-container__title">实验室检测结果</div>
        <div class="lab=input-container__section">
          <el-Form ref="testForm" :model="testFormData" label-width="130px">
            <el-row>
              <el-col :span="10">
                <el-form-item prop="natFlag" label="核酸检测：" required>
                  <el-radio-group
                    v-model="testFormData.natFlag"
                    @change="handleNatFlagChange"
                  >
                    <el-radio label="1">是</el-radio>
                    <el-radio label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item
                  v-if="testFormData.natFlag === '1'"
                  prop="natResult"
                  label="核酸检测结果："
                  required
                >
                  <el-radio-group v-model="testFormData.natResult">
                    <el-radio label="01">阴性</el-radio>
                    <el-radio label="02">阳性</el-radio>
                    <el-radio label="03">未出结果</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item prop="virusTestFlag" label="多病毒检测" required>
                  <el-radio-group
                    v-model="testFormData.virusTestFlag"
                    @change="handleVirusTestChange"
                  >
                    <el-radio label="1">是</el-radio>
                    <el-radio label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
          </el-Form>
          <el-table
            :data="tableData"
            border
            stripe
            style="width: 100%"
            v-if="testFormData.virusTestFlag === '1'"
          >
            <el-table-column label="病原类型">
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.etiologyType"
                  filterable
                  style="width: 100%"
                  @change="
                    handleEtiologyTypeChange(
                      scope.row.etiologyType,
                      scope.$index
                    )
                  "
                >
                  <el-option
                    v-for="(item, index) in etiologyTypeOptions"
                    v-show="getValidOptions(item.dictCode)"
                    :key="index"
                    :value="item.dictCode"
                    :label="item.dictValue"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="其他病原体">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.etiologyOther"
                  :disabled="scope.row.etiologyType !== '99'"
                  maxlength="10"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="检测结果">
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.testResult"
                  filterable
                  style="width: 100%"
                >
                  <el-option value="01" label="阴性"></el-option>
                  <el-option value="02" label="阳性"></el-option>
                  <el-option value="03" label="未出结果"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150px">
              <template slot-scope="scope">
                <el-button type="text" @click="handleAddRecord(scope.$index)"
                  >新增</el-button
                >
                <el-button
                  type="text"
                  @click="handleDelRecord(scope.$index)"
                  :disabled="tableData.length === 1"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </template>
  </BaseDialog>
</template>

<script>
import BaseDialog from '@/components/BaseDialog'
import { infoFormConfig } from './formConfig'
import { getRepoDetailByRepoId } from '../../api/common'
import { inputRepo } from '../../api/lab-detection-input'
import { mapState } from 'vuex'

export default {
  name: 'InputDialog',
  components: {
    BaseDialog
  },
  props: {
    reportId: {
      type: String,
      default: ''
    },
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
    }
  },
  data() {
    return {
      infoFormConfig,
      repoFormData: {
        schoolName: '',
        gradeName: '',
        className: '',
        stuName: '',
        sex: '',
        certNo: '',
        symptomStartDate: '',
        symptoms: [],
        diagnoseSource: ''
      },
      testFormData: {
        natFlag: '',
        natResult: '',
        virusTestFlag: ''
      },
      tableData: [],
      symptomsOptions: [],
      diagnoseSourceOptions: [],
      etiologyTypeOptions: [],
      originTableData: []
    }
  },
  computed: {
    ...mapState('user', ['dict'])
  },
  watch: {
    visible: {
      handler(newVal) {
        if (newVal) {
          getRepoDetailByRepoId({ id: this.reportId }).then(res => {
            this.getFormData(res.data)
          })
          this.getEtiologyTypeOptions()
          this.getSymptomsOptions()
          this.getDiagnoseSourceOptions()
        }
      }
    }
  },
  methods: {
    // 获取病原类型选项
    getEtiologyTypeOptions() {
      this.etiologyTypeOptions = this.dict['etiologyType']
    },
    // 获取症状选项
    getSymptomsOptions() {
      this.symptomsOptions = this.dict['symptom']
    },
    // 获取确诊病因选项
    getDiagnoseSourceOptions() {
      this.diagnoseSourceOptions = this.dict['diagnoseSource']
    },
    // 拼接症状字符串
    getSymptomsString(arr) {
      const symtomsName = []
      arr.forEach(item => {
        for (const symtom of this.symptomsOptions) {
          if (symtom.dictCode === item) {
            symtomsName.push(symtom.dictValue)
            break
          }
        }
      })
      return symtomsName.join('，')
    },
    // 拼接确诊病因字符串
    getDiagnoseSourceString(val) {
      for (const item of this.diagnoseSourceOptions) {
        if (item.dictCode === val) {
          return item.dictValue
        }
      }
    },
    // 格式化表单数据
    getFormData(data) {
      for (const key in this.repoFormData) {
        this.repoFormData[key] =
          data[key] === null || !data[key]
            ? key === 'symptoms'
              ? []
              : ''
            : data[key]
      }
      for (const key in this.testFormData) {
        this.testFormData[key] =
          data[key] === null || !data[key] ? '' : data[key]
      }
      const etio = data.labEtiologyList
      this.tableData = etio === null || !etio ? [] : [...etio]
      this.originTableData = [...this.tableData]
    },
    // 修改核酸检测状态
    handleNatFlagChange(val) {
      this.testFormData.natResult = val === '0' ? '' : '1'
    },
    // 修改多病毒检测状态
    handleVirusTestChange(val) {
      if (val === '0') {
        this.tableData = []
      } else {
        this.tableData = [
          {
            etiologyType: this.etiologyTypeOptions[0].dictCode,
            etiologyOther: '',
            testResult: '01'
          }
        ]
      }
    },
    // 控制已添加的病原类型不可再被选择或添加（其他病原除外）
    getValidOptions(val) {
      if (val === '99') return true
      for (const rec of this.tableData) {
        if (rec.etiologyType === val) {
          return false
        }
      }
      return true
    },
    // 修改病原类型
    handleEtiologyTypeChange(val, ind) {
      if (val !== '99') {
        this.tableData[ind].etiologyOther = ''
      }
    },
    // 添加病原
    handleAddRecord(ind) {
      let etiologyType = '99'
      for (const item of this.etiologyTypeOptions) {
        let valid = true
        for (const rec of this.tableData) {
          if (rec.etiologyType === item.dictCode) {
            valid = false
            break
          }
        }
        if (valid) {
          etiologyType = item.dictCode
          break
        }
      }
      const record = {
        etiologyType,
        etiologyOther: '',
        testResult: '01'
      }
      this.tableData.splice(ind + 1, 0, record)
    },
    // 删除病原
    handleDelRecord(ind) {
      if (this.tableData.length > 1) {
        this.tableData.splice(ind, 1)
      }
    },
    // 获取病原修改状态列表
    getEtiologyList() {
      this.tableData.forEach(item => {
        item.ifDel = '0'
        if (item.id) {
          for (const ind in this.originTableData) {
            if (item.id === this.originTableData[ind].id) {
              this.originTableData.splice(ind, 1)
              break
            }
          }
        }
      })
      this.originTableData.forEach(item => {
        item.ifDel = '1'
      })
      return this.tableData.concat(this.originTableData)
    },
    // 确定
    handleConfirm() {
      this.$refs['testForm'].validate(valid => {
        if (valid) {
          const paramData = {
            id: this.reportId,
            ...this.testFormData,
            labEtiologyList: this.getEtiologyList()
          }
          inputRepo(paramData).then(res => {
            if (res.code === '200') {
              this.$message({
                type: 'success',
                message: '录入成功'
              })
              this.$parent.getTableData()
              this.$refs['testForm'].resetFields()
              this.$emit('update:visible', false)
            } else {
              this.$message.error('录入失败')
            }
          })
        }
      })
    },
    // 取消
    handleCancel() {
      this.$refs['testForm'].resetFields()
      this.$emit('update:visible', false)
    },
    handleClose() {
      this.$refs['testForm'].resetFields()
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.lab-input-container {
  padding: 15px 30px 10px;

  &__title {
    font-size: 18px;
    line-height: 22px;
    font-weight: bolder;
    color: #272727;
    margin-bottom: 20px;
  }

  &__section {
    width: 100%;
    margin: 10px 0;
    clear: both;
    content: '';
    overflow: hidden;
    .section-content {
      font-size: 16px;
      font-weight: 500;
      line-height: 30px;
      .info-label {
        width: 100px;
      }
      .info-content {
        width: calc(100% - 100px);
      }
    }
  }

  &__divider {
    width: 100%;
    height: 1px;
    background-color: #ebebeb;
    margin: 10px 0 20px;
  }
}
</style>
