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
        component: () => import(/* webpackChunkName: "exchanges" */ '@/views/exchanges/index.vue'),
        meta: {
          title: 'Exchange',
          icon: 'education',
          // TODO: remove editor role after changing mocking backend to real backend
          roles: ['user', 'admin', 'editor']
        }
      },
      {
        path: 'stats/daily',
        component: () => import(/* webpackChunkName: "daily-stats" */ '@/views/exchanges/daily-stats.vue'),
        meta: {
          title: 'Daily Exchange Stats',
          icon: 'chart',
          roles: ['admin', 'user', 'editor']
        }
      },
      {
        path: 'waiting',
        name: 'waiting',
        component: () => import(/* webpackChunkName: "waiting-exchanges" */ '@/views/exchanges/waiting.vue'),
        meta: {
          title: 'Waiting Exchanges',
          icon: 'education',
          roles: ['admin', 'user', 'editor']
        }
      },
      {
        path: 'stats/coins',
        component: () => import(/* webpackChunkName: "coins-stats" */ '@/views/exchanges/coins-stats.vue'),
        meta: {
          title: 'Coins Stats',
          icon: 'table',
          roles: ['admin', 'user', 'editor']
        }
      },
      {
        path: 'stats/pairs',
        name: 'pairs',
        component: () => import(/* webpackCunkName: "pairs-stats" */ '@/views/exchanges/pairs-stats.vue'),
        meta: {
          title: 'Pairs Stats',
          icon: 'table',
          roles: ['admin', 'user', 'editor']
        }
      }
    ]
  },
  {
    path: '/staking',
    component: Layout,
    meta: {
      title: 'Staking',
      icon: 'education',
      breadcrumb: false
    },
    children: [
      {
        path: '',
        component: () => import(/* webpackChunkName: "staking" */ '@/views/staking/index.vue'),
        meta: {
          title: 'Staking',
          icon: 'table',
          roles: ['admin', 'user', 'editor']
        }
      },
      {
        path: '/stats',
        component: () => import(/* webpackChunkName: "staking-stats" */ '@/views/staking/stats.vue'),
        meta: {
          title: 'Staking Stats',
          icon: 'table',
          roles: ['admin', 'user', 'editor']
        }
      }
    ]
  },
  {
    path: '/users',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import(/* webpackChunkName: "users" */ '@/views/users/index.vue'),
        meta: {
          title: 'Users',
          icon: 'user',
          roles: ['admin', 'user', 'editor']
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
        component: () => import(/* webpackChunkName: "errors" */ '@/views/errors/index.vue'),
        meta: {
          title: 'Errors',
          icon: 'bug',
          roles: ['admin', 'user', 'editor']
        }
      }
    ]
  }
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
