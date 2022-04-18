<!--
 * @Author: LiYu
 * @Date: 2022-03-02 22:55:59
 * @LastEditors: LiYu
 * @LastEditTime: 2022-03-06 22:35:20
 * @Description: 
-->
<template>
  <div class="explain">
    <p class="title">模板关键字说明：</p>
    <ul class="list">
      <li>{{ commonKeys.name }}：页面名称</li>
      <li>{{ commonKeys.name__pascal }}：页面名称(大驼峰版)</li>
      <li>{{ commonKeys.title }}：页面标题（PSD文件名）</li>

      <li>{{ routerKeys.start }}：替换内容开始位置</li>
      <li>{{ routerKeys.end }}：替换内容结束位置</li>
      <li>{{ routerKeys.pagePath }}：对应配置中的页面路径</li>
    </ul>
  </div>
  <CodeEditor placeholder="请输入路由模板" v-model:value="template"/>
</template>

<script setup>
import CodeEditor from '@/components/code-editor';
import { Message } from '@/ly-ui';
import { commonKeys, routerKeys } from '@/constants/compiler';
const props = defineProps({
  template: {
    type: String
  }
})

const reg = new RegExp(`(?<=${routerKeys.start})[\\d\\D]*(?=${routerKeys.end})`, 'g');

function getTemplate(callback) {
  if(reg.test(props.template)) {
    return callback(props.template);
  }
  const errMsg = `模板必须包含${routerKeys.start}、${routerKeys.end}关键字`;
  Message.error(errMsg);
}

defineExpose({
  getTemplate
})

</script>

<style lang="less" scoped>
.explain {
  .title {
    font-size: 12px;
    margin: 0;
    margin-bottom: 10px;
    color: var(--dark-border);
  }
  .list {
    list-style: none;
    padding-left: 10px;
    margin: 0;
    margin-bottom: 10px;
    font-size: 12px;
    line-height: 2;
    color: var(--primary-color);
  }
}
</style>