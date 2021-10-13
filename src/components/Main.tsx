import React, { Component } from 'react';
import { Layout, Menu, Button } from 'antd';
import 'antd/dist/antd.css';
import { UploadOutlined, PlayCircleOutlined, FileTextOutlined } from '@ant-design/icons';
import Icon from '@ant-design/icons';
import {
  // BrowserRouter as Router, 
  Route,
  // Link,
  Switch,
} from 'react-router-dom'
// import DictionaryView from './DictionaryView';
import { OPEN_MODEL_CONFIG_WINDOW, UPLOAD_DICTIONARY_DATA, UPLOAD_TEXTS_DATA } from '../types/ipc';
import { DictionaryIcon } from './Icon'
import { MainStoreType, StoreType, TextsDataType } from '../types/propsTypes';
import { connect } from 'react-redux';
import DictionaryWindow from './DictionaryWindow';
import { updateDictionaryData, updateTextsData } from '../action';
import TextWindow from './TextWindow';
import MarkView from './MarkView';


const { ipcRenderer } = (window as any).electron

// import TextsView from './TextsView';

interface MainProps extends MainStoreType {
  history: any,
  updateDictionaryData: typeof updateDictionaryData,
  updateTextsData: typeof updateTextsData,
}
interface MainState {
  dictionaryList: Array<[name: string, path: string]>
  stringList: Array<[name: string, path: string]>,
  openKeys: Array<string>,
  selectedKeys: Array<string>,

}
class Main extends Component<MainProps, MainState>{
  public constructor(props: MainProps) {
    super(props)
    this.state = {
      dictionaryList: [
        // ['dict1', ''],
        // ['dict2', ''],
        // ['dict3', ''],
        // ['dict4', ''],
        // ['dict5', ''],
      ],
      stringList: [
        // ['dict1', ''],
        // ['dict2', ''],
        // ['dict3', ''],
        // ['dict4', ''],
        // ['dict5', ''],
      ],
      openKeys: ['directory'],
      selectedKeys: []
    }
  }

