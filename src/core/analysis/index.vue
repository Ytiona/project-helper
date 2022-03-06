<template>
  <div class="container">
    <div class="top">
      <div class="left">
        <Button @click="chooseFiles()" icon="add">添加文件</Button>
        <Button @click="clearAll()" icon="clear-empty" icon-in="right">清空列表</Button>
      </div>
      <slot name="top-right"></slot>
    </div>  
    <div class="block-wrap">
      <div class="file-list" v-if="fileList.length">
        <div class="file-item" v-for="(item, index) in fileList">
          <slot name="psd-item" :data="item" :remove="() => removePsd(index, item)"></slot>
        </div>
        <div class="add-btn" @click="chooseFiles()">
          <i class="iconfont icon-add"></i>
        </div>
      </div>
      <div class="empty" v-else @click="chooseFiles()">
        <i class="iconfont icon-upload"/>
        <div class="tips">拖入文件夹/PSD文件</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Psd2Html from '@/lib/analysis';

const remote = require('@electron/remote');

const fileList = ref([])

const uniqueFilePaths = new Set();

function chooseFiles() {
   remote.dialog.showOpenDialog({
     properties: ['openFile', 'multiSelections'],
     filters: [
       { name: 'Photoshop文件', extensions: ['psd'] }
     ]
   }).then(({ canceled, filePaths }) => {
     if(!canceled) {
       fileList.value.push(
         ...filePaths
          // 防止文件被重复添加
          .filter(item => !uniqueFilePaths.has(item))
          .map(filePath => {
            uniqueFilePaths.add(filePath);
            return {
              psd: new Psd2Html({ filePath }),
              filePath: filePath
            }
          })
       )
     }
   })
}

function removePsd(index, item) {
  fileList.value.splice(index, 1);
  uniqueFilePaths.delete(item.filePath);
}

function clearAll() {
  fileList.value = [];
  uniqueFilePaths.clear();
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
    width: 500px;
    .ly-input {
      flex: 1;
    }
    .ly-btn {
      margin-left: 10px;
    }
  }
}
.block-wrap {
  flex: 1;
}
.file-list {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fill, 280px);
  
  .add-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    border: 1px dashed currentColor;
    border-radius: 10px;
    color: var(--stress-bg);
    cursor: pointer;
    .iconfont {
      font-size: 36px;
    }
    &:hover {
      color: var(--primary-color);
    }
  }
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
