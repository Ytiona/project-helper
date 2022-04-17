<template>
  <div class="img-card">
    <div class="left">
      <div class="cover" @click="onPreview()" title="查看大图">
        <img :src="image.base64" :alt="image.name" v-if="image.base64"/>
        <div class="ani-rotate" v-else>
          <i class="iconfont icon-load"/>
        </div>
      </div>
    </div>
    <div class="middle">
      <div class="middle__top">
        <span class="name">{{ image.name }}</span>
        <span class="size">{{ sizeStr }}</span>
      </div>
      <div class="info">
        <span class="item">W: {{ image.width }} | H :{{ image.height }}</span>
        <span class="label">处理后：</span>
        <span class="item">W: {{ image.width }} | H: {{ image.height }}</span>
      </div>
      <div class="path" @click="onPathExplorer" title="在资源管理器中打开">
        {{ filePath }}
      </div>
    </div>
    <div class="right">
      <Button class="btn">处理</Button>
    </div>
    <i class="iconfont icon-close" @click="remove()" />
  </div>
</template>

<script setup>
import tinyCompress from "@/core/tiny-compress";
import { reactive, watch, ref, watchEffect } from "vue";
import { handleSize } from "@/lib/utils";

const path = require("path");
const { shell } = require("electron");
const Jimp = require("jimp");
const fs = require("fs");

// 图片名、图片路径、宽高、size、压缩后size、压缩后宽高、压缩、重新压缩
const props = defineProps({
  remove: Function,
  filePath: String,
  compressConfig: Object,
});

const emit = defineEmits(["on-preview"]);

const image = reactive({
  name: "",
  // todo: 加载中的图
  base64: "",
  width: null,
  height: null,
  size: null,
});

const sizeStr = ref("");

watchEffect(() => {
  sizeStr.value = handleSize(image.size);
});

watch(
  () => props.filePath,
  async (value) => {
    image.name = path.basename(value);
    fs.stat(value, (err, res) => {
      if (err) throw err;
      image.size = res.size;
    });
    Jimp.read(value, (err, res) => {
      if (err) throw err;
      image.width = res.bitmap.width;
      image.height = res.bitmap.height;
      console.log(res);
      res.getBase64Async(Jimp.AUTO).then((res) => {
        image.base64 = res;
      });
      res.getBufferAsync(Jimp.AUTO, (...args) => {
        console.log(args);
      });
      // image
      //   .scaleToFit(500, Jimp.AUTO) // resize
      //   .writeAsync(value); // save
    });
  },
  {
    immediate: true,
  }
);

function onPreview() {
  emit("on-preview", image.base64);
}

function onPathExplorer() {
  shell.showItemInFolder(props.filePath);
}

defineExpose({
  image,
});
</script>

<style lang="less" scoped>
.img-card {
  position: relative;
  display: flex;
  align-items: center;
  height: 110px;
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
    &__top {
      margin-bottom: 10px;
      display: flex;
      align-items: flex-end;
      .name {
        font-size: 16px;
        font-weight: bold;
        color: #fff;
      }
      .size {
        font-size: 12px;
        margin-left: 8px;
        padding: 2px 4px;
        border-radius: 4px;
        color: var(--page-bg);
        background: var(--primary-color);
      }
    }
    .info {
      margin-bottom: 6px;
      font-size: 12px;
      color: var(--primary-color);
      .label {
        margin-left: 20px;
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
