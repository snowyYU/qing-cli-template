export const formSchema = {
  formStyle: {
    size: 'small',
    labelWidth: '150px',
    justify: 'center',
    btns: []
  },
  properties: [
    {
      type: 'custom',
      label: '任务反馈',
      key: 'feedback',
      span: 24,
      labelWidth: '100px'
    },
    {
      type: 'select',
      label: '审核结果',
      key: 'warningStatus',
      required: true,
      clearable: true,
      options: [],
      props: {
        label: 'dictValue',
        value: 'dictCode'
      },
      span: 24,
      labelWidth: '100px'
    },
    {
      type: 'textarea',
      label: '原因',
      key: 'notPassExplain',
      required: true,
      span: 24,
      labelWidth: '100px'
    },
    {
      type: 'select',
      label: '事件',
      key: 'eventId',
      required: true,
      clearable: true,
      options: [],
      props: {
        label: 'eventName',
        value: 'id'
      },
      span: 24,
      labelWidth: '100px'
    }
  ],
  propertiesOrder: []
}

export const formData = {
  feedback: '', // 任务反馈
  warningStatus: '', // 处理状态
  notPassExplain: '', // 理由
  eventId: '' // 事件
}
