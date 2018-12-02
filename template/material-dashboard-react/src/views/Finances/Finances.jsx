import React from "react";
import PropTypes from "prop-types";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Store from "@material-ui/icons/Store";
import Warning from "@material-ui/icons/Warning";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import AccessTime from "@material-ui/icons/AccessTime";
import Accessibility from "@material-ui/icons/Accessibility";
import BugReport from "@material-ui/icons/BugReport";
import Code from "@material-ui/icons/Code";
import Cloud from "@material-ui/icons/Cloud";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Table from "components/Table/Table.jsx";
import Tasks from "components/Tasks/Tasks.jsx";
import CustomTabs from "components/CustomTabs/CustomTabs.jsx";
import Danger from "components/Typography/Danger.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardIcon from "components/Card/CardIcon.jsx";
import CardBody from "components/Card/CardBody.jsx";

import { bugs, website, server } from "variables/general.jsx";

import {
  dailySalesChart,
  emailsSubscriptionChart,
  completedTasksChart
} from "variables/charts.jsx";

import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.jsx";

class Dashboard extends React.Component {
  state = {
    value: 0
  };
  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };
  render() {
    const { classes } = this.props;
    return (
      <div>
        <GridContainer>

         {/* Sales YTD */}
          <GridItem xs={12} sm={6} md={4}>
            <Card>
              <CardHeader color="success" stats icon>
                <CardIcon color="success">
                  <Icon>attach_money</Icon>
                </CardIcon>
                <p className={classes.cardCategory}>Sales YTD</p>
                <h3 className={classes.cardTitle}>
                  77367 <small>€</small>
                </h3>
              </CardHeader>
            </Card>
          </GridItem>

         {/* Purchases YTD */}
          <GridItem xs={12} sm={6} md={4}>
            <Card>
              <CardHeader color="danger" stats icon>
                <CardIcon color="danger">
                  <Icon>money_off</Icon>
                </CardIcon>
                <p className={classes.cardCategory}>Purchases YTD</p>
                <h3 className={classes.cardTitle}>
                  53363 <small>€</small>
                </h3>
              </CardHeader>
            </Card>
          </GridItem>

          {/* Net Profit YTD */}
          <GridItem xs={12} sm={6} md={4}>
            <Card>
              <CardHeader color="warning" stats icon>
                <CardIcon color="warning">
                  <Icon>bar_chart</Icon>
                </CardIcon>
                <p className={classes.cardCategory}>Net Profit YTD</p>
                <h3 className={classes.cardTitle}>
                  53363 <small>€</small>
                </h3>
              </CardHeader>
            </Card>
          </GridItem>
        </GridContainer>

        {/* SALES YOY */}
        <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
                <Card chart>
                    <CardHeader color="success">
                        <ChartistGraph
                            className="ct-chart"
                            data={dailySalesChart.data}
                            type="Line"
                            options={dailySalesChart.options}
                            listener={dailySalesChart.animation}
                        />
                    </CardHeader>
                    <CardBody>
                        <h4 className={classes.cardTitle}>Sales year on year</h4>
                    </CardBody>
                </Card>
            </GridItem>
        </GridContainer>

        {/* Purchases YOY */}
        <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
                <Card chart>
                    <CardHeader color="danger">
                        <ChartistGraph
                            className="ct-chart"
                            data={dailySalesChart.data}
                            type="Line"
                            options={dailySalesChart.options}
                            listener={dailySalesChart.animation}
                        />
                    </CardHeader>
                    <CardBody>
                        <h4 className={classes.cardTitle}>Purchases year on year</h4>
                    </CardBody>
                </Card>
            </GridItem>
        </GridContainer>

        {/* Net Profit YOY */}
        <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
                <Card chart>
                    <CardHeader color="warning">
                        <ChartistGraph
                            className="ct-chart"
                            data={dailySalesChart.data}
                            type="Line"
                            options={dailySalesChart.options}
                            listener={dailySalesChart.animation}
                        />
                    </CardHeader>
                    <CardBody>
                        <h4 className={classes.cardTitle}>Net Sales year on year</h4>
                    </CardBody>
                </Card>
            </GridItem>
        </GridContainer>
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(Dashboard);
