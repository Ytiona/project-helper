import { defineStore } from 'pinia';
import { DEFAULT_OUTPUT } from '../constants';

const useBuilderStore = defineStore({
  id: 'builder',
  state() {
    return {
      openTinyCompress: true,
      outputPath: DEFAULT_OUTPUT,
      currentBuildConfigType: ''
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


export default useBuilderStore;