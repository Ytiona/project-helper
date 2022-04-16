<template>
  <div class="psd-card">
    <div class="file-icon">
      <i class="iconfont icon-psd" v-if="!parseLoading"/>
      <div class="ani-rotate" v-else>
        <i class="iconfont icon-load"/>
      </div>
    </div>
    <i class="iconfont icon-close" @click="remove()" />
    <div class="right">
      <!-- <div class="name-inp">
        <span class="label">名称：</span>
        <span class="input-wrap">
          <input type="text" v-model="name" placeholder="页面/组件名称"/>
        </span>
      </div> -->
      <div class="title">
        <span class="file-name">{{ fileName }}：</span>
        <Input type="compact" v-model:value="name" placeholder="页面/组件名称" />
      </div>
      <div class="file-info">
        <span v-if="!parseLoading">
          W:{{ parsedPsd.width }} H:{{ parsedPsd.height }} | {{
            (parsedPsd.fileSize / 1024 / 1024).toFixed(2)
          }}Mb | {{ parsedPsd.layerCount }}个图层
        </span>
        <span class="loading" v-else>正在解析...</span>
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
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import analysisPsd from '@/core/analysis';
import { getFileName } from '@/lib/utils';
const props = defineProps({
  filePath: {
    type: String,
    required: true
  },
  remove: {
    type: Function
  }
})

const parseLoading = ref(true);
const parsedPsd = ref({});
const fileName = ref('');
const name = ref('');
const type = ref('page');

const targetTypes = [
  { name: "页面", value: 'page' },
  { name: "组件", value: 'comp' }
]

handleParse();
watch(() => props.filePath, handleParse);

function handleParse() {
  parseLoading.value = true;
  fileName.value = getFileName(props.filePath);
  name.value = fileName.value;
  analysisPsd(props.filePath).then(res => {
    parsedPsd.value = res;
  }).finally(() => {
    parseLoading.value = false;
  })
}

defineExpose({
  type,
  name,
  fileName,
  parsedPsd
})

</script>

<style lang="less" scoped>
.psd-card {
  position: relative;
  display: flex;
  align-items: center;
  height: 90px;
  padding: 4px 8px;
  padding-right: 18px;
  box-sizing: border-box;
  border: 1px solid var(--stress-bg);
  border-radius: 10px;
  .file-icon {
    width: 50px;
    height: 50px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    .iconfont {
      font-size: 50px;
      color: var(--primary-color);
      opacity: 0.5;
    }
    .icon-load {
      font-size: 36px;
    }
  }
  .right {
    flex: 1;
    margin-left: 10px;
    overflow: hidden;
  }
  .name-inp {
    display: flex;
    align-items: center;
    font-size: 14px;
    margin-bottom: 6px;
    color: var(--l-txt);
    .input-wrap {
      flex: 1;
      font-size: 13px;
      border-bottom: 1px solid var(--stress-bg);
      padding-bottom: 4px;
      input {
        width: 100%;
        border: none;
        outline: none;
        color: var(--primary-color);
        background: none;
      }
    }
  }
  .title {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .file-name {
      font-size: 12px;
      color: var(--l-txt);
    }
    .ly-input {
      flex: 1;
      max-width: 100px;
      font-size: 12px;
    }
  }
  .file-info {
    margin-bottom: 10px;
    font-size: 11px;
    color: var(--primary-color);
  }
  .file-options {
    display: flex;
    .file-types {
      display: flex;
      font-size: 11px;
      color: var(--primary-color);
      border-radius: 4px;
      overflow: hidden;
      background: var(--stress-bg);
      .type-item {
        padding: 3px 6px;
        cursor: pointer;
        &.active {
          color: var(--stress-bg);
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
    z-index: 1000;
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
