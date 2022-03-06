import Modal from './src/modal.vue';
import ModalFn from './src/modal.js';

Object.keys(ModalFn).forEach(fnName => {
  Modal[fnName] = ModalFn[fnName];
})

export default Modal;
