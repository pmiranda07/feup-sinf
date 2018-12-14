const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const controller = require('./controller');
const data = require('./data');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

app.use(function (req, res, next) {
    if( data.loadDatabase(req, res) )
        next();
    else res.status(400).send( { message: "Please upload a SAF-T file" } );
});
  
app.get('/overview', controller.getOverview);
app.get('/financial', controller.getFinancial);
app.get('/sales', controller.getSales);
app.get('/purchases', controller.getPurchases);
app.get('/products', controller.getProducts);

app.get('/products/:id', controller.getProduct);
app.get('/sales/:id(*)', controller.getSale);

app.post('/uploadSAFT', data.uploadSAFT);

app.listen(port, () => console.log(`Listening on port ${port}`));
