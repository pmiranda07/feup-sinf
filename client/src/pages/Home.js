import React, { Component } from 'react';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stuff: 'Hello'
    };
  }

  componentDidMount() {
    this.callAPI()
        .then(body => this.setState({ stuff: body.stuff }))
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
        <p>{ this.state.stuff }</p>
        <form action="uploadSAFT" method="post" enctype="multipart/form-data">
          Select file:
          <input type="file" name="saft" id="saft"/>
          <input type="submit" value="Upload File" name="submit"/>
        </form>
      </div>
    );
  }
}

export default Home;
