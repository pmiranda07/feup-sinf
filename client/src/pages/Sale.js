import React, { Component } from 'react';
import SaleTable from '../components/SaleTable';
import './Pages.css';

class Sale extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.match.params.id,
            ship_to_date: "",
            ship_to_address: {},
            ship_from_date: "",
            ship_from_address: {},
            sale_totals:{},
            info : {},
            sale: [{
                id: null,
                description: null,
                quantity: null,
                measure: null,
                price_unit: null
            }]
        }
    }


    componentDidMount() {
        this.callAPI()
            .then((res) => this.handleResponse(res))
            .catch(err => console.log(err));
      }
    
    callAPI = async () => {
        const response = await fetch('/sales/' + this.state.id);
        const response_json = await response.json();
        return response_json;
    };

    handleResponse(res) {
        let s = this.parseResponse(res.info);
        this.setState( { 
            inf: JSON.stringify(res.info),
            info: res.info,
            ship_to_date: res.info.ShipTo.DeliveryDate,
            ship_to_address: res.info.ShipTo.Address,
            ship_from_date: res.info.ShipFrom.DeliveryDate,
            ship_from_address: res.info.ShipFrom.Address,
            sale_id: res.info.InvoiceNo,
            sale_totals: res.info.DocumentTotals,
            sale: s
        } );
    };

    parseResponse(salesInvoice){
        let sale = [];
        if(salesInvoice.Line.length === undefined ){
            sale.push({
                id: salesInvoice.Line.ProductCode,
                description: salesInvoice.Line.ProductDescription,
                quantity: salesInvoice.Line.Quantity,
                measure: salesInvoice.Line.UnitOfMeasure,
                price_unit: salesInvoice.Line.UnitPrice
              })
        }
        else{
            for(let i = 0; i < salesInvoice.Line.length; i++){
                sale.push({
                    id: salesInvoice.Line[i].ProductCode,
                    description: salesInvoice.Line[i].ProductDescription,
                    quantity: salesInvoice.Line[i].Quantity,
                    measure: salesInvoice.Line[i].UnitOfMeasure,
                    price_unit: salesInvoice.Line[i].UnitPrice
                })
            }
        }
        return sale;
    }


    render() {
        return (
            //TODO
            <div id="salePage" className="container">
                <div className="d-flex flex-row justify-content-between">
                    <span className="card small-gap">
                        <div className="card-header">ID</div>
                        <div className="card-body">{this.state.sale_id}</div>
                    </span>

                    <span className="card small-gap">
                        <div className="card-header">Net total</div>
                        <div className="card-body">{this.state.sale_totals.NetTotal + "€"}</div>
                    </span>
                </div>

                <div className="card">
                    <h5 className="card-header text-center">Products Sold</h5>
                    <div className="card-body">
                        <SaleTable data={this.state.sale} history={this.props.history}> </SaleTable>  
                    </div>
                </div>


                <div className="d-flex flex-row justify-content-between">
                    <span className="card small-gap">
                        <div className="card-body text-center">
                            <p>From</p>
                            <p>{this.getAddressText(this.state.ship_from_address.AddressDetail + ", " + this.state.ship_from_address.PostalCode + ", " + this.state.ship_from_address.City)}</p>
                            <p>{this.state.ship_from_date}</p>
                        </div>
                    </span>

                    <span className="card small-gap">
                        <div className="card-body text-center">
                            <p>To</p>
                            <p>{this.getAddressText(this.state.ship_to_address.AddressDetail + ", " + this.state.ship_to_address.PostalCode + ", " + this.state.ship_to_address.City)}</p>
                            <p>{this.state.ship_to_date}</p>
                        </div>
                    </span>
                </div>
            </div>
        );
    }


    getAddressText(full_address) {
        if(full_address.includes('Desconhecido'))
            return 'Unknown address';
        return full_address;
    }
}

export default Sale;
