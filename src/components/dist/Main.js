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
var antd_1 = require("antd");
require("antd/dist/antd.css");
var icons_1 = require("@ant-design/icons");
var icons_2 = require("@ant-design/icons");
var react_router_dom_1 = require("react-router-dom");
var ipc_1 = require("../types/ipc");
var Icon_1 = require("./Icon");
var react_redux_1 = require("react-redux");
var DictionaryWindow_1 = require("./DictionaryWindow");
var action_1 = require("../action");
var TextWindow_1 = require("./TextWindow");
var MarkView_1 = require("./MarkView");
var ipcRenderer = window.electron.ipcRenderer;
 > ,
    openKeys;
Array < string > ,
    selectedKeys;
Array < string > ,
;
var Main = /** @class */ (function (_super) {
    __extends(Main, _super);
    function Main(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            labelList: [],
            stringList: [],
            openKeys: ['directory'],
            selectedKeys: []
        };
        return _this;
    }
    Main.prototype.render = function () {
        var _this = this;
        var Header = antd_1.Layout.Header, Sider = antd_1.Layout.Sider, Content = antd_1.Layout.Content;
        var SubMenu = antd_1.Menu.SubMenu;
        var _a = this.state, labelList = _a.labelList, stringList = _a.stringList, openKeys = _a.openKeys, selectedKeys = _a.selectedKeys;
        var _b = this.props, history = _b.history, dictionaryData = _b.dictionaryData;
        return (react_1["default"].createElement(antd_1.Layout, null,
            react_1["default"].createElement(Sider, { trigger: null, theme: "light" },
                react_1["default"].createElement("div", { className: "logo", style: {
                        width: '100%',
                        height: '60px',
                        // marginLeft: '2%',
                        lineHeight: '60px',
                        textAlign: 'center',
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: 'rgb(13,110,253)',
                        userSelect: 'none'
                    }, onClick: function () {
                        history.push('/');
                    } }, "\u5B9E\u4F53\u62BD\u53D6\u5DE5\u5177"),
                react_1["default"].createElement(antd_1.Menu, { theme: "light", mode: "inline", openKeys: openKeys, selectedKeys: selectedKeys },
                    react_1["default"].createElement(SubMenu, { key: "dictionary", title: "\u5B57\u5178\u6570\u636E", icon: react_1["default"].createElement(icons_2["default"], { component: Icon_1.DictionaryIcon }), onTitleClick: function (e) {
                            // console.log(e);
                            _this.setState({ openKeys: openKeys[0] === e.key ? [] : [e.key] });
                        } }, labelList.map(function (value, index) { return (react_1["default"].createElement(antd_1.Menu.Item, { key: value, onClick: function () {
                            _this.props.updateLabelByShow(value);
                            _this.props.updateDictionaryData(dictionaryData[value]);
                            _this.setState({ selectedKeys: [value] });
                        } }, value)); })),
                    react_1["default"].createElement(SubMenu, { key: "text", title: "\u8BED\u6599\u6570\u636E", icon: react_1["default"].createElement(icons_1.FileTextOutlined, null), onTitleClick: function (e) {
                            _this.setState({ openKeys: openKeys[0] === e.key ? [] : [e.key] });
                        } },
                        stringList.map(function (value) { return ; }, path),
                        ": string], index: number) => (",
                        react_1["default"].createElement(antd_1.Menu.Item, { key: 'text' + index, onClick: function () {
                                _this.setState({ selectedKeys: ['text' + index] });
                                history.push('/texts');
                                _this.readTxtFile(value[1]);
                            } }, value[0]),
                        ")) }"))),
            react_1["default"].createElement(antd_1.Layout, { className: "site-layout" },
                react_1["default"].createElement(Header, { className: "site-layout-background", style: { padding: 0, backgroundColor: 'white' } },
                    react_1["default"].createElement(antd_1.Button, { icon: react_1["default"].createElement(icons_1.UploadOutlined, null), onClick: function () {
                            var path = ipcRenderer.sendSync(ipc_1.UPLOAD_DICTIONARY_DATA);
                            if (path === '') {
                                antd_1.message.success('您已取消上传', 1);
                                return;
                            }
                            _this.readXlsxFile(path);
                        } }, "\u4E0A\u4F20\u5B57\u5178"),
                    react_1["default"].createElement(antd_1.Button, { icon: react_1["default"].createElement(icons_1.UploadOutlined, null), onClick: function () {
                            var path = ipcRenderer.sendSync(ipc_1.UPLOAD_TEXTS_DATA);
                            if (path === '') {
                                antd_1.message.success('您已取消上传', 1);
                                return;
                            }
                            stringList.push([path.split('\\')[path.split('\\').length - 1], path]);
                            var index = stringList.length - 1;
                            for (var i = 0; i < stringList.length - 1; i++) {
                                if (stringList[i][0] === path.split('\\').pop() && stringList[i][1] === path) {
                                    stringList.pop();
                                    index = i;
                                    break;
                                }
                            }
                            _this.setState({ stringList: stringList, openKeys: ['text'], selectedKeys: ['text' + index] });
                            _this.readTxtFile(path);
                            antd_1.message.success('您已成功上传的语料数据', 1);
                        } }, "\u4E0A\u4F20\u8BED\u6599"),
                    react_1["default"].createElement(antd_1.Button, { icon: react_1["default"].createElement(icons_1.PlayCircleOutlined, null), onClick: function () {
                            // ipcRenderer.send(OPEN_MODEL_CONFIG_WINDOW)
                        } }, "\u521D\u59CB\u5316")),
                react_1["default"].createElement(Content, { className: "site-layout-background", style: {
                        // margin: '24px 16px',
                        // padding: 24,
                        minHeight: 600
                    } },
                    react_1["default"].createElement(react_router_dom_1.Switch, null,
                        react_1["default"].createElement(react_router_dom_1.Route, { path: "/dictionary", component: DictionaryWindow_1["default"] }),
                        react_1["default"].createElement(react_router_dom_1.Route, { path: "/texts", component: TextWindow_1["default"] }),
                        react_1["default"].createElement(react_router_dom_1.Route, { path: '/mark', component: MarkView_1["default"] }))))));
    };
    Main.prototype.componentDidMount = function () {
    };
    Main.prototype.readXlsxFile = function (path) {
        var dataFile = window.xlsx.parse(path);
        var labelList = this.state.labelList;
        var dictionaryData = this.props.dictionaryData;
        dataFile[0]['data'].slice(1).forEach(function (arr) {
            if (labelList.includes(arr[0])) {
                dictionaryData[arr[0]].push({
                    label: arr[0],
                    name: arr[1],
                    abbreviations: __spreadArrays(arr.slice(2))
                });
            }
            else {
                labelList.push(arr[0]);
                dictionaryData[arr[0]] = [{
                        label: arr[0],
                        name: arr[1],
                        abbreviations: __spreadArrays(arr.slice(2))
                    }];
            }
        });
        if (labelList.length === 0) {
            antd_1.message.warning('您上传的字典为空', 1);
            return;
        }
        var selectedKeys = this.state.selectedKeys.length === 0 ? [labelList[0]] : this.state.selectedKeys;
        this.setState({ labelList: labelList, selectedKeys: selectedKeys, openKeys: ['dictionary'] });
        this.props.updateLabelByShow(selectedKeys[0]);
        this.props.updateAllDictionaryData(dictionaryData);
        this.props.updateDictionaryData(JSON.parse(JSON.stringify(dictionaryData[selectedKeys[0]]))); // 深复制
        this.props.history.push('/dictionary');
    };
    Main.prototype.readTxtFile = function (path) {
        var _this = this;
        window.fs.readFile(path, 'utf-8', function (err, data) {
            if (err) {
                throw (err);
            }
            var dataByHandle = [];
            var lines = data.split("\r\n");
            lines.forEach(function (line) {
                dataByHandle.push({
                    text: line,
                    label: []
                });
            });
            if (dataByHandle.length === 0) {
                antd_1.message.warning('您上传的语料数据为空', 1);
                return;
            }
            _this.props.updateTextsData(dataByHandle, path);
            _this.props.history.push('/texts');
        });
    };
    return Main;
}(react_1.Component));
var mapStateToProps = function (state, ownProps) {
    var Main = state.Main;
    // console.log()
    return __assign(__assign({}, ownProps), Main);
};
var mapDispatchToProps = {
    updateAllDictionaryData: action_1.updateAllDictionaryData,
    updateLabelByShow: action_1.updateLabelByShow,
    updateDictionaryData: action_1.updateDictionaryData,
    updateTextsData: action_1.updateTextsData
};
exports["default"] = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(Main);
