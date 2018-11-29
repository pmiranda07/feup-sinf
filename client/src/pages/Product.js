import React, { Component } from 'react';
import axios from 'axios';

class Product extends Component {
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
        return axios.get('/Products/' + this.state.id);
    };

    handleResponse(res) {
        this.setState( { info: res.data.info } );
    };


    render() {
        return (
            //TODO
            <div>{this.state.info.ProductDescription}</div>
        );
    }

}

export default Product;
