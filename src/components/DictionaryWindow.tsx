import { PlusOutlined, ExclamationCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { Table, Input, Tag, Button, Modal, message } from 'antd';
import React, { Component } from 'react';
import Icon from '@ant-design/icons';
import { SAVE_DICTIONARY_DATA, UPLOAD_DICTIONARY_DATA } from '../types/ipc';
import { SaveIcon, UpdateIcon } from './Icon'
import { connect } from 'react-redux';
import { uploadNewDictionaryData } from '../action'

interface DictionaryWindowProps {
	uploadNewDictionaryData: typeof uploadNewDictionaryData,
	match: any
}
interface DictionaryWindowState {
	isEmpty: boolean,
	pageSize: number,
	tableData: Array<{
		name: string,
		label: string,
		key?: string,
		abbreviations: Array<string>
	}>,
	inputNameByShow: string,
	inputVisibleName: string
}


const { ipcRenderer } = (window as any).electron
const { WPCResolverDelegate } = (window as any).electron_wpc


class DictionaryWindow extends Component<DictionaryWindowProps, DictionaryWindowState>{
	private nameInput: any
	private input:any
	public constructor(props: DictionaryWindowProps) {
		super(props)
		this.state = {
			isEmpty: true,
			pageSize: 7,
			tableData: [],
			inputNameByShow: '',
			inputVisibleName: ''
		}
	}

	public render(): JSX.Element {
		const { Column } = Table;
		const { ipcRenderer } = (window as any).electron
		const { isEmpty, pageSize, tableData, inputNameByShow, inputVisibleName } = this.state
		return (
			<div style={{
				width: '100%',
				height: '475px',
				cursor: isEmpty ? 'pointer' : 'default',
				padding: '0px 2%',
				backgroundColor: '#fafafa'
			}} onClick={
				() => {
					if (isEmpty) {
						this.uploadDictionaryData()
					}
					// this.setState({ isEmpty: false })
				}
			}>
				{
					isEmpty &&
					<React.Fragment>
						<svg viewBox="0 0 1445 1024" width="100" height="100" style={{
							margin: '100px 0px 0px 350px'
						}}>
							<path d="M1237.052235 496.158118a272.986353 272.986353 0 0 1 154.925177 246.844235c0 145.347765-113.724235 265.637647-260.397177 273.950118l-740.47247 0.722823-19.034353-0.843294a354.785882 354.785882 0 0 1-338.763294-354.665412c0-194.861176 158.539294-354.243765 353.460706-355.388235l5.421176-0.060235 2.168471-5.059765A435.561412 435.561412 0 0 1 796.912941 33.792a436.826353 436.826353 0 0 1 436.344471 436.344471 1276.988235 1276.988235 0 0 0-1.084236 23.67247l4.818824 2.349177z m-509.289411-169.502118L476.882824 577.536l53.910588 53.850353 158.84047-158.840471v348.822589h76.257883v-348.762353l158.84047 158.780235 53.910589-53.850353-250.88-250.88z" fill="#478EEE" />
						</svg>
						<div style={{
							width: "100%",
							textAlign: 'center',
							fontWeight: 'bold',
							fontSize: '16px',
							paddingLeft: '2%'
							// padding: '0px 2%',

						}}>
							点击或拖入文件即可上传
						</div>
					</React.Fragment>
				}
				{
					!isEmpty &&
					<React.Fragment>
						<Table dataSource={tableData} size='small'
							scroll={{ y: 380 }}
							pagination={{
								pageSize,
								position: ['topRight'],
								showSizeChanger: true,
								onChange: (page: number, pageSize?: number) => {
									this.setState({ pageSize: (pageSize as number) })
									// console.log('page:', page, 'pageSize:', pageSize)
								}
							}}
						>
							<Column title="名称" dataIndex="name" key="name" width='15%'
								render={
									(name: string, r: unknown, i: number) => {
										return (
											inputNameByShow !== name ?
												<div onMouseEnter={
													() => {
														this.setState({ inputNameByShow: name }, () => {
															this.nameInput.focus()
														})
													}
												}>
													{name}
												</div> :
												<Input
													ref={
														(input) => {
															this.nameInput = input
														}
													}
													type="text"
													size="small"
													style={{ width: 70 }}
													onBlur={	// 失去焦点保存
														(e) => {
															this.setState({ inputNameByShow: '' })
															if (!e.target.value) return;
															tableData[i]['name'] = e.target.value
															this.setState({ tableData })
														}
													}
													onPressEnter={	// 键盘确定保存
														(e) => {
															this.setState({ inputNameByShow: '' })
															if (!(e.target as any).value) return;
															tableData[i]['name'] = (e.target as any).value
															this.setState({ tableData })
														}
													}
												/>

										)
									}
								}
							/>
							<Column width='75%'
								title="别名"
								dataIndex="abbreviations"
								key="abbreviations"
								render={
									(abbreviations, record: {
										name: string,
										label: string,
										key: string,
										abbreviations: Array<string>
									}, i: number) => (
										<>
											{
												abbreviations.map((abbreviation: string) => (
													<Tag closable color="blue" key={abbreviation} onClose={
														(e) => {
															e.preventDefault()
															const newNames: Array<string> = abbreviations.filter((name: string) => name !== abbreviation)
															tableData[i]['abbreviations'] = [...newNames]
															this.setState({ tableData })
														}
													}>
														{abbreviation}
													</Tag>
												))
											}
											{
												'label' + i === inputVisibleName && (
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
																console.log(record, i);
																this.setState({ inputVisibleName: '' })
																if (!e.target.value) return;
																tableData[parseInt(record['key'])]['abbreviations'].push(e.target.value)
																this.setState({ tableData })
															}
														}
														onPressEnter={
															(e) => {
																this.setState({ inputVisibleName: '' })
																if (!(e.target as any).value) return;
																tableData[i]['abbreviations'].push((e.target as any).value)
																this.setState({ tableData })
															}
														}
													/>
												)
											}
											{
												'label' + i !== inputVisibleName &&
												<Tag className="site-tag-plus" onClick={
													() => {
														this.setState({ inputVisibleName: 'label' + i }, () => {
															(this.input as any).focus();
														})
													}
												}>
													<PlusOutlined /> 添加别名
												</Tag>
											}
										</>
									)
								}
							/>
							<Column title="操作" dataIndex="name" key="action"
								render={
									(name: any, r: unknown, i: number) => {
										return (
											<Button size='small' type='primary' onClick={
												() => {
													Modal.confirm({
														title: '警告',
														icon: <ExclamationCircleOutlined />,
														content: '请确认是否要删除 ' + name + ' 的别名字典',
														okText: '确认',
														cancelText: '取消',
														onOk: () => {
															tableData.splice(i, 1)
															this.setState({ tableData: [...tableData] })
														}
													});
												}
											} icon={<DeleteOutlined />} >
												删除
											</Button>
										)
									}
								}
							/>
						</Table>
						<Button type="primary" size='middle' icon={
							<Icon component={SaveIcon} />
						} style={{
							position: 'absolute',
							top: 10
						}} onClick={
							() => {
								ipcRenderer.send(SAVE_DICTIONARY_DATA, tableData)
							}
						}>
							另存为
						</Button>
						<Button icon={<Icon component={UpdateIcon} />} type="primary" 
							style={{
								position: 'absolute',
								top: 10,
								left: 120
							}}
							onClick={
								() => {
										this.uploadDictionaryData()
								}
						}>
								更换字典
						</Button>
					</React.Fragment>
				}
			</div>
		)
	}

	public componentDidMount() {
		// 
		// this.setState({ tableData })
		document.title = '字典数据'; 
		const { path } = this.props.match.params
		if (path !== 'none') {
			this.readFile(path.split('_').join('\\'))
		}

	}

	private uploadDictionaryData() : void {
		// const { uploadNewDictionaryData } = this.props
		const hide = message.loading('正在上传字典...', 0);
		const { tableData, path } = ipcRenderer.sendSync(UPLOAD_DICTIONARY_DATA)
		setTimeout(hide, 0);
		document.title = path; 
		// console.log(path.split('\\'));
		const TAG = 'MAIN_WIN';
		const resolverDelegate = new WPCResolverDelegate (TAG);
    
		// uploadNewDictionaryData(path.split('\\')[path.split('\\').length - 1], path)
		this.setState({
			tableData: tableData.map((v: any, i: number) => ({
				...v,
				key: '' + i
			}))
		}, () => {
			resolverDelegate.send(UPLOAD_DICTIONARY_DATA, [path.split('\\')[path.split('\\').length - 1], path])
										.then((result: string) => {
												if (result === 'success') {
													message.success('新的字典上传成功', 1)
												} else {
													message.warning('字典已上传过', 1)
												}
										})
			this.setState({ isEmpty: false })
		})
	}

	private readFile(path: string): void {
		document.title = path
		const dataFile = (window as any).xlsx.parse(path)
		const tableData = dataFile[0]['data'].slice(1).map((arr:Array<string>) => ({
				label: arr[0],
				name: arr[1],
				abbreviations: [...arr.slice(2)]
		}))
		this.setState({ tableData, isEmpty: false })
	}
}

// const mapStateToProps = (state:StoreType, ownProps?: any) => {
// 	const { Main } = state
// 	// console.log(Header)
// 	return {
// 			...ownProps,
// 			...Main,
// 	}
// }

const mapDispatchToProps = {
	uploadNewDictionaryData
}

export default connect(null, mapDispatchToProps)(DictionaryWindow);