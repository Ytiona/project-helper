export function build(analysisInstance, {
  outputPath
}) {
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
    if(hasParent) {
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
    if(item.hasChildren()) {
      analysisInstance.html += `
        <view class="${nodeClass}">
          <!-- ${nodePath} -->
        </view>
      `;
      mkdir(imgPath + '/' + nodePath);
    } else {
      const tagStr = `<image class="${nodeClass}" src="./img/${nodePath}.png"/>`;
      item.saveAsPng(`${imgPath}/${nodePath}.png`);
      if(hasParent) {
        const insertIdx = analysisInstance.html.search(`<!-- ${parent.path()} -->`);
        analysisInstance.html = insertStr(analysisInstance.html, insertIdx, tagStr);
      } else {
        analysisInstance.html += tagStr;
      }
    }
  })
  fs.writeFile(`${docPath}/${analysisInstance.fileName}.wxml`, analysisInstance.html, err => {});
  fs.writeFile(`${docPath}/${analysisInstance.fileName}.wxss`, analysisInstance.css, err => {});
  fs.writeFile(`${docPath}/${analysisInstance.fileName}.js`, `Page({})`, err => {});
  fs.writeFile(`${docPath}/${analysisInstance.fileName}.json`, `
    {
      "usingComponents": {}
    }
  `, err => {});
}

function insertStr(soure, start, newStr){   
  return soure.slice(0, start) + newStr + soure.slice(start);
}
