import React, { Component } from 'react';
import axios from 'axios';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: 'Hello',
      files: []
    };


    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.fileUpload = this.fileUpload.bind(this);
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
        <form onSubmit={this.onFormSubmit}>
          Select file:
          <input type="file" onChange={this.onChange} />
          <button type="submit">Upload File</button>
        </form>
      </div>
    );
  }

  onFormSubmit(e){
    e.preventDefault();
    this.fileUpload(this.state.files).then((response) => {
      this.setState( { message: response.data.message } );
    });
  }

  onChange(e) {
    this.setState( { files: e.target.files } )
  }

  fileUpload(files){
    const url = '/uploadSAFT';
    const formData = new FormData();
    formData.append('saft', files[0])
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }
    return axios.post(url, formData,config);
  }
}

export default Home;
