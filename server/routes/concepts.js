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
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX dcat: <http://www.w3.org/ns/dcat#>

PREFIX z-sgov-pojem: <https://slovnik.gov.cz/základní/pojem/>
PREFIX v-sgov-pojem: <https://slovnik.gov.cz/veřejný-sektor/pojem/>

PREFIX app: <https://skod.opendata.cz/slovník/aplikační/>

CONSTRUCT {

  ?pojem a ?typPojmu ; # typ pojmu
    skos:prefLabel ?nazevPojmu ; # název pojmu
    skos:inScheme ?glosar ; # glosář
    skos:broader ?specializovanyPojem ; # specializovaný pojem
    app:pouzitVGlosari ?nazevGlosareKdeJePouzit ; #název glosáře kde je použit
    app:excel ?excel .
  ?glosar rdfs:label ?nazevGlosare . # název glosáře

} 
WHERE {

  VALUES ?typPojmu {z-sgov-pojem:typ-objektu z-sgov-pojem:typ-vlastnosti z-sgov-pojem:typ-vztahu}

  ?pojem a ?typPojmu ;
    skos:prefLabel ?nazevPojmu ;
    skos:inScheme ?glosar .

  ?glosar rdfs:label ?nazevGlosare .
  
  OPTIONAL {
    ?glosar v-sgov-pojem:má-zdrojový-předpis ?predpis .
	
    ?predpis dct:identifier ?cisloPredpisuWithSuffix .
    BIND(REPLACE(?cisloPredpisuWithSuffix, "[\\\\s\\\\x{00A0}]+Sb\\\\.", "") AS ?cisloPredpisu)
	
  }

  OPTIONAL {
    ?pojem skos:broader ?specializovanyPojem .
  }
  
  BIND(
    COALESCE(
	  CONCAT(?nazevPojmu, " (", ?cisloPredpisu, ")"),
	  ?nazevPojmu
	) AS ?excel
  )

  OPTIONAL {
    {
      ?odkazujiciPojem skos:broader ?pojem ;
        skos:inScheme ?pouzitVGlosari .
    } UNION {
      ?odkazujiciPojem (rdfs:domain|rdfs:range)/(owl:unionOf/rdf:rest*/rdf:first)? ?pojem .
    }

    ?odkazujiciPojem skos:inScheme ?odkazujiciGlosar .

    ?odkazujiciGlosar rdfs:label ?nazevGlosareKdeJePouzit .
  }

}
`;
}

function pipeSparqlConstruct(res, query, endpoint) {
    let url = endpoint + "?" +
        "format=application%2Fx-json%2Bld&" +
        "timeout=0&" +
        "query=" + encodeURIComponent(query);

    if (config.graph !== undefined && config.graph !== "") {
        url += "&default-graph-uri=" + encodeURIComponent(config.graph);
    }

    request.get({"url": url}).on("error", (error) => {
        // TODO Error handling.
    }).pipe(res);

}
