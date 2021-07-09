<template>
  <div>
    <slot name="before"></slot>

    <el-breadcrumb
      class="app-breadcrumb"
      separator="/"
      separator-class="el-icon-arrow-right"
    >
      <transition-group name="breadcrumb">
        <el-breadcrumb-item
          v-for="(item, index) in finallBreadcrumbList"
          :key="index + Date()"
        >
          <span
            v-if="
              item.redirect === 'noRedirect' ||
                index === finallBreadcrumbList.length - 1
            "
            :class="[
              'no-redirect',
              index === finallBreadcrumbList.length - 1 ? 'last-element' : ''
            ]"
            >{{ item.meta.title }}</span
          >
          <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
        </el-breadcrumb-item>
        <slot name="after"></slot>
      </transition-group>
    </el-breadcrumb>
  </div>
</template>

<script>
import pathToRegexp from 'path-to-regexp'

export default {
  data() {
    return {
      levelList: null
    }
  },
  props: {
    breadcrumbList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  created() {
    this.getBreadcrumb()
  },
  computed: {
    finallBreadcrumbList() {
      if (this.breadcrumbList[0]) {
        return this.breadcrumbList
      } else {
        return this.levelList
      }
    }
  },
  methods: {
    getBreadcrumb() {
      // only show routes with meta.title
      let matched = this.$route.matched.filter(
        item => item.meta && item.meta.title
      )
      // const first = matched[0]

      // if (!this.isDashboard(first)) {
      //   matched = [{ path: '/dashboard', meta: { title: 'Dashboard' } }].concat(
      //     matched
      //   )
      // }

      this.levelList = matched.filter(
        item => item.meta && item.meta.title && item.meta.breadcrumb !== false
      )
    },
    // isDashboard(route) {
    //   const name = route && route.name
    //   if (!name) {
    //     return false
    //   }
    //   return name.trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase()
    // },
    pathCompile(path) {
      // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
      const { params } = this.$route
      var toPath = pathToRegexp.compile(path)
      return toPath(params)
    },
    handleLink(item) {
      const { redirect, path } = item
      if (redirect) {
        this.$router.push(redirect)
        return
      }
      this.$router.push(this.pathCompile(path))
    }
  }
}
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  vertical-align: middle;
  line-height: 40px;
  .el-breadcrumb__inner a {
    color: #717881;
  }
  .no-redirect {
    color: #97a8be;
    cursor: text;
    &.last-element {
      color: #4a81fe;
    }
  }
}
</style>
