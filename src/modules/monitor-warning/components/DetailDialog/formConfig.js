export const infectiousDetailFormSchema = {
  formStyle: {
    size: 'small',
    labelWidth: '150px',
    justify: 'center',
    btns: [],
    disabled: true
  },
  properties: [
    {
      type: 'dateTimePicker',
      label: '预警时间',
      key: 'warningTime',
      disabled: false,
      span: 8,
      labelWidth: '90px',
      style: { width: '100%' }
    },
    {
      type: 'select',
      label: '传染病分类',
      key: 'infectiouTypeA',
      disabled: false,
      multiple: false,
      collapseTags: false,
      clearable: true,
      options: [],
      props: {
        label: 'name',
        value: 'id'
      },
      span: 5,
      labelWidth: '90px',
      style: { width: '100%' }
    },
    {
      type: 'select',
      label: '',
      key: 'infectiouTypeB',
      disabled: false,
      multiple: false,
      collapseTags: false,
      clearable: true,
      options: [],
      props: {
        label: 'name',
        value: 'id'
      },
      span: 3,
      labelWidth: '8px',
      style: { width: '100%' }
    },
    {
      type: 'input',
      label: '病例数',
      key: 'patientNum',
      disabled: false,
      span: 8,
      labelWidth: '90px'
    },
    // {
    //   type: 'select',
    //   label: '监测指标',
    //   key: 'kpi',
    //   disabled: false,
    //   multiple: false,
    //   collapseTags: false,
    //   clearable: true,
    //   options: [],
    //   props: {
    //     label: 'name',
    //     value: 'id'
    //   },
    //   span: 8,
    //   labelWidth: '90px',
    //   style: { width: '100%' }
    // },
    // {
    //   type: 'select',
    //   label: '指标内容',
    //   key: 'kpiContent',
    //   disabled: false,
    //   multiple: false,
    //   collapseTags: false,
    //   clearable: true,
    //   options: [],
    //   props: {
    //     label: 'name',
    //     value: 'id'
    //   },
    //   span: 8,
    //   labelWidth: '90px',
    //   style: { width: '100%' }
    // },
    {
      type: 'select',
      label: '预警级别',
      key: 'warningLevel',
      disabled: false,
      multiple: false,
      collapseTags: false,
      clearable: true,
      options: [],
      props: {
        label: 'dictValue',
        value: 'dictCode'
      },
      span: 8,
      labelWidth: '90px',
      style: { width: '100%' }
    },
    {
      type: 'select',
      label: '处理状态',
      key: 'warningStatus',
      disabled: false,
      multiple: false,
      collapseTags: false,
      clearable: true,
      options: [],
      props: {
        label: 'dictValue',
        value: 'dictCode'
      },
      span: 8,
      labelWidth: '90px',
      style: { width: '100%' }
    },
    {
      type: 'custom',
      key: 'custom1',
      span: 8
    },
    {
      type: 'custom',
      label: '预警区域',
      key: 'warningArea',
      disabled: false,
      span: 16,
      labelWidth: '90px'
    }
  ],
  propertiesOrder: []
}

export const infectiousDetailFormData = {
  warningTime: '',
  infectiouTypeA: '',
  infectiouTypeB: '',
  patientNum: '',
  // kpi: '',
  // kpiContent: '',
  warningLevel: '',
  warningArea: '',
  warningStatus: ''
}

export const syndromeDetailFormSchema = {
  formStyle: {
    size: 'small',
    labelWidth: '150px',
    justify: 'center',
    btns: [],
    disabled: true
  },
  properties: [
    {
      type: 'dateTimePicker',
      label: '预警时间',
      key: 'warningTime',
      disabled: false,
      span: 8,
      labelWidth: '90px',
      style: { width: '100%' }
    },
    {
      type: 'select',
      label: '症候群类型',
      key: 'syndromeType',
      disabled: false,
      multiple: false,
      collapseTags: false,
      clearable: true,
      options: [],
      props: {
        label: 'name',
        value: 'id'
      },
      span: 8,
      labelWidth: '90px',
      style: { width: '100%' }
    },
    {
      type: 'input',
      label: '病例数',
      key: 'patientNum',
      disabled: false,
      span: 8,
      labelWidth: '90px'
    },
    // {
    //   type: 'select',
    //   label: '监测指标',
    //   key: 'kpi',
    //   disabled: false,
    //   multiple: false,
    //   collapseTags: false,
    //   clearable: true,
    //   options: [],
    //   props: {
    //     label: 'name',
    //     value: 'id'
    //   },
    //   span: 8,
    //   labelWidth: '90px',
    //   style: { width: '100%' }
    // },
    // {
    //   type: 'select',
    //   label: '指标内容',
    //   key: 'kpiContent',
    //   disabled: false,
    //   multiple: false,
    //   collapseTags: false,
    //   clearable: true,
    //   options: [],
    //   props: {
    //     label: 'name',
    //     value: 'id'
    //   },
    //   span: 8,
    //   labelWidth: '90px',
    //   style: { width: '100%' }
    // },
    {
      type: 'select',
      label: '预警级别',
      key: 'warningLevel',
      disabled: false,
      multiple: false,
      collapseTags: false,
      clearable: true,
      options: [],
      props: {
        label: 'dictValue',
        value: 'dictCode'
      },
      span: 8,
      labelWidth: '90px',
      style: { width: '100%' }
    },
    {
      type: 'select',
      label: '处理状态',
      key: 'warningStatus',
      disabled: false,
      multiple: false,
      collapseTags: false,
      clearable: true,
      options: [],
      props: {
        label: 'dictValue',
        value: 'dictCode'
      },
      span: 8,
      labelWidth: '90px',
      style: { width: '100%' }
    },
    {
      type: 'custom',
      key: 'custom1',
      span: 8
    },
    {
      type: 'custom',
      label: '预警区域',
      key: 'warningArea',
      disabled: false,
      span: 16,
      labelWidth: '90px'
    }
  ],
  propertiesOrder: []
}

export const syndromeDetailFormData = {
  warningTime: '',
  syndromeType: '',
  patientNum: '',
  // kpi: '',
  // kpiContent: '',
  warningLevel: '',
  warningArea: '',
  warningStatus: ''
}

export const caseColumns = [
  {
    prop: 'name',
    label: '姓名'
  },
  {
    prop: 'sexCodeName',
    label: '性别'
  },
  {
    prop: 'age',
    label: '年龄'
  },
  {
    prop: 'occupationName',
    label: '职业'
  },
  {
    prop: 'address',
    label: '现住址'
  },
  {
    prop: 'contactPhone',
    label: '联系电话'
  },
  {
    prop: 'visitOrgName',
    label: '就诊机构'
  }
]

export const taskColumns = [
  {
    prop: 'taskTypeName',
    label: '任务类型'
  },
  {
    prop: 'taskName',
    label: '任务名称'
  },
  {
    prop: 'taskStatusName',
    label: '任务状态'
  },
  {
    prop: 'taskExecStartTime',
    label: '执行开始时间'
  },
  {
    prop: 'taskExecEndTime',
    label: '执行结束时间'
  },
  {
    prop: 'memberNum',
    label: '队伍人数'
  },
  {
    prop: 'incharge',
    label: '负责人'
  },
  {
    prop: 'contactPhone',
    label: '联系电话'
  }
]
