import React, { Component } from 'react';
import { render } from 'react-dom';
import axios from 'axios';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { ResponsivePie } from 'nivo';

// TODO:
// Make a parent component that gets token
// Make a table with the out of stock products
// Fix number of products from the saf-t file being bigger than the number of out of stock products...

class Products extends Component {
  constructor(props) {
    super(props);

    this.state = {
      products: [],
      topSelling: {},
      outOfStock: []
    };
  }

  componentDidMount() {
    this.callAPI()
        .then((res) => this.handleResponse(res))
        .catch(err => console.log(err));
    this.callPrimavera()
        .then((res) => this.handlePrimaveraResponse(res))
        .catch(err => console.log(err));
  }

  callAPI = async () => {
    return axios.get('/Products');
  };

  handleResponse(res) {
      this.setState( { 
        products: res.data.products,
        topSelling: res.data.topSelling } );
  };

  callPrimavera = async () => {
    var query = JSON.stringify("SELECT Arm.Artigo, Art.Descricao FROM V_INV_ArtigoArmazem Arm INNER JOIN Artigo Art ON Arm.Artigo = Art.Artigo GROUP BY Arm.Artigo, Art.Descricao HAVING SUM(Arm.StkActual) <= 0");

    return axios({
      method: 'post',
      url: 'http://localhost:2018/WebApi/Administrador/Consulta',
      crossdomain: true,
      headers: {
        'content-type': 'application/json',
        'authorization': "Bearer W3gCKzNPx2CNIUyNkImTxgxqbVhKm1hWA6-KrAKfeFjlV90kaBRAOEEzPO_wZC-nVlqpVvkh5vQ6DSYQLqvla6PnnBXC9G0YH_2xU_ocOZ6QOm3zaLZNszXLwAyRzn8U-OiUDIeiVw_G5Lzy6I8Ngdb1jgDZKmUawu__WCbzi4bhKX4uLJUe4xImlEl_AM9zcFcNZaZGVWeu67XMI-Ae2KYiJ9OidLAQfqkvpHOgdGjuUxulaqYupivEcNiFFF_HiKe98S4FRXrJIuwbPM6vqq5IznhWBSASxP4PRAryvec6_nO8IJoqIZAHETy5g7Xo"
      },
      data: query
    });
  };

  handlePrimaveraResponse(res) {
    this.setState({ outOfStock: res.data.DataSet.Table });
  }

  

  render() {
    const columns = [{
        dataField: 'ProductCode',
        text: 'Code',
        sort: true
    }, {
        dataField: 'ProductGroup',
        text: 'Group',
        sort: true
      }, {
        dataField: 'ProductDescription',
        text: 'Description',
        sort: true,
        events: {
          onClick: (e, column, columnIndex, row, rowIndex) => { 
            this.props.history.push('/Products/' + row.ProductCode);
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

    const defaultSorted = [{
      dataField: 'ProductCode',
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
      <div>
        <h1>Products</h1>
        <input type="text" className="form-control" placeholder="Search product name" onInput={ handleSearchInput }/>
        <BootstrapTable bootstrap4 striped hover keyField='ProductCode' data={ this.state.products } columns={ columns } defaultSorted={defaultSorted} pagination={paginationFactory(tableOptions)} filter={filterFactory()}/>
      
        <div style={{height: 500}}>
          <ResponsivePie
            data={topSellingData}
            margin={{
                "top": 40,
                "right": 80,
                "bottom": 80,
                "left": 80
            }}
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
    );
  }
}

export default Products;
