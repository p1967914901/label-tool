import { PlusOutlined, ExclamationCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { Table, Input, Tag, Button, Modal, message } from 'antd';
import React, { Component } from 'react';
import Icon from '@ant-design/icons';
import { SAVE_DICTIONARY_DATA, UPLOAD_DICTIONARY_DATA } from '../types/ipc';
import { AddIcon, SaveIcon, UpdateIcon } from './Icon'
import { connect } from 'react-redux';
import { updateDictionaryData } from '../action'
import { DictionaryWindowStoreType, StoreType, TableDataType } from '../types/propsTypes';

interface DictionaryWindowProps extends DictionaryWindowStoreType {
  updateDictionaryData: typeof updateDictionaryData,
  match: any
}
interface DictionaryWindowState {
  pageSize: number,
  tableData: TableDataType,
  inputNameByShow: string,
  inputVisibleName: string,
  path: string
}


const { ipcRenderer } = (window as any).electron
const { WPCResolverDelegate } = (window as any).electron_wpc


class DictionaryWindow extends Component<DictionaryWindowProps, DictionaryWindowState>{
  private nameInput: any
  private input: any
  public constructor(props: DictionaryWindowProps) {
    super(props)
    this.state = {
      pageSize: 10,
      tableData: [],
      inputNameByShow: '',
      inputVisibleName: '',
      path: ''
    }
  }

  public render(): JSX.Element {
    const { Column } = Table;
    const { ipcRenderer } = (window as any).electron
    const { pageSize, inputNameByShow, inputVisibleName } = this.state
    const { tableData, path, updateDictionaryData } = this.props
    // console.log(path)
    tableData.forEach((value: { name: string; label: string; key?: string | undefined; abbreviations: string[]; }, index: number) => {
      value['key'] = '' + index
    })
    // console.log('object');
    return (
      <div style={{
        width: '100%',
        // height: '475px',
        padding: '0px 2%',
        position: 'relative'
        // backgroundColor: '#fafafa',
        // backgroundColor: 'red'
      }}>
        <Table dataSource={tableData} size='small'
          scroll={{ y: 420 }}
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
                      placeholder={name}
                      style={{ width: 70 }}
                      onBlur={	// 失去焦点保存
                        (e) => {
                          this.setState({ inputNameByShow: '' })
                          if (!e.target.value) return;
                          tableData[i]['name'] = e.target.value
                          updateDictionaryData(tableData, path)
                          // this.setState({ tableData })
                        }
                      }
                      onPressEnter={	// 键盘确定保存
                        (e) => {
                          this.setState({ inputNameByShow: '' })
                          if (!(e.target as any).value) return;
                          tableData[i]['name'] = (e.target as any).value
                          updateDictionaryData(tableData, path)
                          // this.setState({ tableData })
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
                          updateDictionaryData([...tableData], path)
                          // this.setState({ tableData })
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
                            // console.log(record, i);
                            this.setState({ inputVisibleName: '' })
                            if (!e.target.value) return;
                            tableData[parseInt(record['key'])]['abbreviations'].push(e.target.value)
                            updateDictionaryData(tableData, path)
                            // this.setState({ tableData })
                          }
                        }
                        onPressEnter={
                          (e) => {
                            this.setState({ inputVisibleName: '' })
                            if (!(e.target as any).value) return;
                            tableData[i]['abbreviations'].push((e.target as any).value)
                            updateDictionaryData(tableData, path)
                            // this.setState({ tableData })
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
                          updateDictionaryData([...tableData], path)
                          // this.setState({ tableData: [...tableData] })
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
            const { message, path } = ipcRenderer.sendSync(SAVE_DICTIONARY_DATA)
            if (message === 'success') {
              this.saveFile(path)
            } else {

            }
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
              this.uploadDictionaryData()
            }
          }>
          更换字典
        </Button>
        <Button size='middle' type='primary' icon={<Icon component={AddIcon} />} onClick={
            () => {
              tableData.unshift({
                key: '00',
                name: '',
                label: tableData.length ? tableData[0]['label'] : '',
                abbreviations: []
              })
              // // console.log('data')
              // this.setState({ inputNameByShow: '0' })
              updateDictionaryData([...tableData], path)
            }
          } style={{
            position: 'absolute',
            top: 10,
            left: 320
          }}>
            增加字典
          </Button>
      </div>
    )
  }

  public componentDidMount() {
    // 
    
  }


  private uploadDictionaryData(): void {
    // const { uploadNewDictionaryData } = this.props
    const hide = message.loading('正在上传字典...', 0);
    const { tableData, path } = ipcRenderer.sendSync(UPLOAD_DICTIONARY_DATA)
    setTimeout(hide, 0);
    document.title = path;
    // console.log(path.split('\\'));
    const TAG = 'MAIN_WIN';
    const resolverDelegate = new WPCResolverDelegate(TAG);

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
      // this.setState({ isEmpty: false })
    })
  }

  private readFile(path: string): void {
    // document.title = path
    const dataFile = (window as any).xlsx.parse(path)
    const tableData = dataFile[0]['data'].slice(1).map((arr: Array<string>) => ({
      label: arr[0],
      name: arr[1],
      abbreviations: [...arr.slice(2)]
    }))
    this.setState({ path }, () => {
      // this.setState({ tableData })
      this.props.updateDictionaryData(tableData, path)
    })
  }

  private saveFile(path: string) : void {
    const { tableData, updateDictionaryData } = this.props
    const configData = [{
        name: '字典',
        data: [
            ['标签', '全称', '别名']
        ]
    }]
    tableData.forEach((value) => {
        configData[0]['data'].push([
            value['label'], value['name'], ...value['abbreviations']
        ])
    })
    const buffer = (window as any).xlsx.build(configData);
    (window as any).fs.writeFile(path, buffer, (err: any) => {
      if (err) {

      }
      updateDictionaryData(tableData, path)
    })

  }

}

const mapStateToProps = (state:StoreType, ownProps?: any) => {
	const { DictionaryWindow } = state
	// console.log(Header)
	return {
			...ownProps,
			...DictionaryWindow,
	}
}

const mapDispatchToProps = {
  updateDictionaryData
}

export default connect(mapStateToProps, mapDispatchToProps)(DictionaryWindow);