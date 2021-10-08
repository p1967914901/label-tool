import React, {Component} from 'react';


interface ModelConfigWindowProps {
    
}
interface ModelConfigWindowState {
    
}
class ModelConfigWindow extends Component <ModelConfigWindowProps, ModelConfigWindowState>{
    public constructor(props : ModelConfigWindowProps) {
        super(props)
    }
    
    public render() : JSX.Element {
        return (
            <div style={{
                width: '300px',
                height: '150px',
                backgroundColor: 'red'
            }}>

            </div>
        )
    }
}
export default ModelConfigWindow;