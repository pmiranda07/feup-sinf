import React, { Component } from 'react';
import SalesTable from '../components/SalesTable';
import axios from 'axios';
import Loading from '../components/Loading';
import './Pages.css';
import { ResponsiveBar } from '@nivo/bar'
import Select from 'react-select';


class Sales extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: 'Sales: Please upload a SAF-T file',
      sales_ytd : 0,
      select_options: [],
      selected_option: null,
      salesTotal : {},
      sales: [{
        id: null,
        net_total: null,
        date: null,
        customer: null,
      }],
      bar_vars : [],
      loadingPrimavera: true
    };
  }

  componentDidMount() {
    this.callAPI()
        .then((res) => this.handleResponse(res))
        .catch(err => console.log(err));

    if (this.props.token !== null) {
      this.callPrimavera()
        .then((res) => this.handlePrimaveraResponse(res))
        .catch(err => console.log(err));
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // Check if token was updated
    if( prevProps.token === null && this.props.token !== null ) {
      this.callPrimavera()
        .then((res) => this.handlePrimaveraResponse(res))
        .catch(err => console.log(err));
    }
  }

  callAPI = async () => {
    return axios.get('/sales');
  };

  handleResponse(res) {
    this.setState( {
      sales: this.parseSalesInvoices(res.data.sales)
    });
  };

  callPrimavera = async () => {
    var query = JSON.stringify("SELECT Data, TotalMerc FROM CabecDoc WHERE TipoDoc = 'FA'");
    return axios({
      method: 'post',
      url: 'http://localhost:2018/WebApi/Administrador/Consulta',
      crossdomain: true,
      headers: {
        'content-type': 'application/json',
        'authorization': "Bearer " + this.props.token
      },
      data: query
    });
  };


  handlePrimaveraResponse(res) {
    let aux = this.state.salesTotal;
    for(let i = 0; i < res.data.DataSet.Table.length; i++){
      let date = res.data.DataSet.Table[i].Data.split('-');
      let year = date[0];
      let month = date[1];
      let totalMerc = res.data.DataSet.Table[i].TotalMerc
      if(!(year in aux)){
        aux[year] = {
          [month]: totalMerc
        };
      }
      else if(!(month in aux[year])){
        aux[year][month] = totalMerc;
      }
      else{
        aux[year][month] += totalMerc;
      }
    }
    this.setState({
      salesTotal: aux,
      loadingPrimavera: false
    });
    this.parseSalesTotal();
  };

  parseSalesInvoices(salesInvoices){
    const types = ['FT', 'FR', 'FS', 'VD', 'NC'];
    let sales = [];
    for (let index = 0; index < salesInvoices.length; index++) {
      const type = salesInvoices[index].InvoiceType;
      if( types.includes(type) ) {
        const sale = {
          id: salesInvoices[index].InvoiceNo,
          customer: salesInvoices[index].CustomerID,
          date: salesInvoices[index].InvoiceDate,
          net_total: salesInvoices[index].DocumentTotals.NetTotal,
        }
        sales.push(sale);
      }
    }
    return sales;
  }

  parseSalesTotal(){
    let ret = []
    let options = [];
    for (let index in this.state.salesTotal){
      let obj = {};
      obj["year"] = index;
      options.push({
        value: index, label:index
      });
      for(let key in this.state.salesTotal[index]){
        obj[key] = this.state.salesTotal[index][key];
      }
      ret.push(obj)
    }
    let last = options.length -1;
    this.setState({
      bar_vars: ret,
      select_options: options,
      selected_option: options[last]
    }, () => {
      this.update_sum()
    })
  }

  update_sum(){
    let sum = 0;
    for(let i in this.state.salesTotal[this.state.selected_option['value']]){
      sum+= this.state.salesTotal[this.state.selected_option['value']][i]
    }
    this.setState({
      sales_ytd: sum
    })
  }

  handleChange(selectedOption){
    this.setState({
      selected_option: selectedOption
    },() => {
      this.update_sum()
    })
  }


  loading(){
    return this.state.loadingPrimavera || this.props.token === null
  }

  render() {
    console.log(this.state.bar_vars)
    if (this.loading())
      return <Loading/>

    else return (
      <div id="salesPage" className="container">
      <div className="card">
        <div className="d-flex">
        <h6> Sales on year </h6>
          <Select
            className="w-25"
            value={this.state.selected_option}
            onChange={this.handleChange.bind(this)}
            options={this.state.select_options}
          />
          <h5 className="w-75" style={{textAlign:'center', verticalAlign:'center'}}>{this.state.sales_ytd}€</h5>
        </div>
      </div>
        <div className="card">
          <h5 className="card-header text-center"> Net earnings per year</h5>
            <div className="card-body" style={{ height: 400 }}>
              <ResponsiveBar
              data={this.state.bar_vars}
              keys={[
                "01",
                "02",
                "03",
                "04",
                "05",
                "06",
                "07",
                "08",
                "09",
                "10",
                "11",
                "12"
              ]}
              indexBy="year"
              margin={{
                  "top": 50,
                  "right": 130,
                  "bottom": 50,
                  "left": 60
              }}
              padding={0.3}
              colors="set3"
              colorBy="id"
              defs={[
                  {
                      "id": "dots",
                      "type": "patternDots",
                      "background": "inherit",
                      "color": "#38bcb2",
                      "size": 4,
                      "padding": 1,
                      "stagger": true
                  },
                  {
                      "id": "lines",
                      "type": "patternLines",
                      "background": "inherit",
                      "color": "#eed312",
                      "rotation": -45,
                      "lineWidth": 6,
                      "spacing": 10
                  }
              ]}
              fill={[
                  {
                      "match": {
                          "id": "fries"
                      },
                      "id": "dots"
                  },
                  {
                      "match": {
                          "id": "sandwich"
                      },
                      "id": "lines"
                  }
              ]}
              borderColor="inherit:darker(1.6)"
              axisTop= {null}
              axisRight= {null}
              axisBottom={{
                  "tickSize": 5,
                  "tickPadding": 5,
                  "tickRotation": 0,
                  "legend": "year",
                  "legendPosition": "middle",
                  "legendOffset": 32
              }}
              axisLeft={{
                  "tickSize": 5,
                  "tickPadding": 5,
                  "tickRotation": 0,
                  "legend": "Net Total",
                  "legendPosition": "middle",
                  "legendOffset": -50
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor="inherit:darker(1.6)"
              animate={true}
              motionStiffness={90}
              motionDamping={15}
              legends={[
                  {
                      "dataFrom": "keys",
                      "anchor": "bottom-right",
                      "direction": "column",
                      "justify": false,
                      "translateX": 120,
                      "translateY": 0,
                      "itemsSpacing": 2,
                      "itemWidth": 100,
                      "itemHeight": 20,
                      "itemDirection": "left-to-right",
                      "itemOpacity": 0.85,
                      "symbolSize": 20,
                      "effects": [
                          {
                              "on": "hover",
                              "style": {
                                  "itemOpacity": 1
                              }
                          }
                      ]
                  }
              ]}
            />
          </div>
        </div>
        <div className="card">
          <h5 className="card-header text-center">Uploaded SAF-T Sales List</h5>
          <div className="card-body">
            <SalesTable data={this.state.sales} history={this.props.history}/>
          </div>
        </div>
      </div>
    );
  }
}

export default Sales;
