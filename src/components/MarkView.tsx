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


type labelRecordType = Array<Array<{
	start: number,
	end: number,
	label: string,
	text: string
}>>

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
	nameToColor: {
		[name: string]: string
	},
	labelRecord: labelRecordType
}
class MarkView extends Component<MarkViewProps, MarkViewState>{
	private startIndex: number
	private endIndex: number
	private columns: any
	private input: any
	private labelRecord: Array<{
		index: number,
		start: number,
		end: number,
		label: string,
	}>
	public constructor(props: MarkViewProps) {
		super(props)
		this.startIndex = -1
		this.endIndex = -1
		this.labelRecord = []
		this.state = {
			data: [],
			editKey: '',
			inputVisible: false,
			popoverVisibleName: '',
			labelSettingConfig: {
				label: '',
				color: '',
				key: '',
			},
			nameToColor: {

			},
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
									nameToColor[textBySelect] = 'blue';
									this.setState({ nameToColor })
									updateMarkTextData(data)
									this.labelRecord.push({
										index: current * 10 - 10 + index,
										start,
										end: end + 1,
										label: 'none',

									})
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
														const v = value;
														data[current * 10 - 10 + index]['textArr'].splice(i, 1)
														console.log(v, v.split(''));
														data[current * 10 - 10 + index]['textArr'].splice(i, 0, ...v.split(''))
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
		// console.log(this.labelRecord);
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
		const labelRecord: labelRecordType = this.props.data.map(() => [])
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
						for (let j = this.labelRecord.length - 1; j >=0; j--) {
							if (this.labelRecord[j]['label'] === 'none') {
								this.labelRecord[j]['label'] = labels[i]['name']
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