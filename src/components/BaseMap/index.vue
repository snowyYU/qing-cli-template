<template>
  <div class="base-map">
    <div class="base-map__map" ref="map"></div>

    <div class="base-map__search-bar" v-if="!readonly && showSearchBar">
      <el-autocomplete
        popper-class="base-map__autocomplete"
        size="mini"
        v-model="keyword"
        :fetch-suggestions="querySearch"
        placeholder="请输入关键字"
        clearable
        @select="handleSelect"
      >
        <template slot-scope="{ item }">
          <span class="name">{{ item.name }}</span>
          <span class="district">{{ item.district }}</span>
        </template>
      </el-autocomplete>

      <el-button
        type="primary"
        size="mini"
        icon="el-icon-search"
        @click="handleClick"
      ></el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseMap',
  props: {
    // 自动创建地图
    autoCreate: {
      type: Boolean,
      default: false
    },
    // 只读状态
    readonly: {
      type: Boolean,
      default: false
    },
    // 区域类型
    areaType: {
      type: String,
      default: 'POI'
    },
    // 搜索栏显示状态
    showSearchBar: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 地图实例
      aMap: null,
      // 输入提示，提供了根据关键字获得提示信息的功能
      autocomplete: null,
      // POI搜索
      placeSearch: null,
      // 行政区查询
      districtSearch: null,
      // 地理编码与逆地理编码服务，提供地址与坐标间的相互转换
      geocoder: null,
      // 地图加载完成标志
      isMapComplete: false,
      // 绘制状态
      drawing: false,
      // 矢量图路径
      path: [],
      // 搜索栏关键字
      keyword: ''
    }
  },
  methods: {
    /***** 地图事件 start *****/

    /**
     * 地图加载完成
     */
    handleMapComplete() {
      this.isMapComplete = true
      this.$emit('complete')
    },

    /**
     * 鼠标左键点击
     * @param {*} e
     */
    handleMapClick(e) {
      // console.log(e)
      if (this.areaType === 'POI') {
        this._drawMarker(e.lnglat)
        const lnglat = { lng: e.lnglat.getLng(), lat: e.lnglat.getLat() }
        // console.log('lnglat', lnglat)
        this.$emit('change', this.areaType, lnglat)

        // this._getAddressByLnglat(e.lnglat)
        //   .then(res => {
        //     // console.log(res)
        //     this.$emit('address-change', {
        //       lnglat,
        //       address: res.regeocode.formattedAddress
        //     })
        //   })
        //   .catch(() => {
        //     this.$message.error('无法获取位置信息')
        //   })
      } else if (this.areaType === 'AOI') {
        if (!this.drawing) {
          this.drawing = true
          this.path = []
        }
        this.path.push(e.lnglat)
        this._drawPolygon(this.path)
      }
    },

    /**
     * 鼠标右键点击
     */
    handleMapRightClick() {
      if (this.areaType === 'AOI' && this.drawing) {
        this.drawing = false
        this._drawPolygon(this.path)
        const path = this.path.map(item => ({
          lng: item.getLng(),
          lat: item.getLat()
        }))
        this.path = []
        this.$emit('change', this.areaType, path)
      }
    },

    /**
     * 鼠标移动
     * @param {*} e
     */
    handleMapMouseMove(e) {
      if (this.areaType === 'AOI' && this.drawing) {
        // console.log(e)
        const path = [...this.path, e.lnglat]
        this._drawPolygon(path)
      }
    },

    /***** 地图事件 end *****/

    /***** 搜索栏事件 start *****/

    /**
     * 搜索事件
     * @param {string} queryString
     * @param {function} callback
     */
    querySearch(queryString, callback) {
      if (queryString) {
        this.autocomplete.search(queryString, function(status, result) {
          // console.log(status, result)
          if (status === 'complete') {
            callback(result.tips)
          } else {
            callback([])
          }
        })
      } else {
        callback([])
      }
    },

    /**
     * 搜索栏选中事件
     * @param {*} item
     */
    handleSelect(item) {
      // console.log(item)
      this.keyword = item.name
      this._setZoomAndCenter(18, item.location)
      if (this.areaType === 'POI') {
        this._drawMarker(item.location)
      }
      const lnglat = {
        lng: item.location.getLng(),
        lat: item.location.getLat()
      }
      this.$emit('change', this.areaType, lnglat)

      // this.keyword = item.name
      // this.placeSearch.setCity(item.adcode)
      // this.placeSearch.search(item.name, (status, result) => {
      //   console.log(`placeSearch::${status}: `, result)
      //   if (status === 'complete') {
      //     if (result.poiList.count > 0) {
      //       this._setCenter(result.poiList.pois[0].location)
      //     }
      //   }
      //   this.placeSearch.clear()
      // })
      // this.placeSearch.search(item.name)

      // this.keyword = item.name

      // this.placeSearch.setCity(item.adcode)
      // this.placeSearch.search(item.name, (status, result) => {
      //   console.log(`placeSearch::${status}: `, result)
      // })
      // this.placeSearch.getDetails(item.id, (status, result) => {
      //   console.log(`placeSearch::${status}: `, result)
      // })

      // this.geocoder.setCity(item.adcode)
      // this.geocoder.getLocation(item.name, (status, result) => {
      //   console.log(`geocoder::getLocation::${status}: `, result)
      // })
      // this.geocoder.getAddress(item.location, (status, result) => {
      //   console.log(`geocoder::getAddress::${status}: `, result)
      // })

      // this.districtSearch.search(item.name, (status, result) => {
      //   console.log(`districtSearch::${status}: `, result)

      //   this._drawPolygon(result.districtList[0].boundaries[0])
      // })
    },

    /**
     * 搜索事件
     */
    handleClick() {
      // this.getLnglatByAddress(this.keyword).then(res => {
      //   // console.log(res)
      //   const { location } = res.geocodes[0]
      //   this._setCenter(location)
      //   this._drawMarker(location)
      //   this.$emit('change', this.areaType, location)
      // })

      if (!this.keyword) {
        this.$message.error('请选输入关键字')
        return
      }

      this.autocomplete.search(this.keyword, (status, result) => {
        // console.log('autocomplete-' + status, result)
        if (status === 'complete' && result.count > 0) {
          const { location } = result.tips[0]
          // this._setCenter(location)
          this._setZoomAndCenter(18, location)
          if (this.areaType === 'POI') {
            this._drawMarker(location)
          }
          const lnglat = {
            lng: location.getLng(),
            lat: location.getLat()
          }
          this.$emit('change', this.areaType, lnglat)
        } else {
          this.$message.error('无法获取位置信息')
        }
      })

      // this.placeSearch.search(this.keyword, (status, result) => {
      //   console.log('placeSearch-' + status, result)
      // })

      // this.districtSearch.search(this.keyword, (status, result) => {
      //   console.log('districtSearch-' + status, result)
      // })

      // this.autocomplete.search(this.keyword, (status, result) => {
      //   // console.log(status, result)
      //   if (status === 'complete') {
      //     this.placeSearch.setCity(result.tips[0].adcode)
      //     this.placeSearch.search(result.tips[0].name, (status, result) => {
      //       if (status === 'complete') {
      //         if (result.poiList.count > 0) {
      //           this._setCenter(result.poiList.pois[0].location)
      //         }
      //       }
      //     })
      //   } else {
      //     this.$message.error('无法获取位置信息')
      //   }
      // })
    },

    /***** 搜索栏事件 end *****/

    /***** 公共方法 start *****/

    /**
     * 创建地图
     * @param {object} opts 参数
     */
    create(opts = { animateEnable: false }) {
      if (!this.aMap) {
        const options = { zoom: 13, resizeEnable: true, ...opts }
        if (this.readonly) {
          options.resizeEnable = false
          options.dragEnable = false
          options.zoomEnable = false
          options.doubleClickZoom = false
        }
        this.aMap = new AMap.Map(this.$refs.map, options)
        this.aMap.on('complete', this.handleMapComplete())
        if (!this.readonly) {
          // 工具条，控制地图的缩放、平移等
          this.aMap.addControl(new AMap.ToolBar())
          // 比例尺，显示当前地图中心的比例尺
          this.aMap.addControl(new AMap.Scale())

          if (this.showSearchBar) {
            // 输入提示，提供了根据关键字获得提示信息的功能
            this.autocomplete = new AMap.Autocomplete()
            this.placeSearch = new AMap.PlaceSearch({
              extensions: 'all'
            })
            this.districtSearch = new AMap.DistrictSearch({
              extensions: 'all'
            })
          }

          // 地理编码与逆地理编码服务，提供地址与坐标间的相互转换
          // this.geocoder = new AMap.Geocoder({
          //   batch: false
          // })

          this.geocoder = new AMap.Geocoder({
            radius: 3000,
            batch: false,
            extensions: 'all'
          })

          this._registerEvent()
        }
      }
    },

    /**
     * 销毁地图
     */
    destroy() {
      if (this.aMap) {
        this.isMapComplete = false
        this.drawing = false
        // this.keyword = ''
        this.path = []
        this.aMap.off('complete', this.handleMapComplete)
        if (!this.readonly) {
          this._unregisterEvent()
        }
        this.clearMap()
        this.autocomplete = null
        this.placeSearch = null
        this.districtSearch = null
        this.geocoder = null
        this.aMap.destroy()
        this.aMap = null
      }
    },

    /**
     * 获取高德地图的经纬度坐标类
     * @param {*} lng 经度
     * @param {*} lat 纬度
     * @param {*} noAutofix 自动修正
     */
    getLngLat(lng, lat, noAutofix = false) {
      return new AMap.LngLat(lng, lat, noAutofix)
    },

    /**
     * 设置地图显示的缩放级别
     * @param {number} level 缩放级别
     */
    setZoom(level) {
      if (this.aMap) {
        this.aMap.setZoom(level)
      }
    },

    /**
     * 设置地图显示缩放级别和中心点
     * @param {number} level 缩放级别
     * @param {*} lnglat 经纬度坐标
     */
    setZoomAndCenter(level, lng, lat) {
      if (this.aMap) {
        const lnglat = this.getLngLat(lng, lat)
        this.aMap.setZoomAndCenter(level, lnglat)
      }
    },

    /**
     * 删除地图上所有的覆盖物
     */
    clearMap() {
      if (this.aMap) {
        this.aMap.clearMap()
      }
    },

    /**
     * 地址转坐标
     * @param {string} address 地址
     */
    getLnglatByAddress(address) {
      return new Promise((resolve, reject) => {
        this.geocoder.getLocation(address, (status, result) => {
          if (status === 'complete') {
            resolve(result)
          } else {
            reject(status)
          }
        })
      })
    },

    /***** 公共方法 end *****/

    /***** 内部方法 start *****/

    /**
     * 注册事件
     */
    _registerEvent() {
      this.aMap.on('click', this.handleMapClick)
      this.aMap.on('rightclick', this.handleMapRightClick)
      this.aMap.on('mousemove', this.handleMapMouseMove)
    },

    /**
     * 注销事件
     */
    _unregisterEvent() {
      this.aMap.off('click', this.handleMapClick)
      this.aMap.off('rightclick', this.handleMapRightClick)
      this.aMap.off('mousemove', this.handleMapMouseMove)
    },

    /**
     * 设置地图显示的中心点
     * @param {*} lnglat 经纬度坐标
     */
    _setCenter(lnglat) {
      if (this.aMap) {
        this.aMap.setCenter(lnglat)
      }
    },

    /**
     * 设置地图显示缩放级别和中心点
     * @param {number} level 缩放级别
     * @param {*} lnglat 经纬度坐标
     */
    _setZoomAndCenter(level, lnglat) {
      if (this.aMap) {
        this.aMap.setZoomAndCenter(level, lnglat)
      }
    },

    /**
     * 绘制一个标志
     * @param {*} lnglat 经纬度坐标
     */
    _drawMarker(lnglat) {
      this.clearMap()
      const marker = new AMap.Marker({})
      marker.setPosition(lnglat)
      this.aMap.add(marker)
      // this.setCenter(lnglat)
    },

    /**
     * 绘制一个矢量图
     * @param {array} path 坐标路径 [{ lnglat: AMap.LngLat }]
     * @param {*} opts 参数
     */
    _drawPolygon(path, opts = {}) {
      this.clearMap()
      const polygon = new AMap.Polygon(opts)
      polygon.setPath(path)
      this.aMap.add(polygon)
    },

    /**
     * 坐标转地址
     * @param {*} lnglat 经纬度坐标
     */
    _getAddressByLnglat(lnglat) {
      return new Promise((resolve, reject) => {
        this.geocoder.getAddress(lnglat, (status, result) => {
          // console.log(`getAddress-${status}: `, result)
          if (status === 'complete') {
            resolve(result)
          } else {
            reject(status)
          }
        })
      })
    },

    addressSearch() {},

    /***** 内部方法 end *****/

    /***** 外部方法 start *****/

    /**
     * 设置地图显示的中心点
     * @param {number} lng 经度
     * @param {number} lat 纬度
     */
    setCenter(lng, lat) {
      if (this.aMap) {
        const lnglat = this.getLngLat(lng, lat)
        this.aMap.setCenter(lnglat)
      }
    },

    /**
     * 绘制一个标志
     * @param {number} lng 经度
     * @param {number} lat 纬度
     * @param {*} opts 参数
     */
    drawMarker(lng, lat, opts = {}) {
      if (!lng || !lat) return
      this.clearMap()
      const marker = new AMap.Marker(opts)
      const lnglat = this.getLngLat(Number(lng), Number(lat))
      marker.setPosition(lnglat)
      this.aMap.add(marker)
      this._setCenter(lnglat)
    },

    /**
     * 绘制一个矢量图
     * @param {array} path 坐标路径 [{ lng: number, lat: number }]
     * @param {*} opts 参数
     */
    drawPolygon(path, opts = {}) {
      this.clearMap()
      const polygon = new AMap.Polygon(opts)
      this.path = path.map(item => {
        const { lng, lat } = item
        return this.getLngLat(lng, lat)
      })
      polygon.setPath(this.path)
      this.aMap.add(polygon)
      this._setCenter(polygon.getBounds().getCenter())
    },

    /**
     * 坐标转地址
     * @param {numebr} lng 经度
     * @param {numebr} lat 纬度
     */
    getAddressByLnglat(lng, lat) {
      return new Promise((resolve, reject) => {
        const lnglat = this.getLngLat(lng, lat)
        this.geocoder.getAddress(lnglat, (status, result) => {
          // console.log(`getAddress-${status}: `, result)
          if (status === 'complete') {
            resolve(result)
          } else {
            reject(status)
          }
        })
      })
    }

    /***** 外部方法 end *****/
  },
  mounted() {
    if (this.autoCreate) {
      this.create()
    }
  },
  beforeDestroy() {
    this.destroy()
  }
}
</script>

<style lang="scss" scoped>
.base-map {
  position: relative;
  width: 100%;
  height: 300px;

  &__map {
    width: 100%;
    height: 100%;
  }

  &__search-bar {
    position: absolute;
    top: 16px;
    left: 8px;
    z-index: 10;

    &::v-deep {
      .el-input__inner {
        width: 280px;
        border-radius: 0;
      }

      .el-button {
        border-radius: 0;
      }
    }
  }

  &__autocomplete {
    .district {
      margin-left: 8px;
      font-size: 12px;
      color: #b4b4b4;
    }
  }
}
</style>
