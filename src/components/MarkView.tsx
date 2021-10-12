import React, { Component } from 'react';
import { Input, Modal, Table, Tag } from 'antd';
import 'antd/dist/antd.css';
import Icon, { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
// import $ from 'jquery'
import { ColorResult, SketchPicker } from 'react-color';
import { SettingIcon } from './Icon';




interface MarkViewProps {

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
	displayColorPicker: boolean,
	// colorPickerColor: string,
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
			displayColorPicker: false,
			labelSettingConfig: {
				label: '',
				color: '',
				key: '',
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
				}, {
					color: '#93b7e3',
					name: 'per',
					key: 'p'
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
				dataIndex: 'text',
				key: 'text',
				// width: '70%',
				// ellipsis: true,
				align: 'left',
				render: (text: Array<string>, record: { key?: string, text: Array<string> }, index: number) => {
					return (
						<div onMouseUp={
							() => {
								console.log(getSelection())
							}
						}>
							{
								text.map((value: string, i: number) => {
									if (value.length === 1) {
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
													console.log(this.startIndex, this.endIndex)
													// if (this.startIndex === this.endIndex && getSelection()?.toString() === value) {
													//     console.log(value)
													// }
													const { data } = this.state
													let start = Math.min(this.startIndex, this.endIndex)
													let end = Math.max(this.startIndex, this.endIndex)
													if (text.slice(start, end + 1).join('') === getSelection()?.toString()) {
														data[index]['text'].splice(start, end + 1 - start)
														data[index]['text'].splice(start, 0, getSelection()?.toString() as string)
														this.setState({ data: [...data] })
													}
													console.log(getSelection()?.toString());
													getSelection()?.removeAllRanges()
												}
											}>
												{value}
											</div>
										)
									} else {
										return (
											<Tag key={i} color={'black'} closable style={{
												marginLeft: '5px'
											}} onClose={
												() => {
													const { data } = this.state
													data[index]['text'].splice(i, 1)
													data[index]['text'].splice(i, 0, ...value.split(''))
													this.setState({ data: [...data] })
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
		const { data, labels, inputVisible, displayColorPicker, labelSettingConfig } = this.state
		// console.log(data)
		return (
			<div style={{
				width: '100%',
				height: '500px',
				// backgroundColor: 'red'
				borderBottom: '1px solid black'
			}}>
				
				<div style={{
					width: '100%',
					height: '50px',
					padding: '10px',
					// position: 'absolute'
				}}>
					{
						labels.map((value: { color: string; name: string; key: string; }, index: number) => (
							<Tag closable color={value['color']} key={'name' + index}
								icon={<Icon component={SettingIcon} onClick={
									() => {
										const labelSettingConfig = {
											label: value['name'],
											color: value['color'],
											key: value['key']
										}
										this.setState({ labelSettingConfig }, () => {
											Modal.info({
												title: '警告',
												icon: <Icon component={SettingIcon} />,
												content: (
													<div style={{
														width: '80%',
														height: '100px',
														lineHeight: '30px',
														// backgroundColor: 'red',
													}}>
														<div style={{
															height: '30px'
														}}>
															标签名：<Input defaultValue={labelSettingConfig.label} size='small' onChange={
																(e) => {
																	labelSettingConfig.label = e.target.value
																	this.setState({ labelSettingConfig: {...labelSettingConfig} })
																}
															} style={{
																width: '100px'
															}}/>
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
															<Input maxLength={1} defaultValue	={labelSettingConfig.key} size='small' onChange={
																(e) => {
																	labelSettingConfig.key = e.target.value
																	this.setState({ labelSettingConfig: {...labelSettingConfig} })
																}
															} style={{
																width: '30px'
															}}/>
														</div>
														<div style={{
															height: '30px',
															// po
														}}>
															颜色：
															<div style={{
																width: '20px',
																height: '20px',
																transform: 'translate(15px, 5px)',
																// marginTop: '10px',
																// margin: '5px',
																display: 'inline-block',
																backgroundColor: labelSettingConfig.color
															}} onClick={
																() => {
																	console.log('object')
																	
																	this.setState({ displayColorPicker: displayColorPicker ? false : true })
																}
															}>

															</div>
														</div>
													</div>
												),
												okText: '确认',
												cancelText: '取消',
												onOk: () => {
													labels.splice(index, 1)
													this.setState({ labels })
												}
											});
										})
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
							<PlusOutlined /> 添加别名
						</Tag>
					}
				</div>
				<Table columns={this.columns} dataSource={data} size='small'
					scroll={{ y: 380 }}
				/>
				{
					displayColorPicker &&
					<div style={{
						position: 'fixed',
						top: '100px',
						zIndex: 99999,
						backgroundColor: 'red'
						// width: '100%'
					}}>
						<SketchPicker color={labelSettingConfig.color} 
							onChange={
								(color: ColorResult) => {
									labelSettingConfig.color = color.hex
									this.setState({ labelSettingConfig })
								}
							}
						/>
					</div>
				}
			</div>
		)
	}

	public componentDidMount() {
		const data: Array<{
			key?: string,
			text: Array<string>
		}> = [];
		[
			["富", "动", "24", "煤", "（", "0", ".", "5", "3", "%", "上", "2", "A", "仓", "，", "富", "动", "2", "4", "煤", "（", "0", ".", "8", "0", "%", "）", "上", "2", "C", "D", "仓", "，", "中", "水", "澳", "优", "（", "0", ".", "4", "7", "%", "）", "上", "1", "B", "D", "仓", "，", "优", "混", "煤", "（", "0", ".", "8", "6", "%", "）", "上", "#", "1", "炉", "其", "余", "仓", "，", "优", "混", "煤", "（", "1", ".", "3", "4", "%", "）", "上", "#", "2", "炉", "其", "余", "仓", "。"],
			["富", "动", "24", "煤", "（", "0", ".", "5", "3", "%", "上", "2", "A", "仓", "，", "富", "动", "2", "4", "煤", "（", "0", ".", "8", "0", "%", "）", "上", "2", "C", "D", "仓", "，", "中", "水", "澳", "优", "（", "0", ".", "4", "7", "%", "）", "上", "1", "B", "D", "仓", "，", "优", "混", "煤", "（", "0", ".", "8", "6", "%", "）", "上", "#", "1", "炉", "其", "余", "仓", "，", "优", "混", "煤", "（", "1", ".", "3", "4", "%", "）", "上", "#", "2", "炉", "其", "余", "仓", "。"],
			["富", "动", "24", "煤", "（", "0", ".", "5", "3", "%", "上", "2", "A", "仓", "，", "富", "动", "2", "4", "煤", "（", "0", ".", "8", "0", "%", "）", "上", "2", "C", "D", "仓", "，", "中", "水", "澳", "优", "（", "0", ".", "4", "7", "%", "）", "上", "1", "B", "D", "仓", "，", "优", "混", "煤", "（", "0", ".", "8", "6", "%", "）", "上", "#", "1", "炉", "其", "余", "仓", "，", "优", "混", "煤", "（", "1", ".", "3", "4", "%", "）", "上", "#", "2", "炉", "其", "余", "仓", "。"],
			["富", "动", "24", "煤", "（", "0", ".", "5", "3", "%", "上", "2", "A", "仓", "，", "富", "动", "2", "4", "煤", "（", "0", ".", "8", "0", "%", "）", "上", "2", "C", "D", "仓", "，", "中", "水", "澳", "优", "（", "0", ".", "4", "7", "%", "）", "上", "1", "B", "D", "仓", "，", "优", "混", "煤", "（", "0", ".", "8", "6", "%", "）", "上", "#", "1", "炉", "其", "余", "仓", "，", "优", "混", "煤", "（", "1", ".", "3", "4", "%", "）", "上", "#", "2", "炉", "其", "余", "仓", "。"],
			["富", "动", "24", "煤", "（", "0", ".", "5", "3", "%", "上", "2", "A", "仓", "，", "富", "动", "2", "4", "煤", "（", "0", ".", "8", "0", "%", "）", "上", "2", "C", "D", "仓", "，", "中", "水", "澳", "优", "（", "0", ".", "4", "7", "%", "）", "上", "1", "B", "D", "仓", "，", "优", "混", "煤", "（", "0", ".", "8", "6", "%", "）", "上", "#", "1", "炉", "其", "余", "仓", "，", "优", "混", "煤", "（", "1", ".", "3", "4", "%", "）", "上", "#", "2", "炉", "其", "余", "仓", "。"],
			["富", "动", "24", "煤", "（", "0", ".", "5", "3", "%", "上", "2", "A", "仓", "，", "富", "动", "2", "4", "煤", "（", "0", ".", "8", "0", "%", "）", "上", "2", "C", "D", "仓", "，", "中", "水", "澳", "优", "（", "0", ".", "4", "7", "%", "）", "上", "1", "B", "D", "仓", "，", "优", "混", "煤", "（", "0", ".", "8", "6", "%", "）", "上", "#", "1", "炉", "其", "余", "仓", "，", "优", "混", "煤", "（", "1", ".", "3", "4", "%", "）", "上", "#", "2", "炉", "其", "余", "仓", "。"],
		].forEach((value: string[], index: number) => {
			data.push({
				key: '' + index,
				text: value
			})
		})
		this.setState({ data })
	}


}
export default MarkView;