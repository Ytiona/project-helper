<template>
  <div class="main">
    <Analysis class="row-1 block analysis">
      <template v-slot:top-right>
        <Button icon="setting-fill" @click="configVisbile = true">构建配置</Button>
      </template>
      <template v-slot:psd-item="{data, remove}">
        <PsdCard :data="data" :remove="remove"></PsdCard>
      </template>
    </Analysis>
    <!-- <div class="row-2">
      <TinyCompress class="tiny-compress block" v-if="openTinyCompress"/>
      <Build class="build block"/>
    </div> -->
  </div>
  <div class="footer">
    <div class="left">
      <div class="notice">正在压缩HOME:title.png</div>
      <div class="output-path">
        <span class="path">输出路径：C:/User/dsew/gfg</span>
        <span class="choose-btn">选择路径</span>
      </div>
    </div>
    <div class="right">
      <Checkbox v-model:value="openTinyCompress">开启Tiny压缩</Checkbox>
      <span class="build-btn">
        <i class="iconfont icon-build"></i>
        开始构建
      </span>
    </div>
  </div>

  <Modal v-model:show="configVisbile" title="构建配置" :width="800">
    <Build class="build block"/>
  </Modal>
</template>

<script setup>
import { ref } from '@vue/reactivity';
import Analysis from '@/core/analysis/index.vue';
import TinyCompress from '@/core/tiny-compress/index.vue';
import Build from '@/core/build/index.vue';
import PsdCard from './psd-card.vue';

const openTinyCompress = ref(true);

const configVisbile = ref(false);
</script>

<style lang="less" scoped>
.main {
  padding: 20px;
  height: calc(100vh - 86px - 80px);
  display: flex;
  flex-direction: column;
  overflow: auto;
  .block {
    &:nth-child(1) {
      grid-column: span 2;
    }
  }
  .row-1 {
    margin-bottom: 10px;
  }
  .row-2 {
    display: flex;
  }
  .analysis {
    flex: 1;
  }
  .tiny-compress {
    flex: 0 0 300px;
    margin-right: 10px;
  }
  .build {
    flex: 1;
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
</style>
