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
var react_1 = require("react");
require("antd/dist/antd.css");
var antd_1 = require("antd");
var icons_1 = require("@ant-design/icons");
var icons_2 = require("@ant-design/icons");
var Icon_1 = require("./Icon");
var ipc_1 = require("../types/ipc");
var react_redux_1 = require("react-redux");
var action_1 = require("../action");
var ipcRenderer = window.electron.ipcRenderer;
var TextWindow = /** @class */ (function (_super) {
    __extends(TextWindow, _super);
    function TextWindow(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            editKey: '',
            pageSize: 10
        };
        _this.columns = [
            {
                title: react_1["default"].createElement("div", { style: {
                        width: '100%',
                        textAlign: 'center'
                    } }, "\u6587\u672C"),
                dataIndex: 'text',
                key: 'text',
                width: '82%',
                // ellipsis: true,
                align: 'left',
                render: function (text, record, index) {
                    var TextArea = antd_1.Input.TextArea;
                    var editKey = _this.state.editKey;
                    return editKey !== record['key'] ?
                        react_1["default"].createElement("div", null, text) :
                        react_1["default"].createElement(TextArea, { value: text, onChange: function (e) {
                                var newText = e.target.value;
                                var _a = _this.props, originalData = _a.data, path = _a.path, updateTextsData = _a.updateTextsData, updateIsSave = _a.updateIsSave;
                                var data = originalData.map(function (value) {
                                    if (value['key'] !== record['key'])
                                        return value;
                                    return __assign(__assign({}, value), { text: newText });
                                });
                                updateTextsData(data, path);
                                updateIsSave(false);
                            }, autoSize: true });
                }
            }, {
                title: '操作',
                dataIndex: 'kind',
                render: function (label, record, index) { return (react_1["default"].createElement(react_1["default"].Fragment, null,
                    react_1["default"].createElement(antd_1.Button, { size: 'small', type: 'primary', onClick: function () {
                            var editKey = _this.state.editKey === record['key'] ? '' : record['key'];
                            _this.setState({ editKey: editKey });
                        }, style: {
                            // float: 'right',
                            marginRight: '10px'
                        } }, _this.state.editKey === record['key'] ? '保存' : '编辑'),
                    react_1["default"].createElement(antd_1.Button, { size: 'small', type: 'primary', onClick: function () {
                            var _a = _this.props, data = _a.data, path = _a.path, updateTextsData = _a.updateTextsData, updateIsSave = _a.updateIsSave;
                            antd_1.Modal.confirm({
                                title: '警告',
                                icon: react_1["default"].createElement(icons_1.ExclamationCircleOutlined, null),
                                content: '请确认是否要删除改文本',
                                okText: '确认',
                                cancelText: '取消',
                                onOk: function () {
                                    updateTextsData(data.filter(function (value, i) { return i !== index; }), path);
                                    // console.log('object');
                                    updateIsSave(false);
                                }
                            });
                        }, icon: react_1["default"].createElement(icons_1.DeleteOutlined, null) }, "\u5220\u9664"))); },
                width: '18%',
                align: 'center'
            }
        ];
        return _this;
    }
    TextWindow.prototype.render = function () {
        var _this = this;
        var pageSize = this.state.pageSize;
        var _a = this.props, data = _a.data, path = _a.path, isSave = _a.isSave, current = _a.current, history = _a.history, updateTextsData = _a.updateTextsData, updateTextTablePage = _a.updateTextTablePage, updateMarkTextData = _a.updateMarkTextData;
        data.forEach(function (value, index) {
            value['key'] = '' + index;
        });
        // console.log(isSave);
        return (react_1["default"].createElement("div", { style: {
                width: '100%',
                height: '475px',
                padding: '0px 2%',
                backgroundColor: '#fafafa',
                position: 'relative'
            } },
            react_1["default"].createElement(react_1["default"].Fragment, null,
                react_1["default"].createElement(antd_1.Table, { columns: this.columns, dataSource: data, size: 'small', scroll: { y: 510 }, pagination: {
                        pageSize: pageSize,
                        current: current,
                        simple: true,
                        position: ['topRight'],
                        // showSizeChanger: true,
                        onChange: function (page) {
                            updateTextTablePage(page);
                            // this.setState({ pageSize: (pageSize as number) })
                        }
                    } }),
                react_1["default"].createElement(antd_1.Button, { type: "primary", size: 'middle', icon: react_1["default"].createElement(icons_2["default"], { component: isSave ? Icon_1.SaveIcon : Icon_1.CircleIcon }), style: {
                        position: 'absolute',
                        top: 10
                    }, onClick: function () {
                        _this.saveFile(path);
                        // updateIsSave(true)
                    } }, "\u4FDD\u5B58"),
                react_1["default"].createElement(antd_1.Button, { type: "primary", size: 'middle', icon: react_1["default"].createElement(icons_2["default"], { component: isSave ? Icon_1.SaveIcon : Icon_1.CircleIcon }), style: {
                        position: 'absolute',
                        top: 10,
                        left: 110 - 5
                    }, onClick: function () {
                        var _a = ipcRenderer.sendSync(ipc_1.SAVE_TEXTS_DATA), msg = _a.message, path = _a.path;
                        if (msg === 'success') {
                            // console.log(path);
                            _this.saveFile(path);
                        }
                        else {
                            antd_1.message.success('您已取消保存', 1);
                        }
                    } }, "\u53E6\u5B58\u4E3A"),
                react_1["default"].createElement(antd_1.Button, { icon: react_1["default"].createElement(icons_2["default"], { component: Icon_1.UpdateIcon }), type: "primary", style: {
                        position: 'absolute',
                        top: 10,
                        left: 210 - 5
                    }, onClick: function () {
                        // this.uploadDictionaryData()
                    } }, "\u66F4\u6362\u6587\u672C"),
                react_1["default"].createElement(antd_1.Button, { size: 'middle', type: 'primary', icon: react_1["default"].createElement(icons_2["default"], { component: Icon_1.AddIcon }), onClick: function () {
                        data.unshift({
                            key: '00',
                            text: '',
                            label: []
                        });
                        // console.log('data')
                        _this.setState({ editKey: '0' });
                        updateTextsData(__spreadArrays(data), path);
                    }, style: {
                        position: 'absolute',
                        top: 10,
                        left: 320
                    } }, "\u589E\u52A0\u6587\u672C"),
                react_1["default"].createElement(antd_1.Button, { type: 'primary', icon: react_1["default"].createElement(icons_2["default"], { component: Icon_1.LabelIcon }), onClick: function () {
                        // updateIsSave(false)
                        updateMarkTextData(data.map(function (value) { return (__assign(__assign({}, value), { textArr: value['text'].split('') })); }));
                        history.push('/mark');
                    }, style: {
                        position: 'absolute',
                        top: 10,
                        left: 435
                    } }, "\u6807\u6CE8"))));
    };
    TextWindow.prototype.componentDidMount = function () {
    };
    TextWindow.prototype.saveFile = function (path) {
        var _a = this.props, data = _a.data, updateTextsData = _a.updateTextsData, updateIsSave = _a.updateIsSave;
        var dataString = '';
        data.forEach(function (value) {
            dataString += (value['text'] + '\r\n');
        });
        var fs = window.fs;
        fs.writeFile(path, dataString, function (err) {
            if (err) {
            }
            updateTextsData(data, path);
            antd_1.message.success('您已成功保存', 1);
            updateIsSave(true);
            // console.log('success')
        });
    };
    return TextWindow;
}(react_1.Component));
var mapStateToProps = function (state, ownProps) {
    var TextWindow = state.TextWindow;
    // console.log(Header)
    return __assign(__assign({}, ownProps), TextWindow);
};
var mapDispatchToProps = {
    updateTextsData: action_1.updateTextsData,
    updateIsSave: action_1.updateIsSave,
    updateTextTablePage: action_1.updateTextTablePage,
    updateMarkTextData: action_1.updateMarkTextData
};
exports["default"] = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(TextWindow);
