export const formItemConfig = [
  {
    type: 'select',
    key: 'countyCode',
    label: '县区',
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
    clearable: true,
    props: {
      label: 'className',
      value: 'id'
    },
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
    clearable: true,
    colSpan: 8,
    offset: 0,
    style: { width: '100%' },
    placeholder: '请输入'
  }
]

export const columns = [
  {
    label: '县区',
    prop: 'county',
    showTooltip: true
  },
  {
    label: '学校',
    prop: 'schoolName',
    showTooltip: true
  },
  {
    label: '年级',
    prop: 'gradeName',
    showTooltip: true
  },
  {
    label: '班级',
    prop: 'className',
    showTooltip: true
  },
  {
    label: '姓名',
    prop: 'stuName',
    showTooltip: true
  },
  {
    label: '证件号码',
    prop: 'certNo',
    showTooltip: true
  },
  {
    label: '症状',
    prop: 'symptomsName',
    showTooltip: true
  },
  {
    label: '症状开始时间',
    prop: 'symptomStartDate',
    width: '150px',
    showTooltip: true
  },
  {
    label: '病因',
    prop: 'diagnoseSourceName',
    showTooltip: true
  },
  {
    label: '核酸检测',
    prop: 'natFlagName',
    showTooltip: true
  },
  {
    label: '多病原检测',
    prop: 'virusTestFlagName',
    showTooltip: true
  }
]
