import { commonKeys, pageKeys, routerKeys } from '@/constants/compiler';

const cmk = commonKeys;
const pgk = pageKeys;
const rtk = routerKeys;

const presetConfig = {
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
    ${rtk.start}"${rtk.pagePath}/${cmk.name}/${cmk.name}"${rtk.end}
  ]
}`,
      pagePath: 'pages',
      componentPath: 'components',
      files: [
        {
          fileName: `${cmk.name}.wxml`,
          template: `${pgk.html}`
        },
        {
          fileName: `${cmk.name}.js`,
          template: `Page({
  data: {},
  onLoad() {},
  onReady() {},
})`
        },
        {
          fileName: `${cmk.name}.wxss`,
          template: `${pgk.css}`
        },
        {
          fileName: `${cmk.name}.json`,
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
  ${rtk.start}{
    path: '/${cmk.name}',
    name: '${cmk.name}',
    component: () => import('@/${rtk.pagePath}/${cmk.name}/${cmk.name}'),
    meta: {
      title: '${cmk.title}'
    }
  }${rtk.end}
]`,
      pagePath: 'views',
      componentPath: 'components',
      files: [
        {
          fileName: 'index.vue',
          template: `<template>
  ${pgk.html}
</template>

<script setup>
</script>
<style scoped>
@import './index.css'
</style>`
        },
        {
          fileName: 'index.css',
          template: `${pgk.css}`
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
  ${rtk.start}{
    path: '/${cmk.name}',
    component: React.lazy(() => import("@/${rtk.pagePath}/${cmk.name}/index.js"))
  }${rtk.end}
]`,
      pagePath: 'pages',
      componentPath: 'components',
      files: [
        {
          fileName: 'index.js',
          template: `
import React, { memo } from 'react';
import StyleWrap from './style.js';
const ${cmk.name__pascal} = memo(function ${cmk.name__pascal}(){
  return (
    <StyleWrap>
      ${pgk.html}
    </StyleWrap>
  )
})
export default ${cmk.name__pascal};
`
        },
        {
          fileName: 'style.js',
          template: `import styled from 'styled-components';
const StyleWrap = styled.div\`
  ${pgk.css}
\`
export default StyleWrap;
`
        }
      ]
    }
  }
}

const customConfigDefault = {
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

export {
  customConfigDefault
}

export default presetConfig;