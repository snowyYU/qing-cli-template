export const configItems = [
  {
    searchFormConfig: [
      {
        type: 'input',
        key: 'a',
        label: '疾病名称',
        disabled: false,
        maxlength: '',
        colSpan: 8,
        labelWidth: '100px',
        offset: 0
      },
      {
        type: 'select',
        key: 'b',
        label: '疾病分类',
        options: [],
        disabled: false,
        maxlength: '',
        colSpan: 8,
        labelWidth: '100px',
        offset: 0
      }
    ],
    searchFormData: {
      a: '',
      b: ''
    },
    columns: [
      {
        prop: 'a',
        label: '疾病分类'
      },
      {
        prop: 'b',
        label: '疾病名称'
      },
      {
        prop: 'c',
        label: '诊断编码'
      },
      {
        prop: 'd',
        label: '同义词'
      }
    ]
  },
  {
    searchFormConfig: [
      {
        type: 'input',
        key: 'a',
        label: '症状名称',
        disabled: false,
        maxlength: '',
        colSpan: 8,
        labelWidth: '100px',
        offset: 0
      },
      {
        type: 'select',
        key: 'b',
        label: '症状分类',
        options: [],
        disabled: false,
        maxlength: '',
        colSpan: 8,
        labelWidth: '100px',
        offset: 0
      }
    ],
    searchFormData: {
      a: '',
      b: ''
    },
    columns: [
      {
        prop: 'a',
        label: '编码'
      },
      {
        prop: 'b',
        label: '症状分类'
      },
      {
        prop: 'c',
        label: '症状名称'
      },
      {
        prop: 'd',
        label: '同义词'
      }
    ]
  }
]

export const treeData = [
  {
    label: '诊断',
    index: 0
  },
  {
    label: '症状',
    index: 1
  }
]
