export const formItemConfig = [
  {
    type: 'date',
    key: 'zerorepoDate',
    label: '零上报日期',
    disabled: false,
    dateType: 'daterange',
    rangeSeparator: '至',
    startPlaceholder: '开始时间',
    endPlaceholder: '结束时间',
    editable: false,
    valueFormat: 'yyyy-MM-dd',
    maxlength: '',
    colSpan: 16,
    offset: 0
  }
]

export const columns = [
  {
    label: '零上报日期',
    prop: 'zerorepoDate'
  },
  {
    label: '上报操作时间',
    prop: 'repoDate'
  }
]

export const formSchema = {
  formStyle: {
    size: 'small',
    labelWidth: '150px',
    justify: 'center',
    btns: [],
    disabled: false
  },
  properties: [
    {
      type: 'datePicker',
      key: 'zeroRepoDate',
      label: '零上报日期',
      required: true,
      disabled: false,
      dateType: 'date',
      editable: false,
      valueFormat: 'yyyy-MM-dd',
      maxlength: '',
      colSpan: 20,
      offset: 0,
      pickerOptions: {
        disabledDate(time) {
          return (
            time.getTime() > Date.now() ||
            time.getTime() < Date.now() - 3600 * 24 * 1000 * 8
          )
        }
      }
    }
  ],
  propertiesOrder: []
}
