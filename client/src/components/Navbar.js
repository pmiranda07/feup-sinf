import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import './Navbar.css';

class Navbar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            files: [],
            uploadError: false,
        }

        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.fileUpload = this.fileUpload.bind(this);
    }

    onFormSubmit(e){
        e.preventDefault();
        this.fileUpload(this.state.files)
        .then((response) => {
            window.location.reload();
        })
        .catch((err) =>  {
            console.log(err);
            this.setState({uploadError:true});
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

    resetUploadError() {
        this.setState({uploadError: false});
    }

  render() {
    let alert_error = this.state.uploadError ?
        (<div class="alert alert-danger alert-top" role="alert">
            <strong>Upload Error!</strong> Check your SAF-T file.
            <button type="button" class="close" aria-label="Close" onClick={this.resetUploadError.bind(this)}>
                <span aria-hidden="true">&times;</span>
            </button>
        </div>)
        : null;

    return (
        <nav id="navbar" className="navbar navbar-expand-lg navbar-light">
            {alert_error}
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <NavLink activeClassName="active" className="nav-link logo" exact to="/">
                            <img src={process.env.PUBLIC_URL + 'logo.png'} />
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink activeClassName="active" className="nav-link" exact to="/">Overview</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink activeClassName="active" className="nav-link" exact to="/financial">Financial</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink activeClassName="active" className="nav-link" to="/products">Products</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink activeClassName="active" className="nav-link" to="/sales">Sales</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink activeClassName="active" className="nav-link" to="/purchases">Purchases</NavLink>
                    </li>
                </ul>
            </div>
            <div className="navbar-collapse collapse order-3">
                <div className="navbar-nav ml-auto">
                    <ul className="navbar-nav">
                        <li className="nav-item mx-2">
                            <div className="custom-file">
                                <input onChange={this.onChange} type="file" className="custom-file-input" id="customFile"/>
                                <label className="custom-file-label" htmlFor="customFile">{this.getLabel()}</label>
                            </div>
                        </li>
                        <li className="nav-item">
                            <button className="btn btn-primary" type="button" onClick={this.onFormSubmit}>Upload File</button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
  }

  getLabel() {
    let label = "";
    for(let i = 0; i < this.state.files.length; i++)
        label += this.state.files[i].name + " ";

    if(label === "")
        label = "Choose a file";

    return label;
  }

}

export default Navbar;
