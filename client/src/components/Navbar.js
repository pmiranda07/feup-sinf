import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import './Navbar.css';

class Navbar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            files: []
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
        .catch((err) =>  console.log(err) );
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

  render() {
    return (
        <nav id="navbar" class="navbar navbar-expand-lg navbar-light">
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <NavLink activeClassName="active" className="nav-link" exact to="/">Overview</NavLink>
                    </li>
                    <li class="nav-item">
                        <NavLink activeClassName="active" className="nav-link" exact to="/financial">Financial</NavLink>
                    </li>
                    <li class="nav-item">
                        <NavLink activeClassName="active" className="nav-link" to="/products">Products</NavLink>
                    </li>
                    <li class="nav-item">
                        <NavLink activeClassName="active" className="nav-link" to="/sales">Sales</NavLink>
                    </li>
                    <li class="nav-item">
                        <NavLink activeClassName="active" className="nav-link" to="/purchases">Purchases</NavLink>
                    </li>
                </ul>
            </div>
            <div class="navbar-collapse collapse order-3">
                <div class="navbar-nav ml-auto">
                    <ul class="navbar-nav">
                        <li class="nav-item mx-2">
                            <div class="custom-file">
                                <input onChange={this.onChange} type="file" class="custom-file-input" id="customFile"/>
                                <label class="custom-file-label" for="customFile">{this.getLabel()}</label>
                            </div>
                        </li>
                        <li class="nav-item">
                            <button class="btn btn-primary" type="button" onClick={this.onFormSubmit}>Upload File</button>
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