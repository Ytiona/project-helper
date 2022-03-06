import { createApp } from 'vue';
import Modal from './modal.vue';

function createInstance(config) {
  const app = createApp(Modal, {
    ...config,
    show: false,
    width: 400,
    maskClosable: false,
    closable: false,
    instance: true,
    remove: handleRemove
  })

  const modalNode = document.createElement('div');
  Object.assign(modalNode.style, {
    position: 'fixed',
    zIndex: 1000
  })
  app.mount(modalNode);

  document.body.appendChild(modalNode);

  function handleRemove() {
    document.body.removeChild(modalNode);
    app.unmount();
  }

  return app;
}

export default createInstance;
