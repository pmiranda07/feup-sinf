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
        <div id="LoginForm">
            <div class="container">
                <div class="login-form">
                    <div class="main-div">
                        <div class="panel">
                            <div>
                                <form id="Login" onSubmit={this.handleSignIn.bind(this)}>
                                    <div class="form-group">
                                        <input class="form-control" type="text" ref="username" placeholder="Username" />
                                    </div>

                                    <div class="form-group">
                                        <input class="form-control" type="password" ref="password" placeholder="Password" />
                                    </div>
                                    
                                    <div class="form-group">
                                        <input class="form-control" type="text" ref="company" placeholder="Company" />
                                    </div>

                                    <input type="submit" class="btn btn-primary" />
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