import React, { Component } from 'react';
import './LoginForm.css';

class LoginForm extends Component {

  handleSignIn(e) {
    e.preventDefault();
    let username = this.refs.username.value;
    let password = this.refs.password.value;
    let company = this.refs.company.value;
    this.props.getToken(username, password, company);
  }

  render() {
    return (
        <div id="LoginForm" className="vertical-center">
            <div className="container">
                <div className="login-form">
                    <div className="main-div">
                        <div className="panel">
                            <div>
                                <form id="Login" onSubmit={this.handleSignIn.bind(this)}>
                                    <div className="form-group">
                                        <input className="form-control" type="text" ref="username" placeholder="Username" />
                                    </div>

                                    <div className="form-group">
                                        <input className="form-control" type="password" ref="password" placeholder="Password" />
                                    </div>
                                    
                                    <div className="form-group">
                                        <input className="form-control" type="text" ref="company" placeholder="Company" />
                                    </div>

                                    <input type="submit" className="btn btn-primary" />
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
  }

}

export default LoginForm;