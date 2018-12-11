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
            loadingPrimavera: true
        }
    }


    componentDidMount() {
        if (this.props.token !== "") {
            this.callPrimavera()
              .then((res) => this.handlePrimaveraResponse(res))
              .catch(err => console.log(err));
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // Check if token was updated
        if( prevProps.token === "" && this.props.token !== "" ) {
          this.callPrimavera()
            .then((res) => this.handlePrimaveraResponse(res))
            .catch(err => console.log(err));
        }
    }
    
    
    callPrimavera = async () => {
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

    handlePrimaveraResponse(res) {
        if ( res.status === 200 && res.data.DataSet.Table.length )
            this.setState( { 
                info: res.data.DataSet.Table[0],
                loadingPrimavera: false
            } );
    };


    loading() {
        return this.props.token === "" || this.state.loadingPrimavera;
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
                      data={my_data}
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

const my_data = [
    {
      "id": "Purchases",
      "color": "hsl(113, 70%, 50%)",
      "data": [
        {
          "x": "2013",
          "y": 0,
        },
        {
          "x": "2014",
          "y": 0,
        },
        {
          "x": "2015",
          "y": 0,
        },
        {
          "x": "2016",
          "y": 146
        },
        {
          "x": "2017",
          "y": 271
        },
        {
          "x": "2018",
          "y": 132
        }
      ]
    },
    {
      "id": "Sales",
      "color": "hsl(335, 70%, 50%)",
      "data": [
        {
          "x": "2013",
          "y": 0,
        },
        {
          "x": "2014",
          "y": 0,
        },
        {
          "x": "2015",
          "y": 0,
        },
        {
          "x": "2016",
          "y": 229
        },
        {
          "x": "2017",
          "y": 21
        },
        {
          "x": "2018",
          "y": 206
        }
      ]
    },
    {
      "id": "Profit",
      "color": "hsl(186, 70%, 50%)",
      "data": [
        {
          "x": "2013",
          "y": 0,
        },
        {
          "x": "2014",
          "y": 0,
        },
        {
          "x": "2015",
          "y": 0,
        },
        {
          "x": "2016",
          "y": 116
        },
        {
          "x": "2017",
          "y": 151
        },
        {
          "x": "2018",
          "y": 128
        }
      ]
    }
  ];  

export default Product;
