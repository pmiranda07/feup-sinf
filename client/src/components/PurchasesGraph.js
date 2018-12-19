import React, { Component } from 'react';
import { ResponsiveBar } from 'nivo'
import { example } from '../pages/Purchases';


export default class PurchasesGraph extends Component {
    constructor(props) {
        super(props);
        let ret = example(this.props.purchases)[0];

        this.state = {
            purchasespY: ret
        };
    }
    
    render() {
        return (
              <ResponsiveBar
              data={this.state.purchasespY}
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
                  "legend": "Year",
                  "legendPosition": "center",
                  "legendOffset": 32
              }}
              axisLeft={{
                  "tickSize": 5,
                  "tickPadding": 5,
                  "tickRotation": 0,
                  "legend": "Total (€)",
                  "legendPosition": "center",
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
        );
    }
}