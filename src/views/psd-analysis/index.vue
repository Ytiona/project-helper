<template>
  <h1>psd-analysis</h1>
  <Poptip>
    <button @click="test">test</button>
    <template #content>
      <h1>1323213123</h1>
    </template>
  </Poptip>
  
</template>

<script setup>
import Notice from '@/ly-ui/notice';

function test() {
  Notice.info('213213');
}

</script>

<style lang="less" scoped>

</style>