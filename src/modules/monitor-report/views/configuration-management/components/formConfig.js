export const configItems = [
  {
    formSchema: {
      formStyle: {
        size: 'small',
        labelWidth: '150px',
        justify: 'center',
        btns: [],
        disabled: false
      },
      properties: [
        {
          type: 'select',
          label: '疾病分类',
          key: 'a',
          disabled: false,
          options: [],
          span: 24,
          labelWidth: '120px'
        },
        {
          type: 'select',
          label: '疾病名称',
          key: 'b',
          disabled: false,
          options: [],
          span: 24,
          labelWidth: '120px'
        },
        {
          type: 'input',
          label: '诊断编码',
          key: 'c',
          disabled: false,
          span: 24,
          labelWidth: '120px'
        },
        {
          type: 'input',
          label: '同义词',
          key: 'd',
          disabled: false,
          span: 24,
          labelWidth: '120px'
        }
      ],
      propertiesOrder: []
    },
    formData: {
      a: '',
      b: '',
      c: '',
      d: ''
    }
  },
  {
    formSchema: {
      formStyle: {
        size: 'small',
        labelWidth: '150px',
        justify: 'center',
        btns: [],
        disabled: false
      },
      properties: [
        {
          type: 'select',
          label: '症状分类',
          key: 'a',
          disabled: false,
          options: [],
          span: 24,
          labelWidth: '120px'
        },
        {
          type: 'input',
          label: '症状名称',
          key: 'b',
          disabled: false,
          span: 24,
          labelWidth: '120px'
        },
        {
          type: 'input',
          label: '同义词',
          key: 'c',
          disabled: false,
          span: 24,
          labelWidth: '120px'
        }
      ],
      propertiesOrder: []
    },
    formData: {
      a: '',
      b: '',
      c: ''
    }
  }
]
