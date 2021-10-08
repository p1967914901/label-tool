const { BrowserWindow } = require('electron')
const path = require('path')


module.exports = class DictionaryWindow {
    constructor(parentWindow, initDataPath) {
        this.Window = new BrowserWindow({
            width: 800,
            height: 500,
            x: 150,//250
            y: 100,
            // parent: parentWindow,
            // modal: true, // 拟态窗口
            resizable: false,
            zoomFactor: 1,
            autoHideMenuBar: true,
            openDevTools: true,
            // title: '字典数据',
            // loadURL: '',
            webPreferences: {
                preload: path.join(__dirname, '../preload.js'),
                nodeIntegration: true,
                // enableRemoteModule: true
            }

        })
        this.Window.loadURL('http://localhost:3000/DictionaryWindow/' + initDataPath)
        // this.Window.setTitle('字典数据')
        // console.log('initDataPath: ', initDataPath)
    }
}