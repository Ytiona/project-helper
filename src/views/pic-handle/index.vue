<template>
  <div class="main">
    <FileChoose 
      class="file-choose"
      :filters="[{ name: '图片文件', extensions: ['jpg', 'jpeg', 'png', 'webp'] }]" 
      empty-tips="拖入文件夹/图片文件"
      @on-files-change="resetPsdItems()"
    >
      <template v-slot:top-right>
        <Button icon="setting-fill" @click="configVisbile = true">图片处理配置</Button>
      </template>
      <template v-slot:file-list="{ fileList, chooseFiles, removeFile }">
        <div class="file-list">
          <ImgCard
            v-for="(item, index) in fileList"
            :key="item"
            :filePath="item" 
            :remove="() => removeFile(index)"
            :ref="setImgItems"
            @on-preview="onPreview"
            class="file-item"
          ></ImgCard>
          <div class="add-btn" @click="chooseFiles()">
            <i class="iconfont icon-add"></i>
          </div>
        </div>
      </template>
    </FileChoose>
  </div>

  <div class="footer">
    <div class="left">
      <Checkbox v-model:value="replaceSource">替换原图</Checkbox>
      <div class="tips">提示：不替换会在同目录下创建带 {{ COMPRESS_IMG_PREFIX }} 前缀的同名图片</div>
    </div>
    <div class="right">
      <span class="compress-btn" @click="onCompressAll()">
        <i class="iconfont icon-compress"></i>
        一键处理
      </span>
    </div>
  </div>

  <Modal v-model:show="configVisbile" title="图片处理配置">
    <CompressConfig/>
  </Modal>

  <Modal v-model:show="previewVisible" title="图片预览" footer-hide :width="800">
    <img :src="previewBase64Img" class="preview-img"/>
  </Modal>
</template>

<script setup>
import { ref } from 'vue';
import Modal from '@/ly-ui/modal';
import FileChoose from '@/components/file-choose';
import ImgCard from './components/img-card';
import CompressConfig from './components/compress-config';
import { useLocalStorage } from '@/lib/hooks';
import { COMPRESS_IMG_PREFIX } from '@/constants/routine';

const fileChoose = ref(null);

const configVisbile = ref(false);

const replaceSource = useLocalStorage('replaceSource', true);

const imgItems = [];

function setImgItems(el) {
  if(el) {
    imgItems.push(el);
  }
}

function resetPsdItems() {
  imgItems.length = 0; // 清空数组，保证引用不变
}

const previewVisible = ref(false);
const previewBase64Img = ref('');
function onPreview(base64Img) {
  previewBase64Img.value = base64Img;
  previewVisible.value = true;
}

function onCompressAll() {
  imgItems.forEach(item => item.compress());
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
  grid-template-columns: repeat(auto-fill, minmax(480px, 1fr));
  .add-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 110px;
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
  .left {
    .tips {
      margin-top: 10px;
      font-size: 12px;
      color: var(--dark-border);
    }
  }
  .right {
    display: flex;
    align-items: center;
  }
  .compress-btn {
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
.preview-img {
  width: 800px;
  height: calc(100vh - 200px);
  object-fit: contain;
}
</style>
