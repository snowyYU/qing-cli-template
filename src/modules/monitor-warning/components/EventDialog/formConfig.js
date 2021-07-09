export const eventFormSchema = {
  formStyle: {
    size: 'small',
    labelWidth: '150px',
    justify: 'center',
    btns: []
  },
  properties: [
    {
      type: 'input',
      label: '事件名称',
      key: 'eventName',
      required: true,
      maxlength: 20,
      span: 12,
      clearable: true
    },
    {
      type: 'select',
      label: '事件类别',
      key: 'eventCategory',
      required: true,
      span: 12,
      options: [],
      props: {
        label: 'dictValue',
        value: 'dictCode'
      },
      clearable: true
    },
    {
      type: 'select',
      label: '事件级别',
      key: 'eventLevel',
      required: true,
      span: 12,
      options: [],
      props: {
        label: 'dictValue',
        value: 'dictCode'
      },
      clearable: true
    },
    {
      type: 'select',
      label: '事件来源',
      key: 'eventSource',
      required: true,
      span: 12,
      options: [],
      props: {
        label: 'dictValue',
        value: 'dictCode'
      },
      clearable: true
    },
    {
      type: 'input',
      label: '报告人',
      key: 'eventReportStaff',
      required: false,
      maxlength: 20,
      span: 12,
      clearable: true
    },
    {
      type: 'input',
      label: '联系电话',
      key: 'eventContactPhone',
      required: false,
      maxlength: 20,
      span: 12,
      clearable: true
    },
    {
      type: 'input',
      label: '报告单位',
      key: 'eventReportOrgName',
      required: false,
      maxlength: 20,
      span: 12,
      clearable: true
    },
    {
      type: 'dateTimePicker',
      label: '接到报告时间',
      key: 'receiveReportTime',
      required: false,
      span: 12,
      clearable: true
    },

    {
      type: 'cascader',
      key: 'eventPlace',
      label: '事发场所',
      span: 12,
      options: [],
      clearable: true,
      ref: 'eventPlace',
      props: {
        emitPath: false,
        value: 'id',
        label: 'name'
      }
    },
    {
      type: 'custom',
      label: '',
      key: 'custom1',
      span: 12
    },
    {
      type: 'select',
      label: '事发地区',
      key: 'eventProvinceCode',
      required: false,
      placeholder: '请输入省份',
      props: {
        label: 'regionName',
        value: 'regionCode'
      },
      disabled: false,
      span: 8,
      style: {},
      otherRules: [],
      errorMessage: {},
      options: [],
      initValue: '',
      multiple: false,
      clearable: true,
      collapseTags: false
    },
    {
      type: 'select',
      label: '',
      key: 'eventCityCode',
      required: false,
      placeholder: '请输入城市',
      props: {
        label: 'regionName',
        value: 'regionCode'
      },
      disabled: false,
      style: {},
      otherRules: [],
      errorMessage: {},
      span: 5,
      labelWidth: '10px',
      options: [],
      initValue: '',
      multiple: false,
      clearable: true,
      collapseTags: false
    },
    {
      type: 'select',
      label: '',
      key: 'eventCountyCode',
      labelWidth: '10px',
      required: false,
      placeholder: '请输入区县',
      props: {
        label: 'regionName',
        value: 'regionCode'
      },
      disabled: false,
      style: {},
      span: 5,
      otherRules: [],
      errorMessage: {},
      options: [],
      initValue: '',
      multiple: false,
      clearable: true,
      collapseTags: false
    },
    {
      type: 'select',
      label: '',
      key: 'eventStreetCode',
      labelWidth: '10px',
      required: false,
      placeholder: '请输入街道',
      props: {
        label: 'regionName',
        value: 'regionCode'
      },
      disabled: false,
      style: {},
      span: 5,
      otherRules: [],
      errorMessage: {},
      options: [],
      initValue: '',
      multiple: false,
      clearable: true,
      collapseTags: false
    },
    {
      type: 'input',
      label: '详细地址',
      key: 'eventAddress',
      required: true,
      maxlength: 32,
      span: 12,
      clearable: true
    },
    {
      type: 'custom',
      label: '',
      key: 'chooseLngLatBtn',
      span: 12,
      labelWidth: '20px'
    },
    {
      type: 'input',
      label: '经度',
      key: 'lng',
      required: true,
      disabled: true,
      maxlength: 32,
      span: 12
    },

    {
      type: 'input',
      label: '纬度',
      key: 'lat',
      required: true,
      disabled: true,
      maxlength: 32,
      span: 12
    },
    {
      type: 'input',
      label: '事件波及地区范围',
      key: 'eventEffectArea',
      required: false,
      maxlength: 32,
      span: 24,
      clearable: true
    },
    {
      type: 'input',
      label: '涉及或暴露人数',
      key: 'exposeNum',
      required: false,
      maxlength: 32,
      span: 12,
      clearable: true
    },
    {
      type: 'input',
      label: '发病人数',
      key: 'incidenceNum',
      required: false,
      maxlength: 32,
      span: 12,
      clearable: true
    },
    {
      type: 'input',
      label: '死亡人数',
      key: 'deathNum',
      required: false,
      maxlength: 32,
      span: 12,
      clearable: true
    },
    {
      type: 'dateTimePicker',
      label: '事发时间',
      key: 'eventTime',
      required: false,
      span: 12,
      clearable: true
    },
    {
      type: 'dateTimePicker',
      label: '初步核实时间',
      key: 'initialVerifyTime',
      required: false,
      span: 12,
      clearable: true
    },
    {
      type: 'dateTimePicker',
      label: '首例病人发病时间',
      key: 'receiveRepofirstCaseIncidencyTimertTime',
      required: false,
      span: 12,
      clearable: true
    }
  ],
  propertiesOrder: []
}

