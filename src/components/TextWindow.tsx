import React, { Component } from 'react';
import 'antd/dist/antd.css';
import { Button, Modal, Table, Input, message } from 'antd';
import { ExclamationCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import Icon from '@ant-design/icons';
import { AddIcon, LabelIcon, SaveIcon, UpdateIcon } from './Icon';
import { UPLOAD_TEXTS_DATA } from '../types/ipc';
import { connect } from 'react-redux';
import { StoreType, TextWindowStoreType } from '../types/propsTypes';
import { updateTextsData } from '../action';

interface TextWindowProps extends TextWindowStoreType {
  updateTextsData: typeof updateTextsData,
}
interface TextWindowState {
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
      editKey: '',
      data: [
        {
          key: '1',
          text: 'dsoajmfosamfosao',
          label: []
        }, {
          key: '2',
          text: 'gewgvwev',
          label: []
        }, {
          key: '3',
          text: 'vdscas',
          label: []
        }, {
          key: '1',
          text: 'dsoajmfosamfosao',
          label: []
        }, {
          key: '4',
          text: 'dsoajmfosamfosao',
          label: []
        }, {
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
        width: '70%',
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
                  const { data: originalData, path, updateTextsData } = this.props
                  const data = originalData.map((value: { key?: string; text: string; label: any; }) => {
                    if (value['key'] !== record['key']) return value;
                    return {
                      ...value,
                      text: newText
                    }
                  })
                  updateTextsData(data, path)
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
            <Button size='small' type='primary' 
              icon={<Icon component={LabelIcon} />}
              onClick={
                () => {
                  
                }
              } style={{
              // float: 'right',
              marginRight: '10px'
            }}>
              标注
            </Button>
            <Button size='small' type='primary' onClick={
              () => {
                const { data, path, updateTextsData } = this.props
                Modal.confirm({
                  title: '警告',
                  icon: <ExclamationCircleOutlined />,
                  content: '请确认是否要删除改文本',
                  okText: '确认',
                  cancelText: '取消',
                  onOk: () => {
                    updateTextsData(data.filter((value: any, i: number) => i !== index), path)
                  }
                });
              }
            } icon={<DeleteOutlined />} >
              删除
            </Button>
          </React.Fragment>

        ),
        width: '30%',
        align: 'center'
      }
    ]
  }

  public render(): JSX.Element {
    const { pageSize } = this.state
    const { data, path, updateTextsData } = this.props
    data.forEach((value: { key?: string; text: string; label: any; }, index: number,) => {
      value['key'] = '' + index
    })
    return (
      <div style={{
        width: '100%',
        height: '475px',
        padding: '0px 2%',
        backgroundColor: '#fafafa',
        position: 'relative'
      }}>
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
          <Button type="primary" size='middle' icon={
            <Icon component={SaveIcon} />
          } style={{
            position: 'absolute',
            top: 10
          }} onClick={
            () => {
              this.saveFile(path)
            }
          }>
            保存
          </Button>
          <Button type="primary" size='middle' icon={
            <Icon component={SaveIcon} />
          } style={{
            position: 'absolute',
            top: 10,
            left: 110 - 5
          }} onClick={
            () => {
              // const { message, path } = ipcRenderer.sendSync(SAVE_DICTIONARY_DATA)
              // if (message === 'success') {
              //   this.saveFile(path)
              // } else {

              // }
            }
          }>
            另存为
          </Button>
          <Button icon={<Icon component={UpdateIcon} />} type="primary"
            style={{
              position: 'absolute',
              top: 10,
              left: 210 - 5
            }}
            onClick={
              () => {
                // this.uploadDictionaryData()
              }
            }>
            更换字典
          </Button>
          <Button size='middle' type='primary' icon={<Icon component={AddIcon} />} onClick={
            () => {
              data.unshift({
                key: '00',
                text: '',
                label: []
              })
              // console.log('data')
              this.setState({ editKey: '0' })
              updateTextsData([...data], path)
            }
          } style={{
            position: 'absolute',
            top: 10,
            left: 320
          }}>
            增加文本
          </Button>
          
        </React.Fragment>
      </div>
    )
  }

  public componentDidMount() {

  }

  private uploadTextData(): void {
    const hide = message.loading('正在上传字典...', 0);
    const { data, path } = ipcRenderer.sendSync(UPLOAD_TEXTS_DATA)
    setTimeout(hide, 0);
    document.title = path;
    const TAG = 'MAIN_WIN';
    const resolverDelegate = new WPCResolverDelegate(TAG);
    this.setState({ data }, () => {
      resolverDelegate.send(UPLOAD_TEXTS_DATA, [path.split('\\')[path.split('\\').length - 1], path])
        .then((result: string) => {
          if (result === 'success') {
            message.success('新的字典上传成功', 1)
          } else {
            message.warning('字典已上传过', 1)
          }
        })
      // this.setState({ isEmpty: false })
    })

  }

  private saveFile(path: string) : void {
    const { data, updateTextsData } = this.props;
    let dataString = ''
    data.forEach((value: { key?: string | undefined; text: string; label: { start: number; end: number; label: string; }[]; }) => {
      dataString += (value['text'] + '\r\n')
    })
    const fs = (window as any).fs;
    fs.writeFile(path, dataString, (err: any) => {
      if (err) {

      }
      updateTextsData(data, path)
      // console.log('success')
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
      // this.setState({ data })
      // this.pr
    })

  }
}

const mapStateToProps = (state: StoreType, ownProps?: any) => {
  const { TextWindow } = state
  // console.log(Header)
  return {
    ...ownProps,
    ...TextWindow,
  }
}

const mapDispatchToProps = {
  updateTextsData
}

export default connect(mapStateToProps, mapDispatchToProps)(TextWindow);