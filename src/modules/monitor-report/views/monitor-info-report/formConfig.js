export const formItemConfig = [
  {
    type: 'select',
    key: 'countyCode',
    label: '区县',
    labelWidth: '100px',
    options: [],
    clearable: true,
    props: {
      label: 'label',
      value: 'value'
    },
    colSpan: 8,
    offset: 0,
    style: { width: '100%' },
    placeholder: '请选择'
  },
  {
    type: 'select',
    key: 'schoolId',
    label: '学校',
    labelWidth: '100px',
    options: [],
    clearable: true,
    props: {
      label: 'orgName',
      value: 'orgCode'
    },
    colSpan: 8,
    offset: 0,
    style: { width: '100%' },
    placeholder: '请选择'
  },
  {
    type: 'select',
    key: 'schoolYear',
    label: '学年',
    labelWidth: '100px',
    options: [],
    clearable: true,
    props: {
      label: 'schoolYearName',
      value: 'schoolYear'
    },
    colSpan: 8,
    offset: 0,
    style: { width: '100%' },
    placeholder: '请选择'
  },
  {
    type: 'select',
    key: 'gradeId',
    label: '年级',
    labelWidth: '100px',
    options: [],
    clearable: true,
    props: {
      label: 'gradeValue',
      value: 'id'
    },
    colSpan: 8,
    offset: 0,
    style: { width: '100%' },
    placeholder: '请选择'
  },
  {
    type: 'select',
    key: 'classId',
    label: '班级',
    labelWidth: '100px',
    options: [],
    multiple: false,
    collapseTags: false,
    clearable: true,
    props: {
      label: 'className',
      value: 'id'
    },
    maxlength: '',
    colSpan: 8,
    offset: 0,
    style: { width: '100%' },
    placeholder: '请选择'
  },
  {
    type: 'input',
    key: 'name',
    label: '姓名',
    labelWidth: '100px',
    placeholder: '请输入',
    colSpan: 8,
    offset: 0,
    maxlength: ''
  },
  {
    type: 'date',
    key: 'abDate',
    label: '缺勤时间',
    labelWidth: '100px',
    disabled: false,
    dateType: 'daterange',
    rangeSeparator: '-',
    startPlaceholder: '开始时间',
    endPlaceholder: '结束时间',
    editable: false,
    valueFormat: 'yyyy-MM-dd',
    maxlength: '',
    colSpan: 8,
    offset: 0
  },
  {
    type: 'date',
    key: 'symptomDate',
    label: '症状开始时间',
    labelWidth: '100px',
    disabled: false,
    dateType: 'daterange',
    rangeSeparator: '-',
    startPlaceholder: '开始时间',
    endPlaceholder: '结束时间',
    editable: false,
    valueFormat: 'yyyy-MM-dd',
    maxlength: '',
    colSpan: 8,
    offset: 0
  },
  {
    type: 'select',
    key: 'symptomCode',
    label: '症状',
    labelWidth: '100px',
    options: [],
    multiple: true,
    collapseTags: true,
    clearable: true,
    props: {
      label: 'dictValue',
      value: 'dictCode'
    },
    maxlength: '',
    colSpan: 8,
    offset: 0,
    style: { width: '100%' },
    placeholder: '请选择'
  },
  {
    type: 'select',
    key: 'examineStatus',
    label: '审核状态',
    labelWidth: '100px',
    options: [
      { label: '已审核', value: '01' },
      { label: '未审核', value: '02' },
      { label: '逾期未审核', value: '03' }
    ],
    clearable: true,
    props: {
      label: 'label',
      value: 'value'
    },
    maxlength: '',
    colSpan: 8,
    offset: 0,
    style: { width: '100%' },
    placeholder: '请选择'
  },
  {
    type: 'select',
    key: 'progressStatus',
    label: '病程状态',
    labelWidth: '100px',
    options: [
      { label: '未结束', value: '01' },
      { label: '已结束', value: '02' }
    ],
    clearable: true,
    props: {
      label: 'label',
      value: 'value'
    },
    maxlength: '',
    colSpan: 8,
    offset: 0,
    style: { width: '100%' },
    placeholder: '请选择'
  }
]

export const schoolColumns = [
  {
    prop: 'gradeName',
    label: '年级',
    showTooltip: true
  },
  {
    prop: 'className',
    label: '班级',
    showTooltip: true
  },
  {
    prop: 'stuName',
    label: '姓名',
    showTooltip: true
  },
  {
    prop: 'contactPhone',
    label: '家长电话',
    showTooltip: true,
    width: '120'
  },
  {
    prop: 'absenceFlagName',
    label: '缺勤',
    showTooltip: true,
    width: '50'
  },
  {
    prop: 'abDate',
    label: '缺勤时间',
    width: '280',
    showTooltip: true
  },
  {
    prop: 'symptomStartDate',
    label: '症状开始时间',
    width: '150',
    showTooltip: true
  },
  {
    prop: 'symptomsName',
    label: '症状',
    showTooltip: true
  },
  {
    prop: 'diagnoseFlagName',
    label: '就诊',
    showTooltip: true,
    width: '50'
  },
  {
    prop: 'diagnoseSourceName',
    label: '病因',
    showTooltip: true
  },
  {
    prop: 'examineStatusName',
    label: '审核状态',
    showTooltip: true,
    width: '120'
  },
  {
    prop: 'progressStatusName',
    label: '病程状态',
    showTooltip: true
  }
]

export const cdcColumns = [
  {
    prop: 'countyName',
    label: '区县',
    showTooltip: true
  },
  {
    prop: 'schoolName',
    label: '学校',
    showTooltip: true
  },
  {
    prop: 'gradeName',
    label: '年级',
    showTooltip: true
  },
  {
    prop: 'className',
    label: '班级',
    showTooltip: true
  },
  {
    prop: 'stuName',
    label: '姓名',
    showTooltip: true
  },
  {
    prop: 'contactPhone',
    label: '家长电话',
    showTooltip: true,
    width: '120'
  },
  {
    prop: 'absenceFlagName',
    label: '缺勤',
    showTooltip: true,
    width: '50'
  },
  {
    prop: 'abDate',
    label: '缺勤时间',
    width: '280',
    showTooltip: true
  },
  {
    prop: 'symptomStartDate',
    label: '症状开始时间',
    width: '150',
    showTooltip: true
  },
  {
    prop: 'symptomsName',
    label: '症状',
    showTooltip: true
  },
  {
    prop: 'diagnoseFlagName',
    label: '就诊',
    showTooltip: true,
    width: '50'
  },
  {
    prop: 'diagnoseSourceName',
    label: '病因',
    showTooltip: true
  },
  {
    prop: 'examineStatusName',
    label: '审核状态',
    showTooltip: true,
    width: '120'
  },
  {
    prop: 'progressStatusName',
    label: '病程状态',
    showTooltip: true
  }
]
