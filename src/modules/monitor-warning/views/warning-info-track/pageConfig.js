export const searchFormConfig = [
  {
    type: 'select',
    key: 'examineStatus',
    label: '状态',
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
  //   key: 'county',
  //   label: '县区',
  //   disabled: false,
  //   multiple: false,
  //   collapseTags: false,
  //   clearable: true,
  //   props: {
  //     emitPath: false,
  //     label: 'regionName',
  //     value: 'regionCode'
  //   },
  //   options: [],
  //   maxlength: '',
  //   colSpan: 8,
  //   offset: 0,
  //   style: { width: '100%' }
  // },
  {
    type: 'select',
    key: 'county',
    label: '县区',
    disabled: false,
    multiple: false,
    collapseTags: false,
    clearable: true,
    props: {},
    options: [],
    maxlength: '',
    colSpan: 8,
    offset: 0,
    style: { width: '100%' }
  },
  {
    type: 'select',
    key: 'schoolId',
    label: '学校',
    disabled: false,
    multiple: false,
    collapseTags: false,
    clearable: true,
    props: {
      label: 'orgName',
      value: 'orgCode'
    },
    options: [],
    maxlength: '',
    colSpan: 8,
    offset: 0,
    style: { width: '100%' }
  },
  {
    type: 'date',
    key: 'alertRangeTime',
    label: '预警时间',
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
  }
]

export const searchFormData = {
  examineStatus: '', // 状态
  county: '', // 县区
  schoolId: '', // 学校
  alertStartTime: '', // 预警开始时间
  alertEndTime: '' // 预警结束时间
}

export const columns = [
  {
    prop: 'examineStatusName',
    label: '状态'
  },
  {
    prop: 'countyName',
    label: '县区'
  },
  {
    prop: 'schoolName',
    label: '学校'
  },
  {
    prop: 'monitorScopePosition',
    label: '预警范围'
  },
  {
    prop: 'alertSymptomsName',
    label: '症状'
  },
  {
    prop: 'caseNum',
    label: '病例数'
  },
  {
    prop: 'alertTime',
    label: '预警时间'
  },
  {
    prop: 'alertTypeName',
    label: '预警分类'
  },
  {
    prop: 'infectiousFlag',
    label: '疑似传染病聚集性疫情'
  }
]
