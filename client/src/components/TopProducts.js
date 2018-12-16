import React, { Component } from 'react';
import { ResponsivePie } from 'nivo';

export default class TopProducts extends Component {
    constructor(props) {
        super(props);
        
        let topSellingData = [];
        for (let product in this.props.topSelling) {
            if (this.props.topSelling.hasOwnProperty(product)) {
                topSellingData.push({
                    id: product,
                    label: product,
                    value: this.props.topSelling[product]
                });
            }
        }
        
        topSellingData.sort(function(a, b) {
            return a.value - b.value;
        });
        
        if(topSellingData.length > 10)
            topSellingData = topSellingData.slice(topSellingData.length - 10);

        this.state = {
            topSelling: topSellingData
        };
    }
    
    render() {
        return (
            <ResponsivePie
              margin={{
                  "top": 40,
                  "right": 80,
                  "bottom": 80,
                  "left": 80
              }}
              data={this.state.topSelling}
              sortByValue={true}
              innerRadius={0.5}
              padAngle={1}
              cornerRadius={1}
              colors="accent"
              colorBy="id"
              borderWidth={1}
              borderColor="inherit:darker(0.2)"
              radialLabelsSkipAngle={10}
              radialLabelsTextXOffset={6}
              radialLabelsTextColor="#333333"
              radialLabelsLinkOffset={0}
              radialLabelsLinkDiagonalLength={16}
              radialLabelsLinkHorizontalLength={24}
              radialLabelsLinkStrokeWidth={1}
              radialLabelsLinkColor="inherit"
              slicesLabelsSkipAngle={10}
              slicesLabelsTextColor="#333333"
              animate={true}
              motionStiffness={90}
              motionDamping={15}
              legends={[
                  {
                      "anchor": "bottom",
                      "direction": "row",
                      "translateY": 56,
                      "itemWidth": 100,
                      "itemHeight": 18,
                      "itemTextColor": "#999",
                      "symbolSize": 18,
                      "symbolShape": "circle",
                      "effects": [
                          {
                              "on": "hover",
                              "style": {
                                  "itemTextColor": "#000"
                              }
                          }
                      ]
                  }
              ]}
            />
        );
    }
}