import React, {Component} from 'react';
import { Layout, Menu, Button } from 'antd';
import 'antd/dist/antd.css';
import { UploadOutlined, PlayCircleOutlined, FileTextOutlined } from '@ant-design/icons';
import Icon from '@ant-design/icons';
import { 
	// BrowserRouter as Router, 
	// Route, 
	// Link,
	Switch,
} from 'react-router-dom'
// import DictionaryView from './DictionaryView';
import { OPEN_DICTIONARY_WINDOW, OPEN_MODEL_CONFIG_WINDOW, OPEN_TEXT_WINDOW, UPLOAD_DICTIONARY_DATA, UPLOAD_TEXTS_DATA } from '../types/ipc';
import { DictionaryIcon } from './Icon'
import { MainStoreType, StoreType } from '../types/propsTypes';
import { connect } from 'react-redux';


const { ipcRenderer } = (window as any).electron

// import TextsView from './TextsView';

interface MainProps extends MainStoreType {
    
}
interface MainState {
	collapsed: boolean,
    dictionaryList: Array<[name:string, path:string]>
    stringList: Array<[name: string, path: string]>
}
class Main extends Component <MainProps, MainState>{
    public constructor(props : MainProps) {
        super(props)
        this.state = {
			collapsed: false,
            dictionaryList: [
                // ['dict1', ''],
                // ['dict2', ''],
                // ['dict3', ''],
                // ['dict4', ''],
                // ['dict5', ''],
            ],
            stringList: []
		}
    }
    
    public render() : JSX.Element {
        const { Header, Sider, Content } = Layout;
        const { SubMenu } = Menu;
		const { collapsed, dictionaryList, stringList } = this.state
        // const { dictionaryList } = this.props
        // console.log('object:', dictionaryList);
        return (
            <Layout>
                <Sider trigger={null} collapsible collapsed={collapsed} theme="light">
                    <div className="logo" style={{
                        width: '100%',
                        height: '60px',
                        // marginLeft: '2%',
                        lineHeight: '60px',
                        textAlign: 'center',
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: 'rgb(13,110,253)',
                    }}>
                        实体抽取工具
                    </div>
                    <Menu theme="light" mode="inline" defaultSelectedKeys={['dictionary']}>
                        <SubMenu key="dictionary" title="字典数据" icon={<Icon component={DictionaryIcon} />}>
                            {
                                dictionaryList.map((value: [name: string, path: string], index: number) => (
                                    <Menu.Item key={'dictionary' + index} onClick={
                                        () => {
                                            ipcRenderer.send(OPEN_DICTIONARY_WINDOW, { path: value[1].split('\\').join('_') })
                                            
                                        }
                                    }>
                                        {value[0]}
                                    </Menu.Item>
                                ))
                            }
                        </SubMenu>
                        <SubMenu key="text" title="语料数据" icon={<FileTextOutlined />}>
                            {
                                stringList.map((value: [name: string, path: string], index: number) => (
                                    <Menu.Item key={'text' + index} onClick={
                                        () => {
                                            ipcRenderer.send(OPEN_TEXT_WINDOW, { path: value[1].split('\\').join('_') })
                                            
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
                                ipcRenderer.send(OPEN_DICTIONARY_WINDOW, { path: 'none' })
                                // window.open('http://localhost:3000/DictionaryWindow')
                            }
                        }>
                            上传字典
                        </Button>
                        <Button icon={<UploadOutlined />} onClick={
                            () => {
                                ipcRenderer.send(OPEN_TEXT_WINDOW, { path: 'none' })
                            }
                        }>
                            上传语料
                        </Button>
                        <Button icon={<PlayCircleOutlined />} onClick={
                            () => {
                                ipcRenderer.send(OPEN_MODEL_CONFIG_WINDOW)
                            }
                        }>
                            初始化
                        </Button>
                    </Header>
                    <Content className="site-layout-background"
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            minHeight: 500,
                        }}
                    >
                        <Switch>
                            {/* <Route path="/dictionary" component={DictionaryView}/> */}
                            {/* <Route path="/texts" component={TextsView}/> */}
                            {/* <Route path="/force-directed" component={ForceDirectedView} exact/> */}
                        </Switch>
                    </Content>
                </Layout>
            </Layout>
        )
    }
    
    public componentDidMount():void {
        const { WPCProviderDelegate } = (window as any).electron_wpc
        // console.log(WPCProviderDelegate)
        const providerDelegate = new WPCProviderDelegate();
        /**
         * 上传字典数据监听
         */
        providerDelegate.on(UPLOAD_DICTIONARY_DATA, (resolve: any, reject: any, arg: any) => {
            const { dictionaryList } = this.state
            dictionaryList.push(arg)
            for(let i = 0; i < dictionaryList.length - 1; i++) {
                if (dictionaryList[i][0] === arg[0] && dictionaryList[i][1] === arg[1]) {
                    dictionaryList.pop()
                    resolve('warn')
                    break;
                }
            }
            this.setState({ dictionaryList })
            resolve('success')
        });
        /**
         * 上传语料数据监听UPLOAD_TEXTS_DATA
         */
        providerDelegate.on(UPLOAD_TEXTS_DATA, (resolve: any, reject: any, arg: any) => {
            const { stringList } = this.state
            stringList.push(arg)
            for(let i = 0; i < stringList.length - 1; i++) {
                if (stringList[i][0] === arg[0] && stringList[i][1] === arg[1]) {
                    stringList.pop()
                    resolve('warn')
                    break;
                }
            }
            this.setState({ stringList })
            resolve('success')
        });
    }
}

const mapStateToProps = (state:StoreType, ownProps?: any) => {
    const { Main } = state
    // console.log()
    return {
        ...ownProps,
        ...Main,
    }
}

const mapDispatchToProps = {
    // updataRouter
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);