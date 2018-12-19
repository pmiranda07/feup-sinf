import React, { Component } from 'react';
import axios from 'axios';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

import Select from 'react-select';
import PurchasesGraph from '../components/PurchasesGraph';
import Loading from '../components/Loading';

export function example(purchases){
  let purchasesPerYear = {};
  for (let i=0; i < purchases.length;i++) {
          let date = purchases[i].DataDoc.split('/');
          let year = date[2];
          let month = date[1];
          let totalV = purchases[i].TotalMerc;
          let tipoDoc = purchases[i].TipoDoc;
          if(tipoDoc === 'VNC'){
              if(!(year in purchasesPerYear)){
                  purchasesPerYear[year] = {
                   [month]: -totalV
                  };
              }
              else if(!(month in purchasesPerYear[year])){
                  purchasesPerYear[year][month] = -totalV;
              }
              else{
                  purchasesPerYear[year][month] -= totalV;
              }
          }
          else{
              if(!(year in purchasesPerYear)){
                  purchasesPerYear[year] = {
                   [month]: totalV
                  };
              }
              else if(!(month in purchasesPerYear[year])){
                  purchasesPerYear[year][month] = totalV;
              }
              else{
                  purchasesPerYear[year][month] += totalV;
              }
          }
          purchasesPerYear[year][month] = parseFloat(purchasesPerYear[year][month].toFixed(2));
      }
  let ret = []
  let options = [];
  for (let index in purchasesPerYear){
    let obj = {};
    obj["year"] = index;
    options.push({
      value: index, label:index
    });
    for(let key in purchasesPerYear[index]){
      obj[key] = purchasesPerYear[index][key];
    }
    ret.push(obj)
  }
  let last = options.length -1;

  return [ret, options, options[last]];
}

class Purchases extends Component {
  constructor(props) {
    super(props);

    this.state = {
      purchases: [],
      purchasesPerYear: {},
      purchases_ytd : 0,
      select_options: [],
      selected_option: null,
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
    return axios.get('/purchases');
  };
  handleResponse(res) {
      this.setState( {
        loadingAPI: false
      } );
  };

  callPrimavera = async () => {
    var query = JSON.stringify("SELECT CONCAT(Filial,'/',TipoDoc,'/',Serie,'/',NumDoc) AS Iden,Nome, abs(TotalMerc) AS TotalMerc, TipoDoc ,CONVERT(Varchar(10),DataDoc,103) AS DataDoc FROM CabecCompras WHERE TipoDoc='VFA' OR TipoDoc='VNC'");

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
    this.setState({
      purchases: res.data.DataSet.Table,
      loadingPrimavera: false
    }, function(){
      this.setState({
        purchasesPerYear: example(this.state.purchases)[0],
        select_options: example(this.state.purchases)[1],
        selected_option: example(this.state.purchases)[2],
      },() => {
        this.update_sum()
      })
    });
  };

  update_sum(){
    let sum = 0;
    for(let i = 0; i < this.state.purchasesPerYear.length; i++ ){
      if(this.state.selected_option["value"] === this.state.purchasesPerYear[i]["year"])
      {
        for(let index in this.state.purchasesPerYear[i]){
          if(index !== "year")
            sum+= this.state.purchasesPerYear[i][index]
        }
      }

    }
    this.setState({
      purchases_ytd: sum.toFixed(2)
    })
  }

  handleChange(selectedOption){
    this.setState({
      selected_option: selectedOption
    },() => {
      this.update_sum()
    })
  }


  loading() {
    return this.state.loadingAPI || this.props.token === null || this.state.loadingPrimavera;
  }


  render() {
    if( this.loading() )
      return <Loading/>

      const columns = [{

          dataField: 'Iden',
          text: 'ID',
          sort: true,
          events: {
            onClick: (e, column, columnIndex, row, rowIndex) => {
                this.props.history.push('/purchases/' + row.Iden);
            }
            },
          filter: textFilter({
            delay: 50,
            style: {
              display: 'none'
            },
          }),
        },{
          dataField: 'Nome',
          text: 'Supplier',
          sort: true,
          filter: textFilter({
            delay: 50,
            style: {
              display: 'none'
            },
            placeholder: 'Search supplier',
            getFilter: (filter) => {
              this.nameFilter = filter;
            }
          })
      },{
          dataField: 'TotalMerc',
          text: 'Value (€)',
          sort: true,
          filter: textFilter({
            delay: 50,
            style: {
              display: 'none'
            },
          })
        },
        {
          dataField: 'DataDoc',
          text: 'Date',
          sort: true
        }
      ];

      const defaultSorted = [{
        dataField: 'NumDoc',
        order: 'asc'
      }];

      const customTotal = (from, to, size) => (
        <span className="react-bootstrap-table-pagination-total">
          Showing { from } to { to } of { size } purchases
        </span>
      );

      const tableOptions = {
        hideSizePerPage: true,
        hidePageListOnlyOnePage: true,
        showTotal: true,
        paginationTotalRenderer: customTotal
      };

      const handleSearchInput = (e) => {
        this.nameFilter(e.target.value);
      };

      return (
        <div id="purchasesPage" className="container">
        <h1>Purchases</h1>
        <div className="card">
            <div className="card-header text-center">
                <h6> Purchases on year  </h6>
                <Select
                    className="purchasesSelect"
                    value={this.state.selected_option}
                    onChange={this.handleChange.bind(this)}
                    options={this.state.select_options}
                />
            </div>
        <div className="d-flex card-body text-center">
            <h5 className="w-75" style={{textAlign:'center', verticalAlign:'center', margin: "auto"}}>{this.state.purchases_ytd}€</h5>
        </div>
        </div>
        <div className="card">
          <h5 className="card-header text-center">Purchases per year</h5>
          <div className="card-body" style={{height: 500}}>
            <PurchasesGraph purchases={this.state.purchases}/>
          </div>
        </div>

        <div className="card listOfPurchases">
          <h5 className="card-header text-center">List of Purchases</h5>
          <div className="card-body">
            <input type="text" className="form-control" placeholder="Search Supplier" onInput={ handleSearchInput }/>
            <BootstrapTable bootstrap4 striped hover keyField='PurchaseCode' data={ this.state.purchases } columns={ columns } defaultSorted={defaultSorted} pagination={paginationFactory(tableOptions)} filter={filterFactory()}/>
          </div>
         </div>

        </div>
      );

  }
}

export default Purchases;
