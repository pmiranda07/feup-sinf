/* eslint max-len: 0 */
import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';


export default class SalesTable extends React.Component {
    render() {
        return (
        <BootstrapTable data={ this.props.data }  striped hover pagination>
            <TableHeaderColumn dataField='id' isKey ={ true } width='20%' >Product ID</TableHeaderColumn>
            <TableHeaderColumn dataField='customer' width='20%' >Customer ID</TableHeaderColumn>
            <TableHeaderColumn dataField='date' width='20%' >Date</TableHeaderColumn>
            <TableHeaderColumn dataField='description' width='20%' >Description</TableHeaderColumn>
            <TableHeaderColumn dataField='net_total' width='20%' >Net total</TableHeaderColumn>
        </BootstrapTable>
        );
    }
}