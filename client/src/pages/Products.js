import React, { Component } from 'react';
import axios from 'axios';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { ResponsivePie } from 'nivo';
import ReactLoading from 'react-loading';
import './Products.css';

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
        dataField: 'Artigo',
        text: 'Code',
        sort: true
    }, {
        dataField: 'Descricao',
        text: 'Description',
        sort: true,
        events: {
          onClick: (e, column, columnIndex, row, rowIndex) => { 
            this.props.history.push('/products/' + row.Artigo);
          }
        },
        filter: textFilter({
          delay: 50, 
          style: {
            display: 'none'
          },
          placeholder: 'Search product name',
          getFilter: (filter) => {
            this.nameFilter = filter;
          }
        })
      }
    ];

    const outOfStockColumns = [{
        dataField: 'Artigo',
        text: 'Code',
        sort: true
      }, {
        dataField: 'Descricao',
        text: 'Description',
        sort: true,
        events: {
          onClick: (e, column, columnIndex, row, rowIndex) => { 
            this.props.history.push('/products/' + row.Artigo);
          }
        }
      }
    ]; 

    const defaultSorted = [{
      dataField: 'Artigo',
      order: 'asc'
    }];

    const customTotal = (from, to, size) => (
      <span className="react-bootstrap-table-pagination-total">
        Showing { from } to { to } of { size } products
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

    let topSellingData = [];
    for (let product in this.state.topSelling) {
      if (this.state.topSelling.hasOwnProperty(product)) {
           topSellingData.push({
             id: product,
             label: product,
             value: this.state.topSelling[product]
           });
      }
    }
    
    topSellingData.sort(function(a, b) {
        return a.value - b.value;
    });
    if(topSellingData.length > 10)
      topSellingData = topSellingData.slice(topSellingData.length - 10);

    return (
      <div id="productsPage" className="container">
        <h1>Products</h1>

        <div className="card">
          <h5 className="card-header text-center">Product List</h5>
          <div className="card-body">
            <input type="text" className="form-control" placeholder="Search product name" onInput={ handleSearchInput }/>
            <BootstrapTable bootstrap4 striped hover keyField='ProductCode' data={ this.state.products } columns={ columns } defaultSorted={defaultSorted} pagination={paginationFactory(tableOptions)} filter={filterFactory()}/>
          </div>
        </div>

        <div className="card">
          <h5 className="card-header text-center">Most Sold Products</h5>
          <div className="card-body" style={{height: 500}}>
            <ResponsivePie
              margin={{
                  "top": 40,
                  "right": 80,
                  "bottom": 80,
                  "left": 80
              }}
              data={topSellingData}
              sortByValue={true}
              innerRadius={0.5}
              padAngle={1}
              cornerRadius={1}
              colors="accent"
              colorBy="id"
              borderWidth={1}
              borderColor="inherit:darker(0.2)"
              radialLabelsSkipAngle={10}
              radialLabelsTextXOffset={6}
              radialLabelsTextColor="#333333"
              radialLabelsLinkOffset={0}
              radialLabelsLinkDiagonalLength={16}
              radialLabelsLinkHorizontalLength={24}
              radialLabelsLinkStrokeWidth={1}
              radialLabelsLinkColor="inherit"
              slicesLabelsSkipAngle={10}
              slicesLabelsTextColor="#333333"
              animate={true}
              motionStiffness={90}
              motionDamping={15}
              legends={[
                  {
                      "anchor": "bottom",
                      "direction": "row",
                      "translateY": 56,
                      "itemWidth": 100,
                      "itemHeight": 18,
                      "itemTextColor": "#999",
                      "symbolSize": 18,
                      "symbolShape": "circle",
                      "effects": [
                          {
                              "on": "hover",
                              "style": {
                                  "itemTextColor": "#000"
                              }
                          }
                      ]
                  }
              ]}
          />
          </div>
        </div>

        <div className="card">
          <h5 className="card-header text-center">Products Out-of-Stock</h5>
          <div className="card-body">
            <BootstrapTable bootstrap4 striped hover keyField='Artigo' data={ this.state.outOfStock } columns={ outOfStockColumns } defaultSorted={defaultSorted} pagination={paginationFactory(tableOptions)}/>
          </div>
        </div>
      </div>
    );
  }
}

export default Products;
