<template>
  <div class="ly-checkbox-wrap" @click="toggleValue">
    <div class="prefix">
      <slot name="prefix"></slot>
    </div>
    <div class="ly-checkbox">
      <i class="iconfont icon-ok" v-show="props.value"/>
    </div>
    <div class="suffix">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  value: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:value']);

function toggleValue() {
  emit('update:value', !props.value);
}

</script>

<style lang="less" scoped>
.ly-checkbox-wrap {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  .prefix {
    margin-right: 4px;
  }
  .suffix {
    margin-left: 4px; 
    white-space: nowrap;
  }
  .prefix,.suffix {
    font-size: 12px;
    color: var(--primary-color);
  }
  .ly-checkbox {
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    border: 1px solid var(--primary-color);
    border-radius: 4px;
    
    .iconfont {
      font-size: 12px;
      color: var(--primary-color);
    }
  }
}
</style>
