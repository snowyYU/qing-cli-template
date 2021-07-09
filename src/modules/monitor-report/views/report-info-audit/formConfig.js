export const formItemConfig = [
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
    type: 'date',
    key: 'repoDate',
    label: '上报时间',
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
    key: 'examineStatus',
    label: '审核状态',
    labelWidth: '100px',
    options: [
      {
        label: '已审核',
        value: '01'
      },
      {
        label: '待审核',
        value: '02'
      },
      {
        label: '逾期未审核',
        value: '03'
      }
    ],
    multiple: true,
    collapseTags: false,
    clearable: true,
    props: {
      label: 'label',
      value: 'value'
    },
    colSpan: 10,
    offset: 0,
    style: { width: '100%' },
    placeholder: '请选择'
  }
]

export const columns = [
  {
    label: '审核状态',
    prop: 'examineStatus',
    width: '100px'
  },
  {
    label: '姓名',
    prop: 'stuName',
    showTooltip: true
  },
  {
    label: '性别',
    prop: 'sexName',
    width: '60px'
  },
  {
    label: '年龄',
    prop: 'age',
    width: '60px'
  },
  {
    label: '亲属关系',
    prop: 'relationCodeName',
    showTooltip: true
  },
  {
    label: '家长电话',
    prop: 'contactPhone',
    showTooltip: true,
    width: '120px'
  },
  {
    label: '缺勤',
    prop: 'absenceFlagName',
    width: '60px'
  },
  {
    label: '缺勤时间',
    prop: 'abDate',
    width: '280px',
    showTooltip: true
  },
  {
    label: '症状',
    prop: 'symptomsName',
    width: '150px',
    showTooltip: true
  },
  {
    label: '症状开始时间',
    prop: 'symptomStartDate',
    width: '150px',
    showTooltip: true
  },
  {
    label: '就诊',
    prop: 'diagnoseFlagName',
    width: '60px'
  },
  {
    label: '病因',
    prop: 'diagnoseSourceName',
    showTooltip: true
  },
  {
    label: '上报时间',
    prop: 'repoDate',
    width: '150px',
    showTooltip: true
  }
]
