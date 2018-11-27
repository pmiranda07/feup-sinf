import React from 'react';

export default class ProductListItem extends React.Component {
    render() {
        return (
            
            <tr>
                <td>{this.props.ProductCode}</td>
                <td>{this.props.ProductNumberCode}</td>
                <td>{this.props.ProductType}</td>
                <td>{this.props.ProductGroup}</td>
                <td>{this.props.ProductDescription}</td>
            </tr>
        );
    }
}
