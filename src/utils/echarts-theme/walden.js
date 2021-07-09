const walden = {
  seriesCnt: '3',
  backgroundColor: 'rgba(252,252,252,0)',
  titleColor: '#666666',
  subtitleColor: '#999999',
  textColorShow: false,
  textColor: '#333',
  markTextColor: '#ffffff',
  color: ['#3fb1e3', '#6be6c1', '#626c91', '#a0a7e6', '#c4ebad', '#96dee8'],
  borderColor: '#ccc',
  borderWidth: 0,
  visualMapColor: ['#2a99c9', '#afe8ff'],
  legendTextColor: '#999999',
  kColor: '#e6a0d2',
  kColor0: 'transparent',
  kBorderColor: '#e6a0d2',
  kBorderColor0: '#3fb1e3',
  kBorderWidth: '2',
  lineWidth: '3',
  symbolSize: '8',
  symbol: 'emptyCircle',
  symbolBorderWidth: '2',
  lineSmooth: false,
  graphLineWidth: '1',
  graphLineColor: '#cccccc',
  mapLabelColor: '#ffffff',
  mapLabelColorE: '#3fb1e3',
  mapBorderColor: '#aaaaaa',
  mapBorderColorE: '#3fb1e3',
  mapBorderWidth: 0.5,
  mapBorderWidthE: 1,
  mapAreaColor: '#eeeeee',
  mapAreaColorE: 'rgba(63,177,227,0.25)',
  axes: [
    {
      type: 'all',
      name: '通用坐标轴',
      axisLineShow: true,
      axisLineColor: '#cccccc',
      axisTickShow: false,
      axisTickColor: '#333',
      axisLabelShow: true,
      axisLabelColor: '#999999',
      splitLineShow: true,
      splitLineColor: ['#eeeeee'],
      splitAreaShow: false,
      splitAreaColor: ['rgba(250,250,250,0.05)', 'rgba(200,200,200,0.02)']
    },
    {
      type: 'category',
      name: '类目坐标轴',
      axisLineShow: true,
      axisLineColor: '#333',
      axisTickShow: true,
      axisTickColor: '#333',
      axisLabelShow: true,
      axisLabelColor: '#333',
      splitLineShow: false,
      splitLineColor: ['#ccc'],
      splitAreaShow: false,
      splitAreaColor: ['rgba(250,250,250,0.3)', 'rgba(200,200,200,0.3)']
    },
    {
      type: 'value',
      name: '数值坐标轴',
      axisLineShow: true,
      axisLineColor: '#333',
      axisTickShow: true,
      axisTickColor: '#333',
      axisLabelShow: true,
      axisLabelColor: '#333',
      splitLineShow: true,
      splitLineColor: ['#ccc'],
      splitAreaShow: false,
      splitAreaColor: ['rgba(250,250,250,0.3)', 'rgba(200,200,200,0.3)']
    },
    {
      type: 'log',
      name: '对数坐标轴',
      axisLineShow: true,
      axisLineColor: '#333',
      axisTickShow: true,
      axisTickColor: '#333',
      axisLabelShow: true,
      axisLabelColor: '#333',
      splitLineShow: true,
      splitLineColor: ['#ccc'],
      splitAreaShow: false,
      splitAreaColor: ['rgba(250,250,250,0.3)', 'rgba(200,200,200,0.3)']
    },
    {
      type: 'time',
      name: '时间坐标轴',
      axisLineShow: true,
      axisLineColor: '#333',
      axisTickShow: true,
      axisTickColor: '#333',
      axisLabelShow: true,
      axisLabelColor: '#333',
      splitLineShow: true,
      splitLineColor: ['#ccc'],
      splitAreaShow: false,
      splitAreaColor: ['rgba(250,250,250,0.3)', 'rgba(200,200,200,0.3)']
    }
  ],
  axisSeperateSetting: false,
  toolboxColor: '#999999',
  toolboxEmphasisColor: '#666666',
  tooltipAxisColor: '#cccccc',
  tooltipAxisWidth: 1,
  timelineLineColor: '#626c91',
  timelineLineWidth: 1,
  timelineItemColor: '#626c91',
  timelineItemColorE: '#626c91',
  timelineCheckColor: '#3fb1e3',
  timelineCheckBorderColor: '#3fb1e3',
  timelineItemBorderWidth: 1,
  timelineControlColor: '#626c91',
  timelineControlBorderColor: '#626c91',
  timelineControlBorderWidth: 0.5,
  timelineLabelColor: '#626c91',
  datazoomBackgroundColor: 'rgba(255,255,255,0)',
  datazoomDataColor: 'rgba(222,222,222,1)',
  datazoomFillColor: 'rgba(114,230,212,0.25)',
  datazoomHandleColor: '#cccccc',
  datazoomHandleWidth: '100',
  datazoomLabelColor: '#999999'
}

export default walden
