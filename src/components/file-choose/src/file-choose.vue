<template>
  <div class="container">
    <div class="top">
      <div class="left">
        <Button @click="chooseFiles()" icon="add">添加文件</Button>
        <Button @click="clear()" icon="clear-empty" icon-in="right">清空列表</Button>
      </div>
      <slot name="top-right"></slot>
    </div>  
    <div class="block-wrap">
      <template v-if="fileList.length">
        <slot name="file-list" :fileList="fileList" :chooseFiles="chooseFiles" :removeFile="index => removeFile({ index })"></slot>
      </template>
      <div class="empty" v-else @click="chooseFiles()">
        <i class="iconfont icon-upload"/>
        <div class="tips">{{ emptyTips }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch } from 'vue';
import useFileChoose from '@/core/file-choose';

const props = defineProps({
  filters: {
    type: Array
  },
  emptyTips: {
    type: String,
    default: '点击导入文件'
  }
})

const emit = defineEmits(['on-files-change']);

const {
  fileList,
  chooseFiles,
  removeFile,
  clear,
} = useFileChoose({
  filters: props.filters
})


watch(fileList, () => {
  emit('on-files-change', fileList.value);
})

defineExpose({
  fileList,
  chooseFiles,
  removeFile,
  clear,
})

</script>

<style lang="less" scoped>
.container {
  display: flex;
  flex-direction: column;
  min-height: 200px;
}
.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  .left {
    display: flex;
    .ly-input {
      flex: 1;
    }
    .ly-btn {
      margin-right: 10px;
    }
  }
}
.block-wrap {
  flex: 1;
  overflow: auto;
}
.empty {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100%;
  padding: 20px;
  box-sizing: border-box;
  border: 2px dashed currentColor;
  border-radius: 10px;
  color: var(--stress-bg);
  cursor: pointer;
  .iconfont {
    font-size: 70px;
  }
  .tips {
    font-weight: bold;
    font-size: 20px;
  }
  &:hover {
    color: var(--primary-color);
  }
}
</style>
