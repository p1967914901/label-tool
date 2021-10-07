import React, {Component} from 'react';
import 'antd/dist/antd.css';
import { Button, Modal, Table, Input, message } from 'antd';


import { RETURNTEXTSDATA, SAVE_TEXTS_DATA, SAVE_TEXTS_DATA_RESULT } from '../types/ipc';
import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined';
import ExclamationCircleOutlined from '@ant-design/icons/lib/icons/ExclamationCircleOutlined';
import { data } from 'jquery';


interface TextsViewProps {
    
}
interface TextsViewState {
    data: Array<{
        key: string,
        text: string,
        label: any
    }>,
    editKey: string;
}
class TextsView extends Component <TextsViewProps, TextsViewState>{
    private columns: any
    public constructor(props : TextsViewProps) {
        super(props)
        this.state = {
            data: [],
            editKey: ''
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
                render: (text: string, record: { key: string, text: string, label: any }, index: number) => {
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
                                            data: this.state.data.map((value: { key: string; text: string; label: any; }) => {
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
                            { this.state.editKey === record['key'] ? '保存' : '编辑' }
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
                                        this.setState({ data: data.filter((value:any, i: number) => i !== index) })
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
    
    public render() : JSX.Element {
        const { data } = this.state;
        data.forEach((val: any, index: number) => {
            val['key'] = '' + ( index + 1 )
        })
        return (
            <div>
                <Button size='middle' type='primary' onClick={
                    () => {
                        data.unshift({
                            key: '0',
                            text: '',
                            label: []
                        })
                        // labels.unshift({
                        //     kind: '',
                        //     color: '#999',
                        //     names: [],
                        // })
                        // disabledList.unshift(true)
                        // // console.log(labels)
                        this.setState({ data: [...data], editKey: '1' })
                    }
                } style={{
                    // float: 'right',
                    margin: '0px 10px 10px 0px'
                }}>
                    增加文本
                </Button>
                <Button size='middle' type='primary' onClick={
                    () => {
                        const { ipcRenderer } = (window as any).electron
                        ipcRenderer.send(SAVE_TEXTS_DATA, this.state.data)
                    }
                } style={{
                    // float: 'right',
                    margin: '0px 10px 10px 0px'
                }}>
                    保存
                </Button>
                <Table columns={this.columns} dataSource={data} size='small' 
                    pagination={{
                        pageSize: 5
                    }}
                />
            </div>
        )
    }

    public componentDidMount() {
        const { ipcRenderer } = (window as any).electron
        ipcRenderer.on(RETURNTEXTSDATA, (event: any, data: any) => {
            this.setState({ data })
        })
        ipcRenderer.on(SAVE_TEXTS_DATA_RESULT, (event: any, result: string) => {
            // console.log(result)
            if (result === 'success') {
                message.success('保存成功', 1.5)
            } else if (result === 'cancel') {
                message.success('已取消保存', 1.5)
            } else {
                message.error('保存失败', 1.5)
            }
        })
    }
}
export default TextsView;