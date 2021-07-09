<template>
  <el-form
    :model="formData"
    ref="form"
    size="small"
    :disabled="mode === 'view'"
  >
    <el-row>
      <el-col :span="24">
        <el-row>
          <el-col :span="12">
            <el-form-item
              prop="name"
              label="患者姓名"
              label-width="125px"
              :rules="formRules.name"
            >
              <el-input
                v-model="formData.name"
                placeholder="请输入患者姓名"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="10">
            <el-form-item
              prop="sexCode"
              label="性别"
              label-width="125px"
              :rules="formRules.sexCode"
            >
              <el-select
                :style="{ width: '100%' }"
                v-model="formData.sexCode"
                clearable
                placeholder="请选择性别"
              >
                <el-option
                  :label="item.dictValue"
                  :value="item.dictCode"
                  v-for="item in genderList"
                  :key="item.dictCode"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-col>

      <el-col :span="24">
        <el-row>
          <el-col :span="12">
            <el-form-item
              prop="certType"
              label="证件类型"
              label-width="125px"
              :rules="formRules.certType"
            >
              <el-select
                :style="{ width: '100%' }"
                v-model="formData.certType"
                clearable
                placeholder="请选择证件类型"
              >
                <el-option
                  :label="item.dictValue"
                  :value="item.dictCode"
                  v-for="item in certTypeList"
                  :key="item.dictCode"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="10">
            <el-form-item
              prop="certNo"
              label="证件号码"
              label-width="125px"
              :rules="formRules.certNo"
            >
              <el-input
                v-model="formData.certNo"
                placeholder="请输入证件号码"
                @blur="handleBlur"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-col>

      <el-col :span="24">
        <el-row>
          <el-col :span="12">
            <el-form-item
              prop="birthDate"
              label="出生日期"
              label-width="125px"
              :rules="[]"
            >
              <el-date-picker
                :style="{ width: '100%' }"
                type="date"
                v-model="formData.birthDate"
                placeholder="请选择日期"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item
              prop="age"
              label="年龄"
              label-width="125px"
              :rules="formRules.age"
            >
              <el-input
                v-model="formData.age"
                placeholder="请输入年龄"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item
              prop="ageDimension"
              label=""
              label-width="10px"
              :rules="formRules.ageDimension"
            >
              <el-radio-group v-model="formData.ageDimension">
                <el-radio
                  class="age-dimension"
                  :label="item.dictCode"
                  v-for="item in dimensionList"
                  :key="item.dictCode"
                  >{{ item.dictValue }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-col>

      <el-col :span="24">
        <el-row>
          <el-col :span="10">
            <el-form-item
              prop="registerType"
              label="户籍所在地"
              label-width="125px"
              :rules="[]"
            >
              <el-radio-group v-model="formData.registerType">
                <el-radio
                  class="register-type"
                  :label="item.dictCode"
                  v-for="item in locationTypeList"
                  :key="item.dictCode"
                  >{{ item.dictValue }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>

          <!-- 户籍地址 -->
          <el-col :span="12">
            <el-row>
              <el-col :span="9">
                <el-form-item
                  prop="registerProvinceCode"
                  label="户籍地址"
                  label-width="70px"
                  :rules="[]"
                >
                  <el-select
                    :style="{ width: '100%' }"
                    v-model="formData.registerProvinceCode"
                    clearable
                    placeholder="请选择省份"
                    @change="handleChange('province', 'register', $event)"
                  >
                    <el-option
                      :label="item.regionName"
                      :value="item.regionCode"
                      v-for="item in registerProvinceList"
                      :key="item.regionCode"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="5">
                <el-form-item
                  prop="registerCityCode"
                  label=""
                  label-width="5px"
                  :rules="[]"
                >
                  <el-select
                    :style="{ width: '100%' }"
                    :loading="registerCityLoading"
                    v-model="formData.registerCityCode"
                    clearable
                    placeholder="请选择城市"
                    @change="handleChange('city', 'register', $event)"
                    @visible-change="
                      handleVisibleChange('city', 'register', $event)
                    "
                  >
                    <el-option
                      :label="item.regionName"
                      :value="item.regionCode"
                      v-for="item in registerCityList"
                      :key="item.regionCode"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="5">
                <el-form-item
                  prop="registerCountyCode"
                  label=""
                  label-width="5px"
                  :rules="[]"
                >
                  <el-select
                    :style="{ width: '100%' }"
                    :loading="registerCountyLoading"
                    v-model="formData.registerCountyCode"
                    clearable
                    placeholder="请选择区县"
                    @change="handleChange('county', 'register', $event)"
                    @visible-change="
                      handleVisibleChange('county', 'register', $event)
                    "
                  >
                    <el-option
                      :label="item.regionName"
                      :value="item.regionCode"
                      v-for="item in registerCountyList"
                      :key="item.regionCode"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="5">
                <el-form-item
                  prop="registerStreetCode"
                  label=""
                  label-width="5px"
                  :rules="[]"
                >
                  <el-select
                    :style="{ width: '100%' }"
                    :loading="registerStreetLoading"
                    v-model="formData.registerStreetCode"
                    clearable
                    placeholder="请选择街道"
                    @change="handleChange('street', 'register', $event)"
                    @visible-change="
                      handleVisibleChange('street', 'register', $event)
                    "
                  >
                    <el-option
                      :label="item.regionName"
                      :value="item.regionCode"
                      v-for="item in registerStreetList"
                      :key="item.regionCode"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-col>

      <!-- 现住址 -->
      <el-col :span="24">
        <el-row>
          <el-col :span="9">
            <el-form-item
              prop="caseProvinceCode"
              label="现住址"
              label-width="125px"
              :rules="[]"
            >
              <el-select
                :style="{ width: '100%' }"
                v-model="formData.caseProvinceCode"
                clearable
                placeholder="请选择省份"
                @change="handleChange('province', 'case', $event)"
              >
                <el-option
                  :label="item.regionName"
                  :value="item.regionCode"
                  v-for="item in caseProvinceList"
                  :key="item.regionCode"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item
              prop="caseCityCode"
              label=""
              label-width="10px"
              :rules="[]"
            >
              <el-select
                :style="{ width: '100%' }"
                :loading="caseCityLoading"
                v-model="formData.caseCityCode"
                clearable
                placeholder="请选择城市"
                @change="handleChange('city', 'case', $event)"
                @visible-change="handleVisibleChange('city', 'case', $event)"
              >
                <el-option
                  :label="item.regionName"
                  :value="item.regionCode"
                  v-for="item in caseCityList"
                  :key="item.regionCode"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item
              prop="caseCountyCode"
              label=""
              label-width="10px"
              :rules="[]"
            >
              <el-select
                :style="{ width: '100%' }"
                :loading="caseCountyLoading"
                v-model="formData.caseCountyCode"
                clearable
                placeholder="请选择区县"
                @change="handleChange('county', 'case', $event)"
                @visible-change="handleVisibleChange('county', 'case', $event)"
              >
                <el-option
                  :label="item.regionName"
                  :value="item.regionCode"
                  v-for="item in caseCountyList"
                  :key="item.regionCode"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item
              prop="caseStreetCode"
              label=""
              label-width="10px"
              :rules="[]"
            >
              <el-select
                :style="{ width: '100%' }"
                :loading="caseStreetLoading"
                v-model="formData.caseStreetCode"
                clearable
                placeholder="请选择街道"
                @change="handleChange('street', 'case', $event)"
                @visible-change="handleVisibleChange('street', 'case', $event)"
              >
                <el-option
                  :label="item.regionName"
                  :value="item.regionCode"
                  v-for="item in caseStreetList"
                  :key="item.regionCode"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-col>

      <el-col :span="22">
        <el-form-item
          prop="address"
          label="详细地址"
          label-width="125px"
          :rules="[]"
        >
          <el-input
            v-model="formData.address"
            placeholder="请输入详细地址"
          ></el-input>
        </el-form-item>
      </el-col>

      <el-col :span="24">
        <el-row>
          <el-col :span="11">
            <el-form-item
              prop="lng"
              label="经度"
              label-width="125px"
              :rules="formRules.lng"
            >
              <el-input
                v-model="formData.lng"
                placeholder="请选择经度"
                :disabled="true"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item
              prop="lat"
              label="纬度"
              label-width="125px"
              :rules="formRules.lat"
            >
              <el-input
                v-model="formData.lat"
                placeholder="请选择纬度"
                :disabled="true"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-col>

      <el-col :span="24">
        <div
          class="form-control-group"
          v-for="(addr, addrIndex) in formData.addrInfo"
          :key="'addrInfo-' + addrIndex"
        >
          <el-row>
            <el-col :span="9">
              <el-form-item
                :prop="`addrInfo.${addrIndex}.provinceCode`"
                label="常驻地址"
                label-width="125px"
                :rules="[]"
              >
                <el-select
                  :style="{ width: '100%' }"
                  v-model="addr.provinceCode"
                  clearable
                  placeholder="请选择省份"
                  @change="
                    handleChange('province', 'addr-' + addrIndex, $event)
                  "
                >
                  <el-option
                    :label="item.regionName"
                    :value="item.regionCode"
                    v-for="item in provinceList"
                    :key="item.regionCode"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="4">
              <el-form-item
                :prop="`addrInfo.${addrIndex}.cityCode`"
                label=""
                label-width="10px"
                :rules="[]"
              >
                <el-select
                  :style="{ width: '100%' }"
                  :loading="addrArea[addrIndex].cityLoading"
                  v-model="addr.cityCode"
                  clearable
                  placeholder="请选择城市"
                  @change="handleChange('city', 'addr-' + addrIndex, $event)"
                  @visible-change="
                    handleVisibleChange('city', 'addr-' + addrIndex, $event)
                  "
                >
                  <el-option
                    :label="item.regionName"
                    :value="item.regionCode"
                    v-for="item in addrArea[addrIndex].cityList"
                    :key="item.regionCode"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="4">
              <el-form-item
                :prop="`addrInfo.${addrIndex}.countyCode`"
                label=""
                label-width="10px"
                :rules="[]"
              >
                <el-select
                  :style="{ width: '100%' }"
                  :loading="addrArea[addrIndex].countyLoading"
                  v-model="addr.countyCode"
                  clearable
                  placeholder="请选择区县"
                  @change="handleChange('county', 'addr-' + addrIndex, $event)"
                  @visible-change="
                    handleVisibleChange('county', 'addr-' + addrIndex, $event)
                  "
                >
                  <el-option
                    :label="item.regionName"
                    :value="item.regionCode"
                    v-for="item in addrArea[addrIndex].countyList"
                    :key="item.regionCode"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="4">
              <el-form-item
                :prop="`addrInfo.${addrIndex}.streetCode`"
                label=""
                label-width="10px"
                :rules="[]"
              >
                <el-select
                  :style="{ width: '100%' }"
                  :loading="addrArea[addrIndex].streetLoading"
                  v-model="addr.streetCode"
                  clearable
                  placeholder="请选择街道"
                  @change="handleChange('street', 'addr-' + addrIndex, $event)"
                  @visible-change="
                    handleVisibleChange('street', 'addr-' + addrIndex, $event)
                  "
                >
                  <el-option
                    :label="item.regionName"
                    :value="item.regionCode"
                    v-for="item in addrArea[addrIndex].streetList"
                    :key="item.regionCode"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="22">
              <el-form-item
                :prop="`addrInfo.${addrIndex}.addr`"
                label="常驻详细地址"
                label-width="125px"
                :rules="[]"
              >
                <el-input
                  v-model="addr.addr"
                  placeholder="请输入常驻详细地址"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="2" v-if="mode !== 'view'">
              <div class="custom-icon-wrapper" :style="{ paddingLeft: '10px' }">
                <i
                  class="custom-icon custom-icon__add"
                  @click="handleClick('add', 'addrInfo', addrIndex)"
                  v-if="addrIndex === 0"
                ></i>
                <i
                  class="custom-icon custom-icon__delete"
                  @click="handleClick('delete', 'addrInfo', addrIndex)"
                  v-if="formData.addrInfo.length > 1"
                ></i>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>

      <el-col :span="24">
        <el-row>
          <el-col :span="12">
            <el-form-item
              prop="occupation"
              label="职业"
              label-width="125px"
              :rules="[]"
            >
              <el-select
                :style="{ width: '100%' }"
                v-model="formData.occupation"
                clearable
                placeholder="请选择职业"
              >
                <el-option
                  :label="item.dictValue"
                  :value="item.dictCode"
                  v-for="item in occupationList"
                  :key="item.dictCode"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="10">
            <el-form-item
              prop="company"
              label="工作单位"
              label-width="125px"
              :rules="[]"
            >
              <el-input
                v-model="formData.company"
                placeholder="请输入工作单位"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-col>

      <el-col :span="24">
        <el-row>
          <el-col :span="9">
            <el-form-item
              prop="companyProvinceCode"
              label="工作单位地址"
              label-width="125px"
              :rules="[]"
            >
              <el-select
                :style="{ width: '100%' }"
                v-model="formData.companyProvinceCode"
                clearable
                placeholder="请选择省份"
                @change="handleChange('province', 'company', $event)"
              >
                <el-option
                  :label="item.regionName"
                  :value="item.regionCode"
                  v-for="item in companyProvinceList"
                  :key="item.regionCode"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item
              prop="companyCityCode"
              label=""
              label-width="10px"
              :rules="[]"
            >
              <el-select
                :style="{ width: '100%' }"
                :loading="companyCityLoading"
                v-model="formData.companyCityCode"
                clearable
                placeholder="请选择城市"
                @change="handleChange('city', 'company', $event)"
                @visible-change="handleVisibleChange('city', 'company', $event)"
              >
                <el-option
                  :label="item.regionName"
                  :value="item.regionCode"
                  v-for="item in companyCityList"
                  :key="item.regionCode"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item
              prop="companyCountyCode"
              label=""
              label-width="10px"
              :rules="[]"
            >
              <el-select
                :style="{ width: '100%' }"
                :loading="companyCountyLoading"
                v-model="formData.companyCountyCode"
                clearable
                placeholder="请选择区县"
                @change="handleChange('county', 'company', $event)"
                @visible-change="
                  handleVisibleChange('county', 'company', $event)
                "
              >
                <el-option
                  :label="item.regionName"
                  :value="item.regionCode"
                  v-for="item in companyCountyList"
                  :key="item.regionCode"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item
              prop="companyStreetCode"
              label=""
              label-width="10px"
              :rules="[]"
            >
              <el-select
                :style="{ width: '100%' }"
                :loading="companyStreetLoading"
                v-model="formData.companyStreetCode"
                clearable
                placeholder="请选择街道"
                @change="handleChange('street', 'company', $event)"
                @visible-change="
                  handleVisibleChange('street', 'company', $event)
                "
              >
                <el-option
                  :label="item.regionName"
                  :value="item.regionCode"
                  v-for="item in companyStreetList"
                  :key="item.regionCode"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-col>

      <el-col :span="22">
        <el-form-item
          prop="companyAddress"
          label="工作单位详细地址"
          label-width="125px"
          :rules="[]"
        >
          <el-input
            v-model="formData.companyAddress"
            placeholder="请输入工作单位详细地址"
          ></el-input>
        </el-form-item>
      </el-col>

      <el-col :span="24">
        <el-row>
          <el-col :span="12">
            <el-form-item
              prop="contactPhone"
              label="联系电话"
              label-width="125px"
              :rules="formRules.contactPhone"
            >
              <el-input
                v-model="formData.contactPhone"
                placeholder="请输入联系电话"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-col>

      <el-col :span="24">
        <el-row>
          <el-col :span="12">
            <el-form-item
              prop="otherContactPhone"
              label="其他人联系电话"
              label-width="125px"
              :rules="[]"
            >
              <el-input
                v-model="formData.otherContactPhone"
                placeholder="请输入其他人联系电话"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="10">
            <el-form-item
              prop="relationShip"
              label="关系"
              label-width="125px"
              :rules="[]"
            >
              <el-input
                v-model="formData.relationShip"
                placeholder="请输入关系"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-col>

      <el-col :span="22">
        <el-form-item
          prop="remark"
          label="备注"
          label-width="125px"
          :rules="[]"
        >
          <el-input
            v-model="formData.remark"
            type="textarea"
            placeholder="请输入备注"
          ></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { queryDictInfoByCategory, getRegion, idNumberInfo } from '@/api/common'
import isEmpty from 'lodash/isEmpty'
import cloneDeep from 'lodash/cloneDeep'
// import debounce from 'lodash/debounce'

const initFormData = {
  name: '', // 患者姓名
  sexCode: '', // 性别
  certType: '', // 证件类型
  certNo: '', // 证件号码
  birthDate: '', // 出生日期
  age: '', // 年龄
  ageDimension: '', // 年龄类型
  registerType: '', // 户籍所在地
  registerProvinceCode: '', // 户籍地址省份
  registerProvinceName: '',
  registerCityCode: '', // 户籍地址城市
  registerCityName: '',
  registerCountyCode: '', // 户籍地址区县
  registerCountyName: '',
  registerStreetCode: '', // 户籍地址街道
  registerStreetName: '',
  caseProvinceCode: '', // 现住址省份
  caseProvinceName: '',
  caseCityCode: '', // 现住址城市
  caseCityName: '',
  caseCountyCode: '', // 现住址区县
  caseCountyName: '',
  caseStreetCode: '', // 现住址街道
  caseStreetName: '',
  address: '', // 详细地址
  lng: '', // 经度
  lat: '', // 纬度
  addrInfo: [
    {
      provinceCode: '', // 常驻地址省份
      provinceName: '',
      cityCode: '', // 常驻地址城市
      cityName: '',
      countyCode: '', // 常驻地址区县
      countyName: '',
      streetCode: '', // 常驻地址街道
      streetName: '',
      addr: '' // 常驻详细地址
    }
  ],
  occupation: '', // 职业
  company: '', // 工作单位
  companyProvinceCode: '', // 工作单位地址省份
  companyProvinceName: '',
  companyCityCode: '', // 工作单位地址城市
  companyCityName: '',
  companyCountyCode: '', // 工作单位地址区县
  companyCountyName: '',
  companyStreetCode: '', // 工作单位地址街道
  companyStreetName: '',
  companyAddress: '', // 工作单位详细地址
  contactPhone: '', // 联系电话
  otherContactPhone: '', // 其他人联系电话
  relationShip: '', // 关系
  remark: '' // 备注
}

export default {
  name: 'BasicInfoForm',
  props: {
    mode: {
      type: String,
      default: ''
    },
    caseDialogAllInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    // this.lastRequestId = 0
    // this.handleInput = debounce(this.handleInput, 800)

    const validateAge = (rule, value, callback) => {
      if (value && !/^\d+$/.test(value)) {
        callback(new Error('年龄必须为数字'))
      } else {
        callback()
      }
    }

    return {
      formData: cloneDeep(initFormData),
      formRules: {
        name: [{ required: true, message: '请输入患者姓名', trigger: 'blur' }],
        certType: [
          { required: true, message: '请选择证件类型', trigger: 'change' }
        ],
        certNo: [
          { required: true, message: '请输入证件号码', trigger: 'blur' }
        ],
        sexCode: [{ required: true, message: '请选择性别', trigger: 'change' }],
        age: [
          { required: true, message: '请输入年龄', trigger: 'blur' },
          { validator: validateAge, trigger: 'blur' }
        ],
        ageDimension: [
          { required: true, message: '请选择年龄类型', trigger: 'change' }
        ],
        contactPhone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' }
        ],
        lng: [{ required: true, message: '请选择经度', trigger: 'blur' }],
        lat: [{ required: true, message: '请选择纬度', trigger: 'blur' }]
      },

      // 性别
      genderList: [],

      // 职业
      occupationList: [],

      // 证件类型
      certTypeList: [],

      // 户籍所在地
      locationTypeList: [],

      // 年龄类型
      dimensionList: [],

      /***** 户籍地址 start *****/
      registerCityLoading: false,
      registerCountyLoading: false,
      registerStreetLoading: false,
      registerProvinceList: [],
      registerCityList: [],
      registerCountyList: [],
      registerStreetList: [],
      /***** 户籍地址 end *****/

      /***** 现住址 start *****/
      caseCityLoading: false,
      caseCountyLoading: false,
      caseStreetLoading: false,
      caseProvinceList: [],
      caseCityList: [],
      caseCountyList: [],
      caseStreetList: [],
      /***** 现住址 end *****/

      /***** 常住地址 start *****/
      provinceList: [],
      addrArea: [
        {
          cityLoading: false,
          countyLoading: false,
          streetLoading: false,
          cityList: [],
          countyList: [],
          streetList: []
        }
      ],
      /***** 常住地址 end *****/

      /***** 工作单位地址 start *****/
      companyCityLoading: false,
      companyCountyLoading: false,
      companyStreetLoading: false,
      companyProvinceList: [],
      companyCityList: [],
      companyCountyList: [],
      companyStreetList: []
      /***** 工作单位地址 end *****/
    }
  },
  watch: {
    caseDialogAllInfo(val) {
      if (val && !isEmpty(val.caseInfo)) {
        this.formatData(val.caseInfo)
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

      if (
        data.addrInfo &&
        Array.isArray(data.addrInfo) &&
        data.addrInfo.length > 0
      ) {
        this.addrArea = data.addrInfo.map(addr => {
          let cityList = []
          let countyList = []
          let streetList = []
          if (addr.cityCode && addr.cityName) {
            cityList = [
              {
                regionCode: addr.cityCode,
                regionName: addr.cityName
              }
            ]
          }
          if (addr.countyCode && addr.countyName) {
            countyList = [
              {
                regionCode: addr.countyCode,
                regionName: addr.countyName
              }
            ]
          }
          if (addr.streetCode && addr.streetName) {
            streetList = [
              {
                regionCode: addr.streetCode,
                regionName: addr.streetName
              }
            ]
          }
          return {
            cityLoading: false,
            countyLoading: false,
            streetLoading: false,
            cityList,
            countyList,
            streetList
          }
        })
      } else {
        this.addrArea = [
          {
            cityLoading: false,
            countyLoading: false,
            streetLoading: false,
            cityList: [],
            countyList: [],
            streetList: []
          }
        ]
      }

      this.formData = fields

      const prefixList = ['register', 'case', 'company']
      prefixList.forEach(target => {
        if (data[`${target}CityCode`] && data[`${target}CityName`]) {
          this[`${target}CityList`] = [
            {
              regionCode: data[`${target}CityCode`],
              regionName: data[`${target}CityName`]
            }
          ]
        }
        if (data[`${target}CountyCode`] && data[`${target}CountyName`]) {
          this[`${target}CountyList`] = [
            {
              regionCode: data[`${target}CountyCode`],
              regionName: data[`${target}CountyName`]
            }
          ]
        }
        if (data[`${target}StreetCode`] && data[`${target}StreetName`]) {
          this[`${target}StreetList`] = [
            {
              regionCode: data[`${target}StreetCode`],
              regionName: data[`${target}StreetName`]
            }
          ]
        }
      })
    },

    /**
     * 获取字典
     * @param {string} key
     * @param {function} callback
     */
    queryDictInfoByCategory(key, callback) {
      const params = { dictKey: key }
      queryDictInfoByCategory(params).then(res => {
        callback && callback(res.data)
      })
    },

    /**
     * 获取省市区
     * @param {number} code
     * @param {function} callback
     * @param {function} fn
     */
    getRegion(code, callback, fn) {
      const params = {}
      if (code) {
        params.parentCode = code
      }
      getRegion(params)
        .then(res => {
          callback && callback(res.data)
        })
        .finally(() => {
          fn && fn()
        })
    },

    /**
     * 根据身份证获取出生日期和性别
     */
    idNumberInfo(params, callback) {
      idNumberInfo(params).then(res => {
        callback && callback(res.data)
      })
    },

    /**
     *  点击事件
     */
    handleClick(type, target, index) {
      switch (type) {
        case 'add':
          switch (target) {
            case 'addrInfo':
              this.formData.addrInfo.push({
                provinceCode: '', // 常驻地址省份
                provinceName: '',
                cityCode: '', // 常驻地址城市
                cityName: '',
                countyCode: '', // 常驻地址区县
                countyName: '',
                streetCode: '', // 常驻地址街道
                streetName: '',
                addr: '' // 常驻详细地址
              })
              this.addrArea.push({
                cityLoading: false,
                countyLoading: false,
                streetLoading: false,
                cityList: [],
                countyList: [],
                streetList: []
              })
              break
          }
          break
        case 'delete':
          switch (target) {
            case 'addrInfo':
              this.formData.addrInfo.splice(index, 1)
              this.addrArea.splice(index, 1)
              break
          }
          break
      }
    },

    /**
     * 下拉框更新事件
     */
    handleChange(type, target, value) {
      if (target.indexOf('-') > -1) {
        // 常驻地址(省市区街)动态增删表单逻辑

        const index = Number(target.split('-')[1])

        let region = null
        switch (type) {
          case 'province':
            if (value) {
              region = this.provinceList.find(item => item.regionCode === value)

              if (region) {
                this.formData.addrInfo[index].provinceName = region.regionName
              }

              this.addrArea[index].cityLoading = true
              this.getRegion(
                value,
                res => {
                  this.addrArea[index].cityList = res
                },
                () => {
                  this.addrArea[index].cityLoading = false
                }
              )
            } else {
              this.formData.addrInfo[index].provinceName = ''
              this.addrArea[index].cityList = []
            }

            this.addrArea[index].countyList = []
            this.addrArea[index].streetList = []
            this.formData.addrInfo[index].cityCode = ''
            this.formData.addrInfo[index].countyCode = ''
            this.formData.addrInfo[index].streetCode = ''
            break
          case 'city':
            if (value) {
              region = this.addrArea[index].cityList.find(
                item => item.regionCode === value
              )

              if (region) {
                this.formData.addrInfo[index].cityName = region.regionName
              }

              this.addrArea[index].countyLoading = true
              this.getRegion(
                value,
                res => {
                  this.addrArea[index].countyList = res
                },
                () => {
                  this.addrArea[index].countyLoading = false
                }
              )
            } else {
              this.formData.addrInfo[index].cityName = ''
              this.addrArea[index].countyList = []
            }

            this.addrArea[index].streetList = []
            this.formData.addrInfo[index].countyCode = ''
            this.formData.addrInfo[index].streetCode = ''
            break
          case 'county':
            if (value) {
              region = this.addrArea[index].countyList.find(
                item => item.regionCode === value
              )

              if (region) {
                this.formData.addrInfo[index].countyName = region.regionName
              }

              this.addrArea[index].streetLoading = true
              this.getRegion(
                value,
                res => {
                  this.addrArea[index].streetList = res
                },
                () => {
                  this.addrArea[index].streetLoading = false
                }
              )
            } else {
              this.formData.addrInfo[index].countyName = ''
              this.addrArea[index].streetList = []
            }

            this.formData.addrInfo[index].streetCode = ''
            break
          case 'street':
            if (value) {
              region = this.addrArea[index].streetList.find(
                item => item.regionCode === value
              )

              if (region) {
                this.formData.addrInfo[index].streetName = region.regionName
              }
            } else {
              this.formData.addrInfo[index].streetName = ''
            }
            break
        }
      } else {
        // 普通(省市区街)表单逻辑

        let region = null
        switch (type) {
          case 'province':
            if (value) {
              region = this[`${target}ProvinceList`].find(
                item => item.regionCode === value
              )

              if (region) {
                this.formData[`${target}ProvinceName`] = region.regionName
              }

              this[`${target}CityLoading`] = true
              this.getRegion(
                value,
                res => {
                  this[`${target}CityList`] = res
                },
                () => {
                  this[`${target}CityLoading`] = false
                }
              )
            } else {
              this.formData[`${target}CityName`] = ''
              this[`${target}CityList`] = []
            }

            this[`${target}CountyList`] = []
            this[`${target}StreetList`] = []
            this.formData[`${target}CityCode`] = ''
            this.formData[`${target}CountyCode`] = ''
            this.formData[`${target}StreetCode`] = ''
            break
          case 'city':
            if (value) {
              region = this[`${target}CityList`].find(
                item => item.regionCode === value
              )

              if (region) {
                this.formData[`${target}CityName`] = region.regionName
              }

              this[`${target}CountyLoading`] = true
              this.getRegion(
                value,
                res => {
                  this[`${target}CountyList`] = res
                },
                () => {
                  this[`${target}CountyLoading`] = false
                }
              )
            } else {
              this.formData[`${target}CityName`] = ''
              this[`${target}CountyList`] = []
            }

            this[`${target}StreetList`] = []
            this.formData[`${target}CountyCode`] = ''
            this.formData[`${target}StreetCode`] = ''
            break
          case 'county':
            if (value) {
              region = this[`${target}CountyList`].find(
                item => item.regionCode === value
              )

              if (region) {
                this.formData[`${target}CountyName`] = region.regionName
              }

              this[`${target}StreetLoading`] = true
              this.getRegion(
                value,
                res => {
                  this[`${target}StreetList`] = res
                },
                () => {
                  this[`${target}StreetLoading`] = false
                }
              )
            } else {
              this.formData[`${target}CountyName`] = ''
              this[`${target}StreetList`] = []
            }

            this.formData[`${target}StreetCode`] = ''
            break
          case 'street':
            if (value) {
              region = this[`${target}StreetList`].find(
                item => item.regionCode === value
              )

              if (region) {
                this.formData[`${target}StreetName`] = region.regionName
              }
            } else {
              this.formData[`${target}StreetName`] = ''
            }
            break
        }
      }
    },

    /**
     * 下拉框出现/隐藏时触发
     */
    handleVisibleChange(type, target, value) {
      if (
        value &&
        this.caseDialogAllInfo &&
        !isEmpty(this.caseDialogAllInfo.caseInfo)
      ) {
        if (target.indexOf('-') > -1) {
          // 常驻地址(省市区街)动态增删表单逻辑
          const index = Number(target.split('-')[1])
          switch (type) {
            case 'city':
              if (
                this.formData.addrInfo[index].provinceCode &&
                this.addrArea[index].cityList.length < 2
              ) {
                this.addrArea[index].cityLoading = true
                this.getRegion(
                  this.formData.addrInfo[index].provinceCode,
                  res => {
                    this.addrArea[index].cityList = res
                  },
                  () => {
                    this.addrArea[index].cityLoading = false
                  }
                )
              }
              break
            case 'county':
              if (
                this.formData.addrInfo[index].cityCode &&
                this.addrArea[index].countyList.length < 2
              ) {
                this.addrArea[index].countyLoading = true
                this.getRegion(
                  this.formData.addrInfo[index].cityCode,
                  res => {
                    this.addrArea[index].countyList = res
                  },
                  () => {
                    this.addrArea[index].countyLoading = false
                  }
                )
              }
              break
            case 'street':
              if (
                this.formData.addrInfo[index].countyCode &&
                this.addrArea[index].streetList.length < 2
              ) {
                this.addrArea[index].streetLoading = true
                this.getRegion(
                  this.formData.addrInfo[index].countyCode,
                  res => {
                    this.addrArea[index].streetList = res
                  },
                  () => {
                    this.addrArea[index].streetLoading = false
                  }
                )
              }
              break
          }
        } else {
          // 普通(省市区街)表单逻辑
          switch (type) {
            case 'city':
              if (
                this.formData[`${target}ProvinceCode`] &&
                this[`${target}CityList`].length < 2
              ) {
                this[`${target}CityLoading`] = true
                this.getRegion(
                  this.formData[`${target}ProvinceCode`],
                  res => {
                    this.formData[`${target}CityList`] = res
                  },
                  () => {
                    this[`${target}CityLoading`] = false
                  }
                )
              }
              break
            case 'county':
              if (
                this.formData[`${target}CityCode`] &&
                this[`${target}CountyList`].length < 2
              ) {
                this[`${target}CountyLoading`] = true
                this.getRegion(
                  this.formData[`${target}CityCode`],
                  res => {
                    this.formData[`${target}CountyList`] = res
                  },
                  () => {
                    this[`${target}CountyLoading`] = false
                  }
                )
              }
              break
            case 'street':
              if (
                this.formData[`${target}CountyCode`] &&
                this[`${target}StreetList`].length < 2
              ) {
                this[`${target}StreetLoading`] = true
                this.getRegion(
                  this.formData[`${target}CountyCode`],
                  res => {
                    this.formData[`${target}StreetList`] = res
                  },
                  () => {
                    this[`${target}StreetLoading`] = false
                  }
                )
              }
              break
          }
        }
      }
    },

    /**
     * 输入事件
     * 身份证号逻辑
     * @param {*} value
     */
    // handleInput(value) {
    //   if (!value || this.formData.certType !== '01') {
    //     return
    //   }

    //   this.lastRequestId += 1
    //   const requestId = this.lastRequestId
    //   const params = { idNumber: value }
    //   idNumberInfo(params).then(res => {
    //     if (requestId !== this.lastRequestId) {
    //       return
    //     }
    //     // console.log(res)
    //     const { birthDate, sexCode } = res.data
    //     this.formData.birthDate = birthDate
    //     this.formData.sexCode = sexCode
    //   })
    // },

    /**
     * 失焦事件
     */
    handleBlur() {
      if (!this.formData.certNo || this.formData.certType !== '01') {
        return
      }

      const params = { idNumber: this.formData.certNo }
      idNumberInfo(params, res => {
        const { birthDate, sexCode } = res
        this.formData.birthDate = birthDate
        this.formData.sexCode = sexCode
      })
    },

    /**
     * 获取表单数据
     */
    createForm() {
      // 获取省份列表
      this.getRegion('', res => {
        this.registerProvinceList = res
        this.caseProvinceList = res
        this.provinceList = res
        this.companyProvinceList = res
      })

      // 获取性别字典
      this.queryDictInfoByCategory('sex', res => {
        this.genderList = res
      })

      // 获取职业字典
      this.queryDictInfoByCategory('staff', res => {
        this.occupationList = res
      })

      // 获取证件类型字典
      this.queryDictInfoByCategory('certType', res => {
        this.certTypeList = res
      })

      // 获取户籍所在地字典
      this.queryDictInfoByCategory('locationType', res => {
        this.locationTypeList = res
      })

      // 获取年龄类型字典
      this.queryDictInfoByCategory('dimension', res => {
        this.dimensionList = res
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
      this.genderList = []
      this.occupationList = []
      this.certTypeList = []
      this.locationTypeList = []
      this.dimensionList = []
      this.registerProvinceList = []
      this.registerCityList = []
      this.registerCountyList = []
      this.registerStreetList = []
      this.caseProvinceList = []
      this.caseCityList = []
      this.caseCountyList = []
      this.caseStreetList = []
      this.provinceList = []
      this.addrArea = [
        {
          cityLoading: false,
          countyLoading: false,
          streetLoading: false,
          cityList: [],
          countyList: [],
          streetList: []
        }
      ]
      this.companyProvinceList = []
      this.companyCityList = []
      this.companyCountyList = []
      this.companyStreetList = []
    }
  },
  mounted() {
    this.$emit('complete')
  }
}
</script>

<style lang="scss" scoped>
.form-control-group {
  margin-left: 50px;
  margin-right: 50px;
  background-color: #f4f5f7;
}

.form-control-group:first-child {
  padding-top: 18px;
}

.form-control-group:last-child {
  margin-bottom: 18px;
}

.el-radio:not(:last-child) {
  margin-right: 16px;
}

.age-dimension.el-radio:not(:last-child) {
  margin-right: 10px;
}

.custom-icon-wrapper {
  display: flex;
  align-items: center;
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
