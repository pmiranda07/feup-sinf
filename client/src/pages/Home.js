import React, { Component } from 'react';

class Home extends Component {
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
    const response = await fetch('/Home');
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  render() {
    return (
      <div>
        <p>{ this.state.message }</p>
        <form action="uploadSAFT" method="post" encType="multipart/form-data">
          Select file:
          <input type="file" name="saft" id="saft"/>
          <input type="submit" value="Upload File" name="submit"/>
        </form>
      </div>
    );
  }
}

export default Home;
