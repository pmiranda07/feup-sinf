import React, { Component } from 'react';
import './Common.css'

class InvalidSAFT extends Component {

  render() {    
    return (
        <div className="outer-align container">
            <div className="inner-align">
                <h1>You must upload a SAF-T file!</h1>
            </div>
        </div>
    );
  }
}

export default InvalidSAFT;