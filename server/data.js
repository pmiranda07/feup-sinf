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

    isEmpty() {
        return this.data == null;
    },

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
        });

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
                
                res.send( { message: "File Uploaded" });
            });
        });
    },

    fixFile(json) {
        // Remove top 'AuditFile' key
        let parsed = json['AuditFile'];

        // Delete unused and conflicting keys
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

        return parsed;
    }
}
