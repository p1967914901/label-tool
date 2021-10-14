import React, { Component } from 'react';
import { Input, Modal, Table, Tag, Popover, Button } from 'antd';
import 'antd/dist/antd.css';
import Icon, { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
// import $ from 'jquery'
import { ColorResult, SketchPicker } from 'react-color';
import { SettingIcon } from './Icon';
import { connect } from 'react-redux';
import { MarkViewStoreType, StoreType } from '../types/propsTypes';
import { updateMarkTextData, updateTextTablePage } from '../action';




interface MarkViewProps extends MarkViewStoreType {
	history: any,
	updateTextTablePage: typeof updateTextTablePage,
	updateMarkTextData: typeof updateMarkTextData,
}
interface MarkViewState {
	data: Array<{
		key?: string,
		text: Array<string>,
	}>,
	editKey: string,
	labels: Array<{
		color: string,
		name: string,
		key: string
	}>,
	inputVisible: boolean,
	labelSettingConfig: {
		label: string,
		color: string,
		key: string
	},
	popoverVisibleName: string,
	colorPickerPosition: [number, number],
	nameToColor: {
		[name: string]: string
	}
}
class MarkView extends Component<MarkViewProps, MarkViewState>{
	private startIndex: number
	private endIndex: number
	private columns: any
	private input: any
	public constructor(props: MarkViewProps) {
		super(props)
		this.startIndex = -1
		this.endIndex = -1
		this.state = {
			data: [],
			editKey: '',
			inputVisible: false,
			popoverVisibleName: '',
			colorPickerPosition: [0, 0],
			labelSettingConfig: {
				label: '',
				color: '',
				key: '',
			},
			nameToColor: {

			},
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
			],
		}
		this.columns = [
			{
				title: <div style={{
					width: '100%',
					textAlign: 'center'
				}}>
					文本
				</div>,
				dataIndex: 'textArr',
				key: 'text',
				align: 'left',
				render: (text: Array<string>, record: { key?: string, text: Array<string> }, index: number) => {
					const { nameToColor } = this.state;
					return (
						<div onMouseUp={
							() => {
								// console.log(getSelection()?.toString())
								// console.log(text[this.startIndex]);
								// console.log(index);
								// return;
								const { data, current, updateMarkTextData } = this.props
								let start = Math.min(this.startIndex, this.endIndex)
								let end = Math.max(this.startIndex, this.endIndex)
								// console.log(text.slice(start, end + 1).join(''))
								if (text.slice(start, end + 1).join('').includes(getSelection()?.toString() as string)) {
									const textBySelect: string = getSelection()?.toString() as string;
									start = start + text.slice(start, end + 1).join('').indexOf(textBySelect);
									end = start + textBySelect.length - 1;
									data[current * 10 - 10 + index]['textArr'].splice(start, end + 1 - start)
									data[current * 10 - 10 + index]['textArr'].splice(start, 0, getSelection()?.toString() as string)
									// console.log(data[index]['text']);
									nameToColor[textBySelect] = 'blue';
									this.setState({ nameToColor })
									updateMarkTextData(data)
								}
								// if ()
								getSelection()?.removeAllRanges()
								this.startIndex = this.endIndex = -1
							}
						}>
							{
								text.map((value: string, i: number) => {
									if (!value) return '';
									if (value.length <= 1 && !(value in nameToColor)) {
										return (
											<div key={i} style={{
												// float: 'left'
												display: 'inline-block',
												// marginRight: '2px'
											}} onMouseDown={
												() => {
													this.startIndex = i
												}
											} onMouseOver={
												() => {
													this.endIndex = i
												}
											} onMouseUp={
												() => {
													this.endIndex = i
													// console.log(this.startIndex, this.endIndex)
													// if (this.startIndex === this.endIndex && getSelection()?.toString() === value) {
													//     console.log(value)
													// }

													// console.log(getSelection()?.toString());
													// getSelection()?.removeAllRanges()
												}
											}>
												{value}
											</div>
										)
									} else {
										return (
											<Tag key={i} color={nameToColor[value]} closable
												icon={<Icon component={SettingIcon} onClick={
													() => {

													}
												} />}
												style={{
													marginLeft: '5px'
												}} onClose={
													() => {
														const { data, current, updateMarkTextData } = this.props
														// console.log(data[index]['text'], i);
														const v = value;
														data[current * 10 - 10 + index]['textArr'].splice(i, 1)
														console.log(v, v.split(''));
														data[current * 10 - 10 + index]['textArr'].splice(i, 0, ...v.split(''))
														// console.log(data[index]['text']);
														delete nameToColor[value]
														this.setState({ nameToColor })
														updateMarkTextData(data)
													}
												}>
												{value}
											</Tag>
										)
									}
								})
							}
						</div>
					)

				}
			}
		]
	}

	public render(): JSX.Element {
		// const dataStr = 
		const { labels, inputVisible, labelSettingConfig, popoverVisibleName } = this.state
		const { history, current, data, updateTextTablePage } = this.props
		// if ()
		// console.log(data);
		return (
			<div style={{
				width: '100%',
				height: '500px',
				// backgroundColor: 'red'
				// borderBottom: '1px solid black'
			}}>
				
				<div style={{
					width: '100%',
					height: '50px',
					padding: '10px',//rgb(255, 255, 255)
					// backgroundColor: 'red'
					// position: 'absolute'
				}}>
					{
						labels.map((value: { color: string; name: string; key: string; }, index: number) => (
							<Popover title='标签设置' visible={popoverVisibleName === value['name']} key={'label' + index}
								placement='bottomLeft'
								content={
									<div style={{
										width: '100%',
										height: '100px',
										lineHeight: '30px',
										// backgroundColor: 'red',
									}}>
										<div style={{
											height: '30px'
										}}>
											标签名：<Input value={labelSettingConfig.label} size='small' onChange={
												(e) => {
													labelSettingConfig.label = e.target.value
													this.setState({ labelSettingConfig: { ...labelSettingConfig } })
												}
											} style={{
												width: '100px'
											}} />
										</div>
										<div style={{
											height: '30px'
										}}>
											快捷键：
											<div style={{
												display: 'inline-block',
												// backgroundColor: 'blue',
												height: '30px'
											}}>
												Ctrl + &nbsp;
											</div>
											<Input maxLength={1} value={labelSettingConfig.key} size='small' onChange={
												(e) => {
													labelSettingConfig.key = e.target.value
													this.setState({ labelSettingConfig: { ...labelSettingConfig } })
												}
											} style={{
												width: '30px'
											}} />
										</div>
										<div style={{
											height: '30px',
											// po
										}}>
											颜色：
											<Popover title='拾色器' placement='left' trigger='click'
												content={
													<SketchPicker color={labelSettingConfig.color}
														onChange={
															(color: ColorResult) => {
																labelSettingConfig.color = color.hex
																this.setState({ labelSettingConfig })
															}
														}
													/>
												}
											>
												<div style={{
													width: '20px',
													height: '20px',
													transform: 'translate(15px, 5px)',
													display: 'inline-block',
													backgroundColor: labelSettingConfig.color
												}}></div>
											</Popover>
											<Button type='primary' size='small' style={{
												float: 'right',
												transform: 'translate(-5px, 2.5px)',
											}} onClick={
												() => {
													labels[index] = {
														name: labelSettingConfig.label,
														key: labelSettingConfig.key,
														color: labelSettingConfig.color
													}
													this.setState({ labels, popoverVisibleName: '' })
												}
											}>
												确定
											</Button>
										</div>
									</div>
								}
							>
								<Tag closable color={value['color']} key={'name' + index}
									icon={<Icon component={SettingIcon} onClick={
										() => {
											const labelSettingConfig = {
												label: value['name'],
												color: value['color'],
												key: value['key']
											}
											const name = popoverVisibleName === value['name'] ? '' : value['name']
											this.setState({ labelSettingConfig, popoverVisibleName: name })
										}
									} />}
									style={{
										userSelect: 'none'
									}}
									onClose={
										(e) => {
											e.preventDefault()
											Modal.confirm({
												title: '警告',
												icon: <ExclamationCircleOutlined />,
												content: '请确认是否要删除标签：' + value['name'],
												okText: '确认',
												cancelText: '取消',
												onOk: () => {
													labels.splice(index, 1)
													this.setState({ labels })
												}
											});
										}
									}>
									{value['name'] + ' [' + value['key'] + ']'}
								</Tag>
							</Popover>
						))
					}
					{
						inputVisible && (
							<Input
								ref={
									(input) => {
										this.input = input
									}
								}
								type="text"
								size="small"
								style={{ width: 78 }}
								onBlur={
									(e) => {
										this.setState({ inputVisible: false })
										if (!e.target.value) return;
										labels.push({
											name: e.target.value,
											color: `#${Math.floor(Math.random() * 0xffffff).toString(16).padEnd(6, '0')}`,
											key: 'q'
										})
										this.setState({ labels })
									}
								}
								onPressEnter={
									(e) => {
										this.setState({ inputVisible: false })
										if (!(e.target as any).value) return;
										labels.push({
											name: (e.target as any).value,
											color: `#${Math.floor(Math.random() * 0xffffff).toString(16).padEnd(6, '0')}`,
											key: 'q'
										})
										this.setState({ labels })
									}
								}
							/>
						)
					}
					{
						!inputVisible &&
						<Tag className="site-tag-plus" onClick={
							() => {
								this.setState({ inputVisible: true }, () => {
									(this.input as any).focus();
								})
							}
						}>
							<PlusOutlined /> 添加标签
						</Tag>
					}
				</div>
				
				<Table columns={this.columns} dataSource={data} size='small' 
					scroll={{ y: 380 }}
					pagination={{
						pageSize: 10,
						current,
						simple: true,
						position: ['bottomRight'],
						// showSizeChanger: true,
						onChange: (page: number) => {
							updateTextTablePage(page)
							// this.setState({ pageSize: (pageSize as number) })
						}
					}}
				/>
				<Button type='primary' style={{
					// float: 'left'
					
				}} onClick={
					() => {
						history.push('/texts')
					}
				}>返回</Button>
			</div>
		)
	}

	public componentDidMount() {
		const data: Array<{
			key?: string,
			text: Array<string>
		}> = [];
		[
			["富", "动", "2", "4", "煤", "（", "0", ".", "5", "3", "%", "上", "2", "A", "仓", "，", "富", "动", "2", "4", "煤", "（", "0", ".", "8", "0", "%", "）", "上", "2", "C", "D", "仓", "，", "中", "水", "澳", "优", "（", "0", ".", "4", "7", "%", "）", "上", "1", "B", "D", "仓", "，", "优", "混", "煤", "（", "0", ".", "8", "6", "%", "）", "上", "#", "1", "炉", "其", "余", "仓", "，", "优", "混", "煤", "（", "1", ".", "3", "4", "%", "）", "上", "#", "2", "炉", "其", "余", "仓", "。"],
			["2", "A", "0", "5", "电", "场", "高", "频", "电", "源", "二", "次", "电", "压", "突", "降", "为", "零", "（", "加", "强", "振", "打", "和", "排", "灰", "无", "效", "）", "，", "联", "系", "维", "护", "处", "理", "。", "0", "8", ":", "3", "0", " ", "2", "A", "0", "5", "电", "场", "高", "频", "电", "源", "拉", "弧", "保", "护", "跳", "闸", "。"],
			["今", "日", "值", "班", "：", "公", "司", "领", "导", "-", "-", "-", "周", "董", "，", "运", "行", "部", "-", "-", "-", "黄", "士", "雷", "，", "维", "护", "部", "-", "-", "-", "郑", "晓", "，", "燃", "料", "部", "-", "-", "-", "潘", "巨", "元", "，", "设", "备", "部", "-", "-", "-", "屠", "海", "彪", "，", "安", "健", "环", "-", "-", "-", "王", "爱", "民", "。"],
			["2", "B", "磨", "煤", "机", "旋", "转", "分", "离", "器", "电", "机", "冷", "却", "风", "扇", "声", "音", "较", "大", "，", "联", "系", "华", "业", "。"],
			["2", "B", "磨", "煤", "机", "旋", "转", "分", "离", "器", "电", "机", "冷", "却", "风", "扇", "声", "音", "较", "大", "，", "联", "系", "华", "业", "。"],
			["2", "B", "磨", "煤", "机", "旋", "转", "分", "离", "器", "电", "机", "冷", "却", "风", "扇", "声", "音", "较", "大", "，", "联", "系", "华", "业", "。"],
			["2", "B", "磨", "煤", "机", "旋", "转", "分", "离", "器", "电", "机", "冷", "却", "风", "扇", "声", "音", "较", "大", "，", "联", "系", "华", "业", "。"],
			["2", "B", "磨", "煤", "机", "旋", "转", "分", "离", "器", "电", "机", "冷", "却", "风", "扇", "声", "音", "较", "大", "，", "联", "系", "华", "业", "。"],
			["2", "B", "磨", "煤", "机", "旋", "转", "分", "离", "器", "电", "机", "冷", "却", "风", "扇", "声", "音", "较", "大", "，", "联", "系", "华", "业", "。"],
			["2", "B", "磨", "煤", "机", "旋", "转", "分", "离", "器", "电", "机", "冷", "却", "风", "扇", "声", "音", "较", "大", "，", "联", "系", "华", "业", "。"],
			["2", "B", "磨", "煤", "机", "旋", "转", "分", "离", "器", "电", "机", "冷", "却", "风", "扇", "声", "音", "较", "大", "，", "联", "系", "华", "业", "。"],

		].forEach((value: string[], index: number) => {
			data.push({
				key: '' + index,
				text: value
			})
		})
		this.setState({ data })
		document.addEventListener('keydown', (e) => {
			if (e.ctrlKey) {
				const { labels, nameToColor } = this.state
				for (let i = 0; i < labels.length; i++) {
					if (labels[i]['key'] === e.key) {
						for (let name in nameToColor) {
							if (nameToColor[name] === 'blue') {
								nameToColor[name] = labels[i]['color']
							}
						}
						this.setState({ nameToColor })
						break;
					}
				}
			}
		})
	}

}

const mapStateToProps = (state:StoreType, ownProps?: any) => {
	const { MarkView } = state
	// console.log(Header)
	return {
			...ownProps,
			...MarkView,
	}
}

const mapDispatchToProps = {
  updateTextTablePage,
	updateMarkTextData
}


export default connect(mapStateToProps, mapDispatchToProps)(MarkView);