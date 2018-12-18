import React, { Component } from 'react';
import axios from 'axios';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import ReactLoading from 'react-loading';

import PurchasesGraph from '../components/PurchasesGraph';

class Purchases extends Component {
  constructor(props) {
    super(props);

    this.state = {
      purchases: [],
      purchasesY: 0,
      salesTotal: {},
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
    var query = JSON.stringify("SELECT CONCAT(Filial,'/',TipoDoc,'/',Serie,'/',NumDoc) AS Iden,Nome, Abs(TotalMerc) AS TotalMerc, CONVERT(Varchar(10),DataDoc,103) AS DataDoc FROM CabecCompras WHERE TipoDoc='VFA' OR TipoDoc='VNC'");

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
    });
  };


  loading() {
    return this.state.loadingAPI || this.props.token === null || this.state.loadingPrimavera;
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
          text: 'Value',
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
          <h5 className="card-header text-center">Purchases per year</h5>
          <div className="card-body" style={{height: 500}}>
            <PurchasesGraph purchases={this.state.purchases}/>
          </div>
        </div>

        <div className="card">
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
