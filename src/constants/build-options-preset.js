export default {
  mpWechat: {
    title: '微信小程序',
    type: 'mpWechat',
    options: {
      unit: 'rpx',
      scale: 1.0,
      width: 750,
      containerTag: 'view',
      imgTag: 'image',
      classAttrName: 'class',
      selector: '.',
      imgPath: 'assets',
      routerPath: 'app.json',
      routerTemplate: `{
  "pages": [
    #start
    "#pagePath/#name/#name",
    #end
  ]
}`,
      pagePath: 'pages',
      componentPath: 'components',
      files: [
        {
          fileName: '#name.wxml',
          template: `#html`
        },
        {
          fileName: '#name.js',
          template: `Page({
  data: {},
  onLoad() {},
  onReady() {},
})`
        },
        {
          fileName: '#name.wxss',
          template: `#css`
        },
        {
          fileName: '#name.json',
          template: ``
        }
      ]
    }
  },
  vue: {
    title: 'Vue',
    type: 'vue',
    options: {
      unit: 'px',
      scale: 1.0,
      width: 750,
      containerTag: 'div',
      imgTag: 'img',
      classAttrName: 'class',
      selector: '.',
      imgPath: 'assets',
      routerPath: 'router/index.js',
      routerTemplate: `[
  #start
  {
    path: '/#name',
    name: '#name',
    component: () => import('@/#pagePath/#name/#name'),
    meta: {
      title: '#title'
    }
  }
  #end
]`,
      pagePath: 'views',
      componentPath: 'components',
      files: [
        {
          fileName: 'index.vue',
          template: `<template>
  #html
</template>

<script setup>
</script>
<style scoped>
@import './index.css'
</style>`
        },
        {
          fileName: 'index.css',
          template: `#css`
        }
      ]
    }
  },
  react: {
    title: 'React',
    type: 'react',
    options: {
      unit: 'px',
      scale: 1.0,
      width: 750,
      containerTag: 'div',
      imgTag: 'img',
      classAttrName: 'className',
      selector: '.',
      imgPath: 'assets',
      routerPath: 'router/index.js',
      routerTemplate: `[
  #start
  {
    path: '/#name',
    component: React.lazy(() => import("@/#pagePath/#name/index.js"))
  }
  #end
]`,
      pagePath: 'pages',
      componentPath: 'components',
      files: [
        {
          fileName: 'index.js',
          template: `
import React, { memo } from 'react';
import StyleWrap from './style.js';
export default memo(function #name(){
  return (
    <>
      #html
    </>
  )
})`
        },
        {
          fileName: 'style.js',
          template: `import styled from 'styled-components';
export default styled.div\`
  #css
\``
        }
      ]
    }
  }
}

export const customConfigDefault = {
  title: "自定义",
  deletable: false,
  options: {
    unit: "px",
    scale: 1.0,
    width: 750,
    containerTag: "div",
    imgTag: "img",
    classAttrName: "class",
    selector: ".",
    imgPath: 'assets',
    routerPath: "router/index.js",
    routerTemplate: ``,
    pagePath: "pages",
    componentPath: "components",
    files: [],
  },
}