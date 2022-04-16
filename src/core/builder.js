/*
 * @Author: LiYu
 * @Date: 2022-03-07 23:27:25
 * @LastEditors: LiYu
 * @LastEditTime: 2022-03-17 21:13:12
 * @Description: 
 */
import { mkdirSync } from '@/lib/utils';
const fs = require('fs');

class ProjectBuilder {
  items = [];
  output = '';
  config = {};
  imgPath = '';
  pagePath = '';
  componentPath = '';
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
    return Promise.allSettled([
      // 2.构建路由目录及文件
      this.createRouter(),
      // 3.构建psd
      this.buildPsds()
    ])
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
    mkdirSync(this.output);
    mkdirSync(this.imgPath);
    mkdirSync(this.pagePath);
    mkdirSync(this.componentPath);
  }

  createRouter() {
    return new Promise((resolve, reject) => {
      const { routerPath, routerTemplate, pagePath } = this.config;
      const pages = this.items
        .filter(item => item.type === 'page')
        .map(item => ({ name: item.name, title: item.fileName }));

      const replaceReg = /(?<=#start)[\d\D]*(?=#end)/g;

      const replaceMatchRes = routerTemplate.match(replaceReg);
      if(!replaceMatchRes) return;
      
      const replaceStr = replaceMatchRes[0];

      const generateStr = pages.reduce((whole, cur) => {
        const str = replaceStr
          .replace(/#name/g, cur.name)
          .replace(/#title/g, cur.title);
        return whole + str;
      }, '')

      const result = routerTemplate.replace(/(#start)[\d\D]*(#end)/g, generateStr).replace(/#pagePath/g, pagePath);
      fs.writeFile(`${this.output}/${routerPath}`, result, err => {
        if(err) {
          reject(err);
        }
        resolve();
      });
    })
  }

  buildPsds() {
    let queue = Promise.resolve();
    this.items.forEach(item => {
      queue = queue.then(() => this.buildPsd(item));
    })
    return queue;
  }

  async buildPsd({
    type,
    name,
    parsedPsd
  }) {
    const {
      // scale,
      // width,
      unit,
      containerTag,
      imgTag,
      classAttrName,
      selector,
      files
    } = this.config;
    let savePath;

    if(type === 'comp') {
      savePath = `${this.componentPath}/${name}`;
    } else {
      savePath = `${this.pagePath}/${name}`;
    }

    mkdirSync(savePath);
    mkdirSync(`${this.imgPath}/${name}`);
    
    const descendants = parsedPsd.psd.tree().descendants();
    let html = '',
        css = '';
    const savePngTasks = [];
    descendants.forEach((item, index) => {
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
          z-index: ${parsedPsd.layerCount - index};
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
        mkdirSync(`${this.imgPath}/${name}/${nodePath}`);
      } else {
        const imgSrc = `${this.imgPath}/${name}/${nodePath}.png`;
        const tagStr = `<${imgTag} ${classAttrName}="${nodeClass}" src="${imgSrc}"/>`;
        // item.saveAsPng(imgSrc);
        savePngTasks.push({
          layer: item,
          savePath: imgSrc
        });
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
      const content = (item.template || '').replace(/#css/g, css)
        .replace(/#html/g, html);
      const fileName = item.fileName.replace(/#name/g, name);
      fs.writeFile(`${savePath}/${fileName}`, content, err => {
        if(err) {
          console.error(err);
        }
      });
    })
    // 串行方式执行生成图片，并且放到最后
    let queue = Promise.resolve();
    savePngTasks.forEach(item => {
      queue = queue.then(() => {
        return item.layer.saveAsPng(item.savePath);
      });
    })
    return queue;
  }

  static insertStr(soure, start, newStr) {
    return soure.slice(0, start) + newStr + soure.slice(start);
  }
}


const projectBuilder = new ProjectBuilder({
  items: psdItems,
  output: outputPath.value,
  config: currentBuildConfig
})

// 构建最外层文件夹：output、imgPath、pagePath、componentPath
// 构建路由配置：createRouter
// 构建页面外层：html+css路径、图片路径
// html、css写入文件
// 图片树：构建文件夹、生成png

projectBuilder.build().then(res => {
  res = [
    {
      name: 'home',
      info: {
        width,
        height,
        fileSize,
        layerCount,
        psd,
      },
      promise: Promise.resolve(),
      imgs: [
        {
          path: '/xxx/xx',
          promise: Promise.resolve(),
        }
      ]
    }
  ]
})

export default ProjectBuilder;
