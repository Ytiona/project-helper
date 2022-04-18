<template>
  <div class="main">
    <FileChoose
      class="file-choose"
      :filters="[{ name: 'PSD文件', extensions: ['psd'] }]"
      empty-tips="拖入文件夹/PSD文件"
      @on-files-change="resetPsdItems()"
    >
      <template v-slot:top-right>
        <Button icon="setting-fill" @click="configVisbile = true"
          >构建配置 | 当前：{{ currentBuildConfig.title }}</Button
        >
      </template>
      <template v-slot:file-list="{ fileList, chooseFiles, removeFile }">
        <div class="file-list">
          <PsdCard
            v-for="(item, index) in fileList"
            :key="item"
            :filePath="item"
            :remove="() => removeFile(index)"
            :ref="setPsdItems"
            class="file-item"
          ></PsdCard>
          <div class="add-btn" @click="chooseFiles()">
            <i class="iconfont icon-add"></i>
          </div>
        </div>
      </template>
    </FileChoose>
  </div>
  <div class="footer">
    <div class="left">
      <div class="output-path">
        <span class="path">输出路径：{{ store.outputPath }}</span>
        <span class="choose-btn" @click="onChooseOutputPath()">选择路径</span>
      </div>
    </div>
    <div class="right">
      <Checkbox v-model:value="store.openTinyCompress">开启Tiny压缩</Checkbox>
      <span class="build-btn" @click="onBuild()">
        <i class="iconfont icon-build"></i>
        开始构建
      </span>
    </div>
  </div>

  <Modal
    v-model:show="configVisbile"
    title="构建配置"
    :width="800"
    @on-ok="onConfirmBuildConfig()"
  >
    <BuildConfig class="build block" ref="buildConfigRef" />
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
        <i class="iconfont icon-load" />
      </div>
      <div class="desc">{{ buildDesc }}</div>
      <!-- <div class="cancel-btn">取消构建</div> -->
    </div>
  </Modal>
</template>

<script setup>
import { onMounted, ref, nextTick } from "vue";
import Message from "@/ly-ui/message";
import Modal from "@/ly-ui/modal";
import FileChoose from "@/components/file-choose";
import BuildConfig from "./components/build-config";
import PsdCard from "./components/psd-card";
import ProjectBuilder from "@/core/builder";
import tinyCompress from "@/core/tiny-compress";
import useBuilderStore from "./store";

const remote = require("@electron/remote");

const store = useBuilderStore();

const configVisbile = ref(false);

// 构建配置
let currentBuildOptions;
const buildDesc = ref('构建中...');
const buildLoading = ref(false);
const buildConfigRef = ref(null);
const currentBuildConfig = ref({});

// 初始获取构建配置中的当前配置
onMounted(() => {
  currentBuildConfig.value = buildConfigRef.value.currentBuildConfig;
  currentBuildOptions = buildConfigRef.value.currentOptions;
});

// psd列表
const psdItems = [];
function setPsdItems(el) {
  if (el) {
    psdItems.push(el);
  }
}
function resetPsdItems() {
  psdItems.length = 0; // 清空数组，保证引用不变
}

// 选择输出路径
function onChooseOutputPath() {
  remote.dialog
    .showOpenDialog({
      properties: ["openDirectory"],
    })
    .then(({ canceled, filePaths }) => {
      if (!canceled) {
        store.outputPath = filePaths[0];
      }
    });
}

// 切换构建配置
async function onConfirmBuildConfig() {
  try {
    await buildConfigRef.value.validate();
    currentBuildOptions = buildConfigRef.value.currentOptions;
    currentBuildConfig.value = buildConfigRef.value.currentBuildConfig;
    store.currentBuildConfigType = currentBuildConfig.value.type;
    configVisbile.value = false;
    Message.success(`构建配置已切换为：${currentBuildConfig.value.title}`);
  } catch (errs) {}
}

// 开始构建
async function onBuild() {
  if (!psdItems.length) return Message.error("请添加PSD文件");
  const repeatNames = new Set();
  const map = {};
  psdItems.forEach((item) => {
    if (map[item.name]) {
      repeatNames.add(item.name);
    }
    map[item.name] = true;
  });
  if (repeatNames.size) {
    Modal.warning({
      title: "存在重复的页面/组件名称",
      content: [...repeatNames].join("；"),
    });
    return;
  }

  buildDesc.value = '构建中...';
  buildLoading.value = true;

  await nextTick();

  setTimeout(startBuild, 100);
}

function startBuild() {
  const projectBuilder = new ProjectBuilder({
    items: psdItems,
    output: store.outputPath,
    config: currentBuildOptions,
  });


  const { psdTasks, allTask } = projectBuilder.build();

  allTask.then(() => {
    if (store.openTinyCompress) {
      buildDesc.value = '图片压缩中...';
      const compressTasks = psdTasks.map(({ imgTasks }) => {
        return imgTasks.forEach(({ savePath }) => tinyCompress(savePath))
      })
      Promise.allSettled(compressTasks).finally(() => {
        onBuildComplete();
      })
    } else {
      onBuildComplete();
    }
  }).catch(onBuildComplete)
}

function onBuildComplete() {
  buildLoading.value = false;
  Modal.success({
    title: '温馨提示',
    content: '项目构建完成！'
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
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
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
  .output-path {
    display: flex;
    align-items: center;
    .path {
      display: flex;
      padding: 4px 10px;
      font-size: 12px;
      border-radius: 6px;
      word-break: break-all;
      color: var(--primary-color);
      background: var(--stress-bg);
    }
    .choose-btn {
      margin-left: 4px;
      padding: 4px 10px;
      font-size: 12px;
      border-radius: 6px;
      white-space: nowrap;
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
    white-space: nowrap;
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
