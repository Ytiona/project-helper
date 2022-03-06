<template>
  <transition name="slide-fade">
    <div class="message-wrap" v-show="visible">
      <span class="icon">
        <i :class="`iconfont icon-${type}`"></i>
      </span>
      <span class="content">{{ content }}</span>
      <span v-if="closable" @click="onClose" class="close">
        <i class="iconfont icon-close"></i>
      </span>
    </div>
  </transition>
</template>

<script setup>
import { onMounted, ref } from 'vue';
const props = defineProps({
  type: {
    type: String,
    default: 'info',
    validator(value) {
      return ['info', 'success', 'error', 'warning'].includes(value);
    }
  },
  content: {
    type: String
  },
  duration: {
    type: Number,
    default: 1500
  },
  closable: {
    type: Boolean,
    default: false
  },
  remove: {
    type: Function,
    required: true
  }
})

const visible = ref(false);


onMounted(() => {
  onOpen();
})

function onOpen() {
  visible.value = true;
  if(props.duration !== 0) {
    setTimeout(() => {
      onClose();
    }, props.duration)
  }
}

function onClose() {
  visible.value = false;
  setTimeout(() => {
    props.remove();
  }, 200)
}

</script>

<style lang="less">
.message {
  position: fixed;
  top: 36px;
  z-index: 2000;
  left: 50%;
  transform: translateX(-50%);
  transition: top .4s ease;
}
.message-wrap {
  line-height: 1;
  display: flex;
  align-items: center;
  padding: 10px 20px;
  border: 1px solid var(--primary-color);
  border-radius: 6px;
  background: var(--stress-bg);
  .icon {
    margin-right: 4px;
    color: var(--primary-color);
  }
  .content {
    font-size: 14px;
    color: #fff;
  }
  .close {
    margin-left: 20px;
    color: var(--primary-color);
    cursor: pointer;
    &:hover {
      color: #fff;
    }
  }
}

.slide-fade-enter-active {
  transition: all 0.2s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
