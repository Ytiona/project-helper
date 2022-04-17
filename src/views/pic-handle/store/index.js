import { defineStore } from 'pinia';
import { defaultConfig } from '@/views/pic-handle/constants';

const usePicHandleStore = defineStore({
  id: 'pic-handle',
  state() {
    return {
      replaceSource: false,
      config: {...defaultConfig}
    }
  },
  actions: {
    setConfig(data) {
      if(typeof(data) !== 'object') {
        throw '数据非对象';
      }
      this.config = data;
    }
  }
})

export default usePicHandleStore;