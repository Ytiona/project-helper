<template>
  <h1>temp</h1>
</template>

<script setup>
import tinyCompress from '@/core/tiny-compress';
import ProjectBuilder from '@/core/builder';

const remote = require('@electron/remote');

function startBuild() {
  const {
    psdItems,
    outputPath,
    currentBuildConfig,
    openTinyCompress
  } = window.buildConfig;
  const projectBuilder = new ProjectBuilder({
    items: psdItems,
    output: outputPath.value,
    config: currentBuildConfig
  });

  const {
    routerTask,
    psdTasks
  } = projectBuilder.build();

  if(openTinyCompress.value) {
    psdTasks.forEach(({
      fileTasks,
      imgTasks
    }) => {
      Promise
        .allSettled(imgTasks.map(item => item.promise))
        .finally(() => {
          imgTasks.forEach(({ savePath }) => {
            tinyCompress(savePath)
              .then(res => {
                console.log('ok: ', savePath, res);
              })
          })
        })
    })
  }

  return {
    routerTask,
    psdTasks
  }
}

const result = startBuild();
window.buildResult = result;

remote.ipcMain.send('build-complete');

</script>

<style lang="less" scoped>

</style>
