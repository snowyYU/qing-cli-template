<template>
  <div>
    <div class="">
      <SchemaForm
        :schema="formatFormSchema"
        :model.sync="formData"
        ref="config-form"
        @diagnoseSource-change="handleFormChange('diagnoseSource', $event)"
        @natFlag-change="handleFormChange('natFlag', $event)"
        @virusTestFlag-change="handleFormChange('virusTestFlag', $event)"
      />
    </div>

    <div class="" v-show="formData.virusTestFlag === '1'">
      <!-- <LineEditTable
        :table-header="columns"
        :table-data="dataSource"
        :is-show-add="false"
      >
        <template #operation="{ scope }">
          <el-button type="text" @click="handleTableClick('create', scope)"
            >新增</el-button
          >
          <el-button
            type="text"
            :style="{ color: '#FF4D4D' }"
            @click="handleTableClick('delete', scope)"
            :disabled="dataSource.length === 1"
            >删除</el-button
          >
        </template>
      </LineEditTable> -->

      <el-form
        ref="table-form"
        :model="tableFormData"
        size="small"
        label-width="0px"
      >
        <el-table :data="tableFormData.dataSource" border>
          <el-table-column label="病原类型" prop="etiologyType">
            <template #default="scope">
              <el-form-item
                :prop="`dataSource.${scope.$index}.etiologyType`"
                :rules="formRules.etiologyType"
              >
                <el-select
                  :style="{ width: '100%' }"
                  v-model="scope.row.etiologyType"
                  placeholder="请选择病原类型"
                  clearable
                  @change="handleEtiologyTypeChange(scope.$index)"
                >
                  <el-option
                    :label="item.dictValue"
                    :value="item.dictCode"
                    v-for="item in etiologyTypeList"
                    :key="item.dictCode"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="其他病原体" prop="etiologyOther">
            <template #default="scope">
              <el-form-item
                :ref="`form-item-${scope.$index}-ref`"
                :prop="`dataSource.${scope.$index}.etiologyOther`"
                :rules="
                  scope.row.etiologyType === '99' ? formRules.etiologyOther : []
                "
              >
                <el-input
                  v-model="scope.row.etiologyOther"
                  placeholder="请输入其他病原体"
                  maxlength="10"
                  :disabled="scope.row.etiologyType !== '99'"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="检测结果" prop="testResult">
            <template #default="scope">
              <el-form-item
                :prop="`dataSource.${scope.$index}.testResult`"
                :rules="formRules.testResult"
              >
                <el-select
                  :style="{ width: '100%' }"
                  v-model="scope.row.testResult"
                  placeholder="请选择检测结果"
                  clearable
                >
                  <el-option
                    :label="item.dictValue"
                    :value="item.dictCode"
                    v-for="item in testResultList"
                    :key="item.dictCode"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="120">
            <template #default="scope">
              <el-button type="text" @click="handleTableClick('create', scope)"
                >新增</el-button
              >
              <el-button
                type="text"
                :style="{
                  color:
                    tableFormData.dataSource.length === 1
                      ? undefined
                      : '#FF4D4D'
                }"
                @click="handleTableClick('delete', scope)"
                :disabled="tableFormData.dataSource.length === 1"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </div>
  </div>
</template>

<script>
import isEmpty from 'lodash/isEmpty'
import SchemaForm from '@/components/ConfigForm'
// import LineEditTable from '@/components/LineEditTable'
import {
  caseInfoFormSchema as formSchema,
  caseInfoFormData as initFormData
  // caseInfoColumns as columns
} from './formConfig'
import { queryDictInfoByCategory, getRegion } from '@/api/common'

const initTableFormData = {
  etiologyType: '',
  etiologyOther: '',
  testResult: ''
}

