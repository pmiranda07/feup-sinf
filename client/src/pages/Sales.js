import React, { Component } from 'react';
import SalesTable from '../components/SalesTable';
import axios from 'axios';
import Loading from '../components/Loading';
import './Pages.css';
import Select from 'react-select';
import SalesGraph from '../components/SalesGraph';

export function parseSalesTotal(res){
  let salesTotal = [];
  for(let i = 0; i < res.data.DataSet.Table.length; i++){
    let tipoDoc = res.data.DataSet.Table[i].TipoDoc; 
    let date = res.data.DataSet.Table[i].Data.split('-');
    let year = date[0];
    let month = date[1];
    let totalMerc = res.data.DataSet.Table[i].TotalMerc
    let signal = 1;
    if(tipoDoc === 'NC'){
      signal = -1;
    }
    if(!(year in salesTotal)){
      salesTotal[year] = {
        [month]: Math.round(totalMerc*signal)
      };
    }
    else if(!(month in salesTotal[year])){
      salesTotal[year][month] = Math.round(totalMerc*signal);
    }
    else{
      salesTotal[year][month] += Math.round(totalMerc*signal);
    }
  }
  return salesTotal;
}

export function parseSelectOptions(salesTotal){
  let options = [];
  for (let index in salesTotal){
    let obj = {};
    obj["year"] = index;
    options.push({
      value: index, label:index
    });
    for(let key in salesTotal[index]){
      obj[key] = salesTotal[index][key];
    }
  }
  let last = options.length -1;
  return [options, options[last]];
}


class Sales extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sales_ytd : 0,
      select_options: [],
      selected_option: null,
      salesTotal : {},
      sales: [{
        id: null,
        net_total: null,
        date: null,
        customer: null,
      }],
      loadingPrimavera: true
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
    return axios.get('/sales');
  };

  handleResponse(res) {
    this.setState( {
      sales: this.parseSalesInvoices(res.data.sales)
    });
  };

  callPrimavera = async () => {
    var query = JSON.stringify("SELECT Data, TotalMerc, TipoDoc FROM CabecDoc WHERE TipoDoc = 'FA' OR TipoDoc = 'NC' OR TipoDoc = 'VD'");
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
    let salesTotal = parseSalesTotal(res);
    let select = parseSelectOptions(salesTotal)
    this.setState({
      salesTotal: salesTotal,
      select_options: select[0],
      selected_option: select[1],
      loadingPrimavera: false
    }, () => {
      this.update_sum()
    });
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

  update_sum(){
    let sum = 0;
    for(let i in this.state.salesTotal[this.state.selected_option['value']]){
      sum+= this.state.salesTotal[this.state.selected_option['value']][i]
    }
    this.setState({
      sales_ytd: Math.round(sum)
    })
  }

  handleChange(selectedOption){
    this.setState({
      selected_option: selectedOption
    },() => {
      this.update_sum()
    })
  }


  loading(){
    return this.state.loadingPrimavera || this.props.token === null
  }

  render() {
    if (this.loading())
      return <Loading/>

    else return (
      <div id="salesPage" className="container">
      <h1>Sales</h1>
      <div className="card">
        <div className="card-header text-center">
            <h6> Sales on year </h6>
            <Select
                className="salesSelect"
                value={this.state.selected_option}
                onChange={this.handleChange.bind(this)}
                options={this.state.select_options}
            />
        </div>
        <div className="d-flex card-body text-center">
            <h5 className="w-75" style={{textAlign:'center', verticalAlign:'center', margin: "auto"}}>{this.state.sales_ytd}€</h5>
        </div>
     </div>
        <div className="card">
          <h5 className="card-header text-center"> Net earnings per year</h5>
            <div className="card-body" style={{ height: 400 }}>
              <SalesGraph salesTotal = {this.state.salesTotal}/>
          </div>
        </div>
        <div className="card listOfSales">
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