export const eventFormData = {
  createTime: '', //创建时间 body  false  string(date-time)
  createUser: '', //创建人 body  false  string
  deathNum: '', //死亡人数 body  false  integer(int32)
  delFlag: '', //删除标志 body  false  integer(int32)
  eventAddress: '', //事发地址 body  false  string
  eventCategory: '', //事件类别 body  false  string
  eventCityCode: '', //事发地区地市 body  false  string
  eventCityName: '', //事发地区地市名称 body  false  string
  eventContactPhone: '', //联系电话 body  false  string
  eventCountyCode: '', //事发地区区县 body  false  string
  eventCountyName: '', //事发地区区县名称 body  false  string
  eventEffectArea: '', //事件波及地区范围 body  false  string
  eventLevel: '', //事件级别 body  false  string
  eventName: '', //事件名称 body  false  string
  eventPlace: '', //事件发生场所 body  false  string
  eventProvinceCode: '', //事发地区省份 body  false  string
  eventProvinceName: '', //事发地区省份名称 body  false  string
  eventReportOrgId: '', //报告单位 body  false  string
  eventReportOrgName: '', //报告单位名称 body  false  string
  eventReportStaff: '', //报告人 body  false  string
  eventSource: '13', //事件来源 body  false  string
  eventStreetCode: '', //事发地区街道编码 body  false  string
  eventStreetName: '', //事发地区街道名称 body  false  string
  eventTime: '', //事发时间 body  false  string(date-time)
  exposeNum: '', //涉及或暴露人数 body  false  integer(int32)
  firstCaseIncidencyTime: '', //首例病人发病时间 body  false  string(date-time)
  id: '', //id body  false  string
  incidenceNum: '', //发病人数 body  false  integer(int32)
  initialVerifyTime: '', //初步核实时间 body  false  string(date-time)
  lat: '', //纬度 body  false  number
  lng: '', //经度 body  false  number
  receiveReportTime: '', //接收报告时间 body  false  string(date-time)
  resultId: '', //报告id body  false  string
  status: '', //status body  false  string
  updateTime: '', //修改时间 body  false  string(date-time)
  updateUser: '' //修改人 body  false  string
}
