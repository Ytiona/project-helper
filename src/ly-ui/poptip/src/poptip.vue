<!--
 * @Author: LiYu
 * @Date: 2022-03-21 22:59:23
 * @LastEditors: LiYu
 * @LastEditTime: 2022-03-22 22:36:57
 * @Description: 
-->
<template>
  <div class="poptip">
    <div class="trigger-container" @click="triggerShow">
      <slot></slot>
    </div>
    <transition name="fade">
      <div class="content-container" :style="contentStyle" v-show="visible">
        <div class="arrow"></div>
        <div class="inner">
          <slot name="content"></slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';
// const props = defineProps({
//   placement: {
//     type: String,
//     validate: value => ['top', 'top-start', 'top-end', ''].includes()
//   }
// })

const visible = ref(false);
const contentStyle = ref({});


function triggerShow() {
  if(visible.value) {
    return visible.value = false;
  }
  const triggerContainer = document.querySelector('.trigger-container');
  const rect = triggerContainer.getBoundingClientRect();
  const { width, height } = rect;
  contentStyle.value = {
    top: 0,
    left: `${width}px`
  }
  visible.value = true;
  console.log(rect);
}

</script>

<style lang="less" scoped>
.poptip {
  position: relative;
}
.trigger-container {
  display: inline-block;
}
.content-container {
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  color: #fff;
  z-index: 1000;
  .arrow {
    width: 0;
    height: 0;
    border: 7px solid transparent;
    border-right-color: var(--stress-bg);;
    transform: translateY(10px);
  }
  .inner {
    padding: 10px;
    border-radius: 4px;
    border: 2px solid var(--stress-bg);
    background: var(--block-bg);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .25s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

</style>
