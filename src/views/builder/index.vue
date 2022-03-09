<template>
  <div class="main">
    <FileChoose 
      class="file-choose"
      :filters="[{ name: 'PSD文件', extensions: 'psd' }]" 
      empty-tips="拖入文件夹/PSD文件"
    >
      <template v-slot:top-right>
        <Button icon="setting-fill" @click="configVisbile = true">构建配置</Button>
      </template>
      <template v-slot:file-list="{ fileList, chooseFile, removeFile }">
        <div class="file-list">
          <!-- todo: 集成psd解析模块 -->
          <PsdCard
            v-for="(item, index) in fileList"
            :key="item"
            :filePath="item" 
            :remove="() => removeFile(index)"
            :ref="setPsdItems"
          ></PsdCard>
          <div class="add-btn" @click="chooseFile()">
            <i class="iconfont icon-add"></i>
          </div>
        </div>
      </template>
    </FileChoose>
  </div>
  <div class="footer">
    <div class="left">
      <div class="notice">正在压缩HOME:title.png</div>
      <div class="output-path">
        <span class="path">输出路径：{{ outputPath }}</span>
        <span class="choose-btn" @click="onChooseOutputPath()">选择路径</span>
      </div>
    </div>
    <div class="right">
      <Checkbox v-model:value="openTinyCompress">开启Tiny压缩</Checkbox>
      <span class="build-btn" @click="onBuild()">
        <i class="iconfont icon-build"></i>
        开始构建
      </span>
    </div>
  </div>

  <Modal v-model:show="configVisbile" title="构建配置" :width="800">
    <BuildConfig class="build block" ref="buildConfig"/>
  </Modal>

  <Modal 
    v-model:show="buildLoading" 
    footerHide 
    headHide 
    :closable="false" 
    :width="240"
    :maskClosable="false"
  >
    <div class="build-load">
      <div class="ani-rotate load-icon">
        <i class="iconfont icon-load"/>
      </div>
      <p class="desc">正在构建...</p>
      <div class="cancel-btn">取消构建</div>
    </div>
  </Modal>

</template>

<script setup>
import { ref } from 'vue';
import FileChoose from '@/components/file-choose';
import BuildConfig from './components/build-config';
import PsdCard from './components/psd-card';
import build from '@/core/builder';
const remote = require('@electron/remote');

const openTinyCompress = ref(true);

const configVisbile = ref(false);

const buildLoading = ref(false);
const outputPath = ref('./project-helper/output');
const buildConfig = ref(null);
const psdItems = [];

function setPsdItems(el) {
  if(el) {
    psdItems.push(el);
  }
}

function onChooseOutputPath() {
  remote.dialog.showOpenDialog({
    properties: ['openDirectory']
  }).then(({ canceled, filePaths }) => {
    if(!canceled) {
      outputPath.value = filePaths[0];
    }
  })
}

function onBuild() {
  buildLoading.value = true;
  Promise.allSettled(psdItems.map(item => {
    return build({
      psd: item.parsedPsd.psd,
      output: outputPath.value,
      config: buildConfig.value.currentOptions
    })
  })).finally(() => {
    buildLoading.value = false;
  })
}

</script>

<style lang="less" scoped>
.main {
  padding: 20px;
  height: calc(100vh - 86px - 80px);
  display: flex;
  .file-choose {
    flex: 1;
  }
}
.file-list {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fill, 280px);
  .add-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 90px;
    padding: 10px;
    box-sizing: border-box;
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
.footer {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 80px;
  box-sizing: border-box;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--dark-stress-bg);
  .notice {
    margin-bottom: 10px;
    font-size: 12px;
    color: var(--primary-color);
  }
  .output-path {
    display: flex;
    align-items: center;
    .path {
      padding: 4px 10px;
      font-size: 12px;
      border-radius: 6px;
      color: var(--primary-color);
      background: var(--stress-bg);
    }
    .choose-btn {
      margin-left: 4px;
      padding: 4px 10px;
      font-size: 12px;
      border-radius: 6px;
      color: var(--primary-color);
      background: var(--stress-bg);
      cursor: pointer;
      user-select: none;
      &:hover {
        color: var(--l-txt);
      }
    }
  }
  .right {
    display: flex;
    align-items: center;
  }
  .build-btn {
    margin-left: 20px;
    display: flex;
    align-items: center;
    padding: 8px 26px;
    font-size: 18px;
    letter-spacing: 2px;
    color: var(--l-txt);
    border: 2px solid var(--primary-color);
    border-radius: 12px;
    background: var(--stress-bg);
    cursor: pointer;
    user-select: none;
    .iconfont {
      margin-right: 6px;
      font-size: 26px;
      color: var(--primary-color);
    }
    &:hover {
      background: var(--dark-stress-bg);
    }
  }
}
.build-load {
  overflow: hidden;
  text-align: center;
  color: var(--primary-color);
  .icon-load {
    font-size: 50px;
  }
  .desc {
    margin-top: 10px;
    margin-bottom: 20px;
    font-size: 14px;
  }
  .cancel-btn {
    padding: 10px;
    font-size: 15px;
    letter-spacing: 2px;
    // box-shadow: 0 0 0 4px #414175, 0 0 0 6px #33335a;
    border-radius: 6px;
    color: var(--dark-stress-bg);
    background: var(--primary-color);
    cursor: pointer;
    user-select: none;
    &:hover {
      color: var(--l-txt);
    }
  }
}
</style>
