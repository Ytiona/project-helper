<template>
  <div class="container">
    <div class="block">
      <div class="block__top">
        <div class="block-title">本地预处理配置：</div>
      </div>
      <div class="block__content">
        <div class="config-item">
          <span class="label">最大宽度：</span>
          <span class="content">
            <input
              type="number"
              v-model.number="config.maxWidth"
              placeholder="缺省为不限制"
            />
          </span>
        </div>
        <div class="config-item">
          <span class="label">最大高度：</span>
          <span class="content">
            <input
              type="number"
              v-model.number="config.maxHeight"
              placeholder="缺省为不限制"
            />
          </span>
        </div>
        <div class="config-item">
          <span class="label">图片质量(1~100)：</span>
          <span class="content">
            <input
              type="number"
              v-model.number="config.quality"
              placeholder="缺省为100"
            />
          </span>
        </div>
      </div>
    </div>
    <div class="block">
      <div class="block__top">
        <div class="block-title">Tinypng压缩配置：</div>
        <div class="block-desc">配置限制外的则不进行压缩</div>
      </div>
      <div class="block__content">
        <div class="config-item">
          <span class="label">最小体积(Mb)：</span>
          <span class="content">
            <input
              type="number"
              v-model.number="config.minSize"
              placeholder="缺省为不限制"
            />
          </span>
        </div>
        <div class="config-item">
          <span class="label">最大体积(最大5Mb)：</span>
          <span class="content">
            <input
              max="5"
              type="number"
              v-model.number="config.maxSize"
              placeholder="缺省为5Mb"
            />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "@vue/reactivity";
import usePicHandleStore from "@/views/pic-handle/store";
import Validator from "@/lib/validator";
import Message from "@/ly-ui/message";
import { defaultConfig } from '@/views/pic-handle/constants';

const store = usePicHandleStore();

const config = reactive({ ...store.config });

const validator = new Validator({
  rules: {
    maxWidth: [
      { type: "integer", message: "最大宽度应为整数" },
      { validator: (value) => value > 0, message: "最大宽度应大于0" },
    ],
    maxHeight: [
      { type: "integer", message: "最大高度应为整数" },
      { validator: (value) => value > 0, message: "最大高度应大于0" },
    ],
    quality: [
      { type: "integer", message: "质量应为整数" },
      {
        validator: (value) => value > 0 && value <= 100,
        message: "质量应大于0，小于等于100",
      },
    ],
    minSize: [
      { type: "number", message: "最小体积应为数值" },
      { validator: (value) => value > 0, message: "最小体积应大于0" },
    ],
    maxSize: [
      { type: "number", message: "最大体积应为数值" },
      {
        validator: (value) => value > 0 && value <= 5,
        message: "最大体积应大于0，小于5",
      },
    ],
  }
})

const fieldValidateOrder = [
  "maxWidth",
  "maxHeight",
  "quality",
  "minSize",
  "maxSize",
];

function getConfig(callback) {
  function validate(index) {
    validator
      .validateField(fieldValidateOrder[index], config)
      .then(() => {
        if(index >= fieldValidateOrder.length - 1) {
          const {
            maxWidth,
            maxHeight,
            quality,
            minSize,
            maxSize,
          } = config;
          return callback({
            maxWidth: maxWidth || defaultConfig.maxWidth,
            maxHeight: maxHeight || defaultConfig.maxHeight,
            quality: quality || defaultConfig.quality,
            minSize: minSize || defaultConfig.minSize,
            maxSize: maxSize || defaultConfig.maxSize
          });
        }
        return validate(++index);
      })
      .catch((err) => {
        index = -1; // 中断循环
        return Message.error(err.message);
      });
  }
  validate(0);
}

defineExpose({
  getConfig
})

</script>

<style lang="less" scoped>
.container {
  padding: 2em;
  margin: 20px 0;
  border-radius: 10px;
  background: var(--dark-stress-bg);
}
.block {
  & + .block {
    border-top: 1px solid var(--primary-color);
    margin-top: 30px;
    padding-top: 30px;
  }
  &__top {
    margin-bottom: 20px;
    .block-title {
      margin-bottom: 6px;
      font-size: 14px;
      color: #fff;
    }
    .block-desc {
      font-size: 12px;
      color: var(--dark-border);
    }
  }
  &__content {
    display: flex;
    flex-flow: wrap;
    margin-right: -20px;
    margin-bottom: -30px;
    .config-item {
      display: flex;
      align-items: center;
      margin-bottom: 30px;
      margin-right: 20px;
      font-size: 14px;
      color: var(--primary-color);
      input {
        border: 1px solid var(--dark-border);
        color: var(--l-txt);
        padding: 5px 8px;
        border-radius: 6px;
        background: var(--stress-bg);
        outline: none;
        width: 100px;
        &.small {
          width: 30px;
        }
        &.large {
          width: 150px;
        }
        &::placeholder {
          color: #fff;
          opacity: 0.5;
        }
      }
    }
  }
}
</style>
