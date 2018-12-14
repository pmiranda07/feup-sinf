import React, { Component } from 'react';
import ReactLoading from 'react-loading';
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
    let error_alert = this.props.loginError ? 
        (<div class="alert alert-danger alert-top" role="alert">
            <strong>Login Error!</strong> Check your login credentials.
        </div>) 
        : null;

    let loading = this.props.gettingToken ? 
        <div className="d-flex justify-content-around mt-5">
            <ReactLoading type={"spinningBubbles"} color={"#444444"} height={'10%'} width={'10%'} />
        </div>
        : <input type="submit" className="btn btn-primary" />;

        
    return (
        <div id="LoginForm">
            {error_alert}
            <div className="vertical-center">
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
                                        {loading}
                                    </form>
                                </div>
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