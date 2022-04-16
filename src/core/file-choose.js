/*
 * @Author: LiYu
 * @Date: 2022-03-06 22:59:47
 * @LastEditors: LiYu
 * @LastEditTime: 2022-03-08 22:15:38
 * @Description: 
 */
import { ref } from 'vue';

const remote = require('@electron/remote');

function useFileChoose({
  filters,
  repeatable = false
}) {
  if(!Array.isArray(filters)) {
    throw new Error('Filters只能为数组');
  }

  const uniqueFilePaths = new Set();
  const fileList = ref([]);

  function chooseFile() {
    return choose(false, false);
  }
  function chooseFiles() {
    return choose(false, true);
  }
  function chooseFolder() {
    return choose(true, false);
  }

  function choose(openDirectory = false, multiSelections = true) {
    return remote.dialog.showOpenDialog({
      properties: [
        openDirectory ? 'openDirectory' : 'openFile',
        multiSelections ? 'multiSelections' : null
      ].filter(item => item),
      filters: filters
    }).then(({ canceled, filePaths }) => {
      if(!canceled) {
        fileList.value = fileList.value.concat(
          repeatable ? filePaths : filePaths.filter(item => {
            const result = !uniqueFilePaths.has(item);
            uniqueFilePaths.add(item);
            return result;
          })
        );
        return fileList.value;
      } else {
        return Promise.reject({ errMsg: 'canceled' });
      }
    })
  }

  function removeFile({
    filePath,
    index
  } = {}) {
    if(typeof index !== 'number') {
      if(typeof filePath !== 'string') {
        throw new Error('必须传入filePath或index');
      }
      index = fileList.value.findIndex(item => item === filePath);
    }
    if(index < 0 || index >= fileList.value.length) {
      throw new Error('Delete target does not exist');
    }
    uniqueFilePaths.delete(fileList.value[index]);
    fileList.value.splice(index, 1);
    return fileList.value;
  }

  function clear() {
    uniqueFilePaths.clear();
    return fileList.value = [];
  }

  return {
    fileList,
    chooseFile,
    chooseFiles,
    chooseFolder,
    removeFile,
    clear,
  }
}

export default useFileChoose;