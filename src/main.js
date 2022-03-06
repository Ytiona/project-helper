import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router';
import 'normalize.css';
import '@/assets/style/common.css';
import '@/assets/style/base.css';
import LyUi from '@/ly-ui';
import '@/lib/uitls';
import '@/lib/lodash';

const app = createApp(App);

app.use(router);

app.mount('#app');

app.use(LyUi);
