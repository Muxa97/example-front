import Vue from 'vue'
import Router, { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

Vue.use(Router)

/*
  redirect:                      if set to 'noredirect', no redirect action will be trigger when clicking the breadcrumb
  meta: {
    title: 'title'               the name showed in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon showed in the sidebar
    breadcrumb: false            if false, the item will be hidden in breadcrumb (default is true)
    hidden: true                 if true, this route will not show in the sidebar (default is false)
  }
*/

export const constantRoutes: RouteConfig[] = [
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/login/index.vue'),
    meta: { hidden: true }
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "404" */ '@/views/404.vue'),
    meta: { hidden: true }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/index.vue'),
        meta: {
          title: 'Dashboard',
          icon: 'dashboard'
        }
      }
    ]
  }
]

export const asyncRoutes: RouteConfig[] = [
  {
    path: '/exchange',
    component: Layout,
    meta: {
      title: 'Exchange',
      icon: 'education',
      breadcrumb: false
    },
    children: [
      {
        path: '',
        component: () => import(/* webpackChunkName: "table" */ '@/views/table/index.vue'),
        meta: {
          title: 'Exchange',
          icon: 'education',
          // TODO: remove editor role after changing mocking backend to real backend
          roles: ['user', 'admin', 'editor']
        }
      },
      {
        path: 'stats',
        component: () => import(/* webpackChunkName: "table" */ '@/views/table/stats.vue'),
        meta: {
          title: 'Exchange Stats',
          icon: 'chart',
          roles: ['admin']
        }
      }
    ]
  },
  {
    path: '/audience',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('@/views/audience/index.vue'),
        meta: {
          title: 'Audience',
          icon: 'audience',
          roles: ['admin', 'user', 'editor']
        }
      }
    ]
  },
  {
    path: '/errors',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import(/* webpackCunkName: "errors" */ '@/views/errors/index.vue'),
        meta: {
          title: 'Errors',
          icon: 'bug',
          roles: ['admin', 'user', 'editor']
        }
      }
    ]
  },
]

const createRouter = () => new Router({
  mode: 'history',
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  base: process.env.BASE_URL,
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  (router as any).matcher = (newRouter as any).matcher // reset router
}

export default router
