/* eslint max-len: 0 */
import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';


export default class SalesTable extends React.Component {
    render() {
        return (
        <BootstrapTable data={ this.props.data }  striped hover pagination>
            <TableHeaderColumn dataField='id' isKey ={ true } width='25%' >Sales ID</TableHeaderColumn>
            <TableHeaderColumn dataField='customer' width='25%' >Customer ID</TableHeaderColumn>
            <TableHeaderColumn dataField='date' width='25%' >Date</TableHeaderColumn>
            <TableHeaderColumn dataField='net_total' width='25%' >Net total</TableHeaderColumn>
        </BootstrapTable>
        );
    }
}