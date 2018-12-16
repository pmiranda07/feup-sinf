const Database = require('./data');
const BalanceSheet = require('./balanceSheet');

module.exports = {
    // These functions return all the data needed to build its respective page
    
    getOverview(req, res) {
        res.send({ 
            topSelling: module.exports.getTopSellingProducts()
        });
    },

    getFinancial(req, res) {
        let month = parseInt(req.query.month);
        res.send({ 
            cash: BalanceSheet.getCash(month),
            ebitda: BalanceSheet.getEBITDA(month),
            bank: BalanceSheet.getBank(month),
            ap: BalanceSheet.getAP(month),
            ar: BalanceSheet.getAR(month)
        });
    },

    getSales(req, res) {
        res.send({ sales: module.exports.getListOfSales() });
    },

    getPurchases(req, res) {
        res.send({ message: 'Hello Purchases' });
    },

    getProducts(req, res) {
        res.send({ 
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
    },

    getSale(req, res) {
        let sales = Database.data.SalesInvoices;
        let sale = null;
        for (let i = 0; i < sales.length; i++) {
            if ( sales[i].InvoiceNo == req.params.id ) {
                sale = sales[i]
                res.status(200).send( { info: sale } );
                return;
            }
        }
        res.status(404).send();
        // let sales = Database.data.SalesInvoices;
        // for (let i = 0; i < sales.length; i++) {
        //     if ( sales[i].InvoiceNo == req.params.id ) {
        //         res.status(200).send( { info: sales[i] } );
        //         return;
        //     }
        // }
        // res.status(404).send();
    },

    getListOfSales(){
        return Database.data.SalesInvoices; 
    }
}
