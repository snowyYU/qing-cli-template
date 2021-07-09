export const caseInfoFormSchema = {
  formStyle: {
    size: 'small',
    labelWidth: '150px',
    justify: 'center',
    btns: [],
    disabled: false
  },
  properties: [
    {
      type: 'input',
      label: '患者姓名',
      key: 'name',
      required: true,
      span: 12,
      labelWidth: '130px'
    },
    {
      type: 'select',
      label: '性别',
      key: 'sexCode',
      required: true,
      clearable: true,
      props: { label: 'dictValue', value: 'dictCode' },
      options: [],
      span: 12,
      labelWidth: '130px'
    },
    {
      type: 'select',
      label: '证件类型',
      key: 'certType',
      required: true,
      clearable: true,
      props: { label: 'dictValue', value: 'dictCode' },
      options: [],
      span: 12,
      labelWidth: '130px'
    },
    {
      type: 'input',
      label: '证件号码',
      key: 'certNo',
      required: true,
      span: 12,
      labelWidth: '130px'
    },
    {
      type: 'datePicker',
      label: '出生日期',
      key: 'birthDate',
      span: 12,
      labelWidth: '130px'
    },
    {
      type: 'input',
      label: '年龄',
      key: 'age',
      required: true,
      span: 6,
      labelWidth: '130px'
    },
    {
      type: 'radio',
      label: '',
      key: 'ageDimension',
      required: true,
      props: { label: 'dictValue', value: 'dictCode' },
      options: [],
      span: 6,
      labelWidth: '16px'
    },
    {
      type: 'input',
      label: '监护人姓名',
      key: 'guardianName',
      span: 12,
      labelWidth: '130px'
    },
    {
      type: 'input',
      label: '监护人联系方式',
      key: 'guardianPhone',
      span: 12,
      labelWidth: '130px'
    },
    {
      type: 'select',
      label: '职业',
      key: 'occupation',
      clearable: true,
      props: { label: 'dictValue', value: 'dictCode' },
      options: [],
      span: 12,
      labelWidth: '130px'
    },
    {
      type: 'custom',
      key: 'custom1',
      span: 12
    },
    {
      type: 'radio',
      label: '户籍所在地',
      key: 'registerType',
      props: { label: 'dictValue', value: 'dictCode' },
      options: [],
      span: 9,
      labelWidth: '130px'
    },
    {
      type: 'select',
      label: '户籍地址',
      key: 'registerProvinceCode',
      clearable: true,
      props: { label: 'regionName', value: 'regionCode' },
      options: [],
      span: 6,
      labelWidth: '130px',
      loading: false
    },
    {
      type: 'select',
      label: '',
      key: 'registerCityCode',
      clearable: true,
      props: { label: 'regionName', value: 'regionCode' },
      options: [],
      span: 3,
      labelWidth: '16px',
      loading: false
    },
    {
      type: 'select',
      label: '',
      key: 'registerCountyCode',
      clearable: true,
      props: { label: 'regionName', value: 'regionCode' },
      options: [],
      span: 3,
      labelWidth: '16px',
      loading: false
    },
    {
      type: 'select',
      label: '',
      key: 'registerStreetCode',
      clearable: true,
      props: { label: 'regionName', value: 'regionCode' },
      options: [],
      span: 3,
      labelWidth: '16px',
      loading: false
    },
    {
      type: 'select',
      label: '现住址',
      key: 'caseProvinceCode',
      required: true,
      clearable: true,
      props: { label: 'regionName', value: 'regionCode' },
      options: [],
      span: 9,
      labelWidth: '130px',
      loading: false
    },
    {
      type: 'select',
      label: '',
      key: 'caseCityCode',
      required: true,
      clearable: true,
      props: { label: 'regionName', value: 'regionCode' },
      options: [],
      span: 5,
      labelWidth: '16px',
      loading: false
    },
    {
      type: 'select',
      label: '',
      key: 'caseCountyCode',
      required: true,
      clearable: true,
      props: { label: 'regionName', value: 'regionCode' },
      options: [],
      span: 5,
      labelWidth: '16px',
      loading: false
    },
    {
      type: 'select',
      label: '',
      key: 'caseStreetCode',
      required: true,
      clearable: true,
      props: { label: 'regionName', value: 'regionCode' },
      options: [],
      span: 5,
      labelWidth: '16px',
      loading: false
    },
    {
      type: 'input',
      label: '详细地址',
      key: 'address',
      span: 24,
      labelWidth: '130px'
    },
    {
      type: 'input',
      label: '联系电话',
      key: 'contactPhone',
      required: true,
      span: 12,
      labelWidth: '130px'
    },
    {
      type: 'select',
      label: '疾病名称',
      key: 'c',
      required: true,
      clearable: true,
      props: { label: 'name', value: 'id' },
      options: [],
      span: 6,
      labelWidth: '130px'
    },
    {
      type: 'select',
      label: '',
      key: 'diseaseCode',
      required: true,
      clearable: true,
      props: { label: 'name', value: 'id' },
      options: [],
      span: 6,
      labelWidth: '16px'
    },
    {
      type: 'input',
      label: '就诊机构',
      key: 'visitOrgName',
      span: 12,
      labelWidth: '130px'
    },
    {
      type: 'datePicker',
      label: '就诊时间',
      key: 'visitDate',
      span: 12,
      labelWidth: '130px'
    },
    {
      type: 'select',
      label: '就诊类型',
      key: 'visitType',
      clearable: true,
      props: { label: 'dictValue', value: 'dictCode' },
      options: [
        {
          dictValue: '住院',
          dictCode: '1'
        },
        {
          dictValue: '门诊/急诊',
          dictCode: '0'
        }
      ],
      span: 12,
      labelWidth: '130px'
    },
    {
      type: 'textarea',
      label: '备注',
      key: 'remark',
      span: 24,
      labelWidth: '130px'
    }
  ]
}

export const caseInfoFormData = {
  name: '', // 患者姓名
  certType: '', // 证件类型
  certNo: '', // 证件号码
  sexCode: '', // 性别
  sexCodeName: '', // 性别(字典)
  birthDate: '', // 出生日期
  age: '', // 年龄
  ageDimension: '', // 年龄类型
  guardianName: '', // 监护人姓名
  guardianPhone: '', // 监护人联系方式
  occupation: '', // 职业
  occupationName: '', // 职业(字典)
  registerType: '', // 户籍所在地
  registerProvinceCode: '', // 户籍地址 省
  registerProvinceName: '', //
  registerCityCode: '', // 市
  registerCityName: '', //
  registerCountyCode: '', // 区
  registerCountyName: '', //
  registerStreetCode: '', // 街
  registerStreetName: '', //
  caseProvinceCode: '', // 现住址 省
  caseProvinceName: '', //
  caseCityCode: '', // 市
  caseCityName: '', //
  caseCountyCode: '', // 区
  caseCountyName: '', //
  caseStreetCode: '', // 街
  caseStreetName: '', //
  address: '', // 详细地址
  contactPhone: '', // 联系电话
  c: '', // 疾病类型
  diseaseCode: '', // 疾病名称
  visitOrgName: '', //就诊机构
  visitDate: '', // 就诊时间
  visitType: '', // 就诊类型
  remark: '' // 备注
}
