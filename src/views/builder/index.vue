<template>
  <div class="main">
    <FileChoose 
      class="file-choose"
      :filters="[{ name: 'PSD文件', extensions: 'psd' }]" 
      empty-tips="拖入文件夹/PSD文件"
      @on-files-change="resetPsdItems()"
    >
      <template v-slot:top-right>
        <Button icon="setting-fill" @click="configVisbile = true">构建配置</Button>
      </template>
      <template v-slot:file-list="{ fileList, chooseFile, removeFile }">
        <div class="file-list">
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
      <!-- <div class="notice">正在压缩HOME:title.png</div> -->
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

  <Modal v-model:show="configVisbile" title="构建配置" :width="800" @on-ok="onConfirmBuildConfig()">
    <BuildConfig class="build block" ref="buildConfig"/>
  </Modal>

  <Modal 
    v-model:show="buildLoading" 
    footerHide 
    headHide 
    :closable="false" 
    :width="150"
    :maskClosable="false"
  >
    <div class="build-load">
      <div class="ani-rotate load-icon">
        <i class="iconfont icon-load"/>
      </div>
      <div class="desc">正在构建...</div>
      <!-- <div class="cancel-btn">取消构建</div> -->
    </div>
  </Modal>

</template>

<script setup>
import { onMounted, ref } from 'vue';
import Message from '@/ly-ui/message';
import Modal from '@/ly-ui/modal';
import FileChoose from '@/components/file-choose';
import BuildConfig from './components/build-config';
import PsdCard from './components/psd-card';
import ProjectBuilder from '@/core/builder';
import { DEFAULT_OUTPUT } from '@/constants/routine';
import { walkSync } from '@/lib/utils';
import tinyCompress from '@/core/tiny-compress';
const path = require('path');
const remote = require('@electron/remote');

const openTinyCompress = ref(true);

const configVisbile = ref(false);

const buildLoading = ref(false);
const outputPath = ref(DEFAULT_OUTPUT);
const buildConfig = ref(null);
const psdItems = [];
let currentBuildConfig;
onMounted(() => {
  currentBuildConfig = buildConfig.value.currentOptions;
})

function setPsdItems(el) {
  if(el) {
    psdItems.push(el);
  }
}

function resetPsdItems() {
  psdItems.length = 0; // 清空数组，保证引用不变
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

async function onConfirmBuildConfig() {
  try {
    await buildConfig.value.validate();
    currentBuildConfig = buildConfig.value.currentOptions;
    configVisbile.value = false;
    Message.success('已切换构建配置');
  } catch(errs) {}
}

function onBuild() {
  if(!psdItems.length) return Message.error('请添加PSD文件');
  const repeatNames = new Set();
  const map = {};
  psdItems.forEach(item => {
    if(map[item.name]) {
      repeatNames.add(item.name);
    }
    map[item.name] = true;
  })
  if(repeatNames.size) {
    Modal.warning({
      title: '存在重复的页面/组件名称',
      content: [...repeatNames].join('；')
    })
    return;
  }
  buildLoading.value = true;
  new ProjectBuilder({
    items: psdItems,
    output: outputPath.value,
    config: currentBuildConfig
  })
    .build()
    .then(res => {
      compressPng();
    })
    .finally(() => {
      buildLoading.value = false;
    })
}

function compressPng() {
  const imgs = [];
  walkSync(`${outputPath.value}/${currentBuildConfig.imgPath}`, filePath => {
    if(path.extname(filePath) === '.png') {
      imgs.push(filePath);
      tinyCompress(filePath).then(res => {
        console.log(res);
      })
    }
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
  padding: 10px 0;
  overflow: hidden;
  text-align: center;
  color: var(--primary-color);
  .icon-load {
    font-size: 50px;
  }
  .desc {
    margin-top: 10px;
    font-size: 14px;
  }
}
</style>
