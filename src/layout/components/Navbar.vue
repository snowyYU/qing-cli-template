<template>
  <div class="navbar">
    <!--    <breadcrumb class="breadcrumb-container" />-->
    <div class="left-area">
      <span class="object-title">{{ objectTitle }}</span>
    </div>
    <div class="center-area">
      <el-menu
        :default-active="activeModule"
        mode="horizontal"
        @select="handleMenuSelect"
      >
        <el-menu-item
          :index="route.path"
          v-for="route in routes"
          :key="route.path"
        >
          {{ route.meta.title }}
        </el-menu-item>
      </el-menu>
    </div>
    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar + '?imageView2/1/w/80/h/80'" class="user-avatar" />
          <span class="user-nickname">{{ name }}</span>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <!-- <router-link to="/">
            <el-dropdown-item> 系统管理 </el-dropdown-item>
          </router-link>
          <a
            target="_blank"
            href="https://github.com/PanJiaChen/vue-admin-template/"
          >
            <el-dropdown-item>切换账号</el-dropdown-item>
          </a> -->
          <!-- <a
            target="_blank"
            href="https://panjiachen.github.io/vue-element-admin-site/#/"
          >
            <el-dropdown-item>Docs</el-dropdown-item>
          </a> -->
          <el-dropdown-item @click.native="logout">
            <span style="display: block">退出账号</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
// import Breadcrumb from '@/components/Breadcrumb'

export default {
  components: {
    // Breadcrumb
  },
  computed: {
    ...mapGetters(['sidebar', 'name', 'avatar']),
    ...mapState({
      objectTitle: state => state.settings.objectTitle
    }),
    activeModule() {
      const route = this.$route
      if (route.path) {
        return '/' + route.path.split('/')[1]
      }
      return ''
    },
    routes() {
      const routes = this.$router.options.routes
      const filterRoutes = routes.filter(route => {
        return route.meta && route.meta.isModule && !route.meta.hidden
      })
      // console.log('filterRoutes', filterRoutes)
      return filterRoutes
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout', false)
      // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    // 菜单选中
    handleMenuSelect(index) {
      const target = this.routes.find(route => route.path === index)
      if (target && target.meta && target.meta.outsideLink) {
        window.open(`${target.meta.outsideLink}`)
        return
      }

      if (this.activeModule !== index) {
        this.$router.push(index)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  display: flex;
  // justify-content: space-between;
  align-items: center;
  height: 52px;
  overflow: hidden;
  position: relative;
  background: #4a81fe;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .left-area {
    flex: 0 0 auto;
    margin: 0 26px;

    .object-title {
      color: #ffffff;
      font-size: 16px;
      font-weight: 500;
    }
  }

  .center-area {
    flex: 1 0 auto;
    height: 100%;

    &::v-deep {
      .el-menu.el-menu--horizontal {
        border-bottom: none;
        background-color: #4a81fe;

        & > .el-menu-item {
          height: 52px;
          line-height: 52px;
          border-bottom: none;
          color: #ffffff;

          &.is-active {
            border-bottom: 2px solid #409eff;
            color: #4a81fe;
            background-color: #ffffff;
          }
        }

        & > .el-menu-item:not(.is-disabled):focus,
        & > .el-menu-item:not(.is-disabled):hover,
        & > .el-submenu .el-submenu__title:hover {
          color: #4a81fe;
          background-color: #ffffff;
        }

        // & > .el-menu-item.is-active:not(.is-disabled):focus {
        //   background-color: #ffffff;
        // }

        // & > .el-menu-item.is-active:not(.is-disabled):hover,
        // & > .el-submenu .el-submenu__title:hover {
        //   background-color: rgba(255, 255, 255, 0.8);
        // }
      }
    }
  }

  .right-menu {
    flex: 0 0 auto;
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin: 0 30px;

      .avatar-wrapper {
        display: flex;
        align-items: center;
        height: 52px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          margin-right: 10px;
        }

        .user-nickname {
          color: #ffffff;
          font-size: 14px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
