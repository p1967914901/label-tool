const { ipcMain, dialog } = require('electron')
const fs = require('fs')
// const xlsx = require('node-xlsx');
const spawn = require("child_process").spawn;
// const child_process = require('child_process');

const {
    UPLOAD_DICTIONARY_DATA,
    SAVE_DICTIONARY_DATA,
    UPLOAD_TEXTS_DATA,
    SAVE_TEXTS_DATA,
    IDENTIFY_ENTITY,
    IDENTIFY_ENTITY_RESULT,
} = require('./action')
const DictionaryWindow = require('./libs/DictionaryWindow')
const TextWindow = require('./libs/TextWindow')
const ModelConfigWindow = require('./libs/ModelConfigWindow')


exports.newIpcListener = (mainWindow) => {
    /**
     * 上传字典数据
     */
    ipcMain.on(UPLOAD_DICTIONARY_DATA, (event) => {
        // console.log('object');
        const openFilePromise = dialog.showOpenDialog({
            title: '上传字典数据',
            defaultPath: __dirname + '/data',
            filters: [
                {
                    name: 'xls', extensions: ['xls', 'xlsx']
                }
            ],
            properties: ['openFile']
        })
        openFilePromise.then((res) => {
            if (!res.canceled) {
                event.returnValue = res.filePaths[0]
            }
            event.returnValue = ''
        })
    })
    /**
     * 保存字典数据
     */
    ipcMain.on(SAVE_DICTIONARY_DATA, (event) => {
        // console.log(data);
        const saveFilePromise = dialog.showSaveDialog({
            title: '保存字典数据',
            defaultPath: __dirname + '/data' + '/dict.xls',
            filters: [
                {
                    name: 'xls', extensions: ['xls', 'xlsx']
                }
            ],
            properties: ['dontAddToRecent']
        })
        saveFilePromise.then((res) => {
            if (!res.canceled) {
                event.returnValue = {
                    message: 'success',
                    path: res.filePath
                }
            } else {
                event.returnValue = {
                    message: 'cancel',
                    path: ''
                }
            }
        })
    })
    /**
     * 上传语料数据
     */
    ipcMain.on(UPLOAD_TEXTS_DATA, (event) => {
        // console.log('object');
        const openFilePromise = dialog.showOpenDialog({
            title: '上传语料数据',
            defaultPath: __dirname + '/data',
            filters: [
                {
                    name: 'txt', extensions: ['txt']
                }
            ],
            properties: ['openFile']
        })
        openFilePromise.then((res) => {
            if (!res.canceled) {
                event.returnValue = res.filePaths[0]
            }
            event.returnValue = ''
        })
    })

    /**
     * 保存语料数据
     */
    ipcMain.on(SAVE_TEXTS_DATA, (event) => {
        // console.log(data);
        const saveFilePromise = dialog.showSaveDialog({
            title: '保存语料数据',
            defaultPath: __dirname + '/data' + '/texts.txt',
            filters: [
                {
                    name: 'txt', extensions: ['txt']
                }
            ],
            properties: ['dontAddToRecent']
        })
        saveFilePromise.then((res) => {
            if (!res.canceled) {
                event.returnValue = {
                    message: 'success',
                    path: res.filePath
                }
            } else {
                event.returnValue = {
                    message: 'cancel',
                    path: ''
                }
            }
        })
    })
    /**
     * 识别实体
     */
    ipcMain.on(IDENTIFY_ENTITY, (event, data, labelToColor) => {
        // console.log(labelToColor)
        const writeFilePromise = new Promise((resolve, reject) => {
            fs.writeFile(__dirname + '/data/data.json', JSON.stringify(data), err => {
                if (err) {
                    reject(err)
                }
                // console.log('success')
                resolve(__dirname + '/data/data.json')
            })
        })
        writeFilePromise.then((path) => {//__dirname + '/tools/data.json'
            const result = spawn(__dirname + '/tools/jiagu_train_model.exe', [path]);
            result.on('close', function (code) {
                console.log('child process exited with code :' + code);
            });
            result.stdout.on('data', message => {
                // console.log( 'aaa' + message.toString() + 'aaa')
                if (message.toString().substring(0, 7) === 'success') {
                    fs.readFile(__dirname + '/tools/result.json', (err, fileData) => {
                        if (err) {
                            return console.log(err)
                        }
                        const data = JSON.parse(fileData.toString()).map(value => {
                            returnValue = {
                                text: value['text'],
                                textArr: value['text'].split('').map((v, index) => ({
                                    text: v,
                                    start: index,
                                    end: index,
                                    label: 'none',
                                    color: '',
                                }))
                            }
                            for(let i = value['labels'].length - 1; i >= 0; i--) {
                                const { start, end, label } = value['labels'][i]
                                returnValue['textArr'].splice(start, end - start)
                                returnValue['textArr'].splice(start, 0, {
                                    text: value['text'].slice(start, end),
                                    start,
                                    end: end - 1,
                                    label,
                                    color: labelToColor[label]
                                })
                            }
                            return returnValue
                        })

                        event.reply(IDENTIFY_ENTITY_RESULT, data)
                    })
                    // console.log(message.toString())
                }
            });
            result.stderr.on('data', function (data) {
                console.log('stderr: ' + data);
            });
        }).catch(err => {
            console.log('写入文件失败', err)
        }) 
        
    })
}
