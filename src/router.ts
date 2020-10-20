import Vue from 'vue'
import Router, { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

Vue.use(Router)

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
    redirect: '/dashboard',
    meta: {
      breadcrumb: false,
      hidden: true
    }
  },
  {
    path: '/dashboard',
    component: Layout,
    children: [
      {
        path: '',
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
      icon: 'exchange'
    },
    children: [
      {
        path: '',
        component: () => import(/* webpackChunkName: "exchanges" */ '@/views/exchanges/index.vue'),
        meta: {
          title: 'Exchange',
          icon: 'list',
          roles: ['user', 'admin'],
          breadcrumb: false
        }
      },
      {
        path: 'stats/daily',
        component: () => import(/* webpackChunkName: "daily-stats" */ '@/views/exchanges/daily-stats.vue'),
        meta: {
          title: 'Daily Exchange Stats',
          icon: 'daily',
          roles: ['admin', 'user']
        }
      },
      {
        path: 'waiting',
        name: 'waiting',
        component: () => import(/* webpackChunkName: "waiting-exchanges" */ '@/views/exchanges/waiting.vue'),
        meta: {
          title: 'Waiting Exchanges',
          icon: 'clock',
          roles: ['admin', 'user']
        }
      },
      {
        path: 'stats/coins',
        component: () => import(/* webpackChunkName: "coins-stats" */ '@/views/exchanges/coins-stats.vue'),
        meta: {
          title: 'Coins Stats',
          icon: 'bitcoin',
          roles: ['admin', 'user']
        }
      },
      {
        path: 'stats/pairs',
        name: 'pairs',
        component: () => import(/* webpackCunkName: "pairs-stats" */ '@/views/exchanges/pairs-stats.vue'),
        meta: {
          title: 'Pairs Stats',
          icon: 'pair',
          roles: ['admin', 'user']
        }
      }
    ]
  },
  {
    path: '/staking',
    component: Layout,
    meta: {
      title: 'Staking',
      icon: 'education'
    },
    children: [
      {
        path: '',
        component: () => import(/* webpackChunkName: "staking" */ '@/views/staking/index.vue'),
        meta: {
          title: 'Staking',
          icon: 'table',
          roles: ['admin', 'user'],
          breadcrumb: false
        }
      },
      {
        path: 'stats',
        component: () => import(/* webpackChunkName: "staking-stats" */ '@/views/staking/stats.vue'),
        meta: {
          title: 'Staking Stats',
          icon: 'chart',
          roles: ['admin', 'user']
        }
      }
    ]
  },
  {
    path: '/buy',
    component: Layout,
    meta: {
      title: 'Buy',
      icon: 'cryptocurrency',
      roles: ['admin', 'user']
    },
    children: [
      {
        path: '',
        component: () => import(/* webpackChunkName: "buy" */ '@/views/buy-crypto/index.vue'),
        meta: {
          title: 'Buy',
          icon: 'list',
          roles: ['admin', 'user'],
          breadcrumb: false
        }
      },
      {
        path: 'stats/coins',
        component: () => import(/* webpackChunkName: "buy-stats" */ '@/views/buy-crypto/coins-stats.vue'),
        meta: {
          title: 'Coins Stats',
          icon: 'bitcoin',
          roles: ['admin', 'user']
        }
      },
      {
        path: 'stats/fiat',
        component: () => import(/* webpackChunkName: "buy-fiat-stats" */ '@/views/buy-crypto/fiat-stats.vue'),
        meta: {
          title: 'Fiat Stats',
          icon: 'dollar',
          roles: ['admin', 'user']
        }
      },
      {
        path: 'stats/pairs',
        name: 'buy-pairs',
        component: () => import(/* webpackChunkName: "buy-pairs-stats" */ '@/views/buy-crypto/pairs-stats.vue'),
        meta: {
          title: 'Pairs Stats',
          icon: 'pair',
          roles: ['admin', 'user']
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
          roles: ['admin', 'user']
        }
      }
    ]
  },
  {
    path: '/audience',
    component: Layout,
    meta: {
      roles: ['admin', 'user']
    },
    children: [
      {
        path: '',
        component: () => import(/* webpackChunkName: "audience" */'@/views/audience/index.vue'),
        meta: {
          title: 'Audience',
          icon: 'audience',
          roles: ['admin', 'user']
        }
      }
    ]
  },
  {
    path: '/errors',
    component: Layout,
    meta: {
      roles: ['admin', 'user']
    },
    children: [
      {
        path: '',
        component: () => import(/* webpackChunkName: "errors" */ '@/views/errors/index.vue'),
        meta: {
          title: 'Errors',
          icon: 'bug',
          roles: ['admin', 'user']
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
