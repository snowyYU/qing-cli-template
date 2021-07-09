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
      key: 'certType',
      label: '证件类型',
      options: [],
      props: { label: 'dictValue', value: 'dictCode' }
    },
    {
      type: 'select',
      label: '国籍',
      options: [],
      props: { label: 'dictValue', value: 'dictCode' },
      key: 'countryCode'
    },
    {
      type: 'select',
      label: '民族',
      options: [],
      props: { label: 'dictValue', value: 'dictCode' },
      key: 'nationCode'
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
  certType: '01',
  countryCode: '01',
  nationCode: '01',
  columns: ''
}

export { formSchema, dialogFormData }
