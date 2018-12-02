import React, { Component } from 'react';
import SalesTable from '../components/sales_table'

class Sales extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: 'Sales: Please upload a SAF-T file',
      sales: [{
        id: null,
        description: null,
        net_total: null,
        date: null,
        customer: null
      }]
    };  
  }

  componentDidMount() {
    this.callAPI()
        .then(test => this.setState(
          { 
            message: '',
            sales: test.sales
          }))
        .catch(err => console.log(err));
  }

  callAPI = async () => {
    const response = await fetch('/Sales');
    const response_json = await response.json();
    let sales = this.parseSalesInvoices(response_json.sales)
    if (response.status !== 200) throw Error(response_json.message);
    return { 
      body : response_json,
      sales : sales
    };
  };

  parseSalesInvoices(salesInvoices){
    let sales = [];
    for (let index = 0; index < salesInvoices.length; index++) {
      const sale = {
        id: salesInvoices[index].InvoiceNo,
        description: salesInvoices[index].Line.ProductDescription,
        net_total: salesInvoices[index].DocumentTotals.NetTotal,
        date: salesInvoices[index].SystemEntryDate,
        customer: salesInvoices[index].CustomerID
      }
      sales.push(sale);
    }
    return sales
  }

  render() {
    return (
      <div>
        { this.state.message }
        <SalesTable data = {this.state.sales}> </SalesTable>
      </div>
    );
  }
}

export default Sales;
