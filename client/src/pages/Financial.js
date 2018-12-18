import React, { Component } from 'react';
import axios from 'axios';
import Select from 'react-select'

import FinancialChart from '../components/FinancialChart';
import Loading from '../components/Loading';
import './Pages.css';

class Financial extends Component {
  constructor(props) {
    super(props);

    this.state = {
      month: 0,
      details: { },
      loadingDetails: true
    };

    this.months = [
      { value: 0, label: 'January' },
      { value: 1, label: 'February' },
      { value: 2, label: 'March' },
      { value: 3, label: 'April' },
      { value: 4, label: 'May' },
      { value: 5, label: 'June' },
      { value: 6, label: 'July' },
      { value: 7, label: 'August' },
      { value: 8, label: 'September' },
      { value: 9, label: 'October' },
      { value: 10, label: 'November' },
      { value: 11, label: 'December' }
    ]
  }

  componentDidMount() {
    this.getSaftDetails();
  }

  getSaftDetails() {
    axios.get('/financial?month=' + this.state.month)
    .then((res) => {
      this.setState({
        loadingDetails: false,
        details: res.data
      })
    })
    .catch((err) => console.log(err) );
  }

  loading() {
    return this.state.loadingDetails;
  }

  onMonthChange(option, action) {
    if(action.action === 'select-option')
      this.setState({ month: option.value }, this.getSaftDetails);
  }

  render() {
    if( this.loading() )
      return <Loading/>

    return (
      <div id="financialPage" className="container">
        <h1>Financial</h1>
        <div className="card">
          <div className="card-header">
            <div className="d-flex flex-row justify-content-between align-items-center">
              <h4 className="m-0">Financial details</h4>
              <Select value={this.months[this.state.month]} className="w-50" options={this.months} onChange={this.onMonthChange.bind(this)}/>
            </div>
            </div>
          <div className="card-body d-flex flex-row justify-content-around ">
            <span className="card details">
                <div className="card-header">Cash</div>
                <div className="card-body">{this.state.details.cash}€</div>
            </span>

            <span className="card details">
                <div className="card-header">Bank</div>
                <div className="card-body">{this.state.details.bank}€</div>
            </span>

            <span className="card details">
                <div className="card-header">EBITDA</div>
                <div className="card-body">{this.state.details.ebitda}€</div>
            </span>

            <span className="card details">
                <div className="card-header">Accounts Payable</div>
                <div className="card-body">{this.state.details.ap}€</div>
            </span>

            <span className="card details">
                <div className="card-header">Accounts Receivable</div>
                <div className="card-body">{this.state.details.ar}€</div>
            </span>
          </div>
        </div>

        <div className="card">
          <h4 className="card-header text-center">Sales and Revenue</h4>
          <div className="card-body" style={{height: 500}}>
            <FinancialChart sales={this.state.details.sales} revenue={this.state.details.revenue}/>
          </div>
        </div>
      </div>
    );
  }
}

export default Financial;
