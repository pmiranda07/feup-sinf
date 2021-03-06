import React, { Component } from 'react';
import axios from 'axios';

import PurchasesGraph from '../components/PurchasesGraph';
import FinancialChart from '../components/FinancialChart';
import TopProducts from '../components/TopProducts';
import Loading from '../components/Loading';
import './Pages.css';
import SalesGraph from '../components/SalesGraph';
import {parseSalesTotal} from '../pages/Sales'


class Overview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      topSelling: {},
      sales: [],
      revenue: [],
      purchases: [],
      sales_graph: {},
      loadingAPI: true,
      loadingPurchases: true,
      loadingSales: true
    };
  }

  componentDidMount() {
    this.callAPI();
    this.getPurchases();
    this.getSales();
  }

  callAPI() {
    axios.get('/overview')
    .then((res) => {
      this.setState( {
        topSelling: res.data.topSelling,
        sales: res.data.sales,
        revenue: res.data.revenue,
        loadingAPI: false
      } );
    })
    .catch(err => console.log(err));
  };

  getPurchases() {
    var query = JSON.stringify("SELECT CONCAT(Filial,'/',TipoDoc,'/',Serie,'/',NumDoc) AS Iden,Nome, abs(TotalMerc) AS TotalMerc, TipoDoc ,CONVERT(Varchar(10),DataDoc,103) AS DataDoc FROM CabecCompras WHERE TipoDoc='VFA' OR TipoDoc='VNC'");

    axios({
      method: 'post',
      url: 'http://localhost:2018/WebApi/Administrador/Consulta',
      crossdomain: true,
      headers: {
        'content-type': 'application/json',
        'authorization': "Bearer " + this.props.token
      },
      data: query
    })
    .then((res) => {
      this.setState({
        purchases: res.data.DataSet.Table,
        loadingPurchases: false
      });
    })
    .catch(err => console.log(err));
  }

  getSales() {
    var query = JSON.stringify("SELECT Data, TotalMerc, TipoDoc FROM CabecDoc WHERE TipoDoc = 'FA' OR TipoDoc = 'NC' OR TipoDoc = 'VD'");
    axios({
      method: 'post',
      url: 'http://localhost:2018/WebApi/Administrador/Consulta',
      crossdomain: true,
      headers: {
        'content-type': 'application/json',
        'authorization': "Bearer " + this.props.token
      },
      data: query
    })
    .then((res) => {
      let salesTotals = parseSalesTotal(res);
      this.setState({
        sales_graph: salesTotals,
        loadingSales: false
      });
    })
    .catch((err) => console.log(err));
  }

  loading() {
    return this.state.loadingAPI || this.state.loadingPurchases || this.state.loadingSales;
  }

  render() {
    if( this.loading() )
      return <Loading/>

    return (
      <div id="overviewPage" className="container">
        <h1>Overview</h1>

        <div className="card">
          <h5 className="card-header text-center">Most Sold Products</h5>
          <div className="card-body" style={{height: 500}}>
            <TopProducts topSelling={this.state.topSelling}/>
          </div>
        </div>

        <div className="card">
          <h4 className="card-header text-center">Sales and Revenue</h4>
          <div className="card-body" style={{height: 500}}>
            <FinancialChart sales={this.state.sales} revenue={this.state.revenue}/>
          </div>
        </div>

        <div className="card">
          <h5 className="card-header text-center">Purchases per year</h5>
          <div className="card-body" style={{height: 500}}>
            <PurchasesGraph purchases={this.state.purchases}/>
          </div>
        </div>

        <div className="card">
          <h5 className="card-header text-center">Sales per year</h5>
          <div className="card-body" style={{height: 500}}>
            <SalesGraph salesTotal={this.state.sales_graph}/>
          </div>
        </div>

      </div>
    );
  }
}

export default Overview;
