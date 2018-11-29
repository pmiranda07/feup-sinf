import React, { Component } from 'react';
import axios from 'axios';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

class Products extends Component {
  constructor(props) {
    super(props);

    this.state = {
      products: [],
    };
  }

  componentDidMount() {
    this.callAPI()
        .then((res) => this.handleResponse(res))
        .catch(err => console.log(err));
  }

  callAPI = async () => {
    return axios.get('/Products');
  };

  handleResponse(res) {
      this.setState( { products: res.data.products } );
  };

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
            // TODO Navigate to product page
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

    const options = {
      hideSizePerPage: true,
      hidePageListOnlyOnePage: true,
      showTotal: true,
      paginationTotalRenderer: customTotal
    };

    const handleSearchInput = (e) => {
      this.nameFilter(e.target.value);
    };

    return (
      <div>
        <h1>Products</h1>
        <input type="text" className="form-control" placeholder="Search product name" onInput={ handleSearchInput }/>
        <BootstrapTable bootstrap4 striped hover keyField='ProductCode' data={ this.state.products } columns={ columns } defaultSorted={defaultSorted} pagination={paginationFactory(options)} filter={filterFactory()}/>
      </div>
    );
  }
}

export default Products;
