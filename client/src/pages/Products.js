import React, { Component } from 'react';

class Products extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: 'Hello'
    };
  }

  componentDidMount() {
    this.callAPI()
        .then(body => this.setState({ message: body.message }))
        .catch(err => console.log(err));
  }

  callAPI = async () => {
    const response = await fetch('/Products');
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  render() {
    return (
      <div>
        { this.state.message }
      </div>
    );
  }
}

export default Products;