  public render(): JSX.Element {
    const { Header, Sider, Content } = Layout;
    const { SubMenu } = Menu;
    const { dictionaryList, stringList, openKeys, selectedKeys } = this.state
    const { history } = this.props
    // console.log('object:', openKeys, selectedKeys);
    return (
      <Layout>
        <Sider trigger={null} theme="light">
          <div className="logo" style={{
            width: '100%',
            height: '60px',
            // marginLeft: '2%',
            lineHeight: '60px',
            textAlign: 'center',
            fontSize: '24px',
            fontWeight: 'bold',
            color: 'rgb(13,110,253)',
            userSelect: 'none'
          }} onClick={
            () => {
              history.push('/')
            }
          }>
            实体抽取工具
          </div>
          <Menu theme="light" mode="inline" openKeys={openKeys} selectedKeys={selectedKeys}>
            <SubMenu key="dictionary" title="字典数据" icon={<Icon component={DictionaryIcon} />} onTitleClick={
              (e) => {
                // console.log(e);
                this.setState({ openKeys: openKeys[0] === e.key ? [] : [e.key] })
              }
            }>
              {
                dictionaryList.map((value: [name: string, path: string], index: number) => (
                  <Menu.Item key={'dictionary' + index} onClick={
                    () => {
                      // console.log(value[1].split('\\').join('_'));
                      history.push('/dictionary')
                      this.setState({ selectedKeys: ['dictionary' + index] })
                      this.readXlsxFile(value[1])
                    }
                  }>
                    {value[0]}
                  </Menu.Item>
                ))
              }
            </SubMenu>
            <SubMenu key="text" title="语料数据" icon={<FileTextOutlined />} onTitleClick={
              (e) => {

                this.setState({ openKeys: openKeys[0] === e.key ? [] : [e.key] })
              }
            }>
              {
                stringList.map((value: [name: string, path: string], index: number) => (
                  <Menu.Item key={'text' + index} onClick={
                    () => {
                      this.setState({ selectedKeys: ['text' + index] })
                      history.push('/texts')
                      this.readTxtFile(value[1])
                      // console.log(value[1]);
                      // ipcRenderer.send(OPEN_TEXT_WINDOW, { path: value[1].split('\\').join('_') })

                    }
                  }>
                    {value[0]}
                  </Menu.Item>
                ))
              }
            </SubMenu>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0, backgroundColor: 'white' }}>
            <Button icon={<UploadOutlined />} onClick={
              () => {
                const path: string = ipcRenderer.sendSync(UPLOAD_DICTIONARY_DATA)
                if (path === '') {
                  return;
                }
                history.push('/dictionary')
                dictionaryList.push([path.split('\\')[path.split('\\').length - 1], path])
                let index = dictionaryList.length - 1
                for (let i = 0; i < dictionaryList.length - 1; i++) {
                  if (dictionaryList[i][0] === path.split('\\').pop() && dictionaryList[i][1] === path) {
                    dictionaryList.pop()
                    index = i
                    break;
                  }
                }
                this.setState({ dictionaryList, openKeys: ['dictionary'], selectedKeys: ['dictionary' + index] })
                this.readXlsxFile(path)
              }
            }>
              上传字典
            </Button>
            <Button icon={<UploadOutlined />} onClick={
              () => {
                history.push('/texts')
                // const path: string = ipcRenderer.sendSync(UPLOAD_TEXTS_DATA)
                // stringList.push([path.split('\\')[path.split('\\').length - 1], path])
                // let index = stringList.length - 1
                // for (let i = 0; i < stringList.length - 1; i++) {
                //   if (stringList[i][0] === path.split('\\').pop() && stringList[i][1] === path) {
                //     stringList.pop()
                //     index = i
                //     break;
                //   }
                // }
                // this.setState({ stringList, openKeys: ['text'], selectedKeys: ['text' + index] })
                // this.readTxtFile(path)
              }
            }>
              上传语料
            </Button>
            <Button icon={<PlayCircleOutlined />} onClick={
              () => {
                // ipcRenderer.send(OPEN_MODEL_CONFIG_WINDOW)
              }
            }>
              初始化
            </Button>
          </Header>
          <Content className="site-layout-background"
            style={{
              // margin: '24px 16px',
              // padding: 24,
              minHeight: 500,
            }}
          >
            {/* <MarkView /> */}
            <Switch>
              <Route path="/dictionary" component={DictionaryWindow} />
              <Route path="/texts" component={TextWindow}/>
              {/* <Route path="/force-directed" component={ForceDirectedView} exact/> */}
            </Switch>
          </Content>
        </Layout>
      </Layout>
    )
  }

  public componentDidMount(): void {
    
  }

  private readXlsxFile(path: string): void {
    document.title = path
    const dataFile = (window as any).xlsx.parse(path)
    const tableData = dataFile[0]['data'].slice(1).map((arr: Array<string>) => ({
      label: arr[0],
      name: arr[1],
      abbreviations: [...arr.slice(2)]
    }))
    // console.log(tableData, path, dataFile);
    this.props.updateDictionaryData(tableData, path)
  }

  private readTxtFile(path: string): void {
    // (window as any).fs.readFile(path, 'utf-8', (err: any, data: string) => {
    //   if (err) {
    //       throw(err)
    //   }
    //   const dataByHandle: TextsDataType = []
    //   const lines = data.split("\r\n")
    //   lines.forEach((line) => {
    //       dataByHandle.push({
    //           text: line,
    //           label: []
    //       });
    //   })
    //   this.props.updateTextsData(dataByHandle, path)
  // })  
  }

}

const mapStateToProps = (state: StoreType, ownProps?: any) => {
  const { Main } = state
  // console.log()
  return {
    ...ownProps,
    ...Main,
  }
}

const mapDispatchToProps = {
  updateDictionaryData,
  updateTextsData
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);