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

const app = createApp(App);

app.use(router);

app.mount('#app');

app.use(LyUi);
