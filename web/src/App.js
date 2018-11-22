import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/financial/">financial</Link>
              </li>
            </ul>
          </nav>

          <Route path="/" exact component={Overview} />
          <Route path="/financial/" component={Financial} />
          <Route path="/sales/" component={Sales} />
          <Route path="/purchases/" component={Purchases} />
          <Route path="/products/" component={Products} />
        </div>
      </Router>
    );
  }
}

export default App;
