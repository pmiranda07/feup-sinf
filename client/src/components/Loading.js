import React from 'react';
import ReactLoading from 'react-loading';

export default class Loading extends React.Component {
    render() {
        return (
        <div style={{
            width: '8%',
            height: '8%',
            position: "absolute",
            top: '50%',
            left: '50%',
            marginLeft: '-4%',
            marginTop: '-4%',
          }}>
            <ReactLoading type={"spinningBubbles"} color={"#00ffbb"} height={'100%'} width={'100%'} />
          </div>
        );
    }
}