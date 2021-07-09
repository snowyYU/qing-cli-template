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
    label: '性别',
    width: 60
  },
  {
    prop: 'birthday',
    label: '出生日期'
  },
  {
    prop: 'certTypeName',
    label: '证件类型'
  },
  {
    prop: 'certSensitive',
    label: '证件号码'
  },
  {
    prop: 'studentNumber',
    label: '学籍号'
  },
  {
    prop: 'studentNo',
    label: '学号'
  },

  {
    prop: 'bedroomNo',
    label: '宿舍号'
  }
]

export { searchFormConfig, columns }
