import React, {Component} from 'react';
import "../css/Loading.scss";

class Loading extends Component {
    render() {
        return (
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <div className={"lds-roller"} style={{
                    marginTop: '3rem',
                    marginBottom: '3rem'
                }}>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        );
    }
}

export default Loading;
