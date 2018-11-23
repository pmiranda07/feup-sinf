var parser = require('xml2json');
var fs = require("fs");

module.exports = {
    /* 
        This object will be built as a result of parsing the SAF-T file into JSON.
        It will work as a database.
    */
    data: null,

    /*
        This function will parse the SAF-T file into JSON.
    */
    parseSAFT() {
        fs.readFile('storage/saft.xml', (err, data) => {
            if (err) {
                console.log(err);
                return false;
            }
            
            //console.log(data);
            let json = parser.toJson(data);
            //console.log(json);
            return true;
        });
    },

    isEmpty() {
        return this.data == null;
    },

    uploadSAFT(req, res) {
        if(!req.files) {
            res.status(400).send( { message: "File was not found" } );
            return;
        }

        let file = req.files.saft; // Field name of the form

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

        if( !module.exports.parseSAFT() ) {
            res.status(500).send( { message: "Failed to parse SAF-T" } );
            return;
        }

        res.send( { message: "File Uploaded" });
    }
}
