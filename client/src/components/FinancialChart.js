import React, { Component } from 'react';
import { ResponsiveLine } from 'nivo';

export default class FinancialChart extends Component {
    constructor(props) {
        super(props);

        this.sales_labels = this.getLabel(this.props.sales);
        this.revenue_labels = this.getLabel(this.props.revenue);
    }

    getLabel(values) {
        let labels = [];
        for(let i = 0; i < 12; i++) {
            labels.push({
                "x": String(i+1),
                "y": values[i]
            })
        }
        return labels;
    }

    render() {
        return (
            <div className="card">
                <h4 className="card-header">Sales and Revenue</h4>
                <div className="card-body" style={{height: 500}}>
                    <ResponsiveLine
                        colors="set1"
                        data={
                        [
                            {
                            "id": "Sales",
                            "color": "hsl(335, 70%, 50%)",
                            "data": this.sales_labels
                            },
                            {
                            "id": "Revenue",
                            "color": "hsl(186, 70%, 50%)",
                            "data": this.revenue_labels
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
                            "legend": "Month",
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
        );
    }

}
