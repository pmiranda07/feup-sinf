import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';


export default class SalesTable extends React.Component {
    constructor(props) {
        super(props);

        this.columns = [
            {
                dataField: 'id',
                text: 'Sales ID',
                sort: true,
                events: {
                  onClick: (e, column, columnIndex, row, rowIndex) => { 
                    this.props.history.push('/sales/' + row.id);
                  }
                }
            }, {
                dataField: 'customer',
                text: 'Customer ID',
                sort: true
            }, {
                dataField: 'date',
                text: 'Invoice Date',
                sort: true
            }, {
                dataField: 'net_total',
                text: 'Net total (€)',
                sort: true
            } 
        ];
    
        this.defaultSorted = [{
            dataField: 'id',
            order: 'asc'
        }];

        const customTotal = (from, to, size) => (
            <span className="react-bootstrap-table-pagination-total">
                Showing { from } to { to } of { size } sales
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