export const formItemConfig = [
  {
    type: 'select',
    key: 'gradeId',
    label: '年级',
    labelWidth: '80px',
    options: [],
    clearable: true,
    props: {
      label: 'gradeValue',
      value: 'id'
    },
    colSpan: 12,
    offset: 0,
    style: { width: '100%' },
    placeholder: '请选择'
  },
  {
    type: 'select',
    key: 'classId',
    label: '班级',
    labelWidth: '80px',
    options: [],
    clearable: true,
    props: {
      label: 'className',
      value: 'id'
    },
    colSpan: 12,
    offset: 0,
    style: { width: '100%' },
    placeholder: '请选择'
  },
  {
    type: 'input',
    key: 'studentName',
    label: '姓名',
    labelWidth: '80px',
    placeholder: '请输入',
    colSpan: 12,
    offset: 0,
    maxlength: ''
  },
  {
    type: 'input',
    key: 'certNo',
    label: '证件号码',
    labelWidth: '80px',
    placeholder: '请输入',
    colSpan: 12,
    offset: 0,
    maxlength: ''
  }
]

export const columns = [
  {
    prop: 'gradeName',
    label: '年级',
    align: 'center'
  },
  {
    prop: 'className',
    label: '班级',
    align: 'center'
  },
  {
    prop: 'studentName',
    label: '姓名',
    align: 'center'
  },
  {
    prop: 'sexCode',
    label: '性别',
    align: 'center'
  },
  {
    prop: 'certNo',
    label: '证件号码',
    align: 'center'
  }
]
