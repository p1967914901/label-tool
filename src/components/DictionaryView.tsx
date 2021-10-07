import React, { Component } from 'react';
import 'antd/dist/antd.css';
import { Button, Input, Modal, Table, Tag, message } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';

// import $ from 'jquery';

import { RETURNDICTIONARYDATA, SAVEDICTIONARYDATA, SAVE_DICTIONARY_DATA_RESULT } from '../types/ipc';
// import { ColumnsType } from 'antd/lib/table/interface';


type labelsType = Array<{
    // key: string,
    kind: string,
    color: string,
    names: Array<{
        name: string,
        abbreviations: Array<string>
    }>,
}>

interface DictionaryProps {

}
interface DictionaryState {
    data: Array<{
        name: string,
        kind?: string,
        abbreviation?: string,
    }>,
    labels: labelsType,
    abbreviations: Array<{
        name: string,
        abbreviation: string,
    }>,
    disabledList: Array<boolean>,
    inputVisibleName: string,
    inputNameByShow: string
}
class Dictionary extends Component<DictionaryProps, DictionaryState>{
    private labelsColum:any
    private input:any
    private nameInput:any
    public constructor(props: DictionaryProps) {
        super(props)//<Input placeholder="Borderless" bordered={false} />
        this.labelsColum = [
            {
                title: '标签',
                dataIndex: 'kind',
                // align: 'center',
                // width: '30%',
                render: (label: string, record: any, index: number) => (
                    <Input value={label} bordered={!this.state.disabledList[index]} size='small' id={'label-' + label}
                        onChange={
                            (e) => {
                                const { labels } = this.state
                                labels[index]['kind'] = e.target.value
                                this.setState({ labels })
                            }
                        }
                        disabled={this.state.disabledList[index]}    
                        style={{
                                width: 100
                            }}
                            
                        />
                )
            },{
                title: '颜色',
                dataIndex: 'color',
                render: (color: string) => (
                    <div style={{
                        width: '50px',
                        height: '24px',
                        float: 'left',
                        // margin: '0px 10px 10px 0px',
                        backgroundColor: color,
                        color: 'white',
                        lineHeight: '20px',
                        textAlign: 'center',
                        borderRadius: '5px'
                    }}>
                        {color}
                    </div>
                )
                // width: '30%',
            },{
                title: '操作',
                dataIndex: 'kind',
                render: (label: string, record: unknown, index: number) => (
                    <React.Fragment>
                        <Button size='small' type='primary' onClick={
                            () => {
                                const { disabledList } = this.state
                                disabledList[index] = !disabledList[index]
                                this.setState({ disabledList })
                            }
                        } style={{
                            // float: 'right',
                            marginRight: '10px'
                        }}>
                            {this.state.disabledList[index] ? '编辑' : '保存'}
                        </Button>
                        <Button size='small' type='primary' onClick={
                            () => {
                                const { labels } = this.state
                                Modal.confirm({
                                    title: '警告',
                                    icon: <ExclamationCircleOutlined />,
                                    content: '请确认是否要删除 ' + label + ' 标签',
                                    okText: '确认',
                                    cancelText: '取消',
                                    onOk: () => {
                                        this.setState({ labels: labels.filter((value:any, i: number) => i !== index) })
                                    }
                                });
                            }
                        } icon={<DeleteOutlined />} >
                            删除
                        </Button>
                    </React.Fragment>
                    
                )
                // width: '30%',
            }
        ]
        this.state = {
            data: [],
            labels: [],
            abbreviations: [],
            disabledList: [],
            inputVisibleName: '',
            inputNameByShow: ''
        }
    }

