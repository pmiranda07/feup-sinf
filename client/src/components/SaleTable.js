/* eslint max-len: 0 */
import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';


export default class SaleTable extends React.Component {
    constructor(props) {
        super(props);

        this.columns = [
            {
                dataField: 'id',
                text: 'Product ID',
                sort: true,
                events: {
                  onClick: (e, column, columnIndex, row, rowIndex) => { 
                    this.props.history.push('/products/' + row.id);
                  }
                }
            }, {
                dataField: 'description',
                text: 'Product description',
                sort: true,
                events: {
                    onClick: (e, column, columnIndex, row, rowIndex) => { 
                      this.props.history.push('/products/' + row.id);
                    }
                  }
            }, {
                dataField: 'quantity',
                text: 'Quantity',
                sort: true
            }, {
                dataField: 'measure',
                text: 'Measure unit',
                sort: true
            },
            {
                dataField: 'price_unit',
                text: 'Unit price',
                sort: true
            }
        ];
    
        this.defaultSorted = [{
            dataField: 'id',
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
    }

    render() {
        return (
            <BootstrapTable bootstrap4 striped hover keyField='id' data={ this.props.data } columns={ this.columns } defaultSorted={this.defaultSorted} pagination={paginationFactory(this.tableOptions)}/>
        );
    }
}