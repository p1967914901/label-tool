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
var MarkView = /** @class */ (function (_super) {
    __extends(MarkView, _super);
    function MarkView(props) {
        var _this = _super.call(this, props) || this;
        _this.startIndex = -1;
        _this.endIndex = -1;
        _this.state = {
            data: [],
            editKey: '',
            inputVisible: false,
            popoverVisibleName: '',
            colorPickerPosition: [0, 0],
            labelSettingConfig: {
                label: '',
                color: '',
                key: ''
            },
            nameToColor: {},
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
                dataIndex: 'text',
                key: 'text',
                // width: '70%',
                // ellipsis: true,
                align: 'left',
                render: function (text, record, index) {
                    var nameToColor = _this.state.nameToColor;
                    return (react_1["default"].createElement("div", { onMouseUp: function () {
                            var _a, _b, _c, _d;
                            // console.log(getSelection()?.toString())
                            // console.log(text[this.startIndex]);
                            var data = _this.state.data;
                            var start = Math.min(_this.startIndex, _this.endIndex);
                            var end = Math.max(_this.startIndex, _this.endIndex);
                            // console.log(text.slice(start, end + 1).join(''))
                            if (text.slice(start, end + 1).join('').includes((_a = getSelection()) === null || _a === void 0 ? void 0 : _a.toString())) {
                                var textBySelect = (_b = getSelection()) === null || _b === void 0 ? void 0 : _b.toString();
                                start = start + text.slice(start, end + 1).join('').indexOf(textBySelect);
                                end = start + textBySelect.length - 1;
                                data[index]['text'].splice(start, end + 1 - start);
                                data[index]['text'].splice(start, 0, (_c = getSelection()) === null || _c === void 0 ? void 0 : _c.toString());
                                // console.log(data[index]['text']);
                                nameToColor[textBySelect] = 'blue';
                                _this.setState({ data: __spreadArrays(data), nameToColor: nameToColor });
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
                                    // console.log(this.startIndex, this.endIndex)
                                    // if (this.startIndex === this.endIndex && getSelection()?.toString() === value) {
                                    //     console.log(value)
                                    // }
                                    // console.log(getSelection()?.toString());
                                    // getSelection()?.removeAllRanges()
                                } }, value));
                        }
                        else {
                            return (react_1["default"].createElement(antd_1.Tag, { key: i, color: nameToColor[value], closable: true, icon: react_1["default"].createElement(icons_1["default"], { component: Icon_1.SettingIcon, onClick: function () {
                                    } }), style: {
                                    marginLeft: '5px'
                                }, onClose: function () {
                                    var _a;
                                    var data = _this.state.data;
                                    // console.log(data[index]['text'], i);
                                    var v = value;
                                    data[index]['text'].splice(i, 1);
                                    console.log(v, v.split(''));
                                    (_a = data[index]['text']).splice.apply(_a, __spreadArrays([i, 0], v.split('')));
                                    // console.log(data[index]['text']);
                                    delete nameToColor[value];
                                    _this.setState({ data: __spreadArrays(data), nameToColor: nameToColor });
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
        var _a = this.state, data = _a.data, labels = _a.labels, inputVisible = _a.inputVisible, labelSettingConfig = _a.labelSettingConfig, popoverVisibleName = _a.popoverVisibleName, nameToColor = _a.nameToColor;
        // if ()
        console.log(data, nameToColor);
        return (react_1["default"].createElement("div", { style: {
                width: '100%',
                height: '500px',
                // backgroundColor: 'red'
                borderBottom: '1px solid black'
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
                        " \u6DFB\u52A0\u522B\u540D")),
            react_1["default"].createElement(antd_1.Table, { columns: this.columns, dataSource: data, size: 'small', scroll: { y: 380 } })));
    };
    MarkView.prototype.componentDidMount = function () {
        var _this = this;
        var data = [];
        [
            ["富", "动", "2", "4", "煤", "（", "0", ".", "5", "3", "%", "上", "2", "A", "仓", "，", "富", "动", "2", "4", "煤", "（", "0", ".", "8", "0", "%", "）", "上", "2", "C", "D", "仓", "，", "中", "水", "澳", "优", "（", "0", ".", "4", "7", "%", "）", "上", "1", "B", "D", "仓", "，", "优", "混", "煤", "（", "0", ".", "8", "6", "%", "）", "上", "#", "1", "炉", "其", "余", "仓", "，", "优", "混", "煤", "（", "1", ".", "3", "4", "%", "）", "上", "#", "2", "炉", "其", "余", "仓", "。"],
            ["2", "A", "0", "5", "电", "场", "高", "频", "电", "源", "二", "次", "电", "压", "突", "降", "为", "零", "（", "加", "强", "振", "打", "和", "排", "灰", "无", "效", "）", "，", "联", "系", "维", "护", "处", "理", "。", "0", "8", ":", "3", "0", " ", "2", "A", "0", "5", "电", "场", "高", "频", "电", "源", "拉", "弧", "保", "护", "跳", "闸", "。"],
            ["今", "日", "值", "班", "：", "公", "司", "领", "导", "-", "-", "-", "周", "董", "，", "运", "行", "部", "-", "-", "-", "黄", "士", "雷", "，", "维", "护", "部", "-", "-", "-", "郑", "晓", "，", "燃", "料", "部", "-", "-", "-", "潘", "巨", "元", "，", "设", "备", "部", "-", "-", "-", "屠", "海", "彪", "，", "安", "健", "环", "-", "-", "-", "王", "爱", "民", "。"],
            ["2", "B", "磨", "煤", "机", "旋", "转", "分", "离", "器", "电", "机", "冷", "却", "风", "扇", "声", "音", "较", "大", "，", "联", "系", "华", "业", "。"],
        ].forEach(function (value, index) {
            data.push({
                key: '' + index,
                text: value
            });
        });
        this.setState({ data: data });
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
                        _this.setState({ nameToColor: nameToColor });
                        break;
                    }
                }
            }
        });
    };
    return MarkView;
}(react_1.Component));
exports["default"] = MarkView;