export default {
  name: 'CaseInfo',
  components: {
    SchemaForm
    // LineEditTable
  },
  props: {
    detailData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      formSchema,
      formData: {
        ...initFormData
      },
      // columns,
      // dataSource: [],
      tableFormData: {
        dataSource: [
          {
            ...initTableFormData
          }
        ]
      },
      formRules: {
        etiologyType: [
          { required: true, message: '请选择病原类型', trigger: 'change' }
        ],
        etiologyOther: [
          { required: true, message: '请输入其他病原体', trigger: 'blur' }
        ],
        testResult: [
          { required: true, message: '请选择检测结果', trigger: 'change' }
        ]
      },
      etiologyTypeList: [],
      testResultList: []
    }
  },
  computed: {
    formatFormSchema() {
      const formatFormSchema = {
        ...this.formSchema,
        properties: [...this.formSchema.properties]
      }

      const filterKeys = []
      if (this.formData.natFlag === '0') {
        filterKeys.push('natResult')
      }
      if (this.formData.diagnoseSource !== '99') {
        filterKeys.push('otherSource')
      }

      formatFormSchema.properties = this.formSchema.properties.filter(
        item => !filterKeys.includes(item.key)
      )

      formatFormSchema.properties[
        this.formSchemaPropertiesMap['customAddr']
      ] = {
        ...this.formSchema.properties[
          this.formSchemaPropertiesMap['customAddr']
        ],
        props: {
          ...this.formSchema.properties[
            this.formSchemaPropertiesMap['customAddr']
          ].props,
          lazy: true,
          lazyLoad: (node, resolve) => {
            if (node.level < 4) {
              this.getRegion(node.value, res => {
                resolve(res)
              })
            } else {
              resolve([])
            }
          }
        }
      }

      return formatFormSchema
    },
    formSchemaPropertiesMap() {
      const map = {}
      this.formSchema.properties.forEach((item, index) => {
        map[item.key] = index
      })
      return map
    }
    // columnMap() {
    //   const map = {}
    //   this.columns.forEach((column, index) => {
    //     map[column.value] = index
    //   })
    //   return map
    // }
  },
  watch: {
    detailData(val) {
      if (!isEmpty(val)) {
        this.formatData(val)
      }
    }
  },
  methods: {
    /**
     * 格式化数据
     * @param {*} val
     */
    formatData(val) {
      const fields = {}
      Object.keys(this.formData).forEach(key => {
        if (typeof val[key] !== 'undefined' && val[key] !== null) {
          fields[key] = val[key]
        } else {
          fields[key] = initFormData[key]
        }
      })

      let customAddr = []
      if (val.curStreet) {
        customAddr = [
          val.curProvince,
          val.curCity,
          val.curCounty,
          val.curStreet
        ]
      } else if (val.curCounty) {
        customAddr = [val.curProvince, val.curCity, val.curCounty]
      } else if (val.curCity) {
        customAddr = [val.curProvince, val.curCity]
      } else if (val.curProvince) {
        customAddr = [val.curProvince]
      }
      fields.customAddr = customAddr

      if (customAddr.length > 0) {
        const pms = [getRegion({})]
        for (let i = 0; i < customAddr.length; i++) {
          const code = customAddr[i]
          if (i < customAddr.length - 1) {
            pms.push(getRegion({ parentCode: code }))
          }
        }
        Promise.all(pms).then(res => {
          let options = []
          let target = {}
          for (let i = 0; i < res.length; i++) {
            const arr = res[i].data

            if (i === 0) {
              options = arr
            } else {
              target.children = arr

              if (i === res.length - 1) {
                // 增加叶子节点标志
                const leafTarget = arr.find(
                  item => item.regionCode === customAddr[i]
                )
                leafTarget.leaf = true
                break
              }
            }

            target = arr.find(item => item.regionCode === customAddr[i])
          }

          this.formSchema.properties[
            this.formSchemaPropertiesMap['customAddr']
          ].options = options
        })
      }

      this.formData = fields

      if (
        val.labEtiologyList &&
        Array.isArray(val.labEtiologyList) &&
        val.labEtiologyList.length > 0
      ) {
        this.tableFormData.dataSource = val.labEtiologyList
      } else {
        this.tableFormData.dataSource = [
          {
            etiologyType: '',
            etiologyOther: '',
            testResult: ''
          }
        ]
      }
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
     * 获取省市区
     */
    getRegion(code, callback) {
      const params = {}
      if (code) {
        params.parentCode = code
      }
      getRegion(params).then(res => {
        callback && callback(res.data)
      })
    },

    /**
     *
     */
    handleFormChange(type, value) {
      // switch (type) {
      //   case 'diagnoseSource':
      //     if (value === '99') {
      //       this.formData.otherSource = ''
      //     }
      //     break
      //   case 'natFlag':
      //     if (value === '0') {
      //       this.formData.natResult = ''
      //     }
      //     break
      //   case 'virusTestFlag':
      //     break
      // }
    },

    handleEtiologyTypeChange(index) {
      this.$refs[`form-item-${index}-ref`].clearValidate()
    },

    /**
     * 表格功能键
     */
    handleTableClick(type, scope) {
      switch (type) {
        case 'create':
          this.tableFormData.dataSource.push({
            etiologyType: '',
            etiologyOther: '',
            testResult: ''
          })
          break
        case 'delete':
          this.$confirm('是否删除选中项?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.tableFormData.dataSource.splice(scope.$index, 1)
            })
            .catch()
          break
      }
    },

    init() {
      // 确诊病因
      this.queryDictInfoByCategory('diagnoseSource', res => {
        this.formSchema.properties[
          this.formSchemaPropertiesMap['diagnoseSource']
        ].options = res
      })

      // 病原类型
      this.queryDictInfoByCategory('etiologyType', res => {
        // this.columns[this.columnMap['etiologyType']].options = res

        this.etiologyTypeList = res
      })

      // 检测结果
      this.queryDictInfoByCategory('natResult', res => {
        this.formSchema.properties[
          this.formSchemaPropertiesMap['natResult']
        ].options = res

        // this.columns[this.columnMap['testResult']].options = res

        this.testResultList = res
      })
    },

    submit() {
      const result = this.$refs['config-form'].validateForm()
      if (result) {
        const fields = {
          id: this.detailData.id
        }

        const keys = Object.keys(this.formData)
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i]
          if (key === 'customAddr') {
            // 现住址
            const customAddr = this.formData[key]
            if (customAddr[0]) {
              fields.curProvince = customAddr[0]
            }
            if (customAddr[1]) {
              fields.curCity = customAddr[1]
            }
            if (customAddr[2]) {
              fields.curCounty = customAddr[2]
            }
            if (customAddr[3]) {
              fields.curStreet = customAddr[3]
            }
          } else if (
            ['curProvince', 'curCity', 'curCounty', 'curStreet'].includes(key)
          ) {
            continue
          } else if (key === 'otherSource') {
            // 其他病因
            if (this.formData.diagnoseSource !== '99') {
              fields[key] = this.formData[key]
            } else {
              // fields[key] = ''
            }
          } else if (key === 'natResult') {
            // 核酸监测结果
            if (this.formData.natFlag === '1') {
              fields[key] = this.formData[key]
            } else {
              // fields[key] = ''
            }
          } else {
            fields[key] = this.formData[key]
          }
        }

        if (this.formData.virusTestFlag === '1') {
          this.$refs['table-form'].validate(valid => {
            if (valid) {
              fields.labEtiologyList = this.tableFormData.dataSource.map(
                item => ({
                  ...item,
                  reportId: item.reportId || this.detailData.id
                })
              )
              this.$emit('submit', fields)
            }
          })
        } else {
          // fields.labEtiologyList = []
          this.$emit('submit', fields)
        }
      }
    },

    reset() {
      this.formSchema.properties[
        this.formSchemaPropertiesMap['customAddr']
      ].options = []
      this.formSchema.properties[
        this.formSchemaPropertiesMap['diagnoseSource']
      ].options = []
      this.formSchema.properties[
        this.formSchemaPropertiesMap['natResult']
      ].options = []
      // this.columns[this.columnMap['etiologyType']].options = []
      // this.columns[this.columnMap['testResult']].options = []
      this.etiologyTypeList = []
      this.testResultList = []

      this.formData = {
        ...initFormData
      }

      this.tableFormData.dataSource = [
        {
          ...initTableFormData
        }
      ]
      this.$nextTick(() => {
        this.$refs['table-form'].resetFields()
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
