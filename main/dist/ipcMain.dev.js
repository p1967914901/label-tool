"use strict";

var _require = require('electron'),
    ipcMain = _require.ipcMain,
    dialog = _require.dialog;

var fs = require('fs');

var xlsx = require('node-xlsx'); // const spawn = require("child_process").spawn;
// const child_process = require('child_process');


var _require2 = require('./action'),
    UPLOAD_DICTIONARY_DATA = _require2.UPLOAD_DICTIONARY_DATA,
    RETURN_DICTIONARY_DATA = _require2.RETURN_DICTIONARY_DATA,
    SAVE_DICTIONARY_DATA = _require2.SAVE_DICTIONARY_DATA,
    UPLOAD_TEXTS_DATA = _require2.UPLOAD_TEXTS_DATA,
    RETURNTEXTSDATA = _require2.RETURNTEXTSDATA,
    SAVE_DICTIONARY_DATA_RESULT = _require2.SAVE_DICTIONARY_DATA_RESULT,
    SAVE_TEXTS_DATA = _require2.SAVE_TEXTS_DATA,
    SAVE_TEXTS_DATA_RESULT = _require2.SAVE_TEXTS_DATA_RESULT,
    OPEN_MODEL_CONFIG_WINDOW = _require2.OPEN_MODEL_CONFIG_WINDOW,
    OPEN_DICTIONARY_WINDOW = _require2.OPEN_DICTIONARY_WINDOW,
    OPEN_TEXT_WINDOW = _require2.OPEN_TEXT_WINDOW;

var DictionaryWindow = require('./libs/DictionaryWindow');

var TextWindow = require('./libs/TextWindow');

var ModelConfigWindow = require('./libs/ModelConfigWindow');

exports.newIpcListener = function (mainWindow) {
  /**
   * 上传字典数据
   */
  ipcMain.on(UPLOAD_DICTIONARY_DATA, function (event) {
    // console.log('object');
    var openFilePromise = dialog.showOpenDialog({
      title: '上传字典数据',
      defaultPath: __dirname + '/data',
      filters: [{
        name: 'xls',
        extensions: ['xls', 'xlsx']
      }],
      properties: ['openFile']
    });
    openFilePromise.then(function (res) {
      if (!res.canceled) {
        event.returnValue = res.filePaths[0];
      }

      event.returnValue = '';
    });
  });
  /**
   * 保存字典数据
   */

  ipcMain.on(SAVE_DICTIONARY_DATA, function (event) {
    // console.log(data);
    var saveFilePromise = dialog.showSaveDialog({
      title: '保存字典数据',
      defaultPath: __dirname + '/data' + '/dict.xls',
      filters: [{
        name: 'xls',
        extensions: ['xls', 'xlsx']
      }],
      properties: ['dontAddToRecent']
    });
    saveFilePromise.then(function (res) {
      if (!res.canceled) {
        event.returnValue = {
          message: 'success',
          path: res.filePath
        };
      } else {
        event.returnValue = {
          message: 'cancel',
          path: ''
        };
      }
    });
  });
  /**
   * 上传语料数据
   */

  ipcMain.on(UPLOAD_TEXTS_DATA, function (event) {
    // console.log('object');
    var openFilePromise = dialog.showOpenDialog({
      title: '上传语料数据',
      defaultPath: __dirname + '/data',
      filters: [{
        name: 'txt',
        extensions: ['txt']
      }],
      properties: ['openFile']
    });
    openFilePromise.then(function (res) {
      if (!res.canceled) {
        event.returnValue = res.filePaths[0];
      }

      event.returnValue = '';
    });
  });
  /**
   * 保存语料数据
   */

  ipcMain.on(SAVE_TEXTS_DATA, function (event) {
    // console.log(data);
    var saveFilePromise = dialog.showSaveDialog({
      title: '保存语料数据',
      defaultPath: __dirname + '/data' + '/texts.txt',
      filters: [{
        name: 'txt',
        extensions: ['txt']
      }],
      properties: ['dontAddToRecent']
    });
    saveFilePromise.then(function (res) {
      if (!res.canceled) {
        event.returnValue = {
          message: 'success',
          path: res.filePath
        };
      } else {
        event.returnValue = {
          message: 'cancel',
          path: ''
        };
      }
    });
  });
  /**
   * 新建字典数据窗口
   */

  ipcMain.on(OPEN_DICTIONARY_WINDOW, function (event, data) {
    var DictionaryWindowInstance = new DictionaryWindow(mainWindow, data.path);
  });
  /**
   * 新建语料数据窗口
   */

  ipcMain.on(OPEN_TEXT_WINDOW, function (event, data) {
    var TextWindowInstance = new TextWindow(mainWindow, data.path);
  });
  ipcMain.on(OPEN_MODEL_CONFIG_WINDOW, function (event, data) {
    var ModelconfigWindowInstance = new ModelConfigWindow(mainWindow);
  });
};