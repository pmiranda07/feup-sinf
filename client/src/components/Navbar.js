import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import {DropdownButton} from 'react';
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
        this.state.files = e.target.files;
        document.getElementById("uploadCustomFile").click();
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

    saftFunction() {
        document.getElementById("customFile").click();
    }

  render() {
    let alert_error = this.state.uploadError ?
        (<div className="alert alert-danger alert-top" role="alert">
            <strong>Upload Error!</strong> Check your SAF-T file.
            <button type="button" className="close" aria-label="Close" onClick={this.resetUploadError.bind(this)}>
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
                    <li className="nav-item">
                        <button className="btn" type="button" onClick={this.saftFunction}>Upload SAF-T</button>
                    </li>
                </ul>
            </div>

            <div id="saft-upload">
                <input onChange={this.onChange} type="file" className="custom-file-input" id="customFile"/>
                <button className="btn btn-primary" type="button" onClick={this.onFormSubmit} id="uploadCustomFile">Upload File</button>
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
