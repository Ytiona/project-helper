<template>
  <div class="modal">
    <transition name="bounce">
      <div class="modal-container" :style="{ width: props.width + 'px' }" v-show="_show">
        <div class="head">
          <div class="title">
            <i v-if="titleIcon" :class="`iconfont icon-${titleIcon}`"></i>
            <span class="text">{{ props.title }}</span>
          </div>
          <i class="iconfont icon-close" title="关闭" @click="onClose" v-if="closable"></i>
        </div>
        <div class="content-container">
          <slot>
            <div class="content">{{ content }}</div>
          </slot>
        </div>
        <div class="footer" v-if="!footerHide">
          <div class="btn cancel-btn" @click="onCancel" v-if="showCancel">{{ props.cancelText }}</div>
          <div class="btn confirm-btn" @click="onConfirm">{{ props.confirmText }}</div>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div class="modal-mask" @click="onClickMask()" v-show="_show"></div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
const props = defineProps({
  title: String,
  titleIcon: {
    type: String,
    default: ''
  },
  content: {
    type: String
  },
  show: {
    type: Boolean,
    required: true,
    default: false,
  },
  footerHide: {
    type: Boolean,
    default: false,
  },
  cancelText: {
    type: String,
    default: "取消",
  },
  confirmText: {
    type: String,
    default: "确认",
  },
  width: {
    type: Number,
    default: 500
  },
  onOk: {
    type: Function
  },
  onCancel: {
    type: Function
  },
  maskClosable: {
    type: Boolean,
    default: true
  },
  closable: {
    type: Boolean,
    default: true
  },
  showCancel: {
    type: Boolean,
    default: true
  },
  remove: {
    type: Function
  },
  autoShow: {
    type: Boolean,
    default: false
  },
  instance: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["on-confirm", "on-cancel", "on-close", "update:show"]);

/**
 * 为实现实例化调用modal能有动画效果
 * 写了一个简易的双向绑定
 * todo：待优化实现方式
 */
const _show = ref(props.show);
watch(() => props.show, () => {
  _show.value = props.show;
})
watch(_show, () => {
  emit('update:show', _show.value);
})

// 如果是实例化调用（js调用）方式，则再挂载后立即显示以触发transition动画
onMounted(() => {
  if(props.instance) {
    _show.value = true;
  }
})

function onConfirm() {
  emit("on-confirm");
  if(props.instance) {
    props.onOk && props.onOk();
    handleRemove();
  }
}

function onCancel() {
  emit("on-cancel");
  emit('update:show', false);
  if(props.instance) {
    props.onCancel && props.onCancel();
    handleRemove();
  }
}

function onClose() {
  emit("on-close");
  emit('update:show', false);
}

function handleRemove() {
  _show.value = false;
  if(props.remove) {
    setTimeout(() => {
      props.remove();
    }, 200)
  }
}

function onClickMask() {
  if(props.maskClosable) {
    onClose();
  }
}
</script>

<style lang="less" scoped>
.modal-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  z-index: 1000;
  padding: 14px 20px;
  border-radius: 6px;
  background: var(--stress-bg);
  animation: bounceIn 0.25s;
  .head {
    display: flex;
    .title {
      flex: 1;
      display: flex;
      align-items: center;
      .iconfont {
        line-height: 1;
        font-size: 24px;
        margin-right: 6px;
        color: var(--primary-color);
      }
      .text {
        font-size: 16px;
        color: var(--l-txt);
      }
    }
    .icon-close {
      font-size: 20px;
      color: var(--primary-color);
      cursor: pointer;
      &:hover {
        color: var(--l-txt);
      }
    }
  }
  .content-container {
    padding: 14px 0;
    .content {
      margin-bottom: 20px;
      padding: 20px;
      font-size: 14px;
      color: #fff;
    }
  }
  .footer {
    display: flex;
    justify-content: flex-end;
    .btn {
      font-size: 14px;
      padding: 6px 30px;
      border-radius: 6px;
      cursor: pointer;
      user-select: none;
      &.cancel-btn {
        color: var(--primary-color);
        border: 1px solid var(--dark-border);
        &:hover {
          border-color: var(--primary-color);
        }
      }
      &.confirm-btn {
        margin-left: 5px;
        color: #fff;
        background: var(--dark-border);
        &:hover {
          background: var(--primary-color);
        }
      }
    }
  }
}
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  background: rgba(0, 0, 0, 0.8);
}
.bounce-leave-active,
.bounce-enter-active {
  transition: all 0.2s ease-out;
}
.bounce-enter-from,
.bounce-leave-to {
  transform: translate3d(-50%, -50%, 0) scale(0.9);
  opacity: 0;
}

.fade-leave-active,
.fade-enter-active {
  transition: all 0.2s ease-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
