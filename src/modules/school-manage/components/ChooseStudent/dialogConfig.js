let searchFormConfig = [
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
    type: 'input',
    key: 'certNo',
    label: '证件号码',
    maxlength: '',
    clearable: true,
    colSpan: 8,
    labelWdith: 130
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
    prop: 'certNo',
    label: '证件号码'
  }
]

export { searchFormConfig, columns }
