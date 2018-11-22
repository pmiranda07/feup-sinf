module.exports = {
    /* 
        This object will be built as a result of parsing the SAF-T file into JSON.
        It will work as a database.
    */
    data: null,

    /*
        This function will parse the SAF-T file into JSON.
    */
    parseSAFT(req, res) {

    },

    isEmpty() {
        return this.data == null;
    }
}
