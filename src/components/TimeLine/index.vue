<template>
  <div class="time-line-box">
    <el-timeline>
      <el-timeline-item
        v-for="(activity, index) in logsData"
        :key="index"
        :timestamp="activity.timestamp"
        :icon="activity.icon"
        :type="activity.type"
        :color="activity.color"
        :size="activity.size"
        v-bind="{ ...activity }"
        :hide-timestamp="
          typeof activity.hideTimestamp === 'undefined'
            ? true
            : activity.hideTimestamp
        "
      >
        {{ activity.content }}
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
export default {
  name: 'TimeLine',
  props: {
    logsData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {}
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.time-line-box {
  padding: 20px 0;
  border: 1px solid #e1e3e6;
  margin-bottom: 20px;
}
::v-deep .el-timeline {
  padding-left: 31px;
  .el-timeline-item__node--normal {
    width: 6px;
    height: 6px;
    left: 2px;
  }
  .el-timeline-item__node--large {
    width: 16px;
    height: 16px;
    left: -3px;
  }
  .el-timeline-item__icon {
    &.icon-bigData-chenggong {
      color: #4a81fe;
    }
  }
  .el-timeline-item__content {
    color: #3a3a3d;
  }
}
</style>
