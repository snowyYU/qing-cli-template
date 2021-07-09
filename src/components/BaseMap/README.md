## 2021.04.12

- 更换生成地图的节点，并通过 ref 获取 dom，不再使用 id 获取

## 3.13

- 增加组件文档

### Attributes

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -- | -- | -- | -- | -- |
| auto-create | 自动创建地图 | Boolean | - | false |
| readonly | 只读状态 | Boolean | - | false |
| area-type | 区域类型 | Boolean | POI / AOI | POI |
| show-search-bar | 是否显示搜索栏 | Boolean | - | false |

### Methods

| 方法名 | 说明 | 参数 |
| -- | -- | -- |
| create | 创建地图 | Function(opts: MapOptions) |
| destroy | 销毁地图 | - |
| getLngLat | 获取高德地图的经纬度坐标类 | Function(lng: number, lat: number, noAutofix: boolean) |
| setCenter | 设置地图显示的中心点 | Function(lngLat: AMap.LngLat) |
| setZoom | 设置地图显示的缩放级别 | Function(level: number) |
| clearMap | 删除地图上所有的覆盖物 | - |
| drawMarker | 绘制一个标志 | Function(lng: number, lat: number, opts: object) |
| drawPolygon | 绘制一个矢量图 | Function(path: object) |

### Events

| 事件名称 | 说明 | 回调参数 |
| -- | -- | -- |
| complete | 地图图块加载完成后触发事件 | - |
| change | POI 模式下，切换坐标触发，AOI 模式下，矢量图绘制完毕触发，readonly 参数为 true 时不可用 | (areaType: string, data: lnglat \| path) |

具体内容参考 [高德地图](https://developer.amap.com/api/javascript-api/summary)
