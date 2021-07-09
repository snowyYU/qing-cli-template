<template>
  <BaseDialog
    :visible="visible"
    :title="title"
    :config="config"
    @confirm="handleConfirm"
    @cancel="handleCancel"
    @close="handleCancel"
    @closed="handleClosed"
  >
    <template #body>
      <div class="report-container">
        <div class="section-title">学生基本信息</div>
        <div class="baseInfo">
          <el-col
            v-for="(item, index) in baseFormConfig"
            :key="index"
            :span="item.span"
          >
            <el-col :span="10" class="baseInfo-label"
              >{{ item.label }}：</el-col
            >
            <el-col
              :span="14"
              v-if="item.type === 'text'"
              class="baseInfo-value"
            >
              {{ studentData[item.key] }}
            </el-col>
            <el-col
              :span="14"
              v-else-if="item.type === 'input'"
              class="baseInfo-value"
            >
              <el-input
                v-model="studentData[item.key]"
                clearable
                :disabled="type === 'check'"
                :style="item.style"
                maxlength="30"
              ></el-input>
            </el-col>
            <el-col
              :span="14"
              v-else-if="item.type === 'select'"
              class="baseInfo-value"
            >
              <el-select
                v-model="studentData[item.key]"
                clearable
                :disabled="type === 'check'"
                :style="item.style"
              >
                <el-option
                  v-for="(val, ind) in item.options"
                  :key="ind"
                  :label="val[item.prop.label]"
                  :value="val[item.prop.value]"
                ></el-option>
              </el-select>
            </el-col>
          </el-col>
        </div>
        <div class="section-divider" />
        <div class="section-title">缺勤信息</div>
        <el-form
          ref="abForm"
          :model="abFormData"
          label-width="135px"
          :rules="abFormRules"
          :disabled="type === 'check'"
        >
          <el-row>
            <el-col :span="7">
              <el-form-item label="是否缺勤：" prop="absenceFlag" required>
                <el-radio-group
                  v-model="abFormData.absenceFlag"
                  @change="handleAbsenceChange"
                  :disabled="
                    type === 'continue' && abFormData.absenceFlag === '1'
                  "
                >
                  <el-radio label="1">是</el-radio>
                  <el-radio label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <div v-if="abFormData.absenceFlag === '1'">
              <el-col :span="6">
                <el-form-item label="缺勤时间：" prop="abStartDate" required>
                  <el-date-picker
                    v-model="abFormData.abStartDate"
                    type="date"
                    style="width: 100%"
                    value-format="yyyy-MM-dd"
                    :disabled="type === 'continue'"
                    :picker-options="abStartPickerOptions"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-form-item prop="abStartMoment" required label-width="10px">
                  <el-select
                    v-model="abFormData.abStartMoment"
                    :disabled="type === 'continue'"
                    @change="handleMomentChange($event, 'start')"
                  >
                    <el-option
                      v-for="(item, index) in abStartOption"
                      :key="index"
                      :value="item.value"
                      :label="item.label"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item prop="abEndDate" required label-width="10px">
                  <el-date-picker
                    v-model="abFormData.abEndDate"
                    type="date"
                    style="width: 100%"
                    value-format="yyyy-MM-dd"
                    :picker-options="abEndPickerOptions"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-form-item prop="abEndMoment" required label-width="10px">
                  <el-select
                    v-model="abFormData.abEndMoment"
                    @change="handleMomentChange($event, 'end')"
                    :disabled="
                      type === 'continue' &&
                        abFormData.abStartDate === abFormData.abEndDate &&
                        abFormData.abStartMoment === '2'
                    "
                  >
                    <el-option
                      v-for="(item, index) in abEndOption"
                      :key="index"
                      :value="item.value"
                      :label="item.label"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-form-item prop="abEndMoment" label-width="10px">
                  <el-input v-model="abFormData.abDays" disabled></el-input>
                </el-form-item>
              </el-col>
            </div>
          </el-row>
          <el-row>
            <el-col :span="7">
              <el-form-item prop="symptoms" label="症状：" required>
                <el-select
                  v-model="abFormData.symptoms"
                  placeholder="请选择"
                  multiple
                  filterable
                  clearable
                  style="width: 100%"
                  @change="handleSymptomsChange"
                >
                  <el-option
                    v-for="(item, index) in symptomOptions"
                    :key="index"
                    :value="item.dictCode"
                    :label="item.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                prop="symptomStartDate"
                label="症状开始时间："
                required
              >
                <el-date-picker
                  v-model="abFormData.symptomStartDate"
                  type="date"
                  style="width: 100%"
                  value-format="yyyy-MM-dd"
                  :picker-options="symptomDateOptions"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-form-item
                prop="symptomStartMoment"
                label-width="10px"
                required
              >
                <el-select v-model="abFormData.symptomStartMoment">
                  <el-option value="1" label="上午"></el-option>
                  <el-option value="2" label="下午"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item prop="diagnoseFlag" label="是否确诊：" required>
                <el-radio-group
                  v-model="abFormData.diagnoseFlag"
                  :disabled="type === 'end'"
                  @change="handleDiagnoseChange"
                >
                  <el-radio label="1">是</el-radio>
                  <el-radio label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="7" v-if="abFormData.symptoms.indexOf('01') !== -1">
              <el-form-item prop="temperature" label="温度：" required>
                <el-input
                  v-model="abFormData.temperature"
                  clearable
                  placeholder="小数点后保留一位"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7" v-if="abFormData.symptoms.indexOf('99') !== -1">
              <el-form-item prop="otherSymptoms" label="其他症状" required>
                <el-input
                  v-model="abFormData.otherSymptoms"
                  clearable
                  maxlength="10"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div v-if="abFormData.diagnoseFlag === '1'">
          <div class="section-divider" />
          <div class="section-title">病因追踪</div>
          <el-form
            ref="sourceForm"
            :model="sourceFormData"
            label-width="135px"
            :rules="sourceFormRules"
            :disabled="type === 'check'"
          >
            <el-row>
              <el-col :span="7">
                <el-form-item prop="visitOrgName" label="就诊医院：" required>
                  <el-input
                    v-model="sourceFormData.visitOrgName"
                    clearable
                    maxlength="30"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item prop="diagnoseSource" label="确诊病因：" required>
                  <el-select
                    v-model="sourceFormData.diagnoseSource"
                    filterable
                    clearable
                    style="width: 100%"
                  >
                    <el-option
                      v-for="(item, index) in diagnoseOptions"
                      :key="index"
                      :value="item.dictCode"
                      :label="item.dictValue"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="7" v-if="sourceFormData.diagnoseSource === '99'">
                <el-form-item prop="otherSource" label="其他病因：" required>
                  <el-input
                    v-model="sourceFormData.otherSource"
                    clearable
                    maxlength="30"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="auth === 1">
              <el-col :span="7">
                <el-form-item prop="virusTestFlag" label="多病毒检测：">
                  <el-radio-group
                    v-model="sourceFormData.virusTestFlag"
                    @change="handleVirusTestChange"
                  >
                    <el-radio label="1">是</el-radio>
                    <el-radio label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item prop="natFlag" label="核酸检测：">
                  <el-radio-group
                    v-model="sourceFormData.natFlag"
                    @change="handleNatFlagChange"
                  >
                    <el-radio label="1">是</el-radio>
                    <el-radio label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="8" v-if="sourceFormData.natFlag === '1'">
                <el-form-item prop="natResult" label="核酸检测结果：" required>
                  <el-radio-group v-model="sourceFormData.natResult">
                    <el-radio label="01">阴性</el-radio>
                    <el-radio label="02">阳性</el-radio>
                    <el-radio label="03">未出结果</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-table
            :data="etiologyTableData"
            border
            stripe
            style="width: 100%"
            v-if="auth === 1 && sourceFormData.virusTestFlag === '1'"
          >
            <el-table-column label="病原类型">
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.etiologyType"
                  filterable
                  style="width: 100%"
                  :disabled="type === 'check'"
                  @change="
                    handleEtiologyTypeChange(
                      scope.row.etiologyType,
                      scope.$index
                    )
                  "
                >
                  <el-option
                    v-for="(item, index) in etiologyOptions"
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
                  :disabled="
                    scope.row.etiologyType !== '99' || type === 'check'
                  "
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
                  :disabled="type === 'check'"
                >
                  <el-option value="01" label="阴性"></el-option>
                  <el-option value="02" label="阳性"></el-option>
                  <el-option value="03" label="未出结果"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150px">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="handleAddEtiology(scope.$index)"
                  :disabled="type === 'check'"
                  >新增</el-button
                >
                <el-button
                  type="text"
                  @click="handleDelEtiology(scope.$index)"
                  :disabled="etiologyTableData.length === 1 || type === 'check'"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-if="auth === 1 && abFormData.symptoms.indexOf('15') !== -1">
          <div class="section-divider" />
          <div class="section-title">伤害事件录入</div>
          <el-form
            ref="injuryForm"
            :model="injuryFormData"
            label-width="135px"
            :rules="injuryFormRules"
            :disabled="type === 'check'"
          >
            <el-row>
              <el-col :span="7">
                <el-form-item prop="harmTime" label="伤害发生时间：" required>
                  <el-date-picker
                    v-model="injuryFormData.harmTime"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd HH:mm"
                    style="width: 100%"
                    :picker-options="harmTimeOptions"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item prop="harmIntent" label="伤害意图：" required>
                  <el-select
                    v-model="injuryFormData.harmIntent"
                    filterable
                    style="width: 100%"
                  >
                    <el-option
                      v-for="(item, index) in harmIntentOptions"
                      :key="index"
                      :value="item.dictCode"
                      :label="item.dictValue"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item prop="harmType" label="伤害类型：" required>
                  <el-select
                    v-model="injuryFormData.harmType"
                    filterable
                    style="width: 100%"
                  >
                    <el-option
                      v-for="(item, index) in harmTypeOptions"
                      :key="index"
                      :value="item.dictCode"
                      :label="item.dictValue"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="7">
                <el-form-item
                  prop="harmAddress"
                  label="伤害发生地点："
                  required
                >
                  <el-select
                    v-model="injuryFormData.harmAddress"
                    filterable
                    style="width: 100%"
                  >
                    <el-option
                      v-for="(item, index) in harmAddressOptions"
                      :key="index"
                      :value="item.dictCode"
                      :label="item.dictValue"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item
                  prop="harmActivity"
                  label="伤害发生时活动："
                  required
                >
                  <el-select
                    v-model="injuryFormData.harmActivity"
                    filterable
                    style="width: 100%"
                  >
                    <el-option
                      v-for="(item, index) in harmActivityOptions"
                      :key="index"
                      :value="item.dictCode"
                      :label="item.dictValue"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item prop="harmPart" label="受伤部位：" required>
                  <el-select
                    v-model="injuryFormData.harmPart"
                    multiple
                    filterable
                    style="width: 100%"
                  >
                    <el-option
                      v-for="(item, index) in harmPartOptions"
                      :key="index"
                      :value="item.dictCode"
                      :label="item.dictValue"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="7">
                <el-form-item prop="processWay" label="处理方式：" required>
                  <el-select
                    v-model="injuryFormData.processWay"
                    filterable
                    style="width: 100%"
                  >
                    <el-option
                      v-for="(item, index) in processWayOptions"
                      :key="index"
                      :value="item.dictCode"
                      :label="item.dictValue"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item prop="harmResult" label="伤害结果：">
                  <el-select
                    v-model="injuryFormData.harmResult"
                    filterable
                    style="width: 100%"
                  >
                    <el-option
                      v-for="(item, index) in harmResultOptions"
                      :key="index"
                      :value="item.dictCode"
                      :label="item.dictValue"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item prop="harmMark" label="简单描述">
                  <el-input
                    v-model="injuryFormData.harmMark"
                    type="textarea"
                    style="width: 100%"
                    show-word-limit
                    :rows="2"
                    :maxlength="100"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
    </template>
  </BaseDialog>
