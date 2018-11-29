const Database = require('./data');

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
        res.send({ 
            products: Database.data.Product,
            topSelling: module.exports.getTopSellingProducts()
        });
    },

    getTopSellingProducts() {
        let products = {};
    
        let i = 0;
        Database.data.SalesInvoices.forEach((invoice) => {
    
            const type = invoice.InvoiceType;
    
            if(invoice.Line.length && (type == 'FT' || type == 'FS' || type == 'VD' || type == 'FR'))
                invoice.Line.forEach((line) => {
                    
                    const { ProductDescription, Quantity } = line;
    
                    if(products[ProductDescription])
                        products[ProductDescription] +=  parseInt(Quantity);
                    else
                        products[ProductDescription] = parseInt(Quantity);
                });
        });
    
        return products;
    },

    getProduct(req, res) {
        let products = Database.data.Product;
        for (let i = 0; i < products.length; i++) {
            if ( products[i].ProductCode == req.params.id ) {
                res.send( { info: products[i] } );
                return;
            }
        }
        res.status(404).send();
    }
}
