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

app.get('/Home', controller.getHome);
app.get('/Overview', controller.getOverview);
app.get('/Financial', controller.getFinancial);
app.get('/Sales', controller.getSales);
app.get('/Purchases', controller.getPurchases);
app.get('/Products', controller.getProducts);

app.post('/uploadSAFT', data.uploadSAFT);

app.listen(port, () => console.log(`Listening on port ${port}`));
