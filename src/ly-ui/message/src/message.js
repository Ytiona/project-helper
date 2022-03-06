import createInstance from './instance.js';

function renderMessage(type, config) {
  const _config = typeof config === 'string' ? {
    type,
    content: config
  } : {
    type, 
    content: config.content,
    duration: config.duration,
    closable: config.closable
  }
  return createInstance(_config);
}

export default {
  info(config) {
    renderMessage('info', config);
  },
  success(config) {
    renderMessage('success', config);
  },
  warning(config) {
    renderMessage('warning', config);
  },
  error(config) {
    renderMessage('error', config);
  }
}
