/*
 * @Author: LiYu
 * @Date: 2022-03-20 22:19:09
 * @LastEditors: LiYu
 * @LastEditTime: 2022-03-21 22:47:28
 * @Description: 
 */
import { createApp } from 'vue';
import Notice from './notice.vue';

const OFFSET_Y = 50;

const CONTAINER_CLASS = 'notices-container';

function createInstance(config = {}) {

  let container = document.querySelector(`.${CONTAINER_CLASS}`);
  if(!container) {
    container = document.createElement('div');
    container.setAttribute('class', CONTAINER_CLASS);
    document.body.appendChild(container);
  }

  // 1.创建节点，设置class、top值
  const noticeNode = document.createElement('div');
  noticeNode.setAttribute('class', 'notice');
  const HEIGHT = 50;
  const noticeList = document.querySelectorAll('.notice');
  const heightSum = noticeList.length ? (noticeList[noticeList.length - 1].offsetHeight + noticeList[noticeList.length - 1].clientHeight) : 0;
  noticeNode.style.top = `${heightSum + OFFSET_Y}px`;

  // 2.创建vue实例，挂载节点
  const app = createApp(Notice, {
    ...config,
    remove: handleRemove
  })
  app.mount(noticeNode);
  container.appendChild(noticeNode);
  
  // 处理移除
  function handleRemove() {
    container.removeChild(noticeNode);
    app.unmount();
    resetMsgTop();
  }

  // 重设所有notice节点的top
  function resetMsgTop() {
    const noticeList = document.querySelectorAll('.notice');
    noticeList.forEach((noticeItem, index) => {
      noticeItem.style.top = `${index * HEIGHT + OFFSET_Y}px`;
    })
  }
  
  return app;
}

export default createInstance;
