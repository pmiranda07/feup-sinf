import React, { Component } from 'react';
import SalesTable from '../components/SalesTable';
import axios from 'axios';
import Loading from '../components/Loading';
import './Pages.css';
import Select from 'react-select';
import SalesGraph from '../components/SalesGraph';


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
      bar_vars : [],
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
    var query = JSON.stringify("SELECT Data, TotalMerc FROM CabecDoc WHERE TipoDoc = 'ECL'");
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
    let aux = this.state.salesTotal;
    for(let i = 0; i < res.data.DataSet.Table.length; i++){
      let date = res.data.DataSet.Table[i].Data.split('-');
      let year = date[0];
      let month = date[1];
      let totalMerc = res.data.DataSet.Table[i].TotalMerc
      if(!(year in aux)){
        aux[year] = {
          [month]: totalMerc
        };
      }
      else if(!(month in aux[year])){
        aux[year][month] = totalMerc;
      }
      else{
        aux[year][month] += totalMerc;
      }
    }
    this.setState({
      salesTotal: aux,
      loadingPrimavera: false
    });
    this.parseSalesTotal();
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

  parseSalesTotal(){
    let ret = []
    let options = [];
    for (let index in this.state.salesTotal){
      let obj = {};
      obj["year"] = index;
      options.push({
        value: index, label:index
      });
      for(let key in this.state.salesTotal[index]){
        obj[key] = this.state.salesTotal[index][key];
      }
      ret.push(obj)
    }
    let last = options.length -1;
    this.setState({
      bar_vars: ret,
      select_options: options,
      selected_option: options[last]
    }, () => {
      this.update_sum()
    })
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
              <SalesGraph bar_vars={this.state.bar_vars}/>
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
