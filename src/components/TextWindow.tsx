import React, { Component } from 'react';
import 'antd/dist/antd.css';
import { Button, Modal, Table, Input, message } from 'antd';
import { ExclamationCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import Icon from '@ant-design/icons';
import { AddIcon, SaveIcon, UpdateIcon } from './Icon';
import { UPLOAD_TEXTS_DATA } from '../types/ipc';

interface TextWindowProps {
	match: any
}
interface TextWindowState {
	isEmpty: boolean,
	editKey: string,
	data: Array<{
		key?: string,
		text: string,
		label: Array<{
			start: number,
			end: number,
			label: string
		}>
	}>,
	pageSize: number,
}

const { ipcRenderer } = (window as any).electron
const { WPCResolverDelegate } = (window as any).electron_wpc


class TextWindow extends Component<TextWindowProps, TextWindowState>{
	private columns: any
	public constructor(props: TextWindowProps) {
		super(props)
		this.state = {
			isEmpty: true,
			editKey: '',
			data: [
				{
					key: '1',
					text: 'dsoajmfosamfosao',
					label: []
				},{
					key: '2',
					text: 'gewgvwev',
					label: []
				},{
					key: '3',
					text: 'vdscas',
					label: []
				},{
					key: '1',
					text: 'dsoajmfosamfosao',
					label: []
				},{
					key: '4',
					text: 'dsoajmfosamfosao',
					label: []
				},{
					key: '5',
					text: 'dsoajmfosamfosao',
					label: []
				},
			],
			pageSize: 5
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
				width: '80%',
				// ellipsis: true,
				align: 'left',
				render: (text: string, record: { key?: string, text: string, label: any }, index: number) => {
					const { TextArea } = Input
					const { editKey } = this.state
					return editKey !== record['key'] ?
						<div>
							{text}
						</div> :
						<TextArea
							value={text}
							onChange={
								(e) => {
									const newText = e.target.value
									this.setState({
										data: this.state.data.map((value: { key?: string; text: string; label: any; }) => {
											if (value['key'] !== record['key']) return value;
											return {
												...value,
												text: newText
											}
										})
									})
								}
							}
							autoSize
						/>
				}
			}, {
				title: '操作',
				dataIndex: 'kind',
				render: (label: string, record: { key: string, text: string, label: any }, index: number) => (
					<React.Fragment>
						<Button size='small' type='primary' onClick={
							() => {
								const editKey: string = this.state.editKey === record['key'] ? '' : record['key']
								this.setState({ editKey })
							}
						} style={{
							// float: 'right',
							marginRight: '10px'
						}}>
							{this.state.editKey === record['key'] ? '保存' : '编辑'}
						</Button>
						<Button size='small' type='primary' onClick={
							() => {
								const { data } = this.state
								Modal.confirm({
									title: '警告',
									icon: <ExclamationCircleOutlined />,
									content: '请确认是否要删除改文本',
									okText: '确认',
									cancelText: '取消',
									onOk: () => {
										this.setState({ data: data.filter((value: any, i: number) => i !== index) })
									}
								});
							}
						} icon={<DeleteOutlined />} >
							删除
						</Button>
					</React.Fragment>

				),
				width: '20%',
				align: 'center'
			}
		]
	}

	public render(): JSX.Element {
		const { isEmpty, data, pageSize } = this.state
		data.forEach((value: { key?: string; text: string; label: any; }, index: number,) => {
			value['key'] = '' + index
		})
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
						this.uploadTextData()
					}
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
						
						<Table columns={this.columns} dataSource={data} size='small' 
								scroll={{ y: 380 }}
								pagination={{
									pageSize,
									position: ['topRight'],
									showSizeChanger: true,
									onChange: (page: number, pageSize?: number) => {
										this.setState({ pageSize: (pageSize as number) })
									}
								}}
						/>
						<Button size='middle' type='primary' icon={<Icon component={AddIcon} />} onClick={
								() => {
										data.unshift({
												key: '0',
												text: '',
												label: []
										})
										console.log('data')
										this.setState({ data: [...data], editKey: '0' })
								}
						} style={{
								position: 'absolute',
								top: 10
						}}>
								增加文本
						</Button>
						<Button type="primary" size='middle' icon={
							<Icon component={SaveIcon} />
						} style={{
							position: 'absolute',
							top: 10,
							left: 140
						}} onClick={
							() => {
								// ipcRenderer.send(SAVE_DICTIONARY_DATA, tableData)
							}
						}>
							另存为
						</Button>
						<Button icon={<Icon component={UpdateIcon} />} type="primary" 
							style={{
								position: 'absolute',
								top: 10,
								left: 250
							}}
							onClick={
								() => {
										// this.uploadDictionaryData()
								}
						}>
								更换语料
						</Button>
					</React.Fragment>
				}
			</div>
		)
	}

	public componentDidMount() {
		document.title = '语料数据'; 
		const { path } = this.props.match.params
		if (path !== 'none') {
			this.readFile(path.split('_').join('\\'))
		}
	}
	
	private uploadTextData(): void {
		const hide = message.loading('正在上传字典...', 0);
		const { data, path } = ipcRenderer.sendSync(UPLOAD_TEXTS_DATA)
		setTimeout(hide, 0);
		document.title = path; 
		const TAG = 'MAIN_WIN';
		const resolverDelegate = new WPCResolverDelegate (TAG);
		this.setState({ data }, () => {
			resolverDelegate.send(UPLOAD_TEXTS_DATA, [path.split('\\')[path.split('\\').length - 1], path])
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
		const fs = (window as any).fs;
		fs.readFile(path, 'utf-8', (err: any, dataString: string) => {
			if (err) {
					console.log(err)
			}
			const data: Array<{
				key?: string,
				text: string,
				label: Array<{
					start: number,
					end: number,
					label: string
				}>
			}> = []
			const lines = dataString.split("\r\n")
			lines.forEach((line) => {
					data.push({
							text: line,
							label: []
					});
			})
			this.setState({ data, isEmpty: false })
		})
		
	}
}
export default TextWindow;