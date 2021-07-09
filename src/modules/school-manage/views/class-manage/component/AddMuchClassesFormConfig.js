const formSchema = {
  formStyle: {
    size: 'small',
    labelWidth: '150px',
    justify: 'center',
    btns: []
  },
  properties: [
    {
      type: 'select',
      label: '年级',
      key: 'grade',
      props: { label: 'gradeValue', value: 'id' },
      options: []
    },
    {
      type: 'custom',
      label: '初始班级',
      customLabel: true,
      key: 'initClass',
      controls: false,
      otherRules: [
        { type: 'number', regExp: '/^(0|[1-9][0-9]*)$/g', message: '格式有误' }
      ],
      maxlength: 10
    },
    {
      type: 'input',
      label: '新增行数',
      key: 'columns',
      required: true,
      maxlength: 20,
      otherRules: [
        { type: 'number', regExp: '/^(0|[1-9][0-9]*)$/g', message: '格式有误' }
      ]
    }
  ],
  propertiesOrder: []
}

const dialogFormData = {
  grade: '',
  initClass: '',
  columns: ''
}

export { formSchema, dialogFormData }
