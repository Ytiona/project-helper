<template>
  <div class="container">
    <div class="top">
      <div class="left">
        <Button @click="chooseFile()" icon="add">添加文件</Button>
        <Button @click="clearAll()" icon="clear-empty" icon-in="right">清空列表</Button>
      </div>
      <slot name="top-right"></slot>
    </div>  
    <div class="block-wrap">
      <template v-if="fileList.length">
        <slot name="file-list" :fileList="fileList" :chooseFile="chooseFile" :removeFile="removeFile"></slot>
      </template>
      <div class="empty" v-else @click="chooseFile()">
        <i class="iconfont icon-upload"/>
        <div class="tips">{{ emptyTips }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import FileChoose from '@/core/file-choose';

const props = defineProps({
  filters: {
    type: Array
  },
  emptyTips: {
    type: String,
    default: '拖入文件夹/文件'
  }
})

const emit = defineEmits(['on-files-change']);

const fileChoose = new FileChoose({
  filters: props.filters
})

const fileList = ref([]);

watch(fileList, () => {
  emit('on-files-change', fileList.value);
})

async function chooseFile() {
  try {
    fileList.value = await fileChoose.chooseFiles();
  } catch(err) {
    // console.log(err);  
  }
}

function removeFile(index) {
  fileList.value = fileChoose.removeFile({ index });
}

function clearAll() {
  fileList.value = fileChoose.clear();
}

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
