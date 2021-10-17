import React, { Component } from "react";
import { connect } from "react-redux";
import { LoadingStoreType, StoreType } from "../../types/propsTypes";
import './index.css'

interface LoadingProps extends LoadingStoreType {

}
interface LoadingState {

}
class Loading extends Component<LoadingProps, LoadingState> {
  public constructor(props: LoadingProps) {
    super(props);
  }

  public render(): JSX.Element {
		const { isLoading } = this.props
    return (
      <div className='loading'
        style={{
          width: "899px",
          height: "610px",
          // backgroundColor: "red",
          position: "absolute",
          display: isLoading ? 'inline-block' : "none",
					zIndex: 999,
					backgroundColor: 'rgb(240, 242, 245, 0.5)',
					textAlign: 'center',
					paddingTop: '250px'
        }}
      >
				<svg className="guaongRudderOne">
					<circle className="guaongRudderLine" cx="50" cy="50" r="40" fill="#fff"/>
					<line className="guaongRudderLine" x1="7" y1="25" x2="93" y2="75" stroke="#fff" stroke-width="10"/>
					<line className="guaongRudderLine" x1="75" y1="7" x2="25" y2="93" stroke="#fff" stroke-width="10"/>
					<line className="guaongRudderLine" x1="25" y1="7" x2="75" y2="93" stroke="#fff" stroke-width="10"/>
					<line className="guaongRudderLine" x1="93" y1="25" x2="7" y2="75" stroke="#fff" stroke-width="10"/>
					<line className="guaongRudderLine" x1="0" y1="50" x2="100" y2="50" stroke="#fff" stroke-width="10"/>
					<line className="guaongRudderLine" x1="50" y1="0" x2="50" y2="100" stroke="#fff" stroke-width="10"/>
					<circle className="guaongRudderLine" cx="50" cy="50" r="25" fill="rgb(240, 242, 245, 0.5)"/>
				</svg>
				<svg className="guaongRudderTwo">
					<circle className="guaongRudderLine" cx="25" cy="25" r="20" fill="#fff"/>
					<line className="guaongRudderLine" x1="3.5" y1="12.5" x2="46.5" y2="37.5" stroke="#fff" stroke-width="5"/>
					<line className="guaongRudderLine" x1="37.5" y1="3.5" x2="12.5" y2="46.5" stroke="#fff" stroke-width="5"/>
					<line className="guaongRudderLine" x1="12.5" y1="3.5" x2="37.5" y2="46.5" stroke="#fff" stroke-width="5"/>
					<line className="guaongRudderLine" x1="46.5" y1="12.5" x2="3.5" y2="37.5" stroke="#fff" stroke-width="5"/>
					<line className="guaongRudderLine" x1="0" y1="25" x2="50" y2="25" stroke="#fff" stroke-width="5"/>
					<line className="guaongRudderLine" x1="25" y1="0" x2="25" y2="50" stroke="#fff" stroke-width="5"/>
					<circle className="guaongRudderLine" cx="25" cy="25" r="12.5" fill="rgb(240, 242, 245, 0.5)"/>
				</svg>
      	<div className="guaongText"></div>
			</div>
    );
  }
}

const mapStateToProps = (state: StoreType, ownProps?: any) => {
  const { Loading } = state;
  // console.log(Header)
  return {
    ...ownProps,
    ...Loading,
  }
}

export default connect(mapStateToProps)(Loading);
