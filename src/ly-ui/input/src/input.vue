<!--
 * @Author: LiYu
 * @Date: 2021-09-12 22:27:11
 * @LastEditors: LiYu
 * @LastEditTime: 2022-03-13 21:56:56
 * @Description: 
-->
<template>
  <div 
    class="ly-input"
    :class="[
      type ? `ly-input-${type}` : '',
      { 'has-suffix': suffixTxt }
    ]"
  >
    <input type="text" v-bind="$attrs" class="input" :value="value" @input="onInput"/>
    <Button v-if="suffixTxt" class="suffix">{{ props.suffixTxt }}</Button>
  </div>
</template>

<script setup>
import Button from "../../button";
const props = defineProps({
  suffixTxt: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    dedfault: ''
  },
  value: [String, Number]
});

const emit = defineEmits(['update:value']);

function onInput(e) {
  emit('update:value', e.target.value);
}
</script>

<style lang="less" scoped>
.ly-input {
  display: flex;
  overflow: hidden;
  &.has-suffix {
    .input {
      border-right: none;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
    .suffix {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }
  &.ly-input-compact {
    .input {
      border: none;
      padding: 2px 8px;
      border-radius: 4px;
      color: var(--primary-color);
      background: var(--stress-bg);
    }
  }
}
.input {
  width: 100%;
  flex: 1;
  padding: 6px 10px;
  border: 1px solid var(--primary-color);
  border-radius: 8px;
  outline: none;
  font-size: 13px;
  color: var(--l-txt);
  background: var(--block-bg);
  &::-webkit-input-placeholder {
    color: var(--primary-color);
    opacity: 0.4;
  }
}
</style>
