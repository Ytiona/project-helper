<!--
 * @Author: LiYu
 * @Date: 2021-09-12 17:52:52
 * @LastEditors: LiYu
 * @LastEditTime: 2022-03-22 22:37:54
 * @Description: 
-->
<template>
  <div class="container">
    <div class="slide">
      <div class="logo">
        <span class="pic">
          <img src="@/assets/img/logo.png" alt="" width="200" />
        </span>
        <span class="txt">Project Helper</span>
      </div>
      <div class="menu">
        <div
          v-for="(item, index) in menus"
          :key="index"
          :class="{ active: currentPath === item.path }"
          class="menu-item"
          @click="gotoPage(item)"
        >
          <i :class="`iconfont icon-${item.icon}`" />
          <div class="right">
            <div class="title">{{ item.title }}</div>
            <div class="desc">{{ item.desc }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="main">
      <router-view v-slot="{ Component, route }">
        <div class="head">
          <h4 class="title">{{ route.meta.title }}</h4>
          <div class="ctrl">
            <i class="iconfont icon-minimize" @click="minimizeWin"></i>
            <i class="iconfont icon-maximize" @click="maximizeWin" v-if="!isMaximized"></i>
            <i class="iconfont icon-restore" @click="maximizeWin" v-else></i>
            <i class="iconfont icon-close" @click="closeWin"></i>
          </div>
        </div>
        <div class="wrap">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </div>
      </router-view>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const { ipcRenderer: ipc } = require('electron');

const isMaximized = ref(false);

const router = useRouter();
const menus = [
  {
    path: "/",
    icon: "build",
    title: "项目构建",
    desc: "PSD解析-Tiny压缩-项目构建",
  },
  {
    path: "/tiny-compress",
    icon: "compress",
    title: "Tiny压缩",
    desc: "Tinypng压缩，破解限制",
  },
  {
    path: "/psd-analysis",
    icon: "analysis",
    title: "PSD解析",
    desc: "将PSD文件中图层导出为图片",
  },
];
const currentPath = ref("/");

function gotoPage(menu) {
  currentPath.value = menu.path;
  router.replace(menu.path);
}

ipc.on('maximize', () => {
  isMaximized.value = true;
})

ipc.on('unmaximize', () => {
  isMaximized.value = false;
})

function minimizeWin() {
  ipc.send('min');
}

function maximizeWin() {
  ipc.send('max');
  isMaximized.value = !isMaximized.value;
}

function closeWin() {
  ipc.send('close');
}

</script>

<style lang="less" scoped>
.container {
  display: flex;
  min-height: 100vh;
  .slide {
    padding: 20px 30px;
    background: var(--block-bg);
    .logo {
      display: flex;
      align-items: center;
      -webkit-app-region: drag;
      .pic {
        width: 40px;
        overflow: hidden;
      }
      .txt {
        font-weight: lighter;
        font-size: 28px;
        color: #fff;
      }
    }
  }
  .main {
    flex: 1;
    .head {
      border-bottom: 1px solid var(--stress-bg);
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 46px;
      box-sizing: border-box;
      .title {
        flex: 1;
        display: flex;
        align-items: center;
        line-height: 1;
        margin: 0;
        height: 100%;
        padding: 0 20px;
        font-size: 16px;
        color: var(--primary-color);
        -webkit-app-region: drag;
      }
      .ctrl {
        .iconfont {
          padding: 10px;
          font-size: 18px;
          color: var(--stress-bg);
          cursor: pointer;
          &:hover {
            color: var(--primary-color);
            background: var(--block-bg);
          }
          &.icon-close:hover {
            color: #fff;
            background: rgba(255, 0, 0, 0.8);
          }
        }
      }
    }
    .wrap {
      position: relative;
      height: calc(100vh - 46px);
      overflow: auto;
    }
  }
}
.menu {
  padding: 40px 0;
  .menu-item {
    display: flex;
    align-items: center;
    width: 260px;
    padding: 8px 14px;
    box-sizing: border-box;
    border-radius: 18px;
    cursor: pointer;
    &:not(:last-child) {
      margin-bottom: 30px;
    }
    &.active {
      box-shadow: 0 0 0 2px var(--primary-color);
      background: var(--stress-bg);
    }
    &:hover:not(.active) {
      box-shadow: 0 0 0 1px var(--primary-color);
    }
    .title {
      margin-bottom: 6px;
      font-size: 16px;
      font-weight: 600;
      color: var(--l-txt);
    }
    .desc {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.5);
    }
    .iconfont {
      margin-right: 10px;
      font-size: 46px;
      color: var(--primary-color);
    }
  }
}
</style>

<style lang="less">
// @import "./assets/style/iconfont/iconfont.css";
// @import "./assets/style/fonts.css";
@import "//at.alicdn.com/t/font_2807358_1np9cf0719g.css";
body {
  font-family: SourceHanSansCN Arial, PingFang SC, Microsoft YaHei, SimSun,
    sans-serif, Hiragino Sans GB, Helvetica, "sans-serif", Lantinghei SC,
    WenQuanYi Micro Hei, STHeiti Light, STHeiti;
  background: var(--page-bg);
}
::selection {
  color: var(--l-txt);
  background: var(--primary-color);
}
#app {
  min-height: 100vh;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
  margin: 0; 
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
