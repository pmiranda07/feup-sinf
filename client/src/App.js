import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.css';

import Home from './pages/Home';
import Overview from './pages/Overview';
import Financial from './pages/Financial';
import Products from './pages/Products';
import Purchases from './pages/Products';
import Sales from './pages/Sales';

import Product from './pages/Product';

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/Overview" exact component={Overview} />
          <Route path="/Financial" exact component={Financial} />
          <Route path="/Products" exact component={Products} />
          <Route path="/Purchases" exact component={Purchases} />
          <Route path="/Sales" exact component={Sales} />

          <Route path="/Products/:id" component={Product}/>
        </Switch>
      </Router>
    );
  }
}

export default App;
