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
    // 创建图片、页面、组件根目录
    this.makeRootDir();
    // 构建路由目录及文件
    const routerTask = this.makeRouter();
    // 构建psd
    const psdTasks = this.buildPsds();
    return {
      routerTask,
      psdTasks
    }
  }

  makeRootDir() {
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

  makeRouter() {
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
    const psdTasks = [];
    this.items.forEach(item => {
      const psdTask = this.buildPsd(item);
      psdTasks.push(psdTask);
    })
    return psdTasks;
  }

  buildPsd({
    type,
    name,
    parsedPsd
  }) {

    const { files } = this.config;
    let savePath;

    if(type === 'comp') {
      savePath = `${this.componentPath}/${name}`;
    } else {
      savePath = `${this.pagePath}/${name}`;
    }

    mkdirSync(savePath);
    mkdirSync(`${this.imgPath}/${name}`);
    
    const {
      html,
      css,
      images
    } = this.analysisPsd(parsedPsd.psd);

    const fileTasks = files.map(item => {
      // 替换name关键字
      const fileName = item.fileName.replace(/#name/g, name);
      const promsie = new Promise((resolve, reject) => {
        // 替换css、html关键字
        const content = (item.template || '')
          .replace(/#css/g, css)
          .replace(/#html/g, html);

        // 写入文件
        fs.writeFile(`${savePath}/${fileName}`, content, err => {
          if(err) {
            console.error(err);
            return reject(err);
          }
          return resolve();
        });
      })
      return {
        fileName,
        promsie,
      }
    })

    const imgTasks = images.map(item => {
      return {
        savePath: item.savePath,
        // todo 并发很卡
        promise: item.layer.saveAsPng(item.savePath)
      }
    })

    return {
      name,
      parsedPsd,
      fileTasks,
      imgTasks
    }
  }

  analysisPsd(psd) {
    const {
      // scale,
      // width,
      unit,
      containerTag,
      imgTag,
      classAttrName,
      selector
    } = this.config;
    const descendants = psd.tree().descendants();
    let html = '',
        css = '';
    const images = [];
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
        mkdirSync(`${this.imgPath}/${name}/${nodePath}`);
      } else {
        const imgSrc = `${this.imgPath}/${name}/${nodePath}.png`;
        const tagStr = `<${imgTag} ${classAttrName}="${nodeClass}" src="${imgSrc}"/>`;
        images.push({
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

    return {
      html,
      css,
      images
    }
  } 

  static insertStr(soure, start, newStr) {
    return soure.slice(0, start) + newStr + soure.slice(start);
  }
}

export default ProjectBuilder;
