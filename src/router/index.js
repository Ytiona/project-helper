import { createRouter, createWebHashHistory} from "vue-router";

import ProjectBuilder from '@/views/builder/index.vue';
import TinyCompress from '@/views/pic-handle/index.vue';

const routes = [
  {
    path: '/',
    component: ProjectBuilder,
    meta: {
      title: '项目构建'
    }
  },
  {
    path: '/pic-handle',
    component: TinyCompress,
    meta: {
      title: 'Tiny压缩'
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