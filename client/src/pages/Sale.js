import React, { Component } from 'react';
import SaleTable from '../components/sale_table';
// import Box from 'react-styled-box';
import { Container, Row, Col } from 'react-grid-system';

class Sale extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.match.params.id,
            message: "Please upload a saf-t file",
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
            message: '',
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
            <div>
                {this.state.message}
                <Container> 
                    <Row debug> 
                        <Col style={{textAlign:'center'}}>
                            <h3>{this.state.sale_id}</h3>   
                        </Col>
                        <Col  style={{textAlign:'center'}}>
                            <h3>{this.state.sale_totals.GrossTotal + "€"}</h3>
                        </Col>
                    </Row>
                </Container>
                 <SaleTable data = {this.state.sale}> </SaleTable>  
                 <Container>
                    <Row debug>
                        <Col debug>
                            <Row> 
                                <Col style={{textAlign:'center'}}>
                                    FROM 
                                </Col>
                            </Row>
                            <Row> 
                                <Col style={{textAlign:'center'}}>
                                    {this.state.ship_from_address.AddressDetail + " " + this.state.ship_from_address.PostalCode + " " + this.state.ship_from_address.City}  
                                </Col>
                            </Row>    
                            <Row>
                                <Col style={{textAlign:'center'}}>
                                    {this.state.ship_from_date}
                                </Col>
                            </Row>
                        </Col>
                        <Col debug>
                            <Row>
                                <Col style={{textAlign:'center'}}>
                                    TO 
                                </Col>
                            </Row>
                            <Row> 
                                <Col style={{textAlign:'center'}}>
                                    {this.state.ship_to_address.AddressDetail + " " + this.state.ship_to_address.PostalCode + " " + this.state.ship_to_address.City} 
                                </Col>
                            </Row>
                            <Row> 
                                <Col style={{textAlign:'center'}}>
                                    {this.state.ship_to_date}   
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }

}

export default Sale;
