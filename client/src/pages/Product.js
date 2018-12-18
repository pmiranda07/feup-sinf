import React, { Component } from 'react';
import axios from 'axios';
import { ResponsiveLine } from 'nivo';

import Loading from '../components/Loading';
import './Pages.css'

class Product extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.match.params.id,
            info: { },
            loadingPrimaveraDetails: true,
            loadingPrimaveraDocuments: true,
            sales: {},
            purchases: {}
        }
    }


    componentDidMount() {
        if (this.props.token !== null) {
            this.requestProductDetails()
              .then((res) => this.handleDetailsResponse(res))
              .catch(err => console.log(err));
            this.requestDocuments()
              .then((res) => this.handleDocumentsResponse(res))
              .catch(err => console.log(err));
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // Check if token was updated
        if( prevProps.token === null && this.props.token !== null ) {
          this.requestProductDetails()
            .then((res) => this.handleDetailsResponse(res))
            .catch(err => console.log(err));
          this.requestDocuments()
            .then((res) => this.handleDocumentsResponse(res))
            .catch(err => console.log(err));
        }
    }


    requestProductDetails = async () => {
        var query = JSON.stringify("SELECT Artigo, Descricao, STKActual, PCMedio FROM Artigo WHERE Artigo = '" + this.state.id + "'");

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

    handleDetailsResponse(res) {
        if ( res.status === 200 && res.data.DataSet.Table.length )
            this.setState( {
                info: res.data.DataSet.Table[0],
                loadingPrimaveraDetails: false
            } );
    };

    requestDocuments = async () => {
      var query = JSON.stringify(
        "SELECT LinhasCompras.DataDoc as Date, LinhasCompras.PrecoLiquido as Value, 'Compras' as Type " +
        "FROM LinhasCompras INNER JOIN CabecCompras ON LinhasCompras.IdCabecCompras = CabecCompras.Id INNER JOIN DocumentosCompra ON DocumentosCompra.Documento = CabecCompras.TipoDoc " +
        "WHERE DocumentosCompra.Documento IN ('VFA', 'VNC') AND LinhasCompras.Artigo = '" + this.state.id + "' " +
        "UNION " +
        "SELECT LinhasDoc.Data as Data, LinhasDoc.PrecoLiquido as Value, 'Vendas' as Type " +
        "FROM LinhasDoc INNER JOIN CabecDoc ON LinhasDoc.IdCabecDoc = CabecDoc.Id INNER JOIN DocumentosVenda ON CabecDoc.TipoDoc = DocumentosVenda.Documento " +
        "WHERE CabecDoc.TipoDoc IN ('FA','FS','FR','VD', 'NC') AND LinhasDoc.Artigo = '" + this.state.id + "'"
      );

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

    handleDocumentsResponse(res) {
        if ( res.status === 200 && res.data.DataSet.Table.length ) {
          let docs = this.processDocs(res.data.DataSet.Table);
          this.setState( {
            sales: docs.sales,
            purchases: docs.purchases,
            loadingPrimaveraDocuments: false
          } );
        }
    };


    processDocs(docs) {
      let sales = {
        2016: 0,
        2017: 0,
        2018: 0
      };

      let purchases = {
        2016: 0,
        2017: 0,
        2018: 0
      };

      for(let i = 0; i < docs.length; i++) {
        let line = docs[i];
        if(line.Type === 'Vendas') {
          if(line.Date < "2016-01-01T00:00:00")
            continue;
          if(line.Date < "2017-01-01T00:00:00")
            sales[2016] += line.Value;
          else if(line.Date < "2018-01-01T00:00:00")
            sales[2017] += line.Value;
          else if(line.Date < "2019-01-01T00:00:00")
            sales[2018] += line.Value;
        } else if (line.Type === 'Compras') {
          if(line.Date < "2016-01-01T00:00:00")
            continue;
          if(line.Date < "2017-01-01T00:00:00")
            purchases[2016] += line.Value;
          else if(line.Date < "2018-01-01T00:00:00")
            purchases[2017] += line.Value;
          else if(line.Date < "2019-01-01T00:00:00")
            purchases[2018] += line.Value;
        }
      }

      sales[2016] = parseFloat(sales[2016].toFixed(2));
      sales[2017] = parseFloat(sales[2017].toFixed(2));
      sales[2018] = parseFloat(sales[2018].toFixed(2));

      purchases[2016] = -parseFloat(purchases[2016].toFixed(2));
      purchases[2017] = -parseFloat(purchases[2017].toFixed(2));
      purchases[2018] = -parseFloat(purchases[2018].toFixed(2));

      return { sales: sales, purchases: purchases };
    }


    loading() {
        return this.props.token === null || this.state.loadingPrimaveraDetails || this.state.loadingPrimaveraDocuments;
    }

    render() {
        if( this.loading() )
            return <Loading/>
        return (
          <div id="productPage" className="container">
            <div className="card">
                <div className="card-header">
                    <strong>Product: </strong>{this.state.info.Descricao}
                </div>
                <div className="card-body">
                    <div className="d-flex flex-row justify-content-around product-infos">
                        <span className="card w-25">
                            <div className="card-header text-center">ID</div>
                            <div className="card-body text-center">{this.state.info.Artigo}</div>
                        </span>

                        <span className="card w-25">
                            <div className="card-header text-center">Stock</div>
                            <div className="card-body text-center">{this.state.info.STKActual} Units</div>
                        </span>

                        <span className="card w-25">
                            <div className="card-header text-center">Price</div>
                            <div className="card-body text-center">{this.state.info.PCMedio} €</div>
                        </span>
                    </div>

                    <span className="card prod-overview">
                        <div className="card-header">Overview</div>
                        <div className="card-body">
                        <div>
                          <ResponsiveLine
                            colors="set1"
                            data={
                              [
                                {
                                  "id": "Purchases",
                                  "color": "hsl(113, 70%, 50%)",
                                  "data": [
                                    {
                                      "x": "2016",
                                      "y": this.state.purchases[2016]
                                    },
                                    {
                                      "x": "2017",
                                      "y": this.state.purchases[2017]
                                    },
                                    {
                                      "x": "2018",
                                      "y": this.state.purchases[2018]
                                    }
                                  ]
                                },
                                {
                                  "id": "Sales",
                                  "color": "hsl(335, 70%, 50%)",
                                  "data": [
                                    {
                                      "x": "2016",
                                      "y": this.state.sales[2016]
                                    },
                                    {
                                      "x": "2017",
                                      "y": this.state.sales[2017]
                                    },
                                    {
                                      "x": "2018",
                                      "y": this.state.sales[2018]
                                    }
                                  ]
                                },
                                {
                                  "id": "Profit",
                                  "color": "hsl(186, 70%, 50%)",
                                  "data": [
                                    {
                                      "x": "2016",
                                      "y": this.state.sales[2016] - this.state.purchases[2016]
                                    },
                                    {
                                      "x": "2017",
                                      "y": this.state.sales[2017] - this.state.purchases[2017]
                                    },
                                    {
                                      "x": "2018",
                                      "y": this.state.sales[2018] - this.state.purchases[2018]
                                    }
                                  ]
                                }
                              ]
                            }
                            margin={{
                                "top": 50,
                                "right": 110,
                                "bottom": 50,
                                "left": 60
                            }}
                            xScale={{
                                "type": "point"
                            }}
                            yScale={{
                                "type": "linear",
                                "stacked": false,
                                "min": "auto",
                                "max": "auto"
                            }}
                            axisTop={null}
                            axisRight={null}
                            axisBottom={{
                                "orient": "bottom",
                                "tickSize": 5,
                                "tickPadding": 5,
                                "tickRotation": 0,
                                "legend": "Year",
                                "legendOffset": 36,
                                "legendPosition": "center"
                            }}
                            axisLeft={{
                                "orient": "left",
                                "tickSize": 5,
                                "tickPadding": 5,
                                "tickRotation": 0,
                                "legend": "Value (€)",
                                "legendOffset": -40,
                                "legendPosition": "center"
                            }}
                            dotSize={10}
                            dotColor="inherit:darker(0.3)"
                            dotBorderWidth={2}
                            dotBorderColor="#ffffff"
                            enableDotLabel={true}
                            dotLabel="y"
                            dotLabelYOffset={-12}
                            animate={true}
                            motionStiffness={90}
                            motionDamping={15}
                            legends={[
                                {
                                    "anchor": "bottom-right",
                                    "direction": "column",
                                    "justify": false,
                                    "translateX": 100,
                                    "translateY": 0,
                                    "itemsSpacing": 0,
                                    "itemDirection": "left-to-right",
                                    "itemWidth": 80,
                                    "itemHeight": 20,
                                    "itemOpacity": 0.75,
                                    "symbolSize": 12,
                                    "symbolShape": "circle",
                                    "symbolBorderColor": "rgba(0, 0, 0, .5)",
                                    "effects": [
                                        {
                                            "on": "hover",
                                            "style": {
                                                "itemBackground": "rgba(0, 0, 0, .03)",
                                                "itemOpacity": 1
                                            }
                                        }
                                    ]
                                }
                            ]}
                          />
                        </div>

                        </div>
                    </span>
                </div>
            </div>
          </div>
        );
    }

}

export default Product;
