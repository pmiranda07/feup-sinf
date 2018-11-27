import React, { Component } from 'react';
import ProductListItem from '../components/ProductListItem';
import axios from 'axios';
import {Table} from 'react-bootstrap';

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
    const products = this.state.products.map((product) => (
      <ProductListItem {...product}></ProductListItem>
    ));

    return (
      <div>
        <h1>Products</h1>
        <Table striped bordered condensed hover responsive>
          <thead>
            <tr>
              <th>ProductCode</th>
              <th>ProductNumberCode</th>
              <th>ProductType</th>
              <th>ProductGroup</th>
              <th>ProductDescription</th>
            </tr>
          </thead>

          <tbody>
            {products}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default Products;
