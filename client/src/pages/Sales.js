import React, { Component } from 'react';
import SalesTable from '../components/SalesTable';
import axios from 'axios';
import Loading from '../components/Loading';
import './Pages.css';

class Sales extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: 'Sales: Please upload a SAF-T file',
      sales: [{
        id: null,
        net_total: null,
        date: null,
        customer: null
      }],
      loading: true
    };  
  }

  componentDidMount() {
    this.callAPI()
        .then((res) => this.handleResponse(res))
        .catch(err => console.log(err));
  }

  callAPI = async () => {
    return axios.get('/sales');
  };

  handleResponse(res) {
    this.setState( { 
      sales: this.parseSalesInvoices(res.data.sales),
      loading: false
    } );
  };

  parseSalesInvoices(salesInvoices){
    const types = ['FT', 'FR', 'FS', 'VD', 'NC'];
    let sales = [];
    for (let index = 0; index < salesInvoices.length; index++) {
      const type = salesInvoices[index].InvoiceType;
      if( types.includes(type) ) {
        const sale = {
          id: salesInvoices[index].InvoiceNo,
          customer: salesInvoices[index].CustomerID,
          date: salesInvoices[index].InvoiceDate,
          net_total: salesInvoices[index].DocumentTotals.NetTotal,
        }
        sales.push(sale);
      }
    }
    return sales;
  }

  render() {
    if (this.state.loading) 
      return <Loading/>

    return (
      <div id="salesPage" className="container">
        <div className="card">
          <h5 className="card-header text-center">Sales List</h5>
          <div className="card-body">
            <SalesTable data={this.state.sales} history={this.props.history}/>
          </div>
        </div>
      </div>
    );
  }
}

export default Sales;
