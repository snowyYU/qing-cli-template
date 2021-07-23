<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :default-active="activeMenu"
      :collapse="isCollapse"
      :background-color="variables.menuBg"
      :text-color="variables.menuText"
      :unique-opened="false"
      :active-text-color="variables.menuActiveText"
      :collapse-transition="false"
      mode="vertical"
    >
      <sidebar-item
        v-for="route in routes"
        :key="route.path"
        :item="route"
        :base-path="route.path"
      />
    </el-menu>
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import Hamburger from '@/components/Hamburger'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Hamburger },
  props: {
    noTopHeaderMenu: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters(['permission_routes', 'sidebar']),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    routes() {
      const routes = this.$router.options.routes
      const currentRoute = this.$route
      if (currentRoute.path) {
        let filterRoutes = []
        if (this.noTopHeaderMenu) {
          routes.forEach((route) => {
            if (!route.hidden) {
              filterRoutes.push(route)
            }
          })
        } else {
          const parentPath = '/' + currentRoute.path.split('/')[1]
          routes.some((route) => {
            if (route.path === parentPath) {
              filterRoutes = route.children
              return true
            }
            return false
          })
        }
        return filterRoutes
      }
      return []
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    }
  }
}
</script>

<style lang="scss" scoped>
.hamburger-container {
  position: absolute;
  left: 0;
  bottom: 15px;
  line-height: 46px;
  height: 20px;
  cursor: pointer;
  transition: background 0.3s;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    background: rgba(0, 0, 0, 0.025);
  }
}
</style>
