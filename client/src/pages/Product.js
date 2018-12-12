import React, { Component } from 'react';
import axios from 'axios';
import ReactLoading from 'react-loading';
import { ResponsiveLine } from 'nivo';

class Product extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            id: props.match.params.id,
            info: { },
            loadingPrimaveraDetails: true,
            loadingPrimaveraDocuments: true,
            sales: {}
        }
    }


    componentDidMount() {
        if (this.props.token !== "") {
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
        if( prevProps.token === "" && this.props.token !== "" ) {
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
          "SELECT * FROM LinhasDoc INNER JOIN CabecDoc ON LinhasDoc.IdCabecDoc = CabecDoc.Id INNER JOIN DocumentosVenda ON CabecDoc.TipoDoc = DocumentosVenda.Documento " + 
          "WHERE CabecDoc.TipoDoc IN ('FA','FS','FR','VD') AND LinhasDoc.Artigo = '" + this.state.id + "'");

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
          this.setState( {
            sales: this.processDocs(res.data.DataSet.Table), 
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

      for(let i = 0; i < docs.length; i++) {
        let line = docs[i];
        if(line.Data < "2016-01-01T00:00:00")
          continue;
        if(line.Data < "2017-01-01T00:00:00")
          sales[2016] += line.PrecoLiquido;
        else if(line.Data < "2018-01-01T00:00:00")
          sales[2017] += line.PrecoLiquido;
        else if(line.Data < "2019-01-01T00:00:00")
          sales[2018] += line.PrecoLiquido;
      }

      return sales;
    }
    

    loading() {
        return this.props.token === "" || this.state.loadingPrimaveraDetails || this.state.loadingPrimaveraDocuments;
    }


    renderLoading() {
        return (
          <div style={{
            width: '8%',
            height: '8%',
            position: "absolute",
            top: '50%',
            left: '50%',
            marginLeft: '-4%',
            marginTop: '-4%',
          }}>
            <ReactLoading type={"spinningBubbles"} color={"#00ffbb"} height={'100%'} width={'100%'} />
          </div>
        );
    }


    render() {
        if( this.loading() )
            return this.renderLoading();

        return (
            <div className="card">
                <div className="card-header">
                    <strong>Product: </strong>{this.state.info.Descricao}
                </div>
                <div className="card-body">
                    <div className="d-flex flex-row justify-content-around">
                        <span className="card w-25">
                            <div className="card-header">ID</div>
                            <div className="card-body">{this.state.info.Artigo}</div>
                        </span>

                        <span className="card w-25">
                            <div className="card-header">Stock</div>
                            <div className="card-body">{this.state.info.STKActual}</div>
                        </span>

                        <span className="card w-25">
                            <div className="card-header">Price</div>
                            <div className="card-body">{this.state.info.PCMedio}</div>
                        </span>
                    </div>

                    <div style={{height: 500}}>
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
                                  "y": 0
                                },
                                {
                                  "x": "2017",
                                  "y": 0
                                },
                                {
                                  "x": "2018",
                                  "y": 0
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
                                  "y": 0
                                },
                                {
                                  "x": "2017",
                                  "y": 0
                                },
                                {
                                  "x": "2018",
                                  "y": 0
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
                            "legend": "Value",
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
            </div>
        );
    }

}

export default Product;
