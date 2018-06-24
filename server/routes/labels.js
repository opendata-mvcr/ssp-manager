const express = require("express");
const request = require("request"); // https://github.com/request/request
const config = require("../config");

(function initialize() {
    const router = express.Router();
    router.get("", createLabelsFunction());
    module.exports = router;
})();


function createLabelsFunction() {
    return (req, res) => {
        const query = createConceptSparqlQuery(req.query.iri);
        pipeSparqlConstruct(res, query, config.endpoint);
    }
}

function createConceptSparqlQuery(iri) {
    return `
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

CONSTRUCT {
 <` + iri + `> ?labelPredicate ?label. 
} WHERE { 
 VALUES ?labelPredicate {skos:prefLabel rdfs:label } 
 <` + iri + `> ?labelPredicate ?label. 
}`;
}

function pipeSparqlConstruct(res, query, endpoint) {
    const url = endpoint + "?" +
        "format=application%2Fx-json%2Bld&" +
        "timeout=0&" +
        "query=" + encodeURIComponent(query);

    request.get({"url": url}).on("error", (error) => {
        // TODO Error handling.
    }).pipe(res);

}
