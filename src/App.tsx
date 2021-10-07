import React, { Component } from 'react';
// import $ from 'jquery';
import { Layout, Menu, Button } from 'antd';
import 'antd/dist/antd.css';
import { UploadOutlined, PlayCircleOutlined, FileTextOutlined } from '@ant-design/icons';
import { 
	BrowserRouter as Router, 
	Route, 
	Link,
	Switch,
} from 'react-router-dom'
import './App.css'
import DictionaryView from './components/DictionaryView';
import { OPEN_MODEL_CONFIG_WINDOW, UPLOADDICTIONARYDATA, UPLOADTEXTSDATA } from './types/ipc';
import TextsView from './components/TextsView';



interface AppProps {

}
interface AppState {
	collapsed: boolean
}
class App extends Component<AppProps, AppState>{
	public constructor(props: AppProps) {
		super(props)
		this.state = {
			collapsed: false,
		}
	}

	public render(): JSX.Element {
		const { Header, Sider, Content } = Layout;
		const { collapsed } = this.state
        const { ipcRenderer } = (window as any).electron

		return (
			<div className='App'>
				<Router>
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
						<Menu theme="light" mode="inline" defaultSelectedKeys={['1']}>
							<Menu.Item key="1" icon={<FileTextOutlined />}>
								<Link to='/dictionary'>字典数据</Link>
							</Menu.Item>
							<Menu.Item key="2" icon={<FileTextOutlined />}>
								<Link to='/texts'>语料数据</Link>
							</Menu.Item>
						</Menu>
					</Sider>
					<Layout className="site-layout">
						<Header className="site-layout-background" style={{ padding: 0, backgroundColor: 'white' }}>
							<Button icon={<UploadOutlined />} onClick={
								() => {
									ipcRenderer.send(UPLOADDICTIONARYDATA)
								}
							}>
								上传字典
							</Button>
							<Button icon={<UploadOutlined />} onClick={
								() => {
									ipcRenderer.send(UPLOADTEXTSDATA)
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
								<Route path="/dictionary" component={DictionaryView}/>
								<Route path="/texts" component={TextsView}/>
								{/* <Route path="/force-directed" component={ForceDirectedView} exact/> */}
							</Switch>
						</Content>
					</Layout>
				</Layout>
				</Router>
			</div>
		)
	}


}
export default App;
