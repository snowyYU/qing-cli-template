export const formSchema = {
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
      label: '任务名称',
      key: 'taskName',
      required: true,
      disabled: false,
      span: 12,
      labelWidth: '120px'
    },
    {
      type: 'custom',
      label: '任务执行时间',
      key: 'taskExecRangeTime',
      required: true,
      disabled: false,
      span: 12,
      labelWidth: '120px',
      style: { width: '100%' }
    },
    {
      type: 'custom',
      label: '任务地点',
      key: 'taskExecPlace',
      required: true,
      disabled: false,
      span: 12,
      labelWidth: '120px'
    },
    {
      type: 'radio',
      label: '是否流调',
      key: 'flowTaskFlag',
      required: true,
      disabled: false,
      options: [
        {
          label: '是',
          value: 1
        },
        {
          label: '否',
          value: 0
        }
      ],
      span: 12,
      labelWidth: '120px'
    },
    {
      type: 'input',
      label: '经度',
      key: 'lng',
      required: true,
      disabled: true,
      span: 12,
      labelWidth: '120px'
    },
    {
      type: 'input',
      label: '纬度',
      key: 'lat',
      required: true,
      disabled: true,
      span: 12,
      labelWidth: '120px'
    },
    {
      type: 'input',
      label: '任务说明',
      key: 'taskExplain',
      disabled: false,
      span: 24,
      labelWidth: '120px'
    }
  ],
  propertiesOrder: []
}

export const formData = {
  taskName: '', // 任务名称
  taskExecRangeTime: '', // 任务执行时间
  taskExecPlace: '', // 任务地点
  flowTaskFlag: '', // 是否流调
  lng: '', // 经度
  lat: '', // 纬度
  taskExplain: '' // 任务说明
}

export const caseColumns = [
  {
    prop: 'name',
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
    prop: 'occupationName',
    label: '职业'
  },
  {
    prop: 'address',
    label: '现住址'
  },
  {
    prop: 'contactPhone',
    label: '联系电话'
  },
  {
    prop: 'visitOrgName',
    label: '就诊机构'
  }
]

export const memberColumns = [
  {
    prop: 'leader',
    label: '任务负责人'
  },
  {
    prop: 'member',
    label: '任务成员'
  }
]
