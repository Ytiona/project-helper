<template>
  <div class="img-card">
    <div class="left">
      <div class="cover" @click="onPreview()" title="查看大图">
        <img :src="base64Img" :alt="name"/>
      </div>
    </div>
    <div class="middle">
      <div class="name">{{ name }}</div>
      <div class="info">
        <span class="item">200Kb</span>
        <span class="item">W:{{ width }} H:{{ height }}</span>
      </div>
      <div class="compress-info">
        <span class="label">压缩结果：</span>
        <span class="item">200Kb</span>
        <span class="item">W:{{ width }} H:{{ height }}</span>
      </div>
      <div class="path" @click="onPath" title="在资源管理器中打开">{{ filePath }}</div>
    </div>
    <div class="right">
      <Button class="btn">压缩</Button>
    </div>
    <i class="iconfont icon-close" @click="remove()" />
  </div>
</template>

<script setup>
import tinyCompress from "@/core/tiny-compress";
import { ref, watch } from "vue";
const fs = require("fs");
const path = require("path");
const { shell } = require('electron')

// 图片名、图片路径、宽高、size、压缩后size、压缩后宽高、压缩、重新压缩
const props = defineProps({
  remove: Function,
  filePath: String,
  compressConfig: Object,
});

const emit = defineEmits(['on-preview']);

const base64Img = ref("");

const name = ref("");

const width = ref(1044);
const height = ref(1245);

watch(
  () => props.filePath,
  (value) => {
    name.value = path.basename(value);
    const base64 = fs.readFileSync(value).toString("base64");
    base64Img.value = "data:image/png;base64," + base64;
  },
  {
    immediate: true,
  }
)

function onPreview() {
  emit('on-preview', base64Img.value);
}

function onPath() {
  shell.showItemInFolder(props.filePath);
}

</script>

<style lang="less" scoped>
.img-card {
  position: relative;
  display: flex;
  align-items: center;
  padding: 10px;
  box-sizing: border-box;
  border: 1px solid var(--stress-bg);
  border-radius: 10px;
  .cover {
    width: 80px;
    height: 80px;
    border-radius: 4px;
    overflow: hidden;
    background: var(--dark-stress-bg);
    cursor: pointer;
    img {
      width: 100%;
      height: 100%; 
      object-fit: contain;
    }
  }
  .middle {
    flex: 1;
    margin-left: 10px;
    .name {
      margin-bottom: 10px;
      font-size: 16px;
      font-weight: bold;
      color: #fff;
    }
    .info,
    .compress-info {
      margin-bottom: 6px;
      font-size: 12px;
      color: var(--primary-color);
      .item {
        &+.item::before {
          content: ' | ';
        }
      }
    }
    .path {
      word-break: break-all;
      font-size: 12px;
      color: var(--dark-border);
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
  }
  .right {
    margin-left: 10px;
    .btn {
      min-width: 80px;
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
