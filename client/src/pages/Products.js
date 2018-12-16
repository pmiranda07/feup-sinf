import React, { Component } from 'react';
import axios from 'axios';

import ListOutOfStock from '../components/ListOutOfStock';
import ListProducts from '../components/ListProducts';
import TopProducts from '../components/TopProducts';
import Loading from '../components/Loading';
import './Pages.css';

class Products extends Component {
  constructor(props) {
    super(props);

    this.state = {
      products: [],
      topSelling: {},
      outOfStock: [],
      loadingPrimavera: true,
      loadingAPI: true
    };
  }

  componentDidMount() {
    this.callAPI()
        .then((res) => this.handleResponse(res))
        .catch(err => console.log(err));

    if (this.props.token !== null) {
      this.callPrimavera()
        .then((res) => this.handlePrimaveraResponse(res))
        .catch(err => console.log(err));
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // Check if token was updated
    if( prevProps.token === null && this.props.token !== null ) {
      this.callPrimavera()
        .then((res) => this.handlePrimaveraResponse(res))
        .catch(err => console.log(err));
    }
  }

  callAPI = async () => {
    return axios.get('/products');
  };

  handleResponse(res) {
      this.setState( {
        topSelling: res.data.topSelling,
        loadingAPI: false
      } );
  };

  callPrimavera = async () => {
    var query = JSON.stringify("SELECT Artigo, Descricao, STKActual FROM Artigo");

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
    let outOfStock = [];
    for(let i = 0; i < res.data.DataSet.Table.length; i++)
      if(res.data.DataSet.Table[i].STKActual <= 0)
        outOfStock.push(res.data.DataSet.Table[i]);
    this.setState({
      products: res.data.DataSet.Table,
      outOfStock: outOfStock,
      loadingPrimavera: false
    });
  };

  loading() {
    return this.state.loadingAPI || this.props.token === null || this.state.loadingPrimavera;
  }

  render() {
    if( this.loading() )
      return <Loading/>

    return (
      <div id="productsPage" className="container">
        <h1>Products</h1>
        
        <div className="card">
          <h5 className="card-header text-center">Product List</h5>
          <div className="card-body">
            <ListProducts products={this.state.products} history={this.props.history}/>
          </div>
        </div>

        <div className="card">
          <h5 className="card-header text-center">Most Sold Products</h5>
          <div className="card-body" style={{height: 500}}>
            <TopProducts topSelling={this.state.topSelling}/>
          </div>
        </div>

        <div className="card">
          <h5 className="card-header text-center">Products Out-of-Stock</h5>
          <div className="card-body">
            <ListOutOfStock outOfStock={this.state.outOfStock} history={this.props.history}/>
          </div>
        </div>
      </div>
    );
  }
}

export default Products;
