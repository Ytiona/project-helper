/*
 * @Author: LiYu
 * @Date: 2022-03-06 22:58:54
 * @LastEditors: LiYu
 * @LastEditTime: 2022-03-08 21:39:50
 * @Description: 
 */

 function parsePsd(psdFilePath) {
  return PSD.open(psdFilePath).then(psd => {
    const fileSize = psd.file.data.length;
    const width = psd.header.width;
    const height = psd.header.height;
    const psdTree = psd.tree();
    const descendants = psdTree.descendants();
    const layerCount = descendants.length;
    return {
      width,
      height,
      fileSize,
      layerCount,
      psd,
    }
  })
}

export default parsePsd;