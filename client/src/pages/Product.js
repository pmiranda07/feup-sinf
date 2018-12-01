import React, { Component } from 'react';
import axios from 'axios';
import qs from 'qs';

class Product extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            id: props.match.params.id,
            info: { Descricao: '' }
        }

        this.token = "";
    }


    componentDidMount() {
        this.getPrimaveraToken()
            .then((res) => this.handleTokenResponse(res))
            .catch(err => console.log(err));
    }

    getPrimaveraToken = async () => {
        return axios({
            method: 'POST',
            url: "http://localhost:2018/WebApi/token",
            data: qs.stringify({
            username: "FEUP",
            password: "qualquer1",
            company: "DEMO",
            instance: "Default",
            grant_type: "password",
            line: "Professional"
            }),
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    };

    handleTokenResponse(res) {
        if(res.data.access_token)
          this.token = res.data.access_token;
    
        this.callPrimavera()
          .then((res) => this.handlePrimaveraResponse(res))
          .catch(err => console.log(err));
    };
    
    callPrimavera = async () => {
        var query = JSON.stringify("SELECT Artigo, Descricao, STKActual, PCMedio FROM Artigo WHERE Artigo = '" + this.state.id + "'");

        return axios({
          method: 'post',
          url: 'http://localhost:2018/WebApi/Administrador/Consulta',
          crossdomain: true,
          headers: {
            'content-type': 'application/json',
            'authorization': "Bearer " + this.token
          },
          data: query
        });
    };

    handlePrimaveraResponse(res) {
        if ( res.status === 200 && res.data.DataSet.Table.length)
            this.setState( { info: res.data.DataSet.Table[0] } );
    };


    render() {
        return (
            //TODO
            <div>{this.state.info.Descricao}</div>
        );
    }

}

export default Product;
