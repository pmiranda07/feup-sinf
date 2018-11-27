const data = require('./data');

module.exports = {
    // These functions return all the data needed to build its respective page
    
    getHome(req, res) {
        res.send({ message: 'Hello Home' });
    },
    
    getOverview(req, res) {
        res.send({ message: 'Hello Overview' });
    },

    getFinancial(req, res) {
        res.send({ message: 'Hello Financial' });
    },

    getSales(req, res) {
        res.send({ message: 'Hello Sales' });
    },

    getPurchases(req, res) {
        res.send({ message: 'Hello Purchases' });
    },

    getProducts(req, res) {
        res.send({ products: data.data.Product });
    }
}
