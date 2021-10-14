"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var redux_1 = require("redux");
var actionTypes_1 = require("../types/actionTypes");
var initStore = {
    Main: {
        dictionaryData: {},
        labelByShow: '',
        isSave: true
    },
    DictionaryWindow: {
        tableData: [],
        path: ''
    },
    TextWindow: {
        data: [],
        path: '',
        isSave: true,
        current: 1
    },
    MarkView: {
        data: [],
        current: 1
    }
};
var MainReducer = function (state, action) {
    if (state === void 0) { state = initStore.Main; }
    if (action.type === actionTypes_1.UPDATE_ALL_DICTIONARY_DATA) {
        var dictionaryData = action.dictionaryData;
        return __assign(__assign({}, state), { dictionaryData: dictionaryData });
    }
    else if (action.type === actionTypes_1.MODIFY_LABEL_OF_DICTIONARY_DATA) {
        var label = action.label, tableData = action.tableData;
        var dictionaryData = state.dictionaryData;
        dictionaryData[label] = tableData;
        return __assign(__assign({}, state), dictionaryData);
    }
    else if (action.type === actionTypes_1.UPDATE_IS_SAVE) {
        var isSave = action.isSave;
        return __assign(__assign({}, state), { isSave: isSave });
    }
    return state;
};
var DictionaryWindowReducer = function (state, action) {
    if (state === void 0) { state = initStore.DictionaryWindow; }
    if (action.type === actionTypes_1.UPDATE_DICTIONARY_DATA) {
        var tableData = action.tableData, path = action.path;
        // console.log(path);
        return __assign(__assign({}, state), { tableData: tableData,
            path: path });
    }
    return state;
};
var TextWindowReducer = function (state, action) {
    if (state === void 0) { state = initStore.TextWindow; }
    if (action.type === actionTypes_1.UPDATE_TEXTS_DATA) {
        var data = action.data, path = action.path;
        return __assign(__assign({}, state), { data: data,
            path: path });
    }
    else if (action.type === actionTypes_1.UPDATE_IS_SAVE) {
        var isSave = action.isSave;
        // console.log(isSave);
        return __assign(__assign({}, state), { isSave: isSave });
    }
    else if (action.type === actionTypes_1.UPDATE_TEXT_TABLE_PAGE) {
        var current = action.current;
        return __assign(__assign({}, state), { current: current });
    }
    return state;
};
var MarkViewReducer = function (state, action) {
    if (state === void 0) { state = initStore.MarkView; }
    if (action.type === actionTypes_1.UPDATE_MARK_TEXT_DATA) {
        var data = action.data;
        return __assign(__assign({}, state), { data: data });
    }
    else if (action.type === actionTypes_1.UPDATE_TEXT_TABLE_PAGE) {
        var current = action.current;
        return __assign(__assign({}, state), { current: current });
    }
    return state;
};
var combineReducer = redux_1.combineReducers({
    Main: MainReducer,
    DictionaryWindow: DictionaryWindowReducer,
    TextWindow: TextWindowReducer,
    MarkView: MarkViewReducer
});
var reducer = function (state, action) {
    if (state === void 0) { state = initStore; }
    var store1 = combineReducer(state, action);
    return store1;
};
exports["default"] = reducer;
