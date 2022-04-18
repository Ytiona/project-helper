/*
 * @Author: LiYu
 * @Date: 2022-03-06 23:13:52
 * @LastEditors: LiYu
 * @LastEditTime: 2022-03-17 22:22:39
 * @Description: 
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const { URL } = require('url');

const exts = ['.jpg', '.png'];
const max = 5200000; // 5MB

const requestOptions = {
  method: 'POST',
  hostname: 'tinypng.com',
  path: '/web/shrink',
  headers: {
    rejectUnauthorized: false,
    'Postman-Token': Date.now(),
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36'
  }
};

function tinyCompress(imgPath) {
  return new Promise((resolve, reject) => {
    fs.stat(imgPath, (err, stats) => {
      if (err) return reject(err);
      if (
        // 必须是文件，小于5MB，后缀 jpg||png
        stats.size <= max &&
        stats.isFile() &&
        exts.includes(path.extname(imgPath))
      ) {
        return compressRequest(imgPath).then(resolve, reject);
      }
      return reject('File error');
    });
  })
}

// 压缩请求
function compressRequest(imgPath) {
  return new Promise((resolve, reject) => {
    // 通过 X-Forwarded-For 头部伪造客户端IP
    requestOptions.headers['X-Forwarded-For'] = getRandomIP();
    const req = https.request(requestOptions, res => {
      res.on('data', buf => {
        const obj = JSON.parse(buf.toString());
        if (obj.error) {
          return reject(obj);
        }
        return updateFile(imgPath, obj).then(resolve, reject);
      });
    })

    req.write(fs.readFileSync(imgPath), 'binary');
    req.on('error', e => {
      console.error(e);
    });
    req.end();
  })
}

// 更新文件
function updateFile(imgpath, obj) {
  return new Promise((resolve, reject) => {
    const options = new URL(obj.output.url);
    const req = https.request(options, res => {
      let body = '';
      res.setEncoding('binary');
      res.on('data', function(data) {
        body += data;
      });
      res.on('end', function() {
        fs.writeFile(imgpath, body, 'binary', err => {
          if (err) return reject(err);
          return resolve(obj);
        });
      });
    });
    req.on('error', e => {
      console.error(e);
    });
    req.end();
  })
}

// 生成随机IP， 赋值给 X-Forwarded-For
function getRandomIP() {
  return Array.from(Array(4)).map(() => parseInt(Math.random() * 255)).join('.')
}

export default tinyCompress;