"use strict";
exports.__esModule = true;
exports.updateMarkTextData = exports.updateTextTablePage = exports.updateIsSave = exports.updateTextsData = exports.updateDictionaryData = exports.modifyLabelOfDictionaryData = exports.updateLabelByShow = exports.updateAllDictionaryData = void 0;
var actionTypes_1 = require("../types/actionTypes");
/**
 * 更新所有的字典数据
 */
exports.updateAllDictionaryData = function (dictionaryData) { return ({
    type: actionTypes_1.UPDATE_ALL_DICTIONARY_DATA,
    dictionaryData: dictionaryData
}); };
/**
 * 更新展示的标签
 */
exports.updateLabelByShow = function (labelByShow) { return ({
    type: actionTypes_1.UPDATE_LABEL_BY_SHOW,
    labelByShow: labelByShow
}); };
/**
 * 修改对应标签的字典数据
 */
exports.modifyLabelOfDictionaryData = function (label, tableData) { return ({
    type: actionTypes_1.MODIFY_LABEL_OF_DICTIONARY_DATA,
    label: label,
    tableData: tableData
}); };
/**
 * 更新字典数据
 */
exports.updateDictionaryData = function (tableData) { return ({
    type: actionTypes_1.UPDATE_DICTIONARY_DATA,
    tableData: tableData
}); };
/**
 * 更新语料数据
 */
exports.updateTextsData = function (data, path) { return ({
    type: actionTypes_1.UPDATE_TEXTS_DATA,
    data: data,
    path: path
}); };
/**
 * 更改语料数据的保存状态
 */
exports.updateIsSave = function (isSave) { return ({
    type: actionTypes_1.UPDATE_IS_SAVE,
    isSave: isSave
}); };
/**
 * 更新语料表格的页码
 */
exports.updateTextTablePage = function (current) { return ({
    type: actionTypes_1.UPDATE_TEXT_TABLE_PAGE,
    current: current
}); };
/**
 * 更新标注的文本数据
 */
exports.updateMarkTextData = function (data) { return ({
    type: actionTypes_1.UPDATE_MARK_TEXT_DATA,
    data: data
}); };
