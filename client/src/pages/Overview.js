import React, { Component } from 'react';
import axios from 'axios';

import FinancialChart from '../components/FinancialChart';
import TopProducts from '../components/TopProducts';
import Loading from '../components/Loading';
import './Pages.css';


class Overview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      topSelling: {},
      sales: [],
      revenue: [],
      loadingAPI: true  
    };
  }

  componentDidMount() {
    this.callAPI()
        .then((res) => this.handleResponse(res))
        .catch(err => console.log(err));
  }

  callAPI = async () => {
    return axios.get('/overview');
  };

  handleResponse(res) {
    this.setState( { 
      topSelling: res.data.topSelling,
      sales: res.data.sales,
      revenue: res.data.revenue,
      loadingAPI: false
    } );
  };

  loading() {
    return this.state.loadingAPI;
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

      </div>
    );
  }
}

export default Overview;
