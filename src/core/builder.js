/*
 * @Author: LiYu
 * @Date: 2022-03-07 23:27:25
 * @LastEditors: LiYu
 * @LastEditTime: 2022-03-17 21:13:12
 * @Description: 
 */
import { mkdirSync, pascalcase } from '@/lib/utils';
import { commonKeys, pageKeys, routerKeys } from '@/constants/compiler';

const fs = require('fs');
const path = require('path');

const cmk = commonKeys;
const pgk = pageKeys;
const rtk = routerKeys;

class ProjectBuilder {
  items = [];
  output = '';
  config = {};
  imgPath = '';
  pagePath = '';
  routerPath = '';
  componentPath = '';
  constructor({
    items,
    output,
    config
  }) {
    this.items = items;
    this.output = output.replaceAll('\\', '/');
    this.config = config;
  }

  build() {
    // 创建图片、页面、组件根目录
    this.makeRootDir();
    // 构建路由目录及文件
    const routerTask = this.makeRouter();
    // 构建psd
    const psdTasks = this.buildPsds();

    const allTask = Promise.allSettled([
      routerTask,
      ...psdTasks.reduce((set, cur) => {
        return set.concat([
          ...cur.fileTasks.map(item => item.promise),
          ...cur.imgTasks.map(item => item.promise)
        ])
      }, [])
    ])

    return {
      routerTask,
      psdTasks,
      allTask
    }
  }

  makeRootDir() {
    const {
      imgPath,
      pagePath,
      routerPath,
      componentPath
    } = this.config;
    this.imgPath = path.join(this.output, `/${imgPath}`).replaceAll('\\', '/');
    this.pagePath = path.join(this.output, `/${pagePath}`).replaceAll('\\', '/');
    this.routerPath = path.dirname(path.join(this.output, `/${routerPath}`)).replaceAll('\\', '/');
    this.componentPath = path.join(this.output, `/${componentPath}`).replaceAll('\\', '/');
    mkdirSync(this.output);
    mkdirSync(this.imgPath);
    mkdirSync(this.pagePath);
    mkdirSync(this.routerPath);
    mkdirSync(this.componentPath);
  }

  makeRouter() {
    return new Promise((resolve, reject) => {
      const { routerPath, routerTemplate, pagePath } = this.config;
      const pages = this.items
        .filter(item => item.type === 'page')
        .map(item => ({ name: item.name, title: item.fileName }));

      const replaceReg = new RegExp(`(?<=${rtk.start})[\\d\\D]*(?=${rtk.end})`, 'g');

      const replaceMatchRes = routerTemplate.match(replaceReg);
      if(!replaceMatchRes) return;
      
      const replaceStr = replaceMatchRes[0];

      const generateStr = pages.reduce((whole, cur) => {
        const str = replaceStr
          .replaceAll(cmk.name, cur.name)
          .replaceAll(cmk.name__pascal, pascalcase(cur.name))
          .replaceAll(cmk.title, cur.title);
        return `${whole}${str},`;
      }, '').slice(0, -1)
      
      const resReplaceReg = new RegExp(`(${rtk.start})[\\d\\D]*(${rtk.end})`);
      const result = routerTemplate.replace(resReplaceReg, generateStr)
        .replaceAll(rtk.pagePath, pagePath);

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
    } = this.analysisPsd(parsedPsd, name);

    const fileTasks = files.map(item => {
      // 替换name关键字
      const namePascal = pascalcase(name);
      const fileName = item.fileName.replaceAll(cmk.name, name).replaceAll(cmk.name__pascal, namePascal);
      const promise = new Promise((resolve, reject) => {
        // 替换css、html关键字
        const content = (item.template || '')
          .replaceAll(cmk.name, name)
          .replaceAll(cmk.name__pascal, namePascal)
          .replaceAll(pgk.css, css)
          .replaceAll(pgk.html, html);

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
        promise,
      }
    })
    
    const imgTasks = images.map(item => {
      return {
        savePath: item.savePath,
        // todo 并发很卡
        promise: new Promise((resolve, reject) => {
          item.layer.saveAsPng(item.savePath)
            .then(resolve)
            .catch(reject)
        })
      }
    })

    return {
      name,
      parsedPsd,
      fileTasks,
      imgTasks
    }
  }

  analysisPsd(parsedPsd, name) {
    const { psd, layerCount } = parsedPsd;
    const {
      // scale,
      // width,
      unit,
      containerTag,
      imgTag,
      classAttrName,
      selector,
    } = this.config;
    const descendants = psd.tree().descendants();
    let html = '',
        css = '';
    const images = [];
    descendants.forEach((item, index) => {
      const nodePath = item.path();
      const nodeClass = nodePath.replaceAll('/', '-');
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
          z-index: ${layerCount - index};
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
        const savePath = `${this.imgPath}/${name}/${nodePath}.png`;
        const imgSrc = `../../${this.config.imgPath}/${name}/${nodePath}.png`;
        const tagStr = `<${imgTag} ${classAttrName}="${nodeClass}" src="${imgSrc}"/>`;
        images.push({
          savePath,
          layer: item,
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

    // 去掉父节点占位注释
    html = html.replace(/<!--.*-->/g, '');

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
