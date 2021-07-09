export const searchFormConfig = [
  {
    type: 'date',
    key: 'createRangeTime',
    label: '创建时间',
    disabled: false,
    editable: false,
    dateType: 'datetimerange',
    rangeSeparator: '至',
    startPlaceholder: '开始时间',
    endPlaceholder: '结束时间',
    valueFormat: 'yyyy-MM-dd HH:mm:ss',
    maxlength: '',
    colSpan: 16,
    offset: 0
  },
  {
    type: 'select',
    key: 'kpiCode',
    label: '监测指标',
    disabled: false,
    multiple: false,
    collapseTags: false,
    clearable: true,
    props: {
      label: 'dictValue',
      value: 'dictCode'
    },
    options: [],
    maxlength: '',
    colSpan: 8,
    offset: 0,
    style: { width: '100%' }
  },
  // {
  //   type: 'cascader',
  //   key: 'kpiCode',
  //   label: '监测指标',
  //   options: [],
  //   disabled: false,
  //   multiple: false,
  //   collapseTags: false,
  //   clearable: true,
  //   props: {
  //     checkStrictly: true,
  //     emitPath: false,
  //     label: 'dictValue',
  //     value: 'dictCode'
  //   },
  //   maxlength: '',
  //   colSpan: 8,
  //   offset: 0,
  //   style: { width: '100%' }
  // },
  {
    type: 'select',
    key: 'monitorScope',
    label: '监测范围',
    disabled: false,
    multiple: false,
    collapseTags: false,
    clearable: true,
    props: {
      label: 'dictValue',
      value: 'dictCode'
    },
    options: [],
    maxlength: '',
    colSpan: 8,
    offset: 0,
    style: { width: '100%' }
  }
]

export const searchFormData = {
  createStartTime: '', // 创建开始时间
  createEndTime: '', // 创建结束时间
  kpiCode: '', // 监测指标
  monitorScope: '' // 监测范围
}

export const columns = [
  {
    prop: 'kpiJsonName',
    label: '监测指标'
  },
  {
    prop: 'monitorScopeName',
    label: '监测范围'
  },
  {
    prop: 'personNum',
    label: '监测人数'
  },
  {
    prop: 'monitorDays',
    label: '监测天数'
  },
  {
    prop: 'alertCaseNum',
    label: '预警个案数'
  },
  {
    prop: 'createUser',
    label: '创建人'
  },
  {
    prop: 'createTime',
    label: '创建时间'
  }
]
