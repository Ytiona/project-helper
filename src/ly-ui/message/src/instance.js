/*
 * @Author: LiYu
 * @Date: 2022-02-28 22:21:25
 * @LastEditors: LiYu
 * @LastEditTime: 2022-03-20 22:24:17
 * @Description: 
 */
import { createApp } from 'vue';
import Message from './message.vue';

const OFFSET_Y = 50;

function createInstance(config = {}) {
  // 1.创建节点，设置class、top值
  const messageNode = document.createElement('div');
  messageNode.setAttribute('class', 'message');
  const HEIGHT = 50;
  const messageList = document.querySelectorAll('.message');
  messageNode.style.top = `${messageList.length * HEIGHT + OFFSET_Y}px`;

  // 2.创建vue实例，挂载节点
  const app = createApp(Message, {
    ...config,
    remove: handleRemove
  })
  app.mount(messageNode);
  document.body.appendChild(messageNode);
  
  // 处理移除
  function handleRemove() {
    document.body.removeChild(messageNode);
    app.unmount();
    resetMsgTop();
  }

  // 重设所有message节点的top
  function resetMsgTop() {
    const messageList = document.querySelectorAll('.message');
    messageList.forEach((messageItem, index) => {
      messageItem.style.top = `${index * HEIGHT + OFFSET_Y}px`;
    })
  }
  
  return app;
}

export default createInstance;
