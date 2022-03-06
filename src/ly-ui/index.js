/*
 * @Author: LiYu
 * @Date: 2022-03-06 22:26:35
 * @LastEditors: LiYu
 * @LastEditTime: 2022-03-06 22:44:44
 * @Description: LyUi
 */
import input from "./input";
import button from "./button";
import checkbox from './checkbox';
import modal from './modal';
import message from './message';

export const Input = input;
export const Button = button;
export const Checkbox = checkbox;
export const Modal = modal;
export const Message = message;


export default {
  install(app) {
    app.component('Input', Input);
    app.component('Button', Button);
    app.component('Checkbox', Checkbox);
    app.component('Modal', Modal);

    app.config.globalProperties.$Message = Message;
  }
}
