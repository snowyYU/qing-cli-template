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
    key: 'rangeTime',
    label: '休退学时间',
    valueFormat: 'yyyy-MM-dd',
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
    label: '年级',
    width: 100
  },
  {
    prop: 'className',
    label: '班级',
    width: 100
  },
  {
    prop: 'studentName',
    label: '姓名'
  },
  {
    prop: 'sexCodeName',
    label: '性别',
    width: 50
  },

  {
    prop: 'certSensitive',
    label: '证件号码'
  },
  {
    prop: 'quitTypeName',
    label: '休退学类型'
  },
  {
    prop: 'quitReasonName',
    label: '休退学原因'
  },
  {
    prop: 'quitDate',
    label: '休退学时间',
    width: 210
  }
]

export { searchFormConfig, columns }
