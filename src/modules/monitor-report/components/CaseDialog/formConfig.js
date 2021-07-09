export const trackFormSchema = {
  formStyle: {
    size: 'small',
    labelWidth: '150px',
    justify: 'center',
    btns: [],
    disabled: false
  },
  properties: [
    {
      type: 'datePicker',
      label: '时间',
      key: 'travelTime',
      span: 8,
      labelWidth: '110px',
      style: { width: '100%' }
    },
    {
      type: 'input',
      label: '地点',
      key: 'travelAddr',
      span: 8,
      labelWidth: '110px'
    },
    {
      type: 'input',
      label: '交通工具',
      key: 'trafficTool',
      span: 8,
      labelWidth: '110px'
    },
    {
      type: 'textarea',
      label: '具体内容',
      key: 'travelContent',
      span: 24,
      labelWidth: '110px'
    },
    {
      type: 'input',
      label: '同行人员',
      key: 'pals',
      span: 8,
      labelWidth: '110px'
    },
    {
      type: 'input',
      label: '个人防护情况',
      key: 'protectSituation',
      span: 16,
      labelWidth: '110px'
    }
  ],
  propertiesOrder: []
}

export const initTrackFormData = {
  travelTime: '', // 时间
  travelContent: '', // 具体内容
  travelAddr: '', // 地点
  trafficTool: '', // 交通工具
  pals: '', // 同行人员
  protectSituation: '' // 个人防护情况
}

export const trackColumns = [
  {
    prop: 'travelTime',
    label: '时间'
  },
  {
    prop: 'travelContent',
    label: '具体内容'
  },
  {
    prop: 'travelAddr',
    label: '地点'
  },
  {
    prop: 'trafficTool',
    label: '交通工具'
  }
]
