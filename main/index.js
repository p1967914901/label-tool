// Modules to control application life and create native browser window
const {app, BrowserWindow, globalShortcut } = require('electron')
const path = require('path')
const url = require('url');
const { registProviderWindow, unRegistProviderWindow } = require('electron-wpc');
// const { electron } = require('process')
const {newIpcListener} = require('./ipcMain')

const mainTAG = 'MAIN_WIN';


function createWindow () {
    // const { Menu } = electron
    // Menu.setApplicationMenu(null)
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1100,
        height: 700,
        x: 50,//250
        y: 100,
        resizable: false,
        zoomFactor: 1,
        openDevTools: false,
        autoHideMenuBar: true,
        // frame:false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            // webSecurity: false
        }
    })

    // and load the index.html of the app.
    // mainWindow.loadFile(path.join(__dirname, '/build/index.html'))
    // mainWindow.loadURL(`file://${path.join(__dirname, '/build/index.html')}`)
    // mainWindow.loadURL(url.format({
    //     pathname: path.join(__dirname, '/build/index.html'),
    //     protocol: 'file:',
    //     slashes: true
    //     }))
    mainWindow.loadURL('http://localhost:3000/');


    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
    return mainWindow;
}

app.allowRendererProcessReuse = true;

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
var mainWindow;
app.whenReady().then(() =>{
    // console.log('qpp---whenready');
    mainWindow = createWindow();
    registProviderWindow(mainWindow, mainTAG);
    /**
     * 打开导航栏字典发出广播
     */
    // registBrodcastTransfer("OPEN_DICTIONARY_BROADCAST", (resolve, reject, args) => {
    //     console.log(args);
    //     resolve(args);
    // });
    newIpcListener(mainWindow)
    // 注册事件，打开控制台
    globalShortcut.register('Alt+Z', () => {
        // console.log('Electron loves global shortcuts!')
        mainWindow.webContents.openDevTools()
    })
    globalShortcut.register('Alt+q', () => {
        // console.log('Electron loves global shortcuts!')
        mainWindow.setBounds({
            x: 50,
            y: 100,
            width: 1100,
            height: 700,
        })
    })
    //...销毁
    mainWindow.on('close',()=>{
        unRegistProviderWindow(mainTAG); 
    })
    // setTimeout(() => {
    //     mainWindow.minimize()
    // }, 3000)
    // handleIPC()
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    // console.log('window-all-closed');
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})



// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
