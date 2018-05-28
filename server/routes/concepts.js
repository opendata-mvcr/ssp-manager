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
    return "" +
        "PREFIX skos: <http://www.w3.org/2004/02/skos/core#>\n" +
        "PREFIX dct: <http://purl.org/dc/terms/>\n" +
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
        "PREFIX owl: <http://www.w3.org/2002/07/owl#>\n" +
        "PREFIX dcat: <http://www.w3.org/ns/dcat#>\n" +
        "\n" +
        "PREFIX ssp: <https://ssp.opendata.cz/slovník/základní/pojem/>\n" +
        "PREFIX app: <https://skod.opendata.cz/slovník/aplikační/>\n" +
        "\n" +
        "CONSTRUCT {\n" +
        "\n" +
        "  ?pojem a ?typPojmu ; \n" +
        "    skos:prefLabel ?nazevPojmu ; \n" +
        "    skos:inScheme ?glosar ; \n" +
        "    rdfs:subClassOf ?specializovanyPojem ; \n" +
        "    app:pouzitVGlosari ?odkazujiciGlosar ; \n" +
        "    app:excel ?excel .\n" +
        "\n" +
        "} WHERE {\n" +
        "\n" +
        "  VALUES ?typPojmu {ssp:typ-objektu ssp:typ-vlastnosti ssp:typ-vztahu}\n" +
        "\n" +
        "  ?pojem a ?typPojmu ;\n" +
        "    skos:prefLabel ?nazevPojmu ;\n" +
        "    skos:inScheme ?glosar .\n" +
        "\n" +
        "  ?glosar rdfs:label ?nazevGlosare .\n" +
        "  \n" +
        "  OPTIONAL {\n" +
        "    ?glosar dct:conformsTo ?predpis .\n" +
        "\t\n" +
        "    GRAPH <https://esbirka.opendata.cz/zdroj/datová-sada/pspcz> {\n" +
        "      ?predpis dct:identifier ?cisloPredpisuWithSuffix .\n" +
        "      BIND(REPLACE(?cisloPredpisuWithSuffix, \"[\\\\s\\\\x{00A0}]+Sb\\\\.\", \"\") AS ?cisloPredpisu)\n" +
        "    }\n" +
        "\t\n" +
        "  }\n" +
        "\n" +
        "  OPTIONAL {\n" +
        "    ?pojem rdfs:subClassOf ?specializovanyPojem .\n" +
        "  }\n" +
        "  \n" +
        "  BIND(\n" +
        "    COALESCE(\n" +
        "\t  CONCAT(?nazevPojmu, \" (\", ?cisloPredpisu, \")\"),\n" +
        "\t  ?nazevPojmu\n" +
        "\t) AS ?excel\n" +
        "  )\n" +
        "\n" +
        "  OPTIONAL {\n" +
        "    {\n" +
        "      ?odkazujiciPojem rdfs:subClassOf ?pojem ;\n" +
        "        skos:inScheme ?pouzitVGlosari .\n" +
        "    } UNION {\n" +
        "      ?odkazujiciPojem rdfs:domain ?pojem.\n" +
        "    } UNION {\n" +
        "      ?odkazujiciPojem rdfs:domain/owl:unionOf ?pojem .\n" +
        "    } UNION {\n" +
        "      ?odkazujiciPojem rdfs:range ?pojem.\n" +
        "    } UNION {\n" +
        "      ?odkazujiciPojem rdfs:range/owl:unionOf ?pojem .\n" +
        "    }\n" +
        "\n" +
        "    ?odkazujiciPojem skos:inScheme ?odkazujiciGlosar .\n" +
        "  }\n" +
        "\n" +
        "}\n";
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
