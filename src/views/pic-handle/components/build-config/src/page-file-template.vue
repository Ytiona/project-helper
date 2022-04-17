<template>
  <div class="explain">
    <p class="title">模板关键字说明：</p>
    <ul class="list">
      <li>#name：页面名称</li>
      <li>#html：构建后的页面结构(只可用于模板内容)</li>
      <li>#css：构建后的页面样式(只可用于模板内容)</li>
    </ul>
  </div>
  <div class="file-name">
    <span class="label">页面名称：</span>
    <span class="input-wrap">
      <input type="text" placeholder="请输入文件名（英文）" :value="fileName" @input="onUpdateFileName"/>
    </span>
  </div>
  <CodeEditor :value="template" @update:value="onUpdateTemplate"/>
</template>

<script setup>
import CodeEditor from '@/components/code-editor';
const props = defineProps({
  template: {
    type: String
  },
  fileName: {
    type: String
  }
})

const emit = defineEmits(['update:fileName', 'update:template']);

// todo 表单验证
const rules = {
  fileName: { required: true, message: '请输入文件名' }
}

function onUpdateFileName(event) {
  emit('update:fileName', event.target.value);
}

function onUpdateTemplate(value) {
  emit('update:template', value);
}

function getOptions(callback) {
  return callback({
    template: props.template,
    fileName: props.fileName
  })
}

defineExpose({
  getOptions
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
.file-name {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  .label {
    font-size: 14px;
  }
  .input-wrap {
    flex: 1;
    padding: 4px 0;
    border-bottom: 1px solid var(--dark-border);
    input {
      width: 100%;
      border: none;
      color: var(--primary-color);
      font-size: 16px;
      background: none;
      outline: none;
      &::-webkit-input-placeholder {
        font-size: 14px;
        color: var(--primary-color);
        opacity: 0.4;
      }
    }
  }
}
</style>