/*
 * @Author: LiYu
 * @Date: 2022-03-06 22:59:47
 * @LastEditors: LiYu
 * @LastEditTime: 2022-03-07 23:05:12
 * @Description: 
 */
const remote = require('@electron/remote');
export default class FileChoose {
  fileList = [];
  filters = [];
  uniqueFilePaths = new Set();
  constructor({
    filters,
    repeatable = false
  }) {
    if(!Array.isArray(filters)) {
      throw new Error('Filters只能为数组');
    }
    this.filters = filters;
    this.repeatable = repeatable;
  }

  chooseFile() {
    return this.choose(false, false);
  }

  chooseFiles() {
    return this.choose(false, true);
  }

  chooseFolder() {
    return this.choose(true, false);
  }

  choose(openDirectory = false, multiSelections = true) {
    return new Promise((resolve, reject) => {
      remote.dialog.showOpenDialog({
        properties: [
          openDirectory ? 'openDirectory' : 'openFile',
          multiSelections ? 'multiSelections' : null
        ].filter(item => item),
        filters: this.filters
      }).then(({ canceled, filePaths }) => {
        if(!canceled) {
          this.fileList = this.fileList.concat(
            this.repeatable ? 
              filePaths : 
              filePaths.filter(item => !this.uniqueFilePaths.has(item))
          );
          resolve(this.fileList);
        } else {
          reject({ errMsg: 'canceled' });
        }
      }, reject)
    })
  }

  
  addFiles(files) {
    if(!Array.isArray(files) && typeof files !== 'string') {
      throw new Error('files只能为字符串数组或字符串');
    }
    return this.fileList = this.fileList.concat(files);
  }

  removeFile({
    filePath,
    index
  } = {}) {
    if(typeof index !== 'number') {
      if(typeof filePath !== 'string') {
        throw new Error('必须传入filePath或index');
      }
      index = this.fileList.findIndex(item => item === filePath);
    }
    if(index < 0 || index >= this.fileList.length) {
      throw new Error('Delete target does not exist');
    }
    this.uniqueFilePaths.delete(this.fileList[index]);
    this.fileList.splice(index, 1);
    return this.fileList;
  }

  
  clear() {
    this.uniqueFilePaths.clear();
    return this.fileList = [];
  }
}
