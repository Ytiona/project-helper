/*
 * @Author: LiYu
 * @Date: 2022-03-06 22:26:35
 * @LastEditors: LiYu
 * @LastEditTime: 2022-03-21 22:56:41
 * @Description: LyUi
 */
import input from "./input";
import button from "./button";
import checkbox from './checkbox';
import modal from './modal';
import message from './message';
import notice from './notice';

export const Input = input;
export const Button = button;
export const Checkbox = checkbox;
export const Modal = modal;
export const Message = message;
export const Notice = notice;


export default {
  install(app) {
    app.component('Input', input);
    app.component('Button', button);
    app.component('Checkbox', Checkbox);
    app.component('Modal', Modal);

    app.config.globalProperties.$Message = Message;
    app.config.globalProperties.$Notice = Notice;
  }
}
