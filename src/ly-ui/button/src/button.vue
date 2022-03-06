<template>
  <button class="ly-btn">
    <i v-if="icon && iconIn === 'left'" :class="`iconfont icon-${icon} left-icon`"></i>
    <slot></slot>
    <i v-if="icon && iconIn === 'right'" :class="`iconfont icon-${icon} right-icon`"></i>
  </button>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
    default: ''
  },
  iconIn: {
    type: String,
    default: 'left'
  }
})
</script>

<style lang="less" scoped>
.ly-btn {
  display: flex;
  align-items: center;
  border: 1px solid var(--primary-color);
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  color: var(--l-txt);
  background: var(--stress-bg);
  cursor: pointer;
  &:hover {
    background: var(--dark-stress-bg);
  }
  .left-icon {
    margin-right: 5px;
  }
  .right-icon {
    margin-left: 5px;
  }
  .iconfont {
    color: var(--primary-color);
  }
}
</style>
