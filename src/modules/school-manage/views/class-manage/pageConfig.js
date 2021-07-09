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
  }
]

let columns = [
  {
    prop: 'schoolYear',
    label: '学年'
  },
  {
    prop: 'gradeName',
    label: '年级'
  },
  {
    prop: 'className',
    label: '班级'
  },
  {
    prop: 'boyNum',
    label: '男生人数'
  },
  {
    prop: 'girlNum',
    label: '女生人数'
  },
  {
    prop: 'studentNum',
    label: '学生人数'
  },
  {
    prop: 'teacherName',
    label: '班主任'
  },
  {
    prop: 'teacherPhone',
    label: '班主任电话'
  }
]

export { searchFormConfig, columns }
