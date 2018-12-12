import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.css';
import axios from 'axios';
import qs from 'qs';

import Home from './pages/Home';
import Overview from './pages/Overview';
import Financial from './pages/Financial';
import Products from './pages/Products';
import Purchases from './pages/Products';
import Sales from './pages/Sales';
import Sale from './pages/Sale'

import Product from './pages/Product';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: ""
    };
  }

  componentWillMount() {
    let cachedToken = localStorage.getItem('token');
    let cachedDate = localStorage.getItem('date');

    if (cachedToken && cachedDate) {
      cachedToken = JSON.parse(cachedToken);
      cachedDate = Date.parse(cachedDate);

      // Get token if it has been more than 18 minutes
      if(new Date() - cachedDate < 18 * 60000) {
        this.setState({ token: cachedToken});
        return;
      }
    }

    axios({
        method: 'POST',
        url: "http://localhost:2018/WebApi/token",
        data: qs.stringify({
        username: "FEUP",
        password: "qualquer1",
        company: "DEMO",
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
          this.setState({ token: res.data.access_token});
          localStorage.setItem('token', JSON.stringify(res.data.access_token));
          localStorage.setItem('date',new Date());
        }
    })
    .catch(err => console.log(err));
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/overview" exact component={Overview} />
          <Route path="/financial" exact component={Financial} />
          <Route path="/products" exact render={(props)=><Products token={this.state.token} {...props}/>}/>
          <Route path="/purchases" exact component={Purchases} />
          <Route path="/sales" exact component={Sales} />
          <Route path='/sales/:id*' component={Sale} />
          <Route path="/products/:id" render={(props)=><Product token={this.state.token} {...props}/>}/>
        </Switch>
      </Router>
    );
  }
}

export default App;
