const path = require('path');

export default class Analysis {
  constructor({
    filePath
  }) {
    const extension = path.extname(filePath);
    this.fileName = path.basename(filePath, extension);
    this.psd = PSD.fromFile(filePath);  // file为psd文档的存储路径
    this.fileSize = this.psd.file.data.length;
    this.psd.parse();
    this.width = this.psd.header.width;
    this.height = this.psd.header.height;
    this.psdTree = this.psd.tree();
    this.html = '';
    this.css = '';
    this.descendants = this.psdTree.descendants();
    this.layerCount = this.descendants.length;
  }
}