</template>

<script>
import BaseDialog from '@/components/BaseDialog'
import {
  baseInfoConfig,
  confirmInfoConfig,
  studentData,
  abFormData,
  sourceFormData,
  injuryFormData,
  etiologyTableData,
  abStartOption,
  abEndOption,
  abFormRules,
  sourceFormRules,
  injuryFormRules
} from './formConfig'
import { getRepoDetailByStuId, addRepo } from '../../api/monitor-info-report'
import { getRepoDetailByRepoId, updateByType } from '../../api/common'
import { mapState } from 'vuex'
import { timeFormat } from '../../utils/index'

export default {
  name: 'ReportDialog',
  components: {
    BaseDialog
  },
  props: {
    auth: {
      type: Number,
      default: 0
    },
    studentId: {
      type: String,
      default: ''
    },
    reportId: {
      type: String,
      default: ''
    },
    type: {
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
  computed: {
    ...mapState('user', ['schoolYearList', 'schoolGradeList', 'dict'])
  },
  watch: {
    visible: {
      handler(newVal) {
        if (newVal) {
          this.getBaseFormConfig()
          if (this.type === 'confirm') {
            this.baseFormConfig[3].options = this.relationCodeOptions
          }
          if (this.type === 'add') {
            this.getDataByStuId(this.studentId)
          } else {
            this.getDataByRepoId(this.reportId)
          }
          this.getAbStartPickerOptions()
          this.getAbEndPickerOptions()
          this.getOption(this.abFormData.abStartMoment, 'start')
          this.getOption(this.abFormData.abEndMoment, 'end')
          this.getDaySpan(
            this.abFormData.abStartDate,
            this.abFormData.abEndDate
          )
          this.getRelationCode()
          this.getSymptom()
          this.getDiagnoseSource()
          this.getEtiologyType()
          this.getHarmIntent()
          this.getHarmType()
          this.getHarmAddress()
          this.getHarmActivity()
          this.getHarmPart()
          this.getProcessWay()
          this.getHarmResult()
        }
      },
      immediate: true
    },
    'abFormData.abStartDate': {
      handler() {
        this.handleAbStartChange()
      },
      immediate: true
    },
    'abFormData.abEndDate': {
      handler() {
        this.handleAbEndChange()
      },
      immediate: true
    }
  },
  data() {
    return {
      classId: '',
      baseFormConfig: {},
      studentData: { ...studentData },
      abFormData: { ...abFormData },
      sourceFormData: { ...sourceFormData },
      injuryFormData: { ...injuryFormData },
      etiologyTableData: [...etiologyTableData],
      abStartPickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      abEndPickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      abStartOption,
      abEndOption,
      symptomDateOptions: {
        disabledDate(time) {
          return (
            time.getTime() < Date.now() - 3600 * 24 * 1000 * 8 ||
            time.getTime() > Date.now()
          )
        }
      },
      harmTimeOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      relationCodeOptions: [],
      symptomOptions: [],
      diagnoseOptions: [],
      etiologyOptions: [],
      testResultOptions: [],
      harmIntentOptions: [],
      harmTypeOptions: [],
      harmAddressOptions: [],
      harmActivityOptions: [],
      harmPartOptions: [],
      processWayOptions: [],
      harmResultOptions: [],
      abFormRules,
      sourceFormRules,
      injuryFormRules,
      confirmApi: '',
      // abStartDate: null,
      // abStartMoment: '',
      createTime: '',
      originTableData: ''
    }
  },
  mounted() {},
  methods: {
    // 新建病例时根据学生id获取学生信息
    getDataByStuId(id) {
      getRepoDetailByStuId({ id }).then(res => {
        this.classId = res.data.classId
        this.getFormData(res.data, 'add')
      })
    },
    // 编辑病例时根据病例id获取病例详情
    getDataByRepoId(id) {
      getRepoDetailByRepoId({ id }).then(res => {
        this.classId = res.data.classId
        this.getFormData(res.data)
      })
    },
    // 格式化病例数据
    getFormData(obj, action = 'update') {
      for (const key in this.studentData) {
        this.studentData[key] = obj[key] === null || !obj[key] ? '' : obj[key]
      }
      this.studentData.relationCode = obj.relationCode
      if (action === 'update') {
        for (const key in this.abFormData) {
          if (key === 'symptoms') {
            this.abFormData[key] =
              obj[key] === null || !obj[key] ? [] : obj[key]
          } else {
            this.abFormData[key] =
              obj[key] === null || !obj[key] ? '' : obj[key]
          }
        }
        for (const key in this.sourceFormData) {
          this.sourceFormData[key] =
            obj[key] === null || !obj[key] ? '' : obj[key]
        }
        for (const key in this.injuryFormData) {
          if (key === 'harmPart') {
            this.injuryFormData[key] =
              obj[key] === null || !obj[key] ? [] : obj[key]
          } else {
            this.injuryFormData[key] =
              obj[key] === null || !obj[key] ? '' : obj[key]
          }
        }
        const etio = obj.labEtiologyList
        this.etiologyTableData = etio === null || !etio ? [] : [...etio]
        this.getDaySpan(this.abFormData.abStartDate, this.abFormData.abEndDate)
        this.createTime = obj.createTime
        // this.abFormData.diagnoseFlag =
        //   this.type === 'end' ? '1' : this.abFormData.diagnoseFlag
      }
      this.originTableData = [...this.etiologyTableData]
    },
    // 动态配置基本信息展示内容
    getBaseFormConfig() {
      this.baseFormConfig =
        this.type === 'confirm' ? confirmInfoConfig : baseInfoConfig
    },
    // 获取亲属关系字典
    getRelationCode() {
      this.relationCodeOptions = this.dict['relationCode']
    },
    // 获取症状字典
    getSymptom() {
      this.symptomOptions = this.dict['symptom']
    },
    // 获取确诊病因字典
    getDiagnoseSource() {
      this.diagnoseOptions = this.dict['diagnoseSource']
    },
    // 获取病原类型字典
    getEtiologyType() {
      this.etiologyOptions = this.dict['etiologyType']
    },
    // 获取伤害意图字典
    getHarmIntent() {
      this.harmIntentOptions = this.dict['harmIntent']
    },
    // 获取伤害类型字典
    getHarmType() {
      this.harmTypeOptions = this.dict['harmType']
    },
    // 获取伤害地址字典
    getHarmAddress() {
      this.harmAddressOptions = this.dict['harmAddress']
    },
    // 获取伤害发生时活动字典
    getHarmActivity() {
      this.harmActivityOptions = this.dict['harmActivity']
    },
    // 获取伤害部位字典
    getHarmPart() {
      this.harmPartOptions = this.dict['harmPart']
    },
    // 获取处理方式字典
    getProcessWay() {
      this.processWayOptions = this.dict['processWay']
    },
    // 获取伤害结果字典
    getHarmResult() {
      this.harmResultOptions = this.dict['harmResult']
    },
    // 自动计算缺勤天数
    getDaySpan(start, end) {
      if (start && end) {
        const startTime = new Date(start).getTime()
        const endTime = new Date(end).getTime()
        this.abFormData.abDays =
          (endTime - startTime) / (60 * 60 * 24 * 1000) + 1 + '天'
      } else {
        this.abFormData.abDays = ''
      }
    },
    // 修改缺勤开始日期
    handleAbStartChange() {
      this.getAbEndPickerOptions()
      this.getOption(this.abFormData.abEndMoment, 'end')
      this.getDaySpan(this.abFormData.abStartDate, this.abFormData.abEndDate)
    },
    // 修改缺勤结束日期
    handleAbEndChange() {
      this.getAbStartPickerOptions()
      this.getOption(this.abFormData.abStartMoment, 'start')
      this.getDaySpan(this.abFormData.abStartDate, this.abFormData.abEndDate)
    },
    // 根据所选缺勤结束日期约束开始日期的选择范围
    getAbStartPickerOptions() {
      const day = 3600 * 24 * 1000
      const today = new Date(new Date().toLocaleDateString())
      const _this = this
      const end = new Date(this.abFormData.abEndDate)
      const smo = parseInt(this.abFormData.abStartMoment)
      const emo = parseInt(this.abFormData.abEndMoment)
      const create = new Date(new Date(this.createTime))
      let startPoint = null
      let endPoint = null
      switch (this.type) {
        case 'add':
          startPoint = today.getTime() - day * 8
          endPoint = end.getTime()
          break
        default:
          startPoint = create.getTime() - day * 8
          endPoint = end.getTime()
          break
      }
      this.abStartPickerOptions = {
        disabledDate(time) {
          if (!_this.abFormData.abEndDate) {
            return (
              time.getTime() > startPoint + day * 8 ||
              time.getTime() < startPoint
            )
          } else {
            if (emo - smo >= 0) {
              return time.getTime() > endPoint || time.getTime() < startPoint
            } else {
              return (
                time.getTime() < startPoint || time.getTime() > endPoint - day
              )
            }
          }
        }
      }
    },
    // 根据所选缺勤开始日期约束结束日期的选择范围
    getAbEndPickerOptions() {
      const day = 3600 * 24 * 1000
      const _this = this
      const today = new Date(new Date().toLocaleDateString())
      const start = new Date(this.abFormData.abStartDate)
      const end = new Date(this.abFormData.abEndDate)
      const smo = parseInt(this.abFormData.abStartMoment)
      const emo = parseInt(this.abFormData.abEndMoment)
      const create = new Date(new Date(this.createTime))
      let startPoint = null
      let endPoint = null
      this.abFormData.abEndDate = this.abFormData.abStartDate
        ? this.abFormData.abEndDate
        : null
      switch (this.type) {
        case 'add':
          startPoint = start.getTime()
          endPoint = today.getTime()
          break
        case 'continue':
          startPoint = end.getTime()
          endPoint = today.getTime()
          break
        default:
          startPoint = start.getTime()
          endPoint = create.getTime()
          break
      }
      this.abEndPickerOptions = {
        disabledDate(time) {
          if (!_this.abFormData.abStartDate) {
            return (
              time.getTime() < endPoint - day * 8 || time.getTime() > endPoint
            )
          } else {
            if (emo - smo >= 0) {
              return (
                time.getTime() > endPoint || time.getTime() < startPoint - day
              )
            } else {
              return time.getTime() > endPoint || time.getTime() < startPoint
            }
          }
        }
      }
    },
    // 修改缺勤开始/结束时间点（上午、下午）
    handleMomentChange(val, type) {
      this.getAbStartPickerOptions()
      this.getAbEndPickerOptions()
      this.getOption(val, type)
    },
    // 根据缺勤时间约束时间点的选择范围
    getOption(val, type) {
      if (this.abFormData.abStartDate && this.abFormData.abEndDate) {
        const start = new Date(this.abFormData.abStartDate).getTime()
        const end = new Date(this.abFormData.abEndDate).getTime()
        if (start == end && type === 'start') {
          if (val === '2') {
            this.abFormData.abEndMoment = '2'
          }
        } else if (start == end && type === 'end') {
          if (val === '1') {
            this.abFormData.abStartMoment = '1'
          }
        }
      }
    },
    // 修改是否缺勤状态
    handleAbsenceChange(val) {
      if (val === '1') {
        if (this.type === 'add') {
          this.abFormData.abStartDate = timeFormat(new Date(), 'yyyy-MM-dd')
          this.abFormData.abEndDate = timeFormat(new Date(), 'yyyy-MM-dd')
        } else {
          this.abFormData.abStartDate = timeFormat(
            new Date(this.createTime),
            'yyyy-MM-dd'
          )
          this.abFormData.abEndDate = timeFormat(
            new Date(this.createTime),
            'yyyy-MM-dd'
          )
        }
        this.abFormData.abStartMoment = '1'
        this.abFormData.abEndMoment = '2'
      } else {
        this.abFormData.abStartDate = ''
        this.abFormData.abEndDate = ''
        this.abFormData.abStartMoment = ''
        this.abFormData.abEndMoment = ''
      }
    },
    // 修改症状内容
    handleSymptomsChange(arr) {
      if (arr.indexOf('01') === -1) {
        this.abFormData.temperature = ''
      }
      if (arr.indexOf('99') === -1) {
        this.abFormData.otherSymptoms = ''
      }
      if (arr.indexOf('15') === -1) {
        this.injuryFormData = { ...injuryFormData }
      } else {
        this.injuryFormData.harmTime = timeFormat(
          new Date(),
          'yyyy-MM-dd hh:mm:ss'
        )
      }
    },
    // 修改是否确诊状态
    handleDiagnoseChange(val) {
      if (val === '0') {
        this.sourceFormData = { ...sourceFormData }
        this.etiologyTableData = []
      } else {
        if (this.auth === 1) {
          this.sourceFormData.natFlag = '0'
          this.sourceFormData.virusTestFlag = '0'
        }
      }
    },
    // 修改多病毒监测状态
    handleVirusTestChange(val) {
      if (val === '1') {
        this.etiologyTableData.push({
          etiologyType: this.etiologyOptions[0].dictCode,
          etiologyOther: '',
          testResult: '01'
        })
      } else {
        this.etiologyTableData = []
      }
    },
    // 修改是否进行核酸监测状态
    handleNatFlagChange(val) {
      this.natResult = val === '0' ? '' : '01'
    },
    // 修改病原类型
    handleEtiologyTypeChange(val, ind) {
      if (val !== '99') {
        this.etiologyTableData[ind].etiologyOther = ''
      }
    },
    //  新增时自动添加未填写的病原类型
    getValidOptions(val) {
      if (val === '99') return true
      for (const rec of this.etiologyTableData) {
        if (rec.etiologyType === val) {
          return false
        }
      }
      return true
    },
    // 新增病原
    handleAddEtiology(ind) {
      let etiologyType = '99'
      for (const item of this.etiologyOptions) {
        let valid = true
        for (const rec of this.etiologyTableData) {
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
      this.etiologyTableData.splice(ind + 1, 0, record)
    },
    // 删除病原
    handleDelEtiology(ind) {
      this.etiologyTableData.splice(ind, 1)
    },
    // 生成labEtiologyList参数
    getEtiologyList() {
      this.etiologyTableData.forEach(item => {
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
      return this.etiologyTableData.concat(this.originTableData)
    },
    // 确认
    handleConfirm() {
      this.$refs['abForm'].validate(valid => {
        if (valid) {
          if (this.$refs['sourceForm']) {
            let sourceValid = true
            this.$refs['sourceForm'].validate(valid => {
              sourceValid = valid
            })
            if (!sourceValid) {
              this.$message({
                type: 'warning',
                message: '请完整填写病因追踪'
              })
              return false
            }
          }
          if (this.$refs['injuryForm']) {
            let injuryValid = true
            this.$refs['injuryForm'].validate(valid => {
              injuryValid = valid
            })
            if (!injuryValid) {
              this.$message({
                type: 'warning',
                message: '请完整填写伤害事件录入'
              })
              return false
            }
          }
          let paramData = {
            ...this.abFormData,
            ...this.sourceFormData,
            ...this.injuryFormData,
            contactPhone: this.studentData.contactPhone,
            classId: this.classId,
            relationCode: this.studentData.relationCode
          }
          if (this.type === 'add') {
            paramData.studentId = this.studentId
          } else {
            paramData.id = this.reportId
            if (this.type === 'edit') paramData.type = 1
            else if (this.type === 'continue') paramData.type = 2
            else if (this.type === 'confirm') paramData.type = 3
            else if (this.type === 'audit') paramData.type = 4
            else paramData.type = 5
          }
          paramData.labEtiologyList = this.getEtiologyList()
          this.confirmApi = this.type === 'add' ? addRepo : updateByType
          this.confirmApi(paramData).then(res => {
            if (res.code === '200') {
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              this.$parent.getTableData()
              this.$emit('update:visible', false)
            }
          })
        } else {
          this.$message({
            type: 'warning',
            message: '请完整填写缺勤信息'
          })
          return false
        }
      })
    },
    // 取消
    handleCancel() {
      this.$refs['abForm'].resetFields()
      this.$emit('update:visible', false)
    },
    handleClosed() {
      this.cleanForm()
    },
    // 清空表单
    cleanForm() {
      this.studentData = { ...studentData }
      this.abFormData = { ...abFormData }
      this.sourceFormData = { ...sourceFormData }
      this.etiologyTableData = []
    }
  }
}
</script>

<style lang="scss" scoped>
.report-container {
  padding: 0 20px 0 40px;
  .section-title {
    font-size: 18px;
    line-height: 22px;
    font-weight: bolder;
    color: #272727;
    margin-bottom: 20px;
  }
  .baseInfo {
    font-size: 16px;
    font-weight: 500;
    line-height: 40px;
    content: '';
    clear: both;
    overflow: hidden;
    &-label {
      text-align: right;
    }
    &-value {
      padding-left: 10px;
    }
  }
  .section-divider {
    width: 100%;
    height: 1px;
    background-color: #efefef;
    margin: 24px 0;
  }
  .abInfo {
  }
}
.abDatePicker {
  &-item {
    margin-bottom: 5px;
    &-label {
      line-height: 32px;
    }
  }
}
</style>
