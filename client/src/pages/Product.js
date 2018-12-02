import React, { Component } from 'react';
import axios from 'axios';
import ReactLoading from 'react-loading';

class Product extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            id: props.match.params.id,
            info: { },
            loadingPrimavera: true
        }
    }


    componentDidMount() {
        if (this.props.token !== "") {
            this.callPrimavera()
              .then((res) => this.handlePrimaveraResponse(res))
              .catch(err => console.log(err));
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // Check if token was updated
        if( prevProps.token === "" && this.props.token !== "" ) {
          this.callPrimavera()
            .then((res) => this.handlePrimaveraResponse(res))
            .catch(err => console.log(err));
        }
    }
    
    
    callPrimavera = async () => {
        var query = JSON.stringify("SELECT Artigo, Descricao, STKActual, PCMedio FROM Artigo WHERE Artigo = '" + this.state.id + "'");

        return axios({
          method: 'post',
          url: 'http://localhost:2018/WebApi/Administrador/Consulta',
          crossdomain: true,
          headers: {
            'content-type': 'application/json',
            'authorization': "Bearer " + this.props.token
          },
          data: query
        });
    };

    handlePrimaveraResponse(res) {
        if ( res.status === 200 && res.data.DataSet.Table.length )
            this.setState( { 
                info: res.data.DataSet.Table[0],
                loadingPrimavera: false
            } );
    };


    loading() {
        return this.props.token === "" || this.state.loadingPrimavera;
    }


    renderLoading() {
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


    render() {
        if( this.loading() )
            return this.renderLoading();

        return (
            //TODO
            <div>{this.state.info.Descricao}</div>
        );
    }

}

export default Product;