    public render(): JSX.Element {
        // const { Panel } = Collapse;
        const { Column } = Table;
        const { labels, disabledList, inputVisibleName, inputNameByShow } = this.state
        labels.forEach((value: any, index: number) => {
            value['key'] = 'label' + index
        })
        // console.log(labels)
        return (
            <div>
                <Button size='middle' type='primary' onClick={
                    () => {
                        labels.unshift({
                            kind: '',
                            color: '#999',
                            names: [],
                        })
                        disabledList.unshift(true)
                        // console.log(labels)
                        this.setState({ labels: [...labels], disabledList: [...disabledList] })
                    }
                } style={{
                    // float: 'right',
                    margin: '0px 10px 10px 0px'
                }}>
                    增加标签
                </Button>
                <Button size='middle' type='primary' onClick={
                    () => {
                        const { ipcRenderer } = (window as any).electron
                        ipcRenderer.send(SAVEDICTIONARYDATA, this.state.labels)
                    }
                } style={{
                    // float: 'right',
                    margin: '0px 10px 10px 0px'
                }}>
                    保存
                </Button>
                <Table dataSource={labels} size='middle' columns={this.labelsColum}
                    scroll={{
                        y: 310,
                        scrollToFirstRowOnChange: true
                    }}
                    pagination={{
                        // pageSize: 3,
                        showSizeChanger: true,
                        onChange: (page: number, pageSize?: number) => {
                            console.log('page:', page, 'pageSize:', pageSize)
                        }
                    }}
                    expandable={{
                        expandedRowRender: (record: { kind: string; color: string; names: { name: string; abbreviations: string[]; }[]; }, index: number) => {
                            // console.log(record, index, indent, expanded);
                            const tableData = record['names'].map((value: { name: string; abbreviations: string[]; }, i: number) => ({
                                ...value,
                                key: 'label' + index + '-' + i
                            }))
                            return (
                                <React.Fragment>
                                <Button size='middle' type='primary' onClick={
                                    () => {
                                        labels[index]['names'].unshift({
                                            name: '',
                                            abbreviations: []
                                        })
                                        this.setState({ labels }, () => {
                                            this.nameInput.focus()
                                        })
                                    }
                                } style={{
                                    // float: 'right',
                                    margin: '0px 10px 10px 0px'
                                }}>
                                    增加别名
                                </Button>
                                <Table dataSource={tableData} size='small' 
                                    pagination={{
                                        // pageSize: 3,
                                        showSizeChanger: true,
                                        onChange: (page: number, pageSize?: number) => {
                                            console.log('page:', page, 'pageSize:', pageSize)
                                        }
                                    }}
                                >
                                    <Column title="名称" dataIndex="name" key="name" 
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
                                                            onBlur={
                                                                (e) => {
                                                                    this.setState({ inputNameByShow: '' })
                                                                    if (!e.target.value) return;
                                                                    // console.log(labels[index]['names'][i]['abbreviations'])
                                                                    labels[index]['names'][i]['name']= e.target.value
                                                                    this.setState({ labels: [...labels] })
                                                                }
                                                            }
                                                            onPressEnter={
                                                                (e) => {
                                                                    // console.log((e.target as any).value)
                                                                    this.setState({ inputNameByShow: '' })
                                                                    if (!(e.target as any).value) return;
                                                                    // console.log(labels[index]['names'][i]['abbreviations'])
                                                                    labels[index]['names'][i]['name']= (e.target as any).value
                                                                    this.setState({ labels: [...labels] })
                                                                }
                                                            }
                                                        />
                                                    
                                                )
                                            }
                                        }
                                    />
                                    <Column 
                                        title="别名"
                                        dataIndex="abbreviations"
                                        key="abbreviations"
                                        render={
                                            (abbreviations, record: unknown, i: number) => (
                                                <>
                                                    {
                                                        abbreviations.map((abbreviation:string) => (
                                                            <Tag closable color="blue" key={abbreviation} onClose={
                                                                (e) => {
                                                                    e.preventDefault()
                                                                    const newNames:Array<string> = abbreviations.filter((name:string) => name !== abbreviation)
                                                                    labels[index]['names'][i]['abbreviations'] = [...newNames]
                                                                    this.setState({ labels: [...labels] })
                                                                }
                                                            }>
                                                                {abbreviation}
                                                            </Tag>
                                                        ))
                                                    }
                                                    {
                                                        'label' + index + '-' + i === inputVisibleName && (
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
                                                                    // console.log(e.target.value)
                                                                    this.setState({ inputVisibleName: '' })
                                                                    if (!e.target.value) return;
                                                                    labels[index]['names'][i]['abbreviations'].push(e.target.value)
                                                                    this.setState({ labels: [...labels] })
                                                                }
                                                            }
                                                            onPressEnter={
                                                                (e) => {
                                                                    // console.log((e.target as any).value)
                                                                    this.setState({ inputVisibleName: '' })
                                                                    if (!(e.target as any).value) return;
                                                                    labels[index]['names'][i]['abbreviations'].push((e.target as any).value)
                                                                    this.setState({ labels: [...labels] })
                                                                }
                                                            }
                                                        />
                                                        )
                                                    }
                                                    {
                                                        'label' + index + '-' + i !== inputVisibleName &&
                                                        <Tag className="site-tag-plus" onClick={
                                                            () => {
                                                                this.setState({ inputVisibleName: 'label' + index + '-' + i }, () => {
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
                                                            console.log(record, index, i)
                                                            const { labels } = this.state
                                                            Modal.confirm({
                                                                title: '警告',
                                                                icon: <ExclamationCircleOutlined />,
                                                                content: '请确认是否要删除 ' + name + ' 的别名字典',
                                                                okText: '确认',
                                                                cancelText: '取消',
                                                                onOk: () => {
                                                                    labels[index]['names'].splice(i, 1)
                                                                    this.setState({ labels: [...labels] })
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
                                </React.Fragment>
                            )
                        }
                    }}
                >
                </Table>
            </div>
        )
    }

    public componentDidMount() {
        const { ipcRenderer } = (window as any).electron
        // ipcRenderer.send(UPLOADDICTIONARYDATA)
        // this.setState({
        //     labels: [{
        //         // key: 'label0',
        //         "kind": "equ",
        //         color: '#e3e',
        //         "names": [
        //             {
        //                 "name": "送风机",
        //                 "abbreviations": [
        //                     "送风"
        //                 ]
        //             },{
        //                 "name": "磨煤机",
        //                 "abbreviations": [
        //                     "钢球磨煤机", "球磨机", "中速磨"
        //                 ]
        //             },{
        //                 "name": "给煤机",
        //                 "abbreviations": [
        //                     "皮带给煤机"
        //                 ]
        //             },{
        //                 "name": "空预器",
        //                 "abbreviations": [
        //                     "空气预热器", "容克式换热器", "空气换热器"
        //                 ]
        //             },{
        //                 "name": "送风机1",
        //                 "abbreviations": [
        //                     "送风"
        //                 ]
        //             },{
        //                 "name": "磨煤机1",
        //                 "abbreviations": [
        //                     "钢球磨煤机", "球磨机", "中速磨"
        //                 ]
        //             },{
        //                 "name": "给煤机1",
        //                 "abbreviations": [
        //                     "皮带给煤机"
        //                 ]
        //             },{
        //                 "name": "空预器1",
        //                 "abbreviations": [
        //                     "空气预热器", "容克式换热器", "空气换热器"
        //                 ]
        //             }
        //         ]
        //     },{
        //         // key: 'label1',
        //         "kind": "per",
        //         color: '#589',
        //         "names": [
        //             {
        //                 "name": "王二",
        //                 "abbreviations": [
                            
        //                 ]
        //             },{
        //                 "name": "李三",
        //                 "abbreviations": [
                            
        //                 ]
        //             },
        //             {
        //                 "name": "周董",
        //                 "abbreviations": [
                            
        //                 ]
        //             }
        //         ]
        //     }], disabledList: [true, true, true]
        // })
        ipcRenderer.on(RETURNDICTIONARYDATA, (event: any, data: any) => {
            // const label:Array<string> = []
            const colors:Array<string> = [
                '#145415', '#988432', '#748', '#558741', '#729813'
            ]
            const labels:labelsType = []

            data.forEach((value: any) => {
                labels.push({
                    color: colors[labels.length],
                    ...value
                })
            })
            this.setState({ labels, disabledList: labels.map(() => true) })
            // console.log(event, arg)
        })
        ipcRenderer.on(SAVE_DICTIONARY_DATA_RESULT, (event: any, result: string) => {
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
export default Dictionary;