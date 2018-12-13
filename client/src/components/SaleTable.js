/* eslint max-len: 0 */
import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';


export default class SaleTable extends React.Component {
    render() {
        return (
        <BootstrapTable data={ this.props.data }  striped hover pagination>
            <TableHeaderColumn dataField='id' isKey ={ true } width='20%' >Product ID</TableHeaderColumn>
            <TableHeaderColumn dataField='description' width='20%' >Product description</TableHeaderColumn>
            <TableHeaderColumn dataField='quantity' width='20%' >Number of units</TableHeaderColumn>
            <TableHeaderColumn dataField='measure' width='20%' >Unit of measure</TableHeaderColumn>
            <TableHeaderColumn dataField='price_unit' width='20%' >Price per unit</TableHeaderColumn>
        </BootstrapTable>
        );
    }
}