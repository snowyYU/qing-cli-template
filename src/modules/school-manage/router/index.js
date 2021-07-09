import FirstLayout from '@/layout/FirstLayout'
import SecondLayout from '@/layout/SecondLayout'

const asyncRoutes = [
  {
    path: '/school-manage',
    redirect: '/school-manage/class-manage',
    component: FirstLayout,
    meta: { title: '学校管理', icon: '', isModule: true },
    children: [
      {
        path: '/school-manage/class-manage',
        redirect: '/school-manage/class-manage/index',
        component: SecondLayout,
        meta: { title: '班级管理', icon: '', breadcrumb: false },
        children: [
          {
            name: 'classManage',
            path: '/school-manage/class-manage/index',
            component: () => import('../views/class-manage/index.vue'),
            meta: { title: '班级管理', icon: '' }
          }
        ]
      },

      {
        path: '/school-manage/student-manage',
        redirect: '/school-manage/student-manage/student-file-manage/index',
        component: SecondLayout,
        meta: { title: '学生管理', icon: '' },
        children: [
          {
            path: '/school-manage/student-manage/student-file-manage/index',
            component: () =>
              import('../views/student-manage/student-file-manage/index.vue'),
            meta: { title: '学生档案管理', icon: '' }
          },
          {
            path:
              '/school-manage/student-manage/student-death-registration/index',
            component: () =>
              import(
                '../views/student-manage/student-death-registration/index.vue'
              ),
            meta: { title: '学生死亡登记', icon: '' }
          },
          {
            path:
              '/school-manage/student-manage/student-quit-registration/index',
            component: () =>
              import(
                '../views/student-manage/student-quit-registration/index.vue'
              ),
            meta: { title: '学生休退学登记', icon: '' }
          },
          {
            name: 'student-tranfer-registration',
            path:
              '/school-manage/student-manage/student-tranfer-registration/index',
            component: () =>
              import(
                '../views/student-manage/student-tranfer-registration/index.vue'
              ),
            meta: { title: '学生转学登记', icon: '' }
          }
        ]
      },
      {
        path: '/school-manage/suspend-manage',
        redirect: '/school-manage/suspend-manage/index',
        component: SecondLayout,
        meta: { title: '停课管理', icon: '', breadcrumb: false },
        children: [
          {
            name: 'suspendManage',
            path: '/school-manage/suspend-manage/index',
            component: () => import('../views/suspend-manage/index.vue'),
            meta: { title: '停课管理', icon: '' }
          }
        ]
      }
    ]
  }
]
const constantRoutes = []

export default {
  constantRoutes,
  asyncRoutes
}
