<template>
  <div class="psd-card">
    <i class="iconfont icon-psd file-icon" />
    <i class="iconfont icon-close" @click="remove()" />
    <div class="right">
      <div class="title">
        <span class="file-name">{{ data.psd.fileName }}：</span>
        <Input type="compact" v-model:value="pageName" placeholder="页面名称" />
      </div>
      <div class="file-info">
        W:{{ data.psd.width }} H:{{ data.psd.height }}/{{
          (data.psd.fileSize / 1024 / 1024).toFixed(2)
        }}Mb/{{ data.psd.layerCount }}个图层
      </div>
      <div class="file-options">
        <div class="file-types">
          <div
            v-for="typeItem in targetTypes"
            :key="typeItem.value"
            :class="['type-item', { active: type === typeItem.value }]"
            @click="type = typeItem.value"
          >
            {{ typeItem.name }}
          </div>
        </div>
        <Checkbox v-model:value="isPopup" class="is-pop">弹窗</Checkbox>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  },
  remove: {
    type: Function
  }
})

const pageName = ref('');
const isPopup = ref(false);
const type = ref('page');

const targetTypes = [
  { name: "页面", value: 'page' },
  { name: "组件", value: 'comp' }
]

</script>

<style lang="less" scoped>
.psd-card {
  position: relative;
  display: flex;
  align-items: center;
  height: 90px;
  padding: 10px;
  box-sizing: border-box;
  border: 1px solid var(--stress-bg);
  border-radius: 10px;
  .file-icon {
    font-size: 50px;
    color: var(--primary-color);
    opacity: 0.5;
  }
  .right {
    flex: 1;
    margin-left: 10px;
    overflow: hidden;
  }
  .title {
    display: flex;
    align-items: center;

    .file-name {
      font-size: 14px;
      color: var(--l-txt);
    }
    .ly-input {
      flex: 1;
      max-width: 100px;
    }
  }
  .file-info {
    margin: 10px 0;
    font-size: 11px;
    color: var(--primary-color);
  }
  .file-options {
    display: flex;
    .file-types {
      display: flex;
      font-size: 11px;
      color: var(--l-txt);
      border-radius: 4px;
      overflow: hidden;
      background: var(--stress-bg);
      .type-item {
        padding: 3px 6px;
        cursor: pointer;
        &.active {
          background: var(--primary-color);
        }
      }
    }
    .is-pop {
      margin-left: 10px;
    }
  }
  .icon-close {
    position: absolute;
    top: -6px;
    right: -6px;
    width: 18px;
    height: 18px;
    display: none;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    border-radius: 50%;
    color: var(--stress-bg);
    background: var(--primary-color);
    cursor: pointer;
  }
  &:hover {
    border-color: var(--primary-color);
    .icon-close {
      display: flex;
    }
  }
}
</style>
