const { app, BrowserWindow, Menu, ipcMain } = require('electron');

const reloader = require('electron-reloader');
reloader(module);

require('@electron/remote/main').initialize();

let mainWindow;
// Menu.setApplicationMenu(null);
function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 800,
    minWidth: 1200,
    minHeight: 700,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
      preload: __dirname + '/preload.js'
    }
  })
  mainWindow.webContents.openDevTools();
  mainWindow.loadURL('http://localhost:3000/');

  require("@electron/remote/main").enable(mainWindow.webContents);


  mainWindow.on('maximize', () => {
    mainWindow.webContents.send('maximize');
  })
  mainWindow.on('unmaximize', () => {
    mainWindow.webContents.send('unmaximize');
  })
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('min', () => {
  mainWindow.minimize();
})

ipcMain.on('max', () => {
  if (mainWindow.isMaximized()) {
    // 判断 窗口是否已最大化
    mainWindow.restore();
  } else {
    mainWindow.maximize();
  }
})

ipcMain.on('restore', () => {
  mainWindow.restore();
})

ipcMain.on('close', () => {
  mainWindow.close();
})


process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'