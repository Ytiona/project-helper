<!--
 * @Author: LiYu
 * @Date: 2021-09-12 18:07:50
 * @LastEditors: LiYu
 * @LastEditTime: 2022-03-07 21:53:34
 * @Description: 
-->
<template>
  <div class="block-wrap">
    <ul class="file-list">
      <li v-for="item in fileList" class="file-item">
        <div class="file-icon">
          <i class="iconfont icon-psd"/>
        </div>
        <div class="center">
          <div class="name">home</div>
          <div class="info">1/20，压缩率60%，共5.2Mb</div>
        </div>
        <div class="state">
          <div class="ani-rotate">
            <i class="iconfont icon-load"/>
          </div>
          <!-- <i class="iconfont icon-complate"/> -->
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
const props = defineProps({
  fileList: {
    type: Array,
    default: () => [{}, {}, {}]
  }
})
</script>

<style lang="less" scoped>
.file-list {
  margin: 0;
  padding: 0;
  list-style: none;
  .file-item {
    display: flex;
    align-items: center;
    padding: 10px;
    .file-icon {
      .iconfont {
        font-size: 50px;
        color: var(--primary-color);
        opacity: 0.5;
      }
    }
    .center {
      flex: 1;
      margin: 0 6px;
    }
    .name {
      margin-bottom: 6px;
      font-size: 18px;
      color: var(--l-txt);
    }
    .info {
      font-size: 12px;
      color: var(--primary-color);
    }
    .state {
      .iconfont {
        font-size: 24px;
        color: var(--primary-color);
      }
      .icon-load {
        opacity: 0.5;
      }
    }
  }
}
</style>

