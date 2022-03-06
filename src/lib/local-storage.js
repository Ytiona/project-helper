export default {
  get(key) {
    const str = localStorage.getItem(key);
    if(str) {
      return JSON.parse(str);
    }
    return undefined;
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove(key) {
    localStorage.remove(key);
  },
  clear() {
    localStorage.clear();
  }
}
