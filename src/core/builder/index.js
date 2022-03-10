/*
 * @Author: LiYu
 * @Date: 2022-03-07 23:27:25
 * @LastEditors: LiYu
 * @LastEditTime: 2022-03-10 22:39:53
 * @Description: 
 */
/*
  project
    assets
      home: logo.png, banner.png
      person: menu.png, setting.png
    router
      index.js
    views
      home: home.vue
    components
      popup: popup.vue
  
  1.创建图片、路由、页面、组件文件夹
  2.构建路由文件
  3.调用buildPsd
    1）构建组件或页面
    2）保存png
*/
import { mkdir } from '@/lib/uitls';

export default class ProjectBuilder {
  items = [];
  output = `../../../${__dirname}`;
  config = {};
  imgPath;
  pagePath;
  componentPath;
  constructor({
    items,
    output,
    config
  }) {
    this.items = items;
    this.output = output;
    this.config = config;
  }

  build() {
    // 1.创建图片、页面、组件目录
    this.createDir();
    // 2.构建路由目录及文件
    this.createRouter();

    // 3。构建psd
    this.items.forEach(item => {
      this.buildPsd(item);
    })
  }
  
  createDir() {
    const {
      imgPath,
      pagePath,
      componentPath
    } = this.config;
    this.imgPath = `${this.output}/${imgPath}`;
    this.pagePath = `${this.output}/${pagePath}`;
    this.componentPath = `${this.output}/${componentPath}`;
    mkdir(this.imgPath);
    mkdir(this.pagePath);
    mkdir(this.componentPath);
  }

  createRouter() {
    const { routerPath, routerTemplate, pagePath } = this.config;
    const pages = this.items
        .filter(item => item.type === 'page')
        .map(item => ({ title: item.fileName, name }));

    const replaceReg = /(?<=#start)[\d\D]*(?=#end)/g;

    const replaceStr = routerTemplate.match(replaceReg)[0];

    const generateStr = pages.reduce((whole, cur) => {
      let str = replaceStr;
      str = str.replace(/#name/g, cur.name);
      str = str.replace(/#title/g, cur.title);
      return whole + str;
    }, '')

    const result = routerTemplate.replace(/(#start)[\d\D]*(#end)/g, generateStr).replace(/#pagePath/g, pagePath);
    fs.writeFile(`${this.output}/${routerPath}`, result);
  }

  buildPsd({
    psd,
    isPopup,
    type,
    name
  }) {
    const {
      unit,
      // scale,
      // width,
      containerTag,
      imgTag,
      classAttrName,
      selector,
      files
    } = config;
    let html = '',
        css = '';
    psd.descendants.forEach((item, index) => {
      const nodePath = item.path();
      const nodeClass = nodePath.replace(/\//g, '-');
      let { top, left, parent, width, height } = item;
      const hasParent = nodePath.includes('/');
      if (hasParent) {
        // 有父级，top、left则相对父级进行偏移
        top -= parent.top;
        left -= parent.left;
      }
      css += `
        ${selector}${nodeClass} {
          position: absolute;
          top: ${top}${unit};
          left: ${left}${unit};
          width: ${width}${unit};
          height: ${height}${unit};
          z-index: ${psd.layerCount - index};
        }
      `;
      if (item.hasChildren()) {
        // 有子集说明是对象组，即创建容器标签
        html += `
          <${containerTag} ${classAttrName}="${nodeClass}">
            <!-- ${nodePath} -->
          </${containerTag}>
        `;
        // 创建对应的目录
        mkdir(this.imgPath + '/' + nodePath);
      } else {
        const imgSrc = `/${this.imgPath}/${nodePath}.png`;
        const tagStr = `<${imgTag} ${classAttrName}="${nodeClass}" src="${imgSrc}"/>`;
        item.saveAsPng(imgSrc);
        if (hasParent) {
          // 有父级，则插入到父级的容器内
          const insertIdx = html.search(`<!-- ${parent.path()} -->`);
          html = ProjectBuilder.insertStr(html, insertIdx, tagStr);
        } else {
          // 无父级，直接拼接在后面
          html += tagStr;
        }
      }
    })
    files.forEach(item => {
      fs.writeFile(`${savePath}/${item.fileName}`, item.template);
    })
  }

  static insertStr(soure, start, newStr) {
    return soure.slice(0, start) + newStr + soure.slice(start);
  }
}

