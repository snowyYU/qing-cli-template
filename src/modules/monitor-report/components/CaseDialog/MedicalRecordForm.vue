<template>
  <el-form
    :model="formData"
    ref="form"
    size="small"
    label-position="left"
    :disabled="mode === 'view'"
  >
    <div class="form-wrapper">
      <el-row>
        <el-col :span="12">
          <el-form-item
            prop="morbidityDate"
            label="1、发病日期"
            label-width="100px"
            :rules="[]"
          >
            <el-date-picker
              :style="{ width: '100%' }"
              v-model="formData.morbidityDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择日期"
            ></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item
            prop="initialSymptom"
            label=""
            label-width="200px"
            :rules="[]"
          >
            <template #label>
              <div class="form-label">初发症状和体征（可多选）</div>
            </template>

            <el-checkbox-group v-model="formData.initialSymptom">
              <el-checkbox
                :label="item.dictCode"
                v-for="item in options1"
                :key="item.dictCode"
                >{{ item.dictValue }}</el-checkbox
              >
            </el-checkbox-group>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item
            prop="diagnosisDate"
            label="2、诊断日期"
            label-width="100px"
            :rules="[]"
          >
            <el-date-picker
              :style="{ width: '100%' }"
              v-model="formData.diagnosisDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择日期"
            ></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item
            prop="diagnosisType"
            label="3、初始诊断类型"
            label-width="130px"
            :rules="[]"
          >
            <el-radio-group v-model="formData.diagnosisType">
              <el-radio
                :label="item.dictCode"
                v-for="item in options2"
                :key="item.dictCode"
                >{{ item.dictValue }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item
            prop="clinicalDegree"
            label="4、临床严重程度"
            label-width="130px"
            :rules="[]"
          >
            <el-radio-group v-model="formData.clinicalDegree">
              <el-radio
                :label="item.dictCode"
                v-for="item in options3"
                :key="item.dictCode"
                >{{ item.dictValue }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item
            prop="complicationFlag"
            label="5、有无并发症"
            label-width="110px"
            :rules="[]"
          >
            <el-radio-group v-model="formData.complicationFlag">
              <el-radio
                :label="item.dictCode"
                v-for="item in options5"
                :key="item.dictCode"
                >{{ item.dictValue }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item
            prop="visitSituation"
            label="6、发病后就诊情况"
            label-width="140px"
            :rules="[]"
          >
            <el-radio-group v-model="formData.visitSituation">
              <el-radio
                :label="item.dictCode"
                v-for="item in options4"
                :key="item.dictCode"
                >{{ item.dictValue }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <div
            class="form-control-group"
            v-for="(info, infoIndex) in formData.visitInfos"
            :key="'visitInfos-' + infoIndex"
          >
            <el-row>
              <el-col :span="8">
                <el-form-item
                  :prop="`visitInfos.${infoIndex}.visitDate`"
                  label=""
                  label-width="90px"
                  :rules="[]"
                >
                  <template #label>
                    <div class="form-label">诊断日期</div>
                  </template>

                  <el-date-picker
                    :style="{ width: '100%' }"
                    v-model="info.visitDate"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="请选择日期"
                  ></el-date-picker>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item
                  :prop="`visitInfos.${infoIndex}.visitOrgName`"
                  label=""
                  label-width="90px"
                  :rules="[]"
                >
                  <template #label>
                    <div class="form-label">就诊机构</div>
                  </template>

                  <el-input
                    v-model="info.visitOrgName"
                    placeholder="请输入就诊机构"
                  ></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item
                  :prop="`visitInfos.${infoIndex}.initialDiagnosis`"
                  label=""
                  label-width="90px"
                  :rules="[]"
                >
                  <template #label>
                    <div class="form-label">初步诊断</div>
                  </template>

                  <el-input
                    v-model="info.initialDiagnosis"
                    placeholder="请输入初步诊断"
                  ></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item
                  :prop="`visitInfos.${infoIndex}.inhospFlag`"
                  label=""
                  label-width="90px"
                  :rules="[]"
                >
                  <template #label>
                    <div class="form-label">是否入院</div>
                  </template>

                  <el-radio-group v-model="info.inhospFlag">
                    <el-radio
                      :label="item.dictCode"
                      v-for="item in options6"
                      :key="item.dictCode"
                      >{{ item.dictValue }}</el-radio
                    >
                  </el-radio-group>
                </el-form-item>
              </el-col>

              <el-col :span="16" v-if="mode !== 'view'">
                <div
                  class="custom-icon-wrapper"
                  :style="{ paddingLeft: '10px' }"
                >
                  <i
                    class="custom-icon custom-icon__add"
                    @click="handleClick('add', 'visitInfos', infoIndex)"
                    v-if="infoIndex === 0"
                  ></i>
                  <i
                    class="custom-icon custom-icon__delete"
                    @click="handleClick('delete', 'visitInfos', infoIndex)"
                    v-if="formData.visitInfos.length > 1"
                  ></i>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>

        <el-col :span="24">
          <el-form-item
            prop="cbcFlag"
            label="7、最近一次入院情况"
            label-width="200px"
            :rules="[]"
          >
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item
            prop="cbcFlag"
            label="是否有做血常规检测"
            label-width="160px"
            :rules="[]"
          >
            <template #label>
              <div class="form-label">是否有做血常规检测</div>
            </template>

            <el-radio-group v-model="formData.cbcFlag">
              <el-radio
                :label="item.dictCode"
                v-for="item in options6"
                :key="item.dictCode"
                >{{ item.dictValue }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item
            prop="pneumoniaImagingFlag"
            label="是否有做肺炎影像学"
            label-width="160px"
            :rules="[]"
          >
            <template #label>
              <div class="form-label">是否有做肺炎影像学</div>
            </template>

            <el-radio-group v-model="formData.pneumoniaImagingFlag">
              <el-radio
                :label="item.dictCode"
                v-for="item in options6"
                :key="item.dictCode"
                >{{ item.dictValue }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item
            prop="remark"
            label="备注"
            label-width="60px"
            :rules="[]"
          >
            <template #label>
              <div class="form-label">备注</div>
            </template>

            <el-input
              v-model="formData.remark"
              type="textarea"
              placeholder="请输入备注"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </div>
  </el-form>
</template>

<script>
import { queryDictInfoByCategory } from '@/api/common'
import isEmpty from 'lodash/isEmpty'
import cloneDeep from 'lodash/cloneDeep'

const initFormData = {
  morbidityDate: '', // 发病日期
  initialSymptom: [], // 初发症状和体征（可多选）
  diagnosisDate: '', // 诊断日期
  diagnosisType: '', // 初始诊断类型
  clinicalDegree: '', // 临床严重程度
  complicationFlag: '', // 有无并发症
  visitSituation: '', // 发病后就诊情况
  visitInfos: [
    {
      visitDate: '', // 就诊日期
      visitOrgName: '', // 就诊机构
      initialDiagnosis: '', // 初步诊断
      inhospFlag: '' // 是否入院
    }
  ],
  cbcFlag: '', // 是否有做血常规检测
  pneumoniaImagingFlag: '', // 是否有做肺炎影像学
  remark: '' // 备注
}

export default {
  name: 'MedicalRecordForm',
  props: {
    mode: {
      type: String,
      default: ''
    },
    caseDialogAllInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      formData: cloneDeep(initFormData),
      // 初发症状和体征（可多选）
      options1: [],
      // 初始诊断类型
      options2: [],
      // 临床严重程度
      options3: [],
      options4: [
        {
          dictCode: 1,
          dictValue: '已就诊'
        },
        {
          dictCode: 0,
          dictValue: '未就诊'
        }
      ],
      options5: [
        {
          dictCode: 1,
          dictValue: '有'
        },
        {
          dictCode: 0,
          dictValue: '无'
        }
      ],
      options6: [
        {
          dictCode: 1,
          dictValue: '是'
        },
        {
          dictCode: 0,
          dictValue: '否'
        }
      ]
    }
  },
  watch: {
    caseDialogAllInfo(val) {
      if (val && !isEmpty(val.diagnosisInfo)) {
        this.formatData(val.diagnosisInfo)
      }
    }
  },
  methods: {
    /**
     * 格式化数据
     * @param {*} data
     */
    formatData(data) {
      const fields = {}
      Object.keys(this.formData).forEach(key => {
        if (typeof data[key] !== 'undefined' && data[key] !== null) {
          fields[key] = data[key]
        } else {
          if (typeof this.formData[key] === 'object') {
            fields[key] = cloneDeep(this.formData[key])
          } else {
            fields[key] = this.formData[key]
          }
        }
      })
      this.formData = fields
    },

    /**
     * 获取字典
     * @param {string} key
     * @param {function} callback
     */
    queryDictInfoByCategory(key, callback) {
      const data = { dictKey: key }
      queryDictInfoByCategory(data).then(res => {
        if (res.code === '200') {
          callback && callback(res.data)
        } else {
          this.$message.error(res.msg)
        }
      })
    },

    /**
     *  点击事件
     */
    handleClick(type, target, index) {
      switch (type) {
        case 'add':
          switch (target) {
            case 'visitInfos':
              this.formData.visitInfos.push({
                visitDate: '', // 就诊日期
                visitOrgName: '', // 就诊机构
                initialDiagnosis: '', // 初步诊断
                inhospFlag: '' // 是否入院
              })
              break
          }
          break
        case 'delete':
          switch (target) {
            case 'visitInfos':
              this.formData.visitInfos.splice(index, 1)
              break
          }
          break
      }
    },

    /**
     * 获取表单数据
     */
    createForm() {
      // 初发症状和体征（可多选）
      this.queryDictInfoByCategory('synptomBodysign', res => {
        this.options1 = res
      })

      // 初始诊断类型
      this.queryDictInfoByCategory('caseCategory', res => {
        this.options2 = res
      })

      // 临床严重程度
      this.queryDictInfoByCategory('clinicalServerity', res => {
        this.options3 = res
      })
    },

    /**
     * 提交表单
     */
    submitForm() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate(valid => {
          if (valid) {
            const fields = cloneDeep(this.formData)
            resolve(fields)
          } else {
            reject()
          }
        })
      })
    },

    /**
     * 重置表单
     */
    resetForm() {
      this.formData = cloneDeep(initFormData)
      this.$refs.form.resetFields()
      this.resetDict()
    },

    /**
     * 清空字典
     */
    resetDict() {
      this.options1 = []
      this.options2 = []
      this.options3 = []
    }
  },
  mounted() {
    this.$emit('complete')
  }
}
</script>

<style lang="scss" scoped>
.form-wrapper {
  margin-left: 50px;
  margin-right: 50px;
}

.form-label {
  padding-left: 20px;
  // text-align: right;
}

.form-control-group {
  // margin-left: 16px;
  // margin-right: 16px;
  padding-right: 16px;
  background-color: #f4f5f7;
}

.form-control-group:first-child {
  padding-top: 18px;
}

.form-control-group:last-child {
  margin-bottom: 18px;
}

.el-radio:not(:last-child),
.el-checkbox:not(:last-child) {
  margin-right: 16px;
}

.custom-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 32px;
}

.custom-icon {
  display: inline-block;
  width: 20px;
  height: 20px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 20px 20px;
  cursor: pointer;
}

.custom-icon + .custom-icon {
  margin-left: 10px;
}

.custom-icon__add {
  background-image: url('~@/assets/svgs/icon-add.svg');
}

.custom-icon__delete {
  background-image: url('~@/assets/svgs/icon-delete.svg');
}
</style>
