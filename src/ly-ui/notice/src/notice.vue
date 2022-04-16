<template>
  <transition name="slide-fade">
    <div class="notice-wrap" v-show="visible">
      <span :class="['icon', { large: desc }]">
        <i :class="`iconfont icon-${type}`"></i>
      </span>
      <span class="content">
        <div class="title">{{ title }}</div>
        <div class="desc" v-if="desc">{{ desc }}</div>
      </span>
      <span @click="onClose" class="close">
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
  title: {
    type: String
  },
  desc: {
    type: String
  },
  duration: {
    type: Number,
    default: 1500
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
.notices-container {
  position: fixed;
  top: 50px;
  right: 20px;
  z-index: 2000;
  overflow: hidden;
}
.notice {
  transition: top .4s ease;
  &+.notice {
    margin-top: 10px;
  }
}
</style>

<style lang="less" scoped>
.notice-wrap {
  position: relative;
  line-height: 1;
  display: flex;
  align-items: flex-start;
  width: 300px;
  padding: 12px 20px;
  box-sizing: border-box;
  border: 1px solid var(--primary-color);
  border-radius: 6px;
  background: var(--stress-bg);
  .icon {
    margin-right: 10px;
    color: var(--primary-color);
    .iconfont {
      font-size: 20px;
    }
    &.large {
      .iconfont {
        font-size: 24px;
      }
    }
  }
  .content {
    flex: 1
  }
  .title {
    line-height: 20px;
    font-size: 14px;
    color: #fff;
  }
  .desc {
    margin-top: 6px;
    line-height: 1.5;
    font-size: 12px;
    color: var(--primary-color);
  }
  .close {
    position: absolute;
    right: 10px;
    top: 14px;
    margin-left: 20px;
    color: var(--primary-color);
    cursor: pointer;
    .iconfont {
      font-size: 14px;
    }
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
  transform: translateX(80px);
  opacity: 0;
}
</style>
