import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

class Navbar extends Component {

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
                        <NavLink activeClassName="active" className="nav-link" exact to="/products">Products</NavLink>
                    </li>
                    <li class="nav-item">
                        <NavLink activeClassName="active" className="nav-link" exact to="/sales">Sales</NavLink>
                    </li>
                    <li class="nav-item">
                        <NavLink activeClassName="active" className="nav-link" exact to="/purchases">Purchases</NavLink>
                    </li>
                </ul>
            </div>
        </nav>
    );
  }

}

export default Navbar;