import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Table from "components/Table/Table.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    }
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1"
    }
  }
};

function Products(props) {
  const { classes } = props;
  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="info">
            <h4 className={classes.cardTitleWhite}>List of Products</h4>
          </CardHeader>
          <CardBody>
            <Table
              tableHeaderColor="primary"
              tableHead={["ID", "Product Name", "Price per unit", "Stock"]}
              tableData={[
                ["1", "Product 1", "132", "12"],
                ["2", "Product 2", "654", "36"],
                ["3", "Product 3", "435", "5"],
                ["4", "Product 4", "23", "235"],
                ["5", "Product 5", "25", "24"],
                ["6", "Product 6", "267", "2"]
              ]}
            />
          </CardBody>
        </Card>
      </GridItem>

      <GridItem xs={12} sm={6} md={6}>
        <Card>
          <CardHeader color="info">
            <h4 className={classes.cardTitleWhite}>Top products</h4>
          </CardHeader>
          <CardBody>
            <Table
              tableHeaderColor="primary"
              tableHead={["ID", "Product Name"]}
              tableData={[
                ["1", "Product 1"],
                ["2", "Product 2"],
                ["3", "Product 3"],
                ["4", "Product 4"],
                ["5", "Product 5"],
                ["6", "Product 6"],
                ["7", "Product 7"],
                ["8", "Product 8"],
                ["9", "Product 9"],
                ["10", "Product 10"]
              ]}
            />
          </CardBody>
        </Card>
      </GridItem>

      <GridItem xs={12} sm={6} md={6}>
        <Card>
          <CardHeader color="info">
            <h4 className={classes.cardTitleWhite}>Products out of stock</h4>
          </CardHeader>
          <CardBody>
            <Table
              tableHeaderColor="primary"
              tableHead={["ID", "Product Name"]}
              tableData={[
                  ["32", "Product 32"],
                  ["56", "Product 56"],
                  ["77", "Product 77"],
                  ["91", "Product 91"],
                  ["105", "Product 105"],
                  ["634", "Product 634"]
              ]}
            />
          </CardBody>
        </Card>
      </GridItem>

    </GridContainer>
  );
}

export default withStyles(styles)(Products);
