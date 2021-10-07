const { ipcMain, dialog } = require('electron')
const fs = require('fs')

const {
    UPLOADDICTIONARYDATA,
    RETURNDICTIONARYDATA,
    SAVEDICTIONARYDATA,
    UPLOADTEXTSDATA,
    RETURNTEXTSDATA,
    SAVE_DICTIONARY_DATA_RESULT,
    SAVE_TEXTS_DATA,
    SAVE_TEXTS_DATA_RESULT,
    OPEN_MODEL_CONFIG_WINDOW
} = require('./action')


exports.newIpcListener = (mainWindow) => {
    /**
     * 上传字典数据
     */
    ipcMain.on(UPLOADDICTIONARYDATA, (event) => {
        // console.log('object');
        const openFilePromise = dialog.showOpenDialog({
            title: '上传字典数据',
            defaultPath: __dirname + '/data',
            filters: [
                {
                    name: 'json', extensions: ['json']
                }
            ],
            properties: ['openFile']
        })
        openFilePromise.then((res) => {
            if (!res.canceled) {
                return new Promise((resolve, reject) => {
                    fs.readFile(res.filePaths[0], 'utf-8', (err, data) => {
                        if (err) {
                            reject(err)
                        }
                        resolve(data)
                    })
                })
            }
        }).then(data => {
            // console.log(data.toString())
            event.reply(RETURNDICTIONARYDATA, JSON.parse(data.toString()))
        })
    })
    /**
     * 保存字典数据
     */
    ipcMain.on(SAVEDICTIONARYDATA, (event, data) => {
        // console.log(data);
        const saveFilePromise = dialog.showSaveDialog({
            title: '保存字典数据',
            defaultPath: __dirname + '/data' + '/dict.json',
            filters: [
                {
                    name: 'json', extensions: ['json']
                }
            ],
            properties: ['dontAddToRecent']
        })
        saveFilePromise.then((res) => {
            if (!res.canceled) {
                // console.log(res)
                return new Promise((resolve, reject) => {
                    fs.writeFile(res.filePath, JSON.stringify(data), 'utf8', (err) => {
                        if (!err) {
                            resolve('success')
                        }
                        reject('fail')
                    })
                })
            } else {
                return new Promise((resolve, reject) => {
                    resolve('cancel')
                })
            }
        }).then(result => {
            // console.log(data)
            event.reply(SAVE_DICTIONARY_DATA_RESULT, result)
        })
    })
    /**
     * 上传语料数据
     */
    ipcMain.on(UPLOADTEXTSDATA, (event) => {
        console.log('object');
        const openFilePromise = dialog.showOpenDialog({
            title: '上传语料数据',
            defaultPath: __dirname + '/data',
            filters: [
                {
                    name: 'json', extensions: ['json']
                }
            ],
            properties: ['openFile']
        })
        openFilePromise.then((res) => {
            if (!res.canceled) {
                return new Promise((resolve, reject) => {
                    fs.readFile(res.filePaths[0], 'utf-8', (err, data) => {
                        if (err) {
                            reject(err)
                        }
                        resolve(data)
                    })
                })
            }
        }).then(data => {
            // console.log(data.toString())
            event.reply(RETURNTEXTSDATA, JSON.parse(data.toString()))
        })
    })

    /**
     * 保存语料数据
     */
    ipcMain.on(SAVE_TEXTS_DATA, (event, data) => {
        // console.log(data);
        const saveFilePromise = dialog.showSaveDialog({
            title: '保存语料数据',
            defaultPath: __dirname + '/data' + '/texts.json',
            filters: [
                {
                    name: 'json', extensions: ['json']
                }
            ],
            properties: ['dontAddToRecent']
        })
        saveFilePromise.then((res) => {
            if (!res.canceled) {
                // console.log(res)
                return new Promise((resolve, reject) => {
                    fs.writeFile(res.filePath, JSON.stringify(data), 'utf8', (err) => {
                        if (!err) {
                            resolve('success')
                        }
                        reject('fail')
                    })
                })
            } else {
                return new Promise((resolve, reject) => {
                    resolve('cancel')
                })
            }
        }).then(result => {
            // console.log(data)
            event.reply(SAVE_TEXTS_DATA_RESULT, result)
        })
    })

    ipcMain.on(OPEN_MODEL_CONFIG_WINDOW, (event, data) => {
        
    })
}
