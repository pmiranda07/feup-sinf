import React, { Component } from 'react';
import axios from 'axios';

class Sale extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            id: props.match.params.id,
            info: { }
        }
    }


    componentDidMount() {
        this.callAPI()
            .then((res) => this.handleResponse(res))
            .catch(err => console.log(err));
      }
    
    callAPI = async () => {
        return axios.get('/Sales/' + this.state.id);
    };

    handleResponse(res) {
        this.setState( { info: res.data.info } );
    };


    render() {
        return (
            //TODO
            <div>LOLEI UMA BECA</div>
        );
    }

}

export default Sale;
