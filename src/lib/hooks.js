import { ref, reactive, watch } from 'vue';
import storage from './local-storage';

export function useLocalStorage(key, value) {
  const isObj = typeof(value) === 'object';
  
  const _reactive = isObj ? reactive : ref;
  const _value = storage.get(key);

  let result;

  if(_value !== undefined) {
    result = _reactive(_value);
  } else {
    result = _reactive(value);
  }

  watch(result, () => {
    storage.set(key, isObj ? result : result.value);
  }, {
    deep: true,
    immediate: true
  })

  return result;
}
