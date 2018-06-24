const express = require("express");
const request = require("request"); // https://github.com/request/request
const config = require("../config");

(function initialize() {
    const router = express.Router();
    router.get("", createConceptFunction());
    module.exports = router;
})();

function createConceptFunction() {
    return (req, res) => {
        const query = createConceptSparqlQuery();
        pipeSparqlConstruct(res, query, config.endpoint);
    }
}

function createConceptSparqlQuery() {
    return `
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX dct: <http://purl.org/dc/terms/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX dcat: <http://www.w3.org/ns/dcat#>

PREFIX ssp: <https://ssp.opendata.cz/slovník/základní/pojem/>
PREFIX app: <https://skod.opendata.cz/slovník/aplikační/>

CONSTRUCT {

  ?pojem a ?typPojmu ; 
    skos:prefLabel ?nazevPojmu ; 
    skos:inScheme ?glosar ; 
    skos:broader ?specializovanyPojem ; 
    app:pouzitVGlosari ?odkazujiciGlosar ; 
    app:excel ?excel .

} WHERE {

  VALUES ?typPojmu {ssp:typ-objektu ssp:typ-vlastnosti ssp:typ-vztahu}

  ?pojem a ?typPojmu ;
    skos:prefLabel ?nazevPojmu ;
    skos:inScheme ?glosar .

  ?glosar rdfs:label ?nazevGlosare .
  
  OPTIONAL {
    ?glosar dct:conformsTo ?predpis .

    GRAPH <https://esbirka.opendata.cz/zdroj/datová-sada/pspcz> {
      ?predpis dct:identifier ?cisloPredpisuWithSuffix .
      BIND(REPLACE(?cisloPredpisuWithSuffix, "[\\\\s\\\\x{00A0}]+Sb\\\\.", "") AS ?cisloPredpisu)
    }

  }

  OPTIONAL {
    ?pojem skos:broader ?specializovanyPojem .
  }
  
  BIND(
    COALESCE(
     CONCAT(?nazevPojmu, " (", ?cisloPredpisu, ")"), ?nazevPojmu) AS ?excel
  )

  OPTIONAL {
    {
      ?odkazujiciPojem skos:broader ?pojem ;
        skos:inScheme ?pouzitVGlosari .
    } UNION {
      ?odkazujiciPojem rdfs:domain ?pojem.
    } UNION {
      ?odkazujiciPojem rdfs:domain/owl:unionOf ?pojem .
    } UNION {
       ?odkazujiciPojem rdfs:range ?pojem.
    } UNION {
      ?odkazujiciPojem rdfs:range/owl:unionOf ?pojem .
    }

    ?odkazujiciPojem skos:inScheme ?odkazujiciGlosar .
  }

}
`;
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
