const defaultLayoutConfig = {
  // 栅格间隔
  gutter: 10,
  // 布局模式
  type: 'flex',
  justify: 'start',
  align: 'top',
  sm: 20,
  md: 20,
  lg: 20,
  xl: 20,
  btnGsm: 4,
  btnGmd: 4,
  btnGlg: 4,
  btnGxl: 4
}
// const itemLayOutSet = {
//   colSpan: 8,
//   offset: 0
// }

const componentNecessary = {
  input: {
    disabled: false,
    maxlength: '',
    colSpan: 8,
    offset: 0
    // defaultVal: ''
  },
  select: {
    options: [],
    disabled: false,
    clearable: false,
    colSpan: 8,
    offset: 0
    // defaultVal: ''
  },
  date: {
    dateType: 'year',
    pickerOptions: {},
    unlink: false,
    align: 'left',
    seq: '',
    startPlaceholder: '',
    endPlaceholder: '',
    disabled: false,
    colSpan: 8,
    offset: 0
    // defaultVal: ''
  }
}

export { defaultLayoutConfig, componentNecessary }
