import { toRaw } from 'vue';
import storage from '@/lib/local-storage';

const DEFAULT_KEY = '__pinia__';

const lastingPlugin = ({
  key,
  includes
} = {}) => {
  return (context) => {
    const { store } = context;
    if(!includes.includes(store.$id)) {
      return;
    }
    const storageKey = `${key || DEFAULT_KEY}${store.$id}`;
    const initData = storage.get(storageKey);
    store.$subscribe(() => {
      storage.set(storageKey, toRaw(store.$state));
    })
    return {
      ...initData
    }
  }
}

export default lastingPlugin;