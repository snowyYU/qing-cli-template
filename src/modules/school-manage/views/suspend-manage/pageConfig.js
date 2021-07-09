let searchFormConfig = [
  {
    type: 'date',
    dateType: 'daterange',
    key: 'rangeDate',
    valueFormat: 'yyyy-MM-dd',
    label: '停课时间',
    clearable: true,
    colSpan: 12,
    rangeSeparator: '至',
    startPlaceholder: '开始时间',
    endPlaceholder: '结束时间'
  }
]
let searchFormConfigForLeader = [
  {
    type: 'date',
    dateType: 'daterange',
    key: 'rangeDate',
    valueFormat: 'yyyy-MM-dd',
    label: '停课时间',
    clearable: true,
    colSpan: 12,
    rangeSeparator: '至',
    startPlaceholder: '开始时间',
    endPlaceholder: '结束时间'
  },
  {
    type: 'select',
    key: 'countyCode',
    label: '县区',
    options: [],
    clearable: true,
    colSpan: 6
  },
  {
    type: 'select',
    key: 'schoolId',
    label: '学校',
    options: [],
    props: { label: 'orgName', value: 'orgCode' },
    clearable: true,
    colSpan: 6
  }
]

let columns = [
  {
    prop: 'schoolName',
    label: '停课学校'
  },
  {
    prop: 'stopTimeRange',
    label: '停课时间'
  },
  {
    prop: 'stopReasonName',
    label: '停课原因'
  },
  {
    prop: 'stopScopeName',
    label: '停课范围'
  }
]
let columnsForLeader = [
  {
    prop: 'orgCountyName',
    label: '县区'
  },
  {
    prop: 'schoolName',
    label: '停课学校'
  },
  {
    prop: 'stopTimeRange',
    label: '停课时间'
  },
  {
    prop: 'stopReasonName',
    label: '停课原因'
  },
  {
    prop: 'stopScopeName',
    label: '停课范围'
  }
]
let searchFormData = {
  rangeDate: []
}
let searchFormDataForLeader = {
  rangeDate: [],
  countyCode: '',
  schoolId: ''
}
export {
  searchFormConfig,
  searchFormConfigForLeader,
  columns,
  columnsForLeader,
  searchFormData,
  searchFormDataForLeader
}
