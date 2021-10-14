"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var icons_1 = require("@ant-design/icons");
var antd_1 = require("antd");
var react_1 = require("react");
var icons_2 = require("@ant-design/icons");
var ipc_1 = require("../types/ipc");
var Icon_1 = require("./Icon");
var react_redux_1 = require("react-redux");
var action_1 = require("../action");
// console.log((window as any));
var ipcRenderer = window.electron.ipcRenderer;
var DictionaryWindow = /** @class */ (function (_super) {
    __extends(DictionaryWindow, _super);
    function DictionaryWindow(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            pageSize: 10,
            tableData: [],
            inputNameByShow: '',
            inputVisibleName: '',
            path: ''
        };
        return _this;
    }
    DictionaryWindow.prototype.render = function () {
        var _this = this;
        var Column = antd_1.Table.Column;
        // const { ipcRenderer } = (window as any).electron
        var _a = this.state, pageSize = _a.pageSize, inputNameByShow = _a.inputNameByShow, inputVisibleName = _a.inputVisibleName;
        var _b = this.props, tableData = _b.tableData, updateDictionaryData = _b.updateDictionaryData, modifyLabelOfDictionaryData = _b.modifyLabelOfDictionaryData;
        // console.log(tableData)
        tableData.forEach(function (value, index) {
            value['key'] = '' + index;
        });
        var label = '';
        if (tableData.length) {
            label = tableData[0]['label'];
        }
        // console.log('object');
        return (react_1["default"].createElement("div", { style: {
                width: '100%',
                // height: '475px',
                padding: '0px 2%',
                position: 'relative'
                // backgroundColor: '#fafafa',
                // backgroundColor: 'red'
            } },
            react_1["default"].createElement(antd_1.Table, { dataSource: tableData, size: 'small', scroll: { y: 420 }, pagination: {
                    pageSize: pageSize,
                    position: ['topRight'],
                    showSizeChanger: true,
                    onChange: function (page, pageSize) {
                        _this.setState({ pageSize: pageSize });
                        // console.log('page:', page, 'pageSize:', pageSize)
                    }
                } },
                react_1["default"].createElement(Column, { title: "\u540D\u79F0", dataIndex: "name", key: "name", width: '15%', render: function (name, r, i) {
                        return (inputNameByShow !== name ?
                            react_1["default"].createElement("div", { onMouseEnter: function () {
                                    _this.setState({ inputNameByShow: name }, function () {
                                        _this.nameInput.focus();
                                    });
                                } }, name) :
                            react_1["default"].createElement(antd_1.Input, { ref: function (input) {
                                    _this.nameInput = input;
                                }, type: "text", size: "small", placeholder: name, style: { width: 70 }, onBlur: // 失去焦点保存
                                function (e) {
                                    _this.setState({ inputNameByShow: '' });
                                    if (!e.target.value)
                                        return;
                                    tableData[i]['name'] = e.target.value;
                                    updateDictionaryData(tableData);
                                    modifyLabelOfDictionaryData(label, tableData);
                                    // this.setState({ tableData })
                                }, onPressEnter: // 键盘确定保存
                                function (e) {
                                    _this.setState({ inputNameByShow: '' });
                                    if (!e.target.value)
                                        return;
                                    tableData[i]['name'] = e.target.value;
                                    updateDictionaryData(tableData);
                                    modifyLabelOfDictionaryData(label, tableData);
                                    // this.setState({ tableData })
                                } }));
                    } }),
                react_1["default"].createElement(Column, { width: '75%', title: "\u522B\u540D", dataIndex: "abbreviations", key: "abbreviations", render: function (abbreviations, record, i) { return (react_1["default"].createElement(react_1["default"].Fragment, null,
                        abbreviations.map(function (abbreviation) { return (react_1["default"].createElement(antd_1.Tag, { closable: true, color: "blue", key: abbreviation, onClose: function (e) {
                                e.preventDefault();
                                var newNames = abbreviations.filter(function (name) { return name !== abbreviation; });
                                tableData[i]['abbreviations'] = __spreadArrays(newNames);
                                updateDictionaryData(__spreadArrays(tableData));
                                modifyLabelOfDictionaryData(label, __spreadArrays(tableData));
                                // this.setState({ tableData })
                            } }, abbreviation)); }),
                        'label' + i === inputVisibleName && (react_1["default"].createElement(antd_1.Input, { ref: function (input) {
                                _this.input = input;
                            }, type: "text", size: "small", style: { width: 78 }, onBlur: function (e) {
                                // console.log(record, i);
                                _this.setState({ inputVisibleName: '' });
                                if (!e.target.value)
                                    return;
                                tableData[parseInt(record['key'])]['abbreviations'].push(e.target.value);
                                updateDictionaryData(tableData);
                                modifyLabelOfDictionaryData(label, __spreadArrays(tableData));
                                // this.setState({ tableData })
                            }, onPressEnter: function (e) {
                                _this.setState({ inputVisibleName: '' });
                                if (!e.target.value)
                                    return;
                                tableData[i]['abbreviations'].push(e.target.value);
                                updateDictionaryData(tableData);
                                modifyLabelOfDictionaryData(label, __spreadArrays(tableData));
                                // this.setState({ tableData })
                            } })),
                        'label' + i !== inputVisibleName &&
                            react_1["default"].createElement(antd_1.Tag, { className: "site-tag-plus", onClick: function () {
                                    _this.setState({ inputVisibleName: 'label' + i }, function () {
                                        _this.input.focus();
                                    });
                                } },
                                react_1["default"].createElement(icons_1.PlusOutlined, null),
                                " \u6DFB\u52A0\u522B\u540D"))); } }),
                react_1["default"].createElement(Column, { title: "\u64CD\u4F5C", dataIndex: "name", key: "action", render: function (name, r, i) {
                        return (react_1["default"].createElement(antd_1.Button, { size: 'small', type: 'primary', onClick: function () {
                                antd_1.Modal.confirm({
                                    title: '警告',
                                    icon: react_1["default"].createElement(icons_1.ExclamationCircleOutlined, null),
                                    content: '请确认是否要删除 ' + name + ' 的别名字典',
                                    okText: '确认',
                                    cancelText: '取消',
                                    onOk: function () {
                                        tableData.splice(i, 1);
                                        updateDictionaryData(__spreadArrays(tableData));
                                        modifyLabelOfDictionaryData(label, __spreadArrays(tableData));
                                        // this.setState({ tableData: [...tableData] })
                                    }
                                });
                            }, icon: react_1["default"].createElement(icons_1.DeleteOutlined, null) }, "\u5220\u9664"));
                    } })),
            react_1["default"].createElement(antd_1.Button, { type: "primary", size: 'middle', icon: react_1["default"].createElement(icons_2["default"], { component: Icon_1.SaveIcon }), style: {
                    position: 'absolute',
                    top: 10
                }, onClick: function () {
                    var _a = ipcRenderer.sendSync(ipc_1.SAVE_DICTIONARY_DATA), message = _a.message, path = _a.path;
                    if (message === 'success') {
                        _this.saveFile(path);
                    }
                    else {
                        antd_1.message.success('您已取消保存', 1);
                    }
                } }, "\u53E6\u5B58\u4E3A"),
            react_1["default"].createElement(antd_1.Button, { size: 'middle', type: 'primary', icon: react_1["default"].createElement(icons_2["default"], { component: Icon_1.AddIcon }), onClick: function () {
                    tableData.unshift({
                        key: '00',
                        name: '',
                        label: tableData.length ? tableData[0]['label'] : '',
                        abbreviations: []
                    });
                    // // console.log('data')
                    // this.setState({ inputNameByShow: '0' })
                    updateDictionaryData(__spreadArrays(tableData));
                    modifyLabelOfDictionaryData(label, __spreadArrays(tableData));
                }, style: {
                    position: 'absolute',
                    top: 10,
                    left: 120
                } }, "\u589E\u52A0\u5B57\u5178")));
    };
    DictionaryWindow.prototype.componentDidMount = function () {
        // 
    };
    DictionaryWindow.prototype.saveFile = function (path) {
        var tableData = this.props.tableData;
        var configData = [{
                name: '字典',
                data: [
                    ['标签', '全称', '别名']
                ]
            }];
        tableData.forEach(function (value) {
            configData[0]['data'].push(__spreadArrays([
                value['label'], value['name']
            ], value['abbreviations']));
        });
        var buffer = window.xlsx.build(configData);
        window.fs.writeFile(path, buffer, function (err) {
            if (err) {
            }
            // updateDictionaryData(tableData)
            antd_1.message.success('您的文件已成功保存', 1);
        });
    };
    return DictionaryWindow;
}(react_1.Component));
var mapStateToProps = function (state, ownProps) {
    var DictionaryWindow = state.DictionaryWindow;
    // console.log(Header)
    return __assign(__assign({}, ownProps), DictionaryWindow);
};
var mapDispatchToProps = {
    updateDictionaryData: action_1.updateDictionaryData,
    modifyLabelOfDictionaryData: action_1.modifyLabelOfDictionaryData
};
exports["default"] = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(DictionaryWindow);
