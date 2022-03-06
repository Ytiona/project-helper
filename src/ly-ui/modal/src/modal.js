import createInstance from "./instance";

function renderModal(titleIcon, config) {
  const {
    title,
    content,
    cancelText,
    confirmText,
    onOk,
    onCancel,
    showCancel = false
  } = config;
  const app = createInstance({
    titleIcon,
    title,
    content,
    cancelText,
    confirmText,
    onOk,
    onCancel,
    showCancel
  });
  return app;
}

export default {
  info(config) {
    renderModal('info', config);
  },
  success(config) {
    renderModal('success', config);
  },
  warning(config) {
    renderModal('warning', config);
  },
  error(config) {
    renderModal('error', config);
  },
  confirm(config) {
    renderModal('help', {
      ...config,
      showCancel: true
    });
  }
}
