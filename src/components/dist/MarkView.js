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
// import $ from 'jquery'
var react_color_1 = require("react-color");
var Icon_1 = require("./Icon");
var react_redux_1 = require("react-redux");
var action_1 = require("../action");
var MarkView = /** @class */ (function (_super) {
    __extends(MarkView, _super);
    function MarkView(props) {
        var _this = _super.call(this, props) || this;
        _this.startIndex = -1;
        _this.endIndex = -1;
        _this.labelRecord = [];
        _this.state = {
            data: [],
            editKey: '',
            inputVisible: false,
            popoverVisibleName: '',
            labelSettingConfig: {
                label: '',
                color: '',
                key: ''
            },
            nameToColor: {},
            labelRecord: [],
            labels: [
                {
                    color: '#516b91',
                    name: '人名',
                    key: 'p'
                }, {
                    color: '#59c4e6',
                    name: '地名',
                    key: 'd'
                }, {
                    color: '#edafda',
                    name: '时间',
                    key: 't'
                }
            ]
        };
        _this.columns = [
            {
                title: react_1["default"].createElement("div", { style: {
                        width: '100%',
                        textAlign: 'center'
                    } }, "\u6587\u672C"),
                dataIndex: 'textArr',
                key: 'text',
                align: 'left',
                render: function (text, record, index) {
                    var nameToColor = _this.state.nameToColor;
                    return (react_1["default"].createElement("div", { onMouseUp: function () {
                            var _a, _b, _c, _d;
                            var _e = _this.props, data = _e.data, current = _e.current, updateMarkTextData = _e.updateMarkTextData;
                            var start = Math.min(_this.startIndex, _this.endIndex);
                            var end = Math.max(_this.startIndex, _this.endIndex);
                            // console.log(text.slice(start, end + 1).join(''))
                            if (text.slice(start, end + 1).join('').includes((_a = getSelection()) === null || _a === void 0 ? void 0 : _a.toString())) {
                                var textBySelect = (_b = getSelection()) === null || _b === void 0 ? void 0 : _b.toString();
                                start = start + text.slice(start, end + 1).join('').indexOf(textBySelect);
                                end = start + textBySelect.length - 1;
                                data[current * 10 - 10 + index]['textArr'].splice(start, end + 1 - start);
                                data[current * 10 - 10 + index]['textArr'].splice(start, 0, (_c = getSelection()) === null || _c === void 0 ? void 0 : _c.toString());
                                nameToColor[textBySelect] = 'blue';
                                _this.setState({ nameToColor: nameToColor });
                                updateMarkTextData(data);
                                _this.labelRecord.push({
                                    index: current * 10 - 10 + index,
                                    start: start,
                                    end: end + 1,
                                    label: 'none'
                                });
                            }
                            // if ()
                            (_d = getSelection()) === null || _d === void 0 ? void 0 : _d.removeAllRanges();
                            _this.startIndex = _this.endIndex = -1;
                        } }, text.map(function (value, i) {
                        if (!value)
                            return '';
                        if (value.length <= 1 && !(value in nameToColor)) {
                            return (react_1["default"].createElement("div", { key: i, style: {
                                    // float: 'left'
                                    display: 'inline-block'
                                }, onMouseDown: function () {
                                    _this.startIndex = i;
                                }, onMouseOver: function () {
                                    _this.endIndex = i;
                                }, onMouseUp: function () {
                                    _this.endIndex = i;
                                } }, value));
                        }
                        else {
                            return (react_1["default"].createElement(antd_1.Tag, { key: i, color: nameToColor[value], closable: true, icon: react_1["default"].createElement(icons_1["default"], { component: Icon_1.SettingIcon, onClick: function () {
                                    } }), style: {
                                    marginLeft: '5px'
                                }, onClose: function () {
                                    var _a;
                                    var _b = _this.props, data = _b.data, current = _b.current, updateMarkTextData = _b.updateMarkTextData;
                                    var v = value;
                                    data[current * 10 - 10 + index]['textArr'].splice(i, 1);
                                    console.log(v, v.split(''));
                                    (_a = data[current * 10 - 10 + index]['textArr']).splice.apply(_a, __spreadArrays([i, 0], v.split('')));
                                    delete nameToColor[value];
                                    _this.setState({ nameToColor: nameToColor });
                                    updateMarkTextData(data);
                                } }, value));
                        }
                    })));
                }
            }
        ];
        return _this;
    }
    MarkView.prototype.render = function () {
        var _this = this;
        // const dataStr = 
        var _a = this.state, labels = _a.labels, inputVisible = _a.inputVisible, labelSettingConfig = _a.labelSettingConfig, popoverVisibleName = _a.popoverVisibleName;
        var _b = this.props, history = _b.history, current = _b.current, data = _b.data, updateTextTablePage = _b.updateTextTablePage;
        // if ()
        // console.log(this.labelRecord);
        return (react_1["default"].createElement("div", { style: {
                width: '100%',
                height: '500px'
            } },
            react_1["default"].createElement("div", { style: {
                    width: '100%',
                    height: '50px',
                    padding: '10px'
                } },
                labels.map(function (value, index) { return (react_1["default"].createElement(antd_1.Popover, { title: '\u6807\u7B7E\u8BBE\u7F6E', visible: popoverVisibleName === value['name'], key: 'label' + index, placement: 'bottomLeft', content: react_1["default"].createElement("div", { style: {
                            width: '100%',
                            height: '100px',
                            lineHeight: '30px'
                        } },
                        react_1["default"].createElement("div", { style: {
                                height: '30px'
                            } },
                            "\u6807\u7B7E\u540D\uFF1A",
                            react_1["default"].createElement(antd_1.Input, { value: labelSettingConfig.label, size: 'small', onChange: function (e) {
                                    labelSettingConfig.label = e.target.value;
                                    _this.setState({ labelSettingConfig: __assign({}, labelSettingConfig) });
                                }, style: {
                                    width: '100px'
                                } })),
                        react_1["default"].createElement("div", { style: {
                                height: '30px'
                            } },
                            "\u5FEB\u6377\u952E\uFF1A",
                            react_1["default"].createElement("div", { style: {
                                    display: 'inline-block',
                                    // backgroundColor: 'blue',
                                    height: '30px'
                                } }, "Ctrl + \u00A0"),
                            react_1["default"].createElement(antd_1.Input, { maxLength: 1, value: labelSettingConfig.key, size: 'small', onChange: function (e) {
                                    labelSettingConfig.key = e.target.value;
                                    _this.setState({ labelSettingConfig: __assign({}, labelSettingConfig) });
                                }, style: {
                                    width: '30px'
                                } })),
                        react_1["default"].createElement("div", { style: {
                                height: '30px'
                            } },
                            "\u989C\u8272\uFF1A",
                            react_1["default"].createElement(antd_1.Popover, { title: '\u62FE\u8272\u5668', placement: 'left', trigger: 'click', content: react_1["default"].createElement(react_color_1.SketchPicker, { color: labelSettingConfig.color, onChange: function (color) {
                                        labelSettingConfig.color = color.hex;
                                        _this.setState({ labelSettingConfig: labelSettingConfig });
                                    } }) },
                                react_1["default"].createElement("div", { style: {
                                        width: '20px',
                                        height: '20px',
                                        transform: 'translate(15px, 5px)',
                                        display: 'inline-block',
                                        backgroundColor: labelSettingConfig.color
                                    } })),
                            react_1["default"].createElement(antd_1.Button, { type: 'primary', size: 'small', style: {
                                    float: 'right',
                                    transform: 'translate(-5px, 2.5px)'
                                }, onClick: function () {
                                    labels[index] = {
                                        name: labelSettingConfig.label,
                                        key: labelSettingConfig.key,
                                        color: labelSettingConfig.color
                                    };
                                    _this.setState({ labels: labels, popoverVisibleName: '' });
                                } }, "\u786E\u5B9A"))) },
                    react_1["default"].createElement(antd_1.Tag, { closable: true, color: value['color'], key: 'name' + index, icon: react_1["default"].createElement(icons_1["default"], { component: Icon_1.SettingIcon, onClick: function () {
                                var labelSettingConfig = {
                                    label: value['name'],
                                    color: value['color'],
                                    key: value['key']
                                };
                                var name = popoverVisibleName === value['name'] ? '' : value['name'];
                                _this.setState({ labelSettingConfig: labelSettingConfig, popoverVisibleName: name });
                            } }), style: {
                            userSelect: 'none'
                        }, onClose: function (e) {
                            e.preventDefault();
                            antd_1.Modal.confirm({
                                title: '警告',
                                icon: react_1["default"].createElement(icons_1.ExclamationCircleOutlined, null),
                                content: '请确认是否要删除标签：' + value['name'],
                                okText: '确认',
                                cancelText: '取消',
                                onOk: function () {
                                    labels.splice(index, 1);
                                    _this.setState({ labels: labels });
                                }
                            });
                        } }, value['name'] + ' [' + value['key'] + ']'))); }),
                inputVisible && (react_1["default"].createElement(antd_1.Input, { ref: function (input) {
                        _this.input = input;
                    }, type: "text", size: "small", style: { width: 78 }, onBlur: function (e) {
                        _this.setState({ inputVisible: false });
                        if (!e.target.value)
                            return;
                        labels.push({
                            name: e.target.value,
                            color: "#" + Math.floor(Math.random() * 0xffffff).toString(16).padEnd(6, '0'),
                            key: 'q'
                        });
                        _this.setState({ labels: labels });
                    }, onPressEnter: function (e) {
                        _this.setState({ inputVisible: false });
                        if (!e.target.value)
                            return;
                        labels.push({
                            name: e.target.value,
                            color: "#" + Math.floor(Math.random() * 0xffffff).toString(16).padEnd(6, '0'),
                            key: 'q'
                        });
                        _this.setState({ labels: labels });
                    } })),
                !inputVisible &&
                    react_1["default"].createElement(antd_1.Tag, { className: "site-tag-plus", onClick: function () {
                            _this.setState({ inputVisible: true }, function () {
                                _this.input.focus();
                            });
                        } },
                        react_1["default"].createElement(icons_1.PlusOutlined, null),
                        " \u6DFB\u52A0\u6807\u7B7E")),
            react_1["default"].createElement(antd_1.Table, { columns: this.columns, dataSource: data, size: 'small', scroll: { y: 380 }, pagination: {
                    pageSize: 10,
                    current: current,
                    simple: true,
                    position: ['bottomRight'],
                    // showSizeChanger: true,
                    onChange: function (page) {
                        updateTextTablePage(page);
                        // this.setState({ pageSize: (pageSize as number) })
                    }
                } }),
            react_1["default"].createElement(antd_1.Button, { type: 'primary', style: {
                // float: 'left'
                }, onClick: function () {
                    history.push('/texts');
                } }, "\u8FD4\u56DE")));
    };
    MarkView.prototype.componentDidMount = function () {
        var _this = this;
        var labelRecord = this.props.data.map(function () { return []; });
        document.addEventListener('keydown', function (e) {
            if (e.ctrlKey) {
                var _a = _this.state, labels = _a.labels, nameToColor = _a.nameToColor;
                for (var i = 0; i < labels.length; i++) {
                    if (labels[i]['key'] === e.key) {
                        for (var name in nameToColor) {
                            if (nameToColor[name] === 'blue') {
                                nameToColor[name] = labels[i]['color'];
                            }
                        }
                        for (var j = _this.labelRecord.length - 1; j >= 0; j--) {
                            if (_this.labelRecord[j]['label'] === 'none') {
                                _this.labelRecord[j]['label'] = labels[i]['name'];
                            }
                        }
                        _this.setState({ nameToColor: nameToColor });
                        break;
                    }
                }
            }
        });
    };
    return MarkView;
}(react_1.Component));
var mapStateToProps = function (state, ownProps) {
    var MarkView = state.MarkView;
    // console.log(Header)
    return __assign(__assign({}, ownProps), MarkView);
};
var mapDispatchToProps = {
    updateTextTablePage: action_1.updateTextTablePage,
    updateMarkTextData: action_1.updateMarkTextData
};
exports["default"] = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(MarkView);
