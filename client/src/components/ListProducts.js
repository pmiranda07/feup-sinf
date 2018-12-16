import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";


export default class ListProducts extends React.Component {
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
            <div>
                <input type="text" className="form-control" placeholder="Search product name" onInput={ this.handleSearchInput }/>
                <BootstrapTable bootstrap4 striped hover keyField='Artigo' data={ this.props.products } columns={ this.columns } defaultSorted={this.defaultSorted} pagination={paginationFactory(this.tableOptions)} filter={filterFactory()}/>
            </div>
        );
    }
}