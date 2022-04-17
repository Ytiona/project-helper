import { createRouter, createWebHashHistory} from "vue-router";

const routes = [
  {
    path: '/',
    component: () => import('@/views/builder/index.vue'),
    meta: {
      title: '项目构建'
    }
  },
  {
    path: '/pic-handle',
    component: () => import('@/views/pic-handle/index.vue'),
    meta: {
      title: '图片批量处理'
    }
  },
  {
    path: '/psd-analysis',
    component: () => import('@/views/psd-analysis/index.vue'),
    meta: {
      title: 'PSD解析'
    }
  },
  {
    path: '/temp',
    component: () => import('@/views/temp/index.vue'),
    meta: {
      title: 'temp'
    }
  }
]

export default createRouter({
  history: createWebHashHistory(),
  routes: routes
})