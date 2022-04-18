/*
 * @Author: LiYu
 * @Date: 2022-02-27 21:55:03
 * @LastEditors: LiYu
 * @LastEditTime: 2022-03-17 22:17:16
 * @Description: 
 */
const path = require('path');
const fs = require('fs');


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

export function getFiles(folder, exts) {
  return new Promise((resolve, reject) => {
    const result = [];
    function readdir(dir) {
      fs.readdir(dir, (err, files) => {
        if (err) return reject(err);
        files.forEach(file => {
          const fullPath = path.join(dir, file);
          const stat = fs.statSync(fullPath);
          if(stat.isDirectory()) {
            return readdir(fullPath);
          }
          const valid = Array.isArray(exts) ? exts.includes(path.extname(file)) : true;
          if(valid) {
            result.push(path.join(dir, file));
          }
        })
      });
    }
    readdir(folder);
  })
}

export function handleSize(size) {
  if(typeof(size) !== 'number') return '';
  if(size >= 1024 ** 3) {
    return `${(size / 1024 ** 3).toFixed(1)}Gb`;
  }
  if(size >= 1024 ** 2) {
    return `${(size / 1024 ** 2).toFixed(1)}Mb`;
  }
  if(size >= 1024) {
    return `${(size / 1024).toFixed(1)}Kb`;
  }
  return `${size.toFixed(1)}B`;
}

export function pascalcase(str) {
  str = str[0].toUpperCase() + str.substr(1);
  return str.replace(/(-[a-z])|(_[a-z])/g, $1 => $1[1].toUpperCase());
}

