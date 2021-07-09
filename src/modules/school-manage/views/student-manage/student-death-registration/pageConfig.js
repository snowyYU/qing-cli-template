let searchFormConfig = [
  {
    type: 'select',
    key: 'schoolYear',
    label: '学年',
    disabled: false,
    props: { label: 'schoolYearName', value: 'schoolYear' },
    maxlength: '',
    clearable: true,
    colSpan: 8,
    labelWdith: 130,
    offset: 0,
    options: []
  },
  {
    type: 'select',
    key: 'gradeId',
    label: '年级',
    disabled: false,
    props: { label: 'gradeValue', value: 'id' },
    maxlength: '',
    clearable: true,
    colSpan: 8,
    labelWdith: 130,
    offset: 0,
    options: []
  },
  {
    type: 'select',
    key: 'classId',
    label: '班级',
    disabled: false,
    props: { label: 'className', value: 'id' },
    maxlength: '',
    clearable: true,
    colSpan: 8,
    labelWdith: 130,
    offset: 0,
    options: []
  },
  {
    type: 'input',
    key: 'studentName',
    label: '姓名',
    maxlength: '',
    clearable: true,
    colSpan: 8,
    labelWdith: 130
  },
  {
    type: 'date',
    dateType: 'daterange',
    valueFormat: 'yyyy-MM-dd',
    key: 'rangeDate',
    label: '死亡日期',
    clearable: true,
    colSpan: 12,
    rangeSeparator: '至',
    startPlaceholder: '开始时间',
    endPlaceholder: '结束时间'
  }
]

let columns = [
  {
    prop: 'gradeName',
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
    prop: 'certSensitive',
    label: '证件号码'
  },
  {
    prop: 'deadReasonName',
    label: '死亡原因'
  },
  {
    prop: 'deadDate',
    label: '死亡日期'
  }
]

export { searchFormConfig, columns }
