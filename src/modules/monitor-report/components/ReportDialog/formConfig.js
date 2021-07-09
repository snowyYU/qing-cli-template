import { timeFormat } from '../../utils/index'

export const baseInfoConfig = [
  {
    label: '年级',
    key: 'gradeName',
    type: 'text',
    span: 5
  },
  {
    label: '班级',
    key: 'className',
    type: 'text',
    span: 5
  },
  {
    label: '姓名',
    key: 'stuName',
    type: 'text',
    span: 5
  },
  {
    label: '家长电话',
    key: 'contactPhone',
    type: 'input',
    span: 6
  }
]

export const confirmInfoConfig = [
  {
    label: '姓名',
    key: 'stuName',
    type: 'text',
    span: 5
  },
  {
    label: '性别',
    key: 'sexName',
    type: 'text',
    span: 5
  },
  {
    label: '年龄',
    key: 'age',
    type: 'text',
    span: 5
  },
  {
    label: '家长亲属关系',
    key: 'relationCode',
    type: 'select',
    options: [],
    prop: {
      label: 'dictValue',
      value: 'dictCode'
    },
    span: 6,
    style: {
      width: '100%'
    }
  },
  {
    label: '家长电话',
    key: 'contactPhone',
    type: 'input',
    span: 5
  }
]

export const studentData = {
  gradeName: '',
  className: '',
  stuName: '',
  contactPhone: '',
  age: '',
  sexName: '',
  relationCode: ''
}

export const abFormData = {
  absenceFlag: '1',
  abStartDate: timeFormat(new Date(), 'yyyy-MM-dd'),
  abStartMoment: '1',
  abEndDate: timeFormat(new Date(), 'yyyy-MM-dd'),
  abEndMoment: '2',
  abDays: '',
  symptoms: [],
  symptomStartDate: timeFormat(new Date(), 'yyyy-MM-dd'),
  symptomStartMoment: '1',
  diagnoseFlag: '0',
  temperature: '',
  otherSymptoms: ''
}

export const sourceFormData = {
  visitOrgName: '',
  diagnoseSource: '',
  otherSource: '',
  // virusTestFlag: '0',
  // natFlag: '0',
  virusTestFlag: '',
  natFlag: '',
  natResult: ''
}

export const injuryFormData = {
  // harmTime: timeFormat(new Date(), 'yyyy-MM-dd hh:mm'),
  harmTime: null,
  harmIntent: '',
  harmType: '',
  harmAddress: '',
  harmActivity: '',
  harmPart: [],
  processWay: '',
  harmResult: '',
  harmMark: ''
}

export const etiologyTableData = []

export const abStartOption = [
  { value: '1', label: '上午' },
  { value: '2', label: '下午' }
]

export const abEndOption = [
  { value: '1', label: '上午' },
  { value: '2', label: '下午' }
]

export const abFormRules = {
  absenceFlag: [
    {
      required: true,
      message: '请选择是否缺勤',
      trigger: ['blur', 'change']
    }
  ],
  abStartDate: [
    {
      required: true,
      message: '请选择缺勤开始时间',
      trigger: ['blur', 'change']
    }
  ],
  abEndDate: [
    {
      required: true,
      message: '请选择缺勤结束时间',
      trigger: ['blur', 'change']
    }
  ],
  symptoms: [
    { required: true, message: '请选择症状', trigger: ['blur', 'change'] }
  ],
  symptomStartDate: [
    {
      required: true,
      message: '请选择症状开始时间',
      trigger: ['blur', 'change']
    }
  ],
  symptomStartMoment: [
    {
      required: true,
      message: '请选择开始时刻',
      trigger: ['blur', 'change']
    }
  ],

  diagnoseFlag: [
    {
      required: true,
      message: '请选择是否确诊',
      trigger: ['blur', 'change']
    }
  ],
  temperature: [
    {
      required: true,
      message: '请输入正确格式的温度',
      pattern: /^\d{2}(.\d)?$/,
      trigger: ['blur', 'change']
    }
  ],
  otherSymptoms: [
    {
      required: true,
      message: '请输入其他症状',
      trigger: ['blur', 'change']
    },
    {
      required: true,
      pattern: /^(\S+)$/,
      message: '输入内容不能为空格',
      trigger: ['blur', 'change']
    }
  ]
}

export const sourceFormRules = {
  visitOrgName: [
    { required: true, message: '请输入就诊医院', trigger: ['blur', 'change'] },
    {
      required: true,
      pattern: /^(\S+)$/,
      message: '输入内容不能为空格',
      trigger: ['blur', 'change']
    }
  ],
  diagnoseSource: [
    { required: true, message: '请选择确诊病因', trigger: ['blur', 'change'] }
  ],
  otherSource: [
    { required: true, message: '请输入其他病因', trigger: ['blur', 'change'] },
    {
      required: true,
      pattern: /^(\S+)$/,
      message: '输入内容不能为空格',
      trigger: ['blur', 'change']
    }
  ],
  natResult: [
    {
      required: true,
      message: '请选择核酸检测结果',
      trigger: ['blur', 'change']
    }
  ]
}

export const injuryFormRules = {
  harmTime: [
    {
      required: true,
      message: '请选择伤害发生时间',
      trigger: ['blur', 'change']
    }
  ],
  harmIntent: [
    {
      required: true,
      message: '请选择伤害意图',
      trigger: ['blur', 'change']
    }
  ],
  harmType: [
    {
      required: true,
      message: '请选择伤害类型',
      trigger: ['blur', 'change']
    }
  ],
  harmAddress: [
    {
      required: true,
      message: '请选择伤害发生地点',
      trigger: ['blur', 'change']
    }
  ],
  harmActivity: [
    {
      required: true,
      message: '请选择伤害发生时活动',
      trigger: ['blur', 'change']
    }
  ],
  harmPart: [
    {
      required: true,
      message: '请选择受伤部位',
      trigger: ['blur', 'change']
    }
  ],
  processWay: [
    {
      required: true,
      message: '请选择处理方式',
      trigger: ['blur', 'change']
    }
  ],
  harmResult: [
    {
      required: true,
      message: '请选择伤害结果',
      trigger: ['blur', 'change']
    }
  ]
}
