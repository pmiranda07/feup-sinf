import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";


export default class ListOutOfStock extends React.Component {
    constructor(props) {
        super(props);

        this.columns = [{
            dataField: 'Artigo',
            text: 'Code',
            sort: true,
            events: {
              onClick: (e, column, columnIndex, row, rowIndex) => { 
                this.props.history.push('/products/' + row.Artigo);
              }
            }
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

        this.defaultSorted = [{
            dataField: 'Artigo',
            order: 'asc'
        }];

        const customTotal = (from, to, size) => (
            <span className="react-bootstrap-table-pagination-total">
                Showing { from } to { to } of { size } products
            </span>
        );

        this.tableOptions = {
            hideSizePerPage: true,
            hidePageListOnlyOnePage: true,
            showTotal: true,
            paginationTotalRenderer: customTotal
        };

        this.handleSearchInput = (e) => {
            this.nameFilter(e.target.value);
        };    
    }

    render() {
        return (
            <BootstrapTable bootstrap4 striped hover keyField='Artigo' data={ this.props.outOfStock } columns={ this.columns } defaultSorted={this.defaultSorted} pagination={paginationFactory(this.tableOptions)}/>
        );
    }
}
