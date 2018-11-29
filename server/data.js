var parser = require('xml2json');
var fs = require("fs");
var read = require('read-file');
var write = require('write');

module.exports = {
    /* 
        This object will be built as a result of parsing the SAF-T file into JSON.
        It will work as a database.
    */
    data: null,


    loadDatabase(req, res) {
        console.log("Database Middleware called");
        if ((!module.exports.data) && req.method === 'GET') {
            console.log("Loading database");
            try {
                let jsonString = fs.readFileSync('storage/saft.json');
                module.exports.data = JSON.parse(jsonString);
                module.exports.dataChanged = false;
                console.log("Database loaded");
                return true;
            } catch (error) {
                console.log("Error loading database");
                return false;
            }
        }
        return true;
    },


    /*
        Handles the upload of a SAF-T file, parses it to JSON, stores it in a .json file and in the data variable
    */
    uploadSAFT(req, res) {
        if(!req.files) {
            res.status(400).send( { message: "File was not found" } );
            return;
        }

        let file = req.files.saft;

        if(file.mimetype != "text/xml") {
            res.status(400).send( { message: "File is not a XML" } );
            return;
        }

        file.mv("storage/saft.xml", function(err) {
            if(err) {
                res.status(500).send( { message: "Server error: Could not save file" } );
                return;
            }

            read("storage/saft.xml", "utf8", (err, xmlBuffer) => {
                if( err ) {
                    res.status(500).send( { message: "Failed to parse SAF-T" } );
                    return false;
                }
                
                let jsonString = parser.toJson(xmlBuffer);
                let json = JSON.parse(jsonString);
                
                json = module.exports.fixFile(json);
                jsonString = JSON.stringify(json);
    
                module.exports.data = json;
    
                write('storage/saft.json', jsonString, (err) => {
                    if( err ) {
                        res.status(500).send( { message: "Failed to parse SAF-T" } );
                        return false;
                    }
                    
                    module.exports.data = null;
                    res.send( { message: "File Uploaded" });
                });
            });
        });
    },

    fixFile(json) {
        // Remove top 'AuditFile' key
        let parsed = json['AuditFile'];

        // Delete unused and conflicting keys
        delete parsed['xmlns:doc'];
        delete parsed['xmlns:xsi'];
        delete parsed['xmlns:xsd'];
        delete parsed['xsi:schemaLocation'];
        delete parsed['xmlns'];

        // Move 'MasterFiles' up one level
        let MasterFiles = parsed.MasterFiles;
        delete parsed.MasterFiles;

        parsed = {
            ...parsed,
            ...MasterFiles
        };

        // Move 'TaxTable' up one level
        let TaxTable = parsed.TaxTable;
        delete parsed.TaxTable;

        parsed = {
            ...parsed,
            ...TaxTable
        };

        module.exports.parseSourceDocuments(parsed);

        return parsed;
    },

    parseSourceDocuments(parsed) {

        let SalesInvoices = parsed.SourceDocuments.SalesInvoices;
    
        const { Invoice, NumberOfEntries, TotalDebit, TotalCredit } = SalesInvoices;
    
        parsed.SalesInvoicesInfo = {
            NumberOfEntries,
            TotalDebit,
            TotalCredit
        };
    
        parsed.SalesInvoices = Invoice;
    
        if(!parsed.SourceDocuments.MovementOfGoods) {
            delete parsed.SourceDocuments;
            return;
        }
    
        let MovementOfGoods = parsed.SourceDocuments.MovementOfGoods;
    
        const { NumberOfMovementLines, TotalQuantityIssued, StockMovement } = MovementOfGoods;
    
        parsed.StockMovementsInfo = {
            NumberOfMovementLines,
            TotalQuantityIssued
        };
    
        parsed.StockMovements = StockMovement;
    
        delete parsed.SourceDocuments;
    }
}
