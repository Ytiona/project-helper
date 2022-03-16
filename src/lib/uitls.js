/*
 * @Author: LiYu
 * @Date: 2022-02-27 21:55:03
 * @LastEditors: LiYu
 * @LastEditTime: 2022-03-13 13:11:24
 * @Description: 
 */
import storage from './local-storage';
const path = require('path');
const fs = require('fs');

window.utils = {
  localStorage: storage
}

export function getFileName(filePath) {
  return path.basename(filePath, path.extname(filePath));
}

export function mkdir(path) {
  return new Promise((resolve, reject) => {
    fs.exists(path, e => {
      if(e) return resolve();
      fs.mkdir(path, {}, err => {
        if(err) return reject(err);
        return resolve();
      })
    })
  })
}

export function mkdirSync(path) {
  if(!fs.existsSync(path)){
    fs.mkdirSync(path);            
  }
}

export function walkSync(currentDirPath, callback) {
  fs.readdirSync(currentDirPath).forEach(function (name) {
    const filePath = path.join(currentDirPath, name);
    const stat = fs.statSync(filePath);
    if (stat.isFile()) {
      callback(filePath, stat);
    } else if (stat.isDirectory()) {
      walkSync(filePath, callback);
    }
  });
}