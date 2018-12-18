import React, { Component, Fragment } from 'react';
import { Route, Switch, withRouter } from "react-router-dom";
import './App.css';
import axios from 'axios';
import qs from 'qs';

import Overview from './pages/Overview';
import Financial from './pages/Financial';
import Products from './pages/Products';
import Purchases from './pages/Purchases';
import Sales from './pages/Sales';
import Sale from './pages/Sale';
import Purchase from './pages/Purchase';

import Product from './pages/Product';
import LoginForm from './components/LoginForm';
import Navbar from './components/Navbar';
import Loading from './components/Loading';
import InvalidSAFT from './components/InvalidSAFT';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: null,
      gettingToken: false,
      loginError: null,
      cachedCredentials: false,
      checkingSAFT: true,
      validSAFT: false,
      fiscalYear: null
    };

    this.getToken = this.getToken.bind(this);

    this.props.history.listen((location, action) => {
      this.verifyToken();
    });
  }

  componentWillMount() {
    this.verifyToken();
    this.verifySAFT();
  }

  verifySAFT() {
    axios.get('/saft')
    .then((res) => {
      this.setState({ checkingSAFT: false, validSAFT: res.data.valid, fiscalYear: res.data.fiscalYear });
    })
    .catch((err) => {
      this.setState({ checkingSAFT: false, validSAFT: false });
    })
  }

  verifyToken() {
    let cachedToken = localStorage.getItem('token');
    let cachedDate = localStorage.getItem('date');

    if (cachedToken && cachedDate) {
      cachedToken = JSON.parse(cachedToken);
      cachedDate = Date.parse(cachedDate);

      // Get if token has less than 18 minutes
      if(new Date() - cachedDate < 18 * 60000) {
        this.setState({ token: cachedToken});
        return;
      }
      
      this.setState({ token: null });

      let username = localStorage.getItem('username');
      let password = localStorage.getItem('password');
      let company = localStorage.getItem('company');

      if(username && password && company) {
        username = JSON.parse(username); 
        password = JSON.parse(password);
        company = JSON.parse(company);
  
        this.setState({ cachedCredentials: true});
        this.getToken(username, password, company);
        return;
      }
    }
  }

  getToken(username, password, company) {
    this.setState({ gettingToken: true });
    axios({
      method: 'POST',
      url: "http://localhost:2018/WebApi/token",
      data: qs.stringify({
      username: username,
      password: password,
      company: company,
      instance: "Default",
      grant_type: "password",
      line: "Professional"
      }),
      headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    .then((res) => {
        if(res.status === 200) {
          this.setState({ token: res.data.access_token, gettingToken: false, loginError: null });
          localStorage.setItem('username', JSON.stringify(username));
          localStorage.setItem('password', JSON.stringify(password));
          localStorage.setItem('company', JSON.stringify(company));

          localStorage.setItem('token', JSON.stringify(res.data.access_token));
          localStorage.setItem('date',new Date());
        }
    })
    .catch((err) => {
      console.log(err);
      this.setState( { gettingToken: false, loginError: err.response } );
      if (this.state.cachedCredentials) {
        localStorage.clear();
        this.setState( { cachedCredentials: false });
      }
    });
  }

  render() {
    if(this.state.token === null || this.state.checkingSAFT) {
      if(this.state.cachedCredentials || this.state.checkingSAFT) {
        return (
          <Loading/>
        )
      }

      return ( 
        <Switch>
          <Route path='*' render={() => <LoginForm getToken={this.getToken} gettingToken={this.state.gettingToken} loginError={this.state.loginError}/>} />
        </Switch>
      )
    }

    if(!this.state.validSAFT) {
      return (
        <Fragment>
          <Navbar invalidSAFT={true}/>
          <Route path='*' render={() => <InvalidSAFT />}/>
        </Fragment>
      )
    }

    return (
      <Fragment>
        <Navbar fiscalYear={this.state.fiscalYear}/>
        <Switch>
          <Route path="/" exact render={(props)=><Overview token={this.state.token} {...props}/>} />
          <Route path="/financial" exact render={(props)=><Financial token={this.state.token} {...props}/>} />
          <Route path="/products" exact render={(props)=><Products token={this.state.token} {...props}/>}/>
          <Route path="/purchases" exact render={(props)=><Purchases token={this.state.token} {...props}/>}/>
          <Route path="/sales" exact render={(props)=><Sales token={this.state.token} {...props}/>} />
          <Route path='/sales/:id*' render={(props)=><Sale token={this.state.token} {...props}/>} />
          <Route path="/products/:id" render={(props)=><Product token={this.state.token} {...props}/>}/>
          <Route path='/purchases/:id*' render={(props)=><Purchase token={this.state.token} {...props}/>} />
        </Switch>
      </Fragment>
    );
  }
}

export default withRouter(App);
