module.exports = {
    // These functions return all the data needed to build its respective page
    
    getHome(req, res) {
        res.send({ stuff: 'Hello Home' });
    },
    
    getOverview(req, res) {
        res.send({ stuff: 'Hello Overview' });
    },

    getFinancial(req, res) {
        res.send({ stuff: 'Hello Financial' });
    },

    getSales(req, res) {
        res.send({ stuff: 'Hello Sales' });
    },

    getPurchases(req, res) {
        res.send({ stuff: 'Hello Purchases' });
    },

    getProducts(req, res) {
        res.send({ stuff: 'Hello Products' });
    }
}
