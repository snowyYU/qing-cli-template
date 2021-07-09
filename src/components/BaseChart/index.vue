<template>
  <div class="base-chart"></div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'chart',
  props: {
    // 自动初始化
    autoInit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      chart: null,
      eventList: []
    }
  },
  methods: {
    /**
     * 创建一个 ECharts 实例
     */
    init() {
      this.chart = echarts.init(this.$el, 'walden')
      this.$emit('complete')
    },

    /**
     * 设置图表实例的配置项以及数据
     */
    setOption(option) {
      if (this.chart) {
        this.chart.setOption(option)
      }
    },

    /**
     * 添加事件
     * @param {string} eventName 事件名称
     * @param {string|object} query 可选的过滤条件，能够只在指定的组件或者元素上进行响应。
     * @param {function} handler 事件处理函数
     * @param {object} context 可选。回调函数内部的context，即this的指向。
     */
    on(eventName, ...args) {
      if (this.chart) {
        const event = { eventName }
        const handler = args.find(arg => typeof arg === 'function')
        if (handler) {
          event.handler = handler
        }
        this.eventList.push(event)
        this.chart.on(eventName, ...args)
      }
    },

    /**
     * 移除事件
     * @param {string} eventName 事件名称
     * @param {function} handler 可选，可以传入需要解绑的处理函数，不传的话解绑所有该类型的事件函数。
     */
    off(eventName, handler) {
      if (this.chart) {
        if (handler) {
          const index = this.eventList.findIndex(
            event => event.eventName === eventName && event.handler === handler
          )
          if (index > -1) {
            this.eventList.splice(index, 1)
          }

          this.chart.off(eventName, handler)
        } else {
          this.eventList = this.eventList.filter(
            event => event.eventName !== eventName
          )

          this.chart.off(eventName)
        }
      }
    },

    /**
     * 清空事件
     */
    clearEvent() {
      if (this.chart) {
        this.eventList.forEach(event => {
          this.chart.off(event.eventName, event.handler)
        })
        this.eventList = []
      }
    },

    /**
     * 改变图表尺寸，在容器大小发生改变时需要手动调用
     */
    resize() {
      if (this.chart) {
        this.chart.resize()
      }
    },

    /**
     * 显示加载动画效果
     */
    showLoading() {
      if (this.chart) {
        this.chart.showLoading()
      }
    },

    /**
     * 隐藏动画加载效果
     */
    hideLoading() {
      if (this.chart) {
        this.chart.hideLoading()
      }
    },

    /**
     * 清空当前实例
     */
    clear() {
      if (this.chart) {
        this.chart.clear()
      }
    },

    /**
     * 销毁实例
     */
    dispose() {
      if (this.chart) {
        this.chart.dispose()
        this.chart = null
      }
    }
  },
  mounted() {
    if (this.autoInit) {
      this.init()
    }
  },
  destroyed() {
    this.clearEvent()
    this.dispose()
  }
}
</script>

<style lang="scss" scoped>
.base-chart {
  width: 100%;
  height: 100%;
}
</style>
