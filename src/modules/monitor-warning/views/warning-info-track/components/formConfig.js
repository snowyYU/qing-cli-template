export const warningReportColumns = [
  {
    prop: 'gradeValue',
    label: '年级'
  },
  {
    prop: 'className',
    label: '班级'
  },
  {
    prop: 'studentName',
    label: '姓名'
  },
  {
    prop: 'sexCodeName',
    label: '性别'
  },
  {
    prop: 'age',
    label: '年龄'
  },
  {
    prop: 'symptomsName',
    label: '症状'
  },
  {
    prop: 'symptomStartDate',
    label: '症状开始时间'
  },
  {
    prop: 'custom',
    label: '缺勤时间和天数'
  },
  {
    prop: 'diagnoseFlag',
    label: '就诊'
  },
  {
    prop: 'diagnoseSourceName',
    label: '病因'
  },
  {
    prop: 'natFlag',
    label: '核酸检测'
  },
  {
    prop: 'virusTestFlag',
    label: '多病毒检测'
  },
  {
    prop: 'contactName',
    label: '联系人'
  },
  {
    prop: 'contactPhone',
    label: '联系电话'
  }
]

export const stepFormData = {
  signalRealFlag: '', // 学校核实-预警信号是否属实
  examineItem: [], // 学校核实-已采取措施
  // examineItem: '', // 学校核实-已采取措施
  examineOther: '', // 学校核实-其他措施
  countyCdcDeal: '', // 区疾控审核-处理结果
  countyCdcExamineContent: '', // 区疾控审核-审核内容
  cityCdcExamineContent: '' // 市疾控审核-审核内容
}

export const caseInfoFormSchema = {
  formStyle: {
    size: 'small',
    labelWidth: '150px',
    justify: 'center',
    btns: []
  },
  properties: [
    {
      type: 'formAreaTitle',
      title: '学生基本信息',
      height: '32',
      key: 'formAreaTitle1'
    },
    {
      type: 'text',
      label: '学校名称',
      key: 'schoolName',
      required: false,
      disabled: false,
      span: 12,
      labelWidth: '120px'
    },
    {
      type: 'text',
      label: '年级',
      key: 'gradeName',
      required: false,
      disabled: false,
      span: 12,
      labelWidth: '120px'
    },
    {
      type: 'text',
      label: '班级',
      key: 'className',
      required: false,
      disabled: false,
      span: 12,
      labelWidth: '120px'
    },
    {
      type: 'text',
      label: '姓名',
      key: 'stuName',
      required: false,
      disabled: false,
      span: 12,
      labelWidth: '120px'
    },
    {
      type: 'input',
      label: '联系人',
      key: 'contactName',
      required: true,
      disabled: false,
      span: 12,
      labelWidth: '120px',
      maxlength: '30'
    },
    {
      type: 'input',
      label: '联系电话',
      key: 'contactPhone',
      required: true,
      disabled: false,
      span: 12,
      labelWidth: '120px',
      maxlength: '30'
    },
    {
      type: 'cascader',
      label: '现住址',
      key: 'customAddr',
      required: true,
      disabled: false,
      clearable: true,
      props: {
        label: 'regionName',
        value: 'regionCode'
      },
      options: [],
      span: 24,
      labelWidth: '120px'
    },
    {
      type: 'input',
      label: '详细地址',
      key: 'curAddr',
      required: true,
      disabled: false,
      span: 24,
      labelWidth: '120px',
      maxlength: '50'
    },
    {
      type: 'formAreaTitle',
      title: '患病信息',
      height: '32',
      key: 'formAreaTitle2'
    },
    {
      type: 'input',
      label: '就诊医院',
      key: 'visitOrgName',
      required: true,
      disabled: false,
      span: 12,
      labelWidth: '120px',
      maxlength: '30'
    },
    {
      type: 'select',
      label: '确诊病因',
      key: 'diagnoseSource',
      required: true,
      disabled: false,
      clearable: true,
      filterable: true,
      props: {
        label: 'dictValue',
        value: 'dictCode'
      },
      options: [],
      span: 12,
      labelWidth: '120px'
    },
    {
      type: 'input',
      label: '其他病因',
      key: 'otherSource',
      required: true,
      disabled: false,
      span: 12,
      labelWidth: '120px',
      maxlength: 30
    },
    {
      type: 'radio',
      label: '核酸检测',
      key: 'natFlag',
      required: true,
      disabled: false,
      props: {},
      options: [
        {
          label: '是',
          value: '1'
        },
        {
          label: '否',
          value: '0'
        }
      ],
      span: 12,
      labelWidth: '120px'
    },
    {
      type: 'radio',
      label: '核酸检测结果',
      key: 'natResult',
      required: true,
      disabled: false,
      props: {
        label: 'dictValue',
        value: 'dictCode'
      },
      options: [],
      span: 12,
      labelWidth: '120px'
    },
    {
      type: 'radio',
      label: '多病毒检测',
      key: 'virusTestFlag',
      required: true,
      disabled: false,
      props: {},
      options: [
        {
          label: '是',
          value: '1'
        },
        {
          label: '否',
          value: '0'
        }
      ],
      span: 12,
      labelWidth: '120px'
    }
  ],
  propertiesOrder: []
}

export const caseInfoFormData = {
  schoolName: '', // 学校名称
  gradeName: '', // 年级
  className: '', // 班级
  stuName: '', // 姓名
  contactName: '', // 联系人
  contactPhone: '', // 联系电话
  customAddr: '', // 现住址
  curProvince: '', // 省
  curCity: '', // 市
  curCounty: '', // 区
  curStreet: '', // 街道
  curAddr: '', // 详细地址
  visitOrgName: '', // 就诊医院
  diagnoseSource: '', // 确诊病因
  otherSource: '', // 其他病因
  natFlag: '0', // 核酸检测
  natResult: '', // 核酸检测结果
  virusTestFlag: '0' // 多病毒检测
}

export const caseInfoColumns = [
  {
    label: '病原类型',
    value: 'etiologyType',
    defaultData: '',
    minWidth: '120',
    type: 'select',
    props: {
      label: 'dictValue',
      value: 'dictCode'
    },
    options: [],
    config: {
      filterable: true,
      clearable: true
    }
  },
  {
    label: '其他病原体',
    value: 'etiologyOther',
    defaultData: '',
    minWidth: '120',
    type: 'input',
    config: {}
  },
  {
    label: '检测结果',
    value: 'testResult',
    defaultData: '',
    minWidth: '120',
    type: 'select',
    props: {
      label: 'dictValue',
      value: 'dictCode'
    },
    options: [],
    config: {
      filterable: true,
      clearable: true
    }
  }
]
