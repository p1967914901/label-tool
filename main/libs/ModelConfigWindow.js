const { BrowserWindow } = require('electron')
const path = require('path')


module.exports = class ModelConfigWindow {
    constructor(parentWindow) {
        this.Window = new BrowserWindow({
            width: 400,
            height: 200,
            x: 50,//250
            y: 100,
            // parent: parentWindow,
            // modal: true, // 拟态窗口
            resizable: false,
            zoomFactor: 1,
            autoHideMenuBar: true,
            openDevTools: true,
            title: '数据选择',
            // loadURL: '',
            webPreferences: {
                preload: path.join(__dirname, '../preload.js'),
                nodeIntegration: true
            }
        })
        this.Window.loadURL('http://localhost:3000/ModelConfigWindow')
    }
}