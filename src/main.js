/*
 * @Author: LiYu
 * @Date: 2021-09-12 17:52:52
 * @LastEditors: LiYu
 * @LastEditTime: 2022-03-17 21:13:08
 * @Description: 
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router';
import 'normalize.css';
import '@/assets/style/common.css';
import '@/assets/style/base.css';
import LyUi from '@/ly-ui';
import '@/lib/utils';
import '@/lib/lodash';
import { createPinia } from 'pinia'
import lastingPlugin from '@/lib/pinia-lasting-plugin';

const app = createApp(App);

const store = createPinia();
store.use(lastingPlugin({
  includes: [
    'builder',
    'pic-handle',
  ]
}))

app.use(router);
app.use(store);

app.mount('#app');

app.use(LyUi);
