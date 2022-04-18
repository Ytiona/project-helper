<template>
  <div class="img-card">
    <div class="left">
      <div class="cover" @click="onPreview()" title="查看大图">
        <div class="ani-rotate load-wrap" v-if="readLoading">
          <i class="iconfont icon-load"/>
        </div>
        <img :src="image.base64" :alt="image.name" v-else/>
      </div>
    </div>
    <div class="middle">
      <div class="middle__top">
        <span class="name">{{ image.name }}</span>
        <span class="size">{{ handleSize(image.size) }}</span>
      </div>
      <div class="info">
        <template v-if="readLoading">
          正在读取中...
        </template>
        <template v-else>
          <span class="item">W: {{ image.width }} | H :{{ image.height }}</span>
          <span class="label">处理后：</span>
          <span class="item">W: {{ handledWidth }} | H: {{ handledHeight }}</span>
        </template>
      </div>
      <div class="path" @click="onPathExplorer" title="在资源管理器中打开">
        {{ filePath }}
      </div>
    </div>
    <div class="right">
      <template v-if="!isInit">
        <div class="compress-compressLoading" v-if="compressLoading">
          <div class="ani-rotate load-wrap">
            <i class="iconfont icon-load"/>
          </div>
        </div>
        <div class="compress-res" v-else>
          <div :class="['perc', resTypeCls]">
            <i class="iconfont icon-decline"></i>
            <span class="txt">{{ compressPercentage }}</span>
          </div>
          <div class="res-size">{{ handleSize(compressSize) }}</div>
        </div>
      </template>
    </div>
    <i class="iconfont icon-close" @click="remove()" />
  </div>
</template>

<script setup>
import tinyCompress from "@/core/tiny-compress";
import { reactive, watch, ref, watchEffect, computed } from "vue";
import { handleSize } from "@/lib/utils";
import usePicHandleStore from "@/views/pic-handle/store";
import Validator from "@/lib/validator";
import { COMPRESS_IMG_PREFIX } from '@/views/pic-handle/constants';
import { defaultConfig } from '@/views/pic-handle/constants';

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

const store = usePicHandleStore();

const image = reactive({
  name: "",
  base64: "",
  width: null,
  height: null,
  size: null,
});

let jimpImage;

const readLoading = ref(true);
const isInit = ref(true);
const compressLoading = ref(false);
const compressSize = ref(null);

const handledWidth = ref(null);
const handledHeight = ref(null);

const resTypeCls = computed(() => {
  if(compressSize.value > image.size) {
    return 'error';
  }
  return 'success';
})

const compressPercentage = computed(() => {
  return ((compressSize.value / image.size) * 100).toFixed(0) + '%';
})

// 计算本地处理后的宽高
watchEffect(() => {
  const { maxHeight, maxWidth } = store.config;
  const { width, height } = image;
  const ratio = width / height;
  let _handledWidth = width, 
      _handledHeight = height;
  if(!Validator.isEmpty(maxWidth) && width > maxWidth) {
    _handledWidth = maxWidth;
    _handledHeight = parseInt(_handledWidth / ratio);
  }
  if(!Validator.isEmpty(maxHeight) && _handledHeight > maxHeight) {
    _handledHeight = maxHeight;
    _handledWidth = parseInt(_handledHeight * ratio);
  }
  handledHeight.value = _handledHeight;
  handledWidth.value = _handledWidth;
})

// 读取图片信息，并创建jimp实例
watch(
  () => props.filePath,
  async (value) => {
    readLoading.value = true;
    image.name = path.basename(value);
    fs.stat(value, (err, res) => {
      if (err) throw err;
      image.size = res.size;
    });
    Jimp.read(value, (err, res) => {
      readLoading.value = false;
      if (err) throw err;
      jimpImage = res;
      image.width = res.bitmap.width;
      image.height = res.bitmap.height;
      res.getBase64Async(Jimp.AUTO).then((res) => {
        image.base64 = res;
      });
    });
  },
  {
    immediate: true,
  }
);

const outputFilePath = computed(() => {
  if(!store.replaceSource) {
    const basename = path.basename(props.filePath);
    const dirname = path.dirname(props.filePath);
    return `${dirname}/${COMPRESS_IMG_PREFIX}${basename}`;
  }
  return props.filePath;
})

function onPreview() {
  emit("on-preview", image.base64);
}

function onPathExplorer() {
  shell.showItemInFolder(props.filePath);
}

async function compress() {
  if(compressLoading.value) return;
  isInit.value = false;
  compressLoading.value = true;
  try {
    await localHandle(outputFilePath.value);
    await _tinyCompress(outputFilePath.value);
  } catch(err) {
    console.log(err);
  }
  compressLoading.value = false;
}

function localHandle(output) {
  const handlers = [];
  // 宽高有变化，则添加resize处理
  if(handledHeight.value !== image.height || handledWidth.value !== image.width) {
    handlers.push({
      name: 'resize',
      params: [
        handledWidth.value,
        handledHeight.value
      ]
    });
  }
  // 质量不为100，则添加quality处理
  if(store.config.quality !== 100) {
    handlers.push({
      name: 'quality',
      params: [store.config.quality]
    });
  }
  let current = jimpImage;
  handlers.forEach(({ name, params }) => {
    current = current[name](...params);
  })
  return current.writeAsync(output);
}

function _tinyCompress(filePath) {
  const { maxSize, minSize } = store.config;
  if(
    !Validator.isEmpty(minSize) && image.size >= minSize ||
    !Validator.isEmpty(maxSize) && image.size <= maxSize
  ) {
    return tinyCompress(filePath).then(res => {
      console.log(res);
      compressSize.value = res?.output?.size;
      return res;
    })
  }
}

defineExpose({
  image,
  compress
})

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
    .load-wrap {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      .iconfont {
        font-size: 30px;
        color: var(--primary-color);
      }
    }
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
    .compress-compressLoading {
      .load-wrap {
        width: 100px;
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        .iconfont {
          font-size: 30px;
          color: var(--primary-color);
        }
      }
    }
    .compress-res {
      text-align: center;
      .perc {
        display: flex;
        align-items: center;
        margin-bottom: 6px;
        font-size: 0;
        .iconfont {
          font-size: 24px;
        }
        .txt {
          font-size: 24px;
        }
        &.success {
          color: var(--success-color);
        }
        &.error {
          color: var(--error-color);
          .iconfont {
            transform: rotate(180deg) translateY(1px);
          }
        }
      }
      .res-size {
        display: inline-block;
        padding: 2px 4px;
        font-size: 12px;
        border-radius: 4px;
        color: var(--block-bg);
        background: var(--primary-color);
      }
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
