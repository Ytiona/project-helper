<template>
  <div class="code-editor">
    <div class="editor-container" v-show="!fullScreen">
      <div class="toggle-full-screen" @click="onFullScreen()">
        <i class="iconfont icon-full-screen"></i>
      </div>
      <textarea
        :rows="rows"
        :placeholder="placeholder"
        :value="value"
        @input="onInput"
      ></textarea>
    </div>
    <teleport to='body'>
      <div class="editor-container full-screen-editor-container" v-show="fullScreen">
        <div class="toggle-full-screen" @click="fullScreen = false">
          <i class="iconfont icon-exit-full-screen"></i>
        </div>
        <textarea
          :rows="rows"
          :placeholder="placeholder"
          :value="value"
          @input="onInput"
        ></textarea>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { onUnmounted, ref } from 'vue';
import { Message } from '@/ly-ui';
defineProps({
  value: {
    type: String
  },
  rows: {
    type: [String, Number],
    default: 12
  },
  placeholder: {
    type: String,
    default: '请输入'
  }
})

const emit = defineEmits(['update:value']);

function onInput(event) {
  emit('update:value', event.target.value);
}

const fullScreen = ref(false);
function onFullScreen() {
  Message.info('按下Esc退出全屏');
  fullScreen.value = true;
}

document.addEventListener('keydown', handleEsc)
function handleEsc(event) {
  if(event.keyCode === 27) {
    fullScreen.value = false;
  }
}
onUnmounted(() => {
  document.removeEventListener('keydown', handleEsc);
})

</script>

<style lang="less" scoped>
.editor-container {
  position: relative;
  border-radius: 4px;
  background: var(--dark-stress-bg);
  textarea {
    width: 100%;
    padding: 10px;
    border-radius: 4px;
    box-sizing: border-box;
    border: none;
    outline: none;
    font-size: 13px;
    line-height: 1.5;
    color: var(--primary-color);
    height: 100%;
    resize: none;
    background: none;
    &::-webkit-input-placeholder {
      color: var(--primary-color);
      opacity: 0.4;
    }
  }
}
.full-screen-editor-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1100;
  textarea {
    font-size: 14px;
    line-height: 1.8;
  }
}
.toggle-full-screen {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 20px;
  color: var(--primary-color);
  cursor: pointer;
  &:hover {
    background: var(--stress-bg);
  }
}
</style>
