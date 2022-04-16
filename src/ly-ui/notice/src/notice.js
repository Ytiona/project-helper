/*
 * @Author: LiYu
 * @Date: 2022-03-20 22:19:17
 * @LastEditors: LiYu
 * @LastEditTime: 2022-03-21 22:18:26
 * @Description: 
 */
import createInstance from './instance.js';

function renderNotice(type, config) {
  const _config = typeof config === 'string' ? {
    type,
    title: config
  } : {
    type, 
    title: config.title,
    desc: config.desc,
    duration: config.duration,
    closable: config.closable
  }
  return createInstance(_config);
}

export default {
  info(config) {
    renderNotice('info', config);
  },
  success(config) {
    renderNotice('success', config);
  },
  warning(config) {
    renderNotice('warning', config);
  },
  error(config) {
    renderNotice('error', config);
  }
}
