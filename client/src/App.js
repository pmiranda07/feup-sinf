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

import Product from './pages/Product';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: ""
    };
  }

  componentWillMount() {
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
        if(res.status === 200) 
            this.setState({ token: res.data.access_token});
    })
    .catch(err => console.log(err));
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/Overview" exact component={Overview} />
          <Route path="/Financial" exact component={Financial} />
          <Route path="/Products" exact render={(props)=><Products token={this.state.token} {...props}/>}/>
          <Route path="/Purchases" exact component={Purchases} />
          <Route path="/Sales" exact component={Sales} />

          <Route path="/Products/:id" render={(props)=><Product token={this.state.token} {...props}/>}/>
        </Switch>
      </Router>
    );
  }
}

export default App;
