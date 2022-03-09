/*
 * @Author: LiYu
 * @Date: 2022-03-06 23:07:51
 * @LastEditors: LiYu
 * @LastEditTime: 2022-03-09 22:40:51
 * @Description: 
 */
import { mkdir } from '@/lib/uitls';
export default function build({
  psd,
  output,
  config
}) {
  return new Promise((resolve, reject) => {

    const docPath = analysisInstance.docPath = outputPath + '/' + analysisInstance.fileName;
    const imgPath = docPath + '/img';
    mkdir(outputPath);
    mkdir(docPath);
    mkdir(imgPath);
    analysisInstance.descendants.forEach((item, index) => {
      const nodePath = item.path();
      const nodeClass = nodePath.replace(/\//g, '-');
      let { top, left, parent, width, height } = item;
      const hasParent = nodePath.includes('/');
      if (hasParent) {
        top -= parent.top;
        left -= parent.left;
      }
      analysisInstance.css += `
      .${nodeClass} {
        position: absolute;
        top: ${top}rpx;
        left: ${left}rpx;
        width: ${width}rpx;
        height: ${height}rpx;
        z-index: ${analysisInstance.layerCount - index};
      }
    `;
      if (item.hasChildren()) {
        analysisInstance.html += `
        <view class="${nodeClass}">
          <!-- ${nodePath} -->
        </view>
      `;
        mkdir(imgPath + '/' + nodePath);
      } else {
        const tagStr = `<image class="${nodeClass}" src="./img/${nodePath}.png"/>`;
        item.saveAsPng(`${imgPath}/${nodePath}.png`);
        if (hasParent) {
          const insertIdx = analysisInstance.html.search(`<!-- ${parent.path()} -->`);
          analysisInstance.html = insertStr(analysisInstance.html, insertIdx, tagStr);
        } else {
          analysisInstance.html += tagStr;
        }
      }
    })
    fs.writeFile(`${docPath}/${analysisInstance.fileName}.wxml`, analysisInstance.html);
    fs.writeFile(`${docPath}/${analysisInstance.fileName}.wxss`, analysisInstance.css);
    fs.writeFile(`${docPath}/${analysisInstance.fileName}.js`, `Page({})`);
    fs.writeFile(`${docPath}/${analysisInstance.fileName}.json`, `
    {
      "usingComponents": {}
    }
  `);
  })
}

function insertStr(soure, start, newStr) {
  return soure.slice(0, start) + newStr + soure.slice(start);
}
